use std::fs::File;
use std::io::{Read, Write};

use std::error::Error;
type E = Box<dyn Error>;
use regex::Regex;
use std::collections::HashMap;

fn main() -> Result<(), E> {
    main_shrink()?;
    // main_grow()?;
    Ok(())
}

fn main_grow() -> Result<(), E> {
    let all_words = load_all_words()?;

    // let initial_subset = load_words()?;
    let RARE_LETTERS = Regex::new(r"[qjzx]").unwrap();
    let mut initial_subset = all_words.clone();
    initial_subset.retain(|x|
        RARE_LETTERS.is_match(x)
    );

    println!("{}", all_words.len());
    println!("{}", initial_subset.len());

    let finders = letter_finders();
    let mut rng = rand::thread_rng();
    use rand::distributions::{Distribution, Uniform};
    let sampler = Uniform::new(0, all_words.len());

    let mut current_subset = initial_subset;
    loop {
        let times = 1000;
        let mut best_score = std::f64::INFINITY;
        let mut best_candidate = None;
        // let mut options = vec![];
        for _ in 0..times {
            let mut subset = current_subset.clone();
            let mut to_add;
            loop {
                let index = sampler.sample(&mut rng);
                to_add = all_words[index].to_owned();
                if !subset.contains(&to_add) {
                    break;
                }
            }
            subset.push(to_add.to_owned());
            let score = score(&subset, &finders);
            if best_candidate.is_none() {
                best_candidate = Some(subset);
                best_score = score;
            } else {
                if score < best_score {
                    best_candidate = Some(subset);
                    best_score = score;
                }
            }
        }
        current_subset = best_candidate.unwrap();
        println!("{} {}", best_score, current_subset.len());

        let text = current_subset.join("\n");

        let dir = "../../subsets/";
        // let name = [dir, format!("{}", current_subset.len()).as_str()].concat();
        // let mut file = File::create(name)?;
        // file.write_all(text.as_bytes())?;

        let name2 = [dir, "current"].concat();
        let mut file2 = File::create(name2)?;
        file2.write_all(text.as_bytes())?;
    }

    Ok(())
}

// one easy available optimisation would be to
// score only individual candidates
// and not to recompute the whole set score
// but current way it is just simpler

fn main_shrink() -> Result<(), E> {
    let mut subset = load_words()?;

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // subset.retain(|x| x.len() >= 5);
    let group_size = 100;
    let times = 100; // save after

    println!("{}", subset.len());
    println!("{}", subset.first().unwrap());

    let finders = letter_finders();
    println!("score: {}", score(&subset, &finders));

    use rand::distributions::{Distribution, Uniform};

    let mut rng = rand::thread_rng();


    loop {
        for _ in 0..times {
            let between = Uniform::new(0, subset.len());

            let mut group = vec![];
            for _ in 0..group_size {
                let index = between.sample(&mut rng);
                group.push(Candidate { index });
            }
            let finalist = group.iter().min_by(|a, b| {
                let mut copy = subset.to_vec();
                copy.remove(a.index);
                let score_a = score(&copy, &finders);

                let mut copy = subset.to_vec();
                copy.remove(b.index);
                let score_b = score(&copy, &finders);

                use std::cmp::Ordering::Equal;
                score_a.partial_cmp(&score_b).unwrap_or(Equal)
            }).unwrap();
            subset.remove(finalist.index);

            println!("score: {}", score(&subset, &finders));
        }
        let text = subset.join("\n");
        println!("{}", subset.len());

        let dir = "../../subsets/";
        let name1 = [dir, "current"].concat();
        let name2 = [dir, format!("subset-{}", subset.len()).as_str()].concat();
        let mut file = File::create(name1)?;
        file.write_all(text.as_bytes())?;
        let mut file = File::create(name2)?;
        file.write_all(text.as_bytes())?;
    }

    Ok(())
}

struct Candidate {
    index: usize,
}

fn load_all_words() -> Result<Vec<String>, E> {
    let mut file = File::open("../../subsets/full")?;
    let mut string = String::new();
    file.read_to_string(&mut string)?;
    let vec = string.trim().lines().map(|x| x.to_owned().trim().to_owned()).collect();
    Ok(vec)
}

fn load_string() -> Result<String, E> {
    // let mut file = File::open("../../10k.txt")?;
    let mut file = File::open("../../subsets/current")?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    // println!("{}", contents);
    Ok(contents)
}

fn load_words() -> Result<Vec<String>, E> {
    let string = load_string()?;
    let vec = string.lines().map(|x| x.to_owned().trim().to_owned()).collect();
    Ok(vec)
}

//const LETTERS: [&'static str; 26] = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const LETTERS: [&'static str; 21] = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"];

fn letter_finders() -> HashMap<String, Regex> {
    let mut result: HashMap<String, Regex> = HashMap::new();
    for &x in &LETTERS {
        let regex = Regex::new(
            format!(r"{}", x).as_str()
        ).unwrap();
        let key: String = x.to_owned();
        result.insert(key, regex);
    }
    result
}

fn empty_counts() -> HashMap<String, usize> {
    let mut result: HashMap<String, usize> = HashMap::new();
    for &x in &LETTERS {
        let key: String = x.to_owned();
        result.insert(key, 0);
    }
    result
}

fn score(words: &Vec<String>, finders: &HashMap<String, Regex>) -> f64 {
    let mut counts = empty_counts();
    for word in words {
        for (letter, regex) in finders {
            let count = regex.find_iter(word.as_str()).count();
            let key = letter.to_string();
            let value = counts.get(&key).unwrap();
            let value = value + count;
            counts.insert(key, value);
        }
    }

    use statistical::population_variance;

    let mut omg: Vec<f64> = vec![];
    for &x in counts.values() {
        let f: f64 = x as f64;
        omg.push(f);
    }

    population_variance(&omg[..], None)
}

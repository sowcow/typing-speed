use std::fs::File;
use std::io::{Read, Write};

use std::error::Error;
type E = Box<dyn Error>;
use regex::Regex;
use std::collections::HashMap;

// one easy available optimisation would be to
// score only individual candidates
// and not to recompute the whole set score
// but current way it is just simpler

fn main() -> Result<(), E> {
    let mut subset = load_words()?;

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    subset.retain(|x| x.len() >= 5);
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

fn load_string() -> Result<String, E> {
    // let mut file = File::open("../../10k.txt")?;
    let mut file = File::open("../../subsets/current")?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    println!("{}", contents);
    Ok(contents)
}

fn load_words() -> Result<Vec<String>, E> {
    let string = load_string()?;
    let vec = string.lines().map(|x| x.to_owned().trim().to_owned()).collect();
    Ok(vec)
}

const LETTERS: [&'static str; 26] = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

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

use std::error::Error;
type E = Box<dyn Error>;
use regex::Regex;
use std::collections::HashMap;

fn main() -> Result<(), E> {
    let mut subset = load_words()?;
    subset.retain(|x| x.len() > 3);

    println!("{}", subset.len());

    let finders = letter_finders();
    println!("score: {}", score(subset, finders));

    Ok(())
}

fn load_string() -> Result<String, E> {
    use std::fs::File;
    use std::io::Read;

    let mut file = File::open("../../10k.txt")?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    println!("{}", contents);
    Ok(contents)
}

fn load_words() -> Result<Vec<String>, E> {
    let string = load_string()?;
    let vec = string.lines().map(|x| x.to_owned()).collect();
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

fn score(words: Vec<String>, finders: HashMap<String, Regex>) -> f64 {
    let mut counts = empty_counts();
    for word in words {
        for (letter, regex) in &finders {
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

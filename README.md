# Typing Speed

- Naming is hard
- Type words for a minute to see how you perform
- All consonants have almost equal frequency of appearance
- Status: ready :heavy_check_mark:
- It doesn't give you conventional WPM (one word at a time slowers typing and average word length may be different)

## Motivation

The site I used to use finally annoyed me into writing my own simplified version.

## Notes

- Frontend: word by word is ok although it slowers typing
- Words source: good list from http://www.desiquintans.com/nounlist
- Words filtering: started with all words with rare letters and
  grown the list in the direction of minimizing the variance of frequency of appearance of consonants :). And after that sacraficed diversity of words for unity of frequency of consonants by removing words in the same direction

## Possibilities for Change

1. Per key stats are unlikely
1. No idea yet about replacing one word at a time mechanics with a continuous line (probably requires replacing "particles")
1. There is no decision yet on giving conventional wpm/cpm characteristics (requires continuous line)
1. I may consider to show the right letter above the wrong one

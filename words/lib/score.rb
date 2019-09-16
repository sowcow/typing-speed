require 'descriptive_statistics'

module Score
  module_function

  def [] got
    if got.respond_to? :each
      calc_array got
    else
      calc got
    end
  end

  def variance xs
    calc_array(xs).values.variance
  end

  LETTERS = [*?a..?z]
  RE = Hash[LETTERS.map { |x| [x, /#{x}/] }]

  def empty_score
    balance = Hash[LETTERS.map { |x| [x, 0] }]
  end

  def calc word
    return @calc[word] if @calc[word] # memoize

    score = empty_score
    LETTERS.each { |letter|
      score[letter] += word.scan(RE[letter]).count
    }

    @calc[word] = score # memoize

    score
  end

  def calc_array words
    score = empty_score
    words.each { |word|
      LETTERS.each { |letter|
        score[letter] += word.scan(RE[letter]).count
      }
    }
    score
  end
end

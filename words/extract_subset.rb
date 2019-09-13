require 'descriptive_statistics'

# this stuff would really use some of rust perfomance with
# and some nice data structures

file = File.join __dir__, '10k.txt'
text = File.read file
words = text.lines.map &:strip
words.reject! { |x| x.length < 3 }
p words.count

module Score
  module_function

  def [] got
    if got.respond_to? :each
      calc_array got
    else
      calc got
    end
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

class Subset
  class << self
    alias_method :[], :new
  end

  def initialize words
    @words = words
  end

  def score
    @score ||= Score.calc_array @words
  end

  def variance
    score.variance
  end

  def to_s
    @words.join ?\n
  end

  def decimate
    deltas = @words.sample 10
    bad_guy = deltas.min_by { |delta|
      subset = @words - [delta]
      Subset[subset].variance
    }
    resulting_subset = @words - [bad_guy]
    Subset[resulting_subset]
  end
end

xs = words
subset = Subset[words]

loop do
  p subset.variance
  subset = subset.decimate
  File.write 'subset.txt', subset.to_s
end

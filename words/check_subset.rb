require 'descriptive_statistics'

# this stuff would really use some of rust perfomance
# this file also misses one obvious optimization that is used in rust version

END{
  # file = File.join __dir__, 'subsets2/subset-196'
  file = ARGV.pop || File.join(__dir__, 'subsets/subset-336')
  text = File.read file
  words = text.lines.map &:strip
  require 'yaml'
  puts YAML.dump Hash[Score[words].sort_by { |k,v| v }]
}

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

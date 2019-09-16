require 'descriptive_statistics'
require_relative 'lib/files'
require_relative 'lib/score'


RARE_LETTERS = /[qjzx]/
all_words = Files.load_words 'subsets/full'
initial_subset = all_words.select { |x| x =~ RARE_LETTERS }

current_subset = initial_subset

loop do
  options = 100.times.map {
    Subset.maybe_mutate current_subset, all_words
  }
  winner = options.min_by { |candidate|
    Score.variance candidate
  }
  score = Score.variance winner
  current_subset = winner
  Files.save_words current_subset, "subsets/set-#{current_subset.count}"
  puts "#{current_subset.count} - #{score}"
end


BEGIN{
  module Subset
    module_function

    def maybe_mutate subset, words
      word = words.sample
      if subset.include? word
        subset
      else
        subset + [word]
      end
    end

    def print subset
      require 'yaml'
      puts YAML.dump Hash[Score[initial_subset].sort_by { |k,v| v }]
    end
  end
}

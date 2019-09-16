module Files
  module_function
  def load_words file
    text = File.read file
    text.strip!
    words = text.lines.map &:strip
  end

  def save_words subset, file
    words = subset.join ?\n
    File.write file, words
  end
end

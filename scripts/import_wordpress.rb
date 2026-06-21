#!/usr/bin/env ruby

require "cgi"
require "fileutils"
require "json"
require "open-uri"
require "rexml/document"
require "uri"

SOURCE = ARGV.fetch(0) do
  warn "Usage: ruby scripts/import_wordpress.rb /path/to/wordpress-export.xml"
  exit 1
end

ROOT = File.expand_path("..", __dir__)
POSTS_DIR = File.join(ROOT, "src", "posts")
PAGES_DIR = File.join(ROOT, "src", "pages")
UPLOADS_DIR = File.join(ROOT, "src", "assets", "uploads")
WORDPRESS_ORIGIN = "https://wealthandscrubs.wordpress.com"

FileUtils.mkdir_p([POSTS_DIR, PAGES_DIR, UPLOADS_DIR])
FileUtils.rm_f(Dir.glob(File.join(POSTS_DIR, "*.html")))
FileUtils.rm_f(Dir.glob(File.join(PAGES_DIR, "*.html")))

document = REXML::Document.new(File.read(SOURCE))
items = document.get_elements("rss/channel/item")

def element_text(item, name)
  item.elements[name]&.text.to_s
end

attachments = {}
media_urls = []

items.each do |item|
  next unless element_text(item, "wp:post_type") == "attachment"

  id = element_text(item, "wp:post_id")
  url = element_text(item, "wp:attachment_url")
  alt = ""
  item.elements.each("wp:postmeta") do |meta|
    if element_text(meta, "wp:meta_key") == "_wp_attachment_image_alt"
      alt = element_text(meta, "wp:meta_value")
    end
  end
  attachments[id] = { "url" => url, "alt" => alt }
  media_urls << url unless url.empty?
end

def local_media_path(url)
  uri = URI.parse(CGI.unescapeHTML(url))
  "/assets/uploads/#{File.basename(uri.path)}"
rescue URI::InvalidURIError
  url
end

def plain_text(html)
  CGI.unescapeHTML(
    html
      .gsub(/<!--.*?-->/m, " ")
      .gsub(/<script\b[^>]*>.*?<\/script>/mi, " ")
      .gsub(/<style\b[^>]*>.*?<\/style>/mi, " ")
      .gsub(/<[^>]+>/, " ")
  ).gsub(/\s+/, " ").strip
end

def yaml_string(value)
  value.to_s.to_json
end

def clean_content(content)
  cleaned = content.dup
  cleaned.gsub!(/<!--\s*\/?wp:.*?-->/m, "")
  cleaned.gsub!(/\s(?:srcset|sizes)="[^"]*"/, "")
  cleaned.gsub!(/<p>\s*<\/p>/, "")
  cleaned.gsub!(WORDPRESS_ORIGIN, "")
  cleaned.gsub!(%r{/wp-content/uploads/2026/06/([^"'\s?<]+)(?:\?[^"'\s<]*)?}) do
    "/assets/uploads/#{Regexp.last_match(1)}"
  end
  cleaned.gsub!(
    /<p>Please use the contact form below and I'll respond as soon as possible\.<\/p>/,
    "<p>A lightweight contact form will be added after the new site launches. Until then, partnership and reader contact details will remain available through the existing site.</p>"
  )
  cleaned.gsub!(
    /<p>For affiliate partnerships, sponsored content opportunities, product reviews, and collaboration inquiries, please use the contact form and include &quot;Partnership Inquiry&quot; in the subject line\.<\/p>/,
    "<p>Partnership contact details will be added before launch.</p>"
  )
  cleaned.strip
end

published = items.filter do |item|
  %w[post page].include?(element_text(item, "wp:post_type")) &&
    element_text(item, "wp:status") == "publish"
end

published.each do |item|
  type = element_text(item, "wp:post_type")
  title = CGI.unescapeHTML(element_text(item, "title"))
  slug = element_text(item, "wp:post_name")
  date = element_text(item, "wp:post_date")
  content = clean_content(element_text(item, "content:encoded"))
  excerpt = plain_text(element_text(item, "excerpt:encoded"))
  excerpt = plain_text(content)[0, 175].to_s.sub(/\s+\S*\z/, "") + "…" if excerpt.empty?
  categories = []
  tags = []
  item.elements.each("category") do |category|
    case category.attributes["domain"]
    when "category"
      categories << CGI.unescapeHTML(category.text.to_s)
    when "post_tag"
      tags << CGI.unescapeHTML(category.text.to_s)
    end
  end

  thumbnail_id = ""
  item.elements.each("wp:postmeta") do |meta|
    if element_text(meta, "wp:meta_key") == "_thumbnail_id"
      thumbnail_id = element_text(meta, "wp:meta_value")
    end
  end
  featured = attachments[thumbnail_id]

  content.scan(%r{https://wealthandscrubs\.wordpress\.com/wp-content/uploads/[^"'\s<)]+}) do |url|
    media_urls << CGI.unescapeHTML(url)
  end

  link = element_text(item, "link")
  permalink = if type == "page"
    slug == "home" ? "/index.html" : "/#{slug}/index.html"
  else
    path = URI.parse(link).path
    "#{path}index.html"
  end

  front_matter = [
    "---",
    "layout: layouts/#{type == 'post' ? 'post' : 'page'}.njk",
    "title: #{yaml_string(title)}",
    "slug: #{yaml_string(slug)}",
    "date: #{date.split.first}",
    "permalink: #{yaml_string(permalink)}",
    "excerpt: #{yaml_string(excerpt)}",
    "author: #{yaml_string('Brooke | Wealth & Scrubs')}",
    "categories: #{categories.to_json}",
    "tags: #{([type] + tags).uniq.to_json}",
    ("featuredImage: #{yaml_string(local_media_path(featured['url']))}" if featured),
    ("featuredImageAlt: #{yaml_string(featured['alt'])}" if featured),
    "---",
    ""
  ].compact.join("\n")

  directory = type == "post" ? POSTS_DIR : PAGES_DIR
  filename = type == "post" ? "#{date.split.first}-#{slug}.html" : "#{slug}.html"
  File.write(File.join(directory, filename), front_matter + content + "\n")
end

media_urls.map! { |url| CGI.unescapeHTML(url).sub(/[?#].*\z/, "") }
media_urls.select! { |url| url.start_with?("#{WORDPRESS_ORIGIN}/wp-content/uploads/") }
media_urls.uniq!

failures = []
media_urls.each_with_index do |url, index|
  destination = File.join(UPLOADS_DIR, File.basename(URI.parse(url).path))
  next if File.exist?(destination) && File.size?(destination)

  begin
    URI.open(url, "User-Agent" => "Mozilla/5.0", read_timeout: 30) do |remote|
      File.binwrite(destination, remote.read)
    end
    puts "Downloaded #{index + 1}/#{media_urls.length}: #{File.basename(destination)}"
  rescue StandardError => error
    failures << [url, error.message]
    warn "Could not download #{url}: #{error.message}"
  end
end

puts "Imported #{published.count { |item| element_text(item, 'wp:post_type') == 'post' }} posts"
puts "Imported #{published.count { |item| element_text(item, 'wp:post_type') == 'page' }} pages"
puts "Localized #{media_urls.length - failures.length}/#{media_urls.length} media files"

unless failures.empty?
  warn "Media failures:"
  failures.each { |url, message| warn "- #{url}: #{message}" }
  exit 2
end

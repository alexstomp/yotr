source 'https://rubygems.org'

# Server stack & languages
ruby '2.1.2'
gem 'rails', '4.1.4'
gem 'pg'
gem 'thin'
gem 'pry'

# Functional Gems
gem 'newrelic_rpm'
gem 'devise'

# Front-end frameworks
gem 'sass-rails', '~> 4.0.3'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.0.0'
gem 'backbone-on-rails'
gem 'jquery-rails'
gem 'turbolinks'
gem 'jbuilder', '~> 2.0'

# Heroku deploy fix
group :production do
    gem 'rails_12factor'
end

# Update localhost without restart
group :development do
    gem 'spring'
end

group :doc do
    gem 'sdoc', '~> 0.4.0'
end

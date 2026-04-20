FROM ruby:3.2

WORKDIR /app

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev postgresql-client

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .

EXPOSE 3000
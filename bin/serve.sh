#!/usr/bin/env bash
declare DIR="$(cd "$(dirname "$0")/../docs" && pwd -P)"

# does not work:
# bundle exec --gemfile="$sourcedir/Gemfile" jekyll serve --source "$sourcedir" --destination "$sourcedir/_site"

cd "$DIR"
bundle exec jekyll serve

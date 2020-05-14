#!/usr/bin/env bash
# declare DIR="$(realpath "${BASH_SOURCE%/*}")"
declare DIR="$(cd "$(dirname "$0")" && pwd -P)"
declare sourcedir="$DIR/../docs"

# does not work:
# bundle exec --gemfile="$sourcedir/Gemfile" jekyll serve --source "$sourcedir" --destination "$sourcedir/_site"

cd "$sourcedir"
bundle exec jekyll serve

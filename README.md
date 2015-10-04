# Contest Page

## What is this repository
This repository holds the code for the CS 241 Contest Page.
I hope that when I am done with this project other courses like 225 and 233 will want to use it for their classes.
If you have any feature requests please contact me (Brandon Chong)
If you would like to contribute just fork this repo, make any modifications, and send a pull request

## Setup instructions
```bash
npm install #if you are on Windows use: npm install --no-bin-links
bower install
grunt uglify
grunt compass:dev
grunt compass:foundation
grunt
```

## What do I need to do to use this?
1. Build the project by running grunt
2. Host the 'public' folder on a webserver (I recommend web.engr.illinois.edu)
3. Have a script update the json files in the 'public/data/' folder

##  JSON Schema
```javascript
The main json is an array of student objects.

The student schema is defined as
{
  "test_cases": [TestCase],
  "nickname" : String,
  "time_stamp": String
}

The TestCase schema is
{
  "name": String,
  "total_pts": Number,
  "pts_earned": Number,
  "max_memory": Number,
  "runtime": Number,
  "output": String
  // max_memory is in bytes and runtime is in seconds
}
```

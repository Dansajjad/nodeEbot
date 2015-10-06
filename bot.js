/**
* nodeEbot v.0.2.0! 
* A twitter_ebooks style bot for Node.js
* by Dave Schumaker (@davely)
* https://github.com/daveschumaker/nodeEbot
*
* Heavily inspired by the following twitter_ebooks project for Ruby by Mispy:
* https://github.com/mispy/twitter_ebooks
*/

// Import required npm modules to make our robot work!
var fs = require('fs');
var util = require('util');
var Promise = require('bluebird');

//////////
var config = require('./config'); // Robot config, personality settings and API keys
var generator = require('./components/generator'); // Compiles word dictionary and builds new sentences.
var tweet = require('./components/tweets'); // Methods to interact with Twitter by writing and favoriting tweets and more.
var utils = require('./components/utilities'); // Various helper functions

// Create promises
fs = Promise.promisifyAll(fs);
generator = Promise.promisifyAll(generator);

///// DEBUG STUFF
// var fakeTweet = {
//   id_str: 12345,
//   text: '@Roboderp This is a Dodgers sample tweet to analyze!',
//   user: {
//     screen_name: 'fakeuser',
//   }
// };


/////////////////////
// Process stopwords.
generator.stopwords = fs.readFileAsync('./data/stopwords.txt').toString().split("\n");

// Filename to source or tweets and other content from?
tweetFile = 'tweets.txt';

// Start watching the Twitter stream.
tweet.watchStream();

// RAW CONTENT!
fs.readFileAsync(tweetFile)
.then(function(fileContents) {
  //console.log("Get file contents");
  var content = fileContents.toString().split("\n");
  //console.log(content);
  return content;
})
.then(function(content){
  //console.log("Build Corpus");
  return generator.buildCorpus(content);
})
.then(function(data){
  var newTweet = generator.makeTweet(140);
  tweet.postNewTweet(newTweet);
  console.log(utils.currentTime(), newTweet + '');
  //console.log('JUST TWEETED!\n', utils.currentTime(), newTweet);
  //tweet.checkReply(fakeTweet);

  setInterval(function() {
    newTweet = generator.makeTweet(140);
    tweet.postNewTweet(newTweet);
    console.log(utils.currentTime(), newTweet + '');
  }, 90000);  
  
  //return generator.makeTweet(140);
});
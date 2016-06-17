const request = require('browser-request');
const _ = require('underscore');

class Dictionary {
  constructor() {
    this.baseApi = 'http://api.wordnik.com:80/v4/word.json/';
    this.apiKey = 'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
  }

  getMeaning(word, callback) {
    let meaningUrl = this.baseApi + encodeURIComponent(word) + '/definitions';
    let queryParams = {
      limit: 2,
      sourceDictionaries: 'all',
      api_key: this.apiKey
    }
    request({uri: meaningUrl, qs: queryParams, json: true},
      function(er, response, body) {
      if (er) {
        return callback(er, null);
      }
      let returnText = _.map(body, function(item) {
        return {partOfSpeech: item.partOfSpeech, meaning: item.text};
      });
      return callback(null, returnText);
    });
  }

  getExample(word, callback) {
    let exampleUrl = this.baseApi + encodeURIComponent(word) + '/examples';
    let queryParams = {
      limit: 2,
      api_key: this.apiKey
    }
    request({uri: exampleUrl, qs: queryParams, json: true},
      function(er, response, body) {
      if (er) {
        return callback(er, null);
      }
      let returnText = _.map(body.examples, function(item) {
        return {example: item.text, source: item.title};
      });
      return callback(null, returnText);
    });
  }

  getPronunciation(word, callback) {
    let pronunciationUrl = this.baseApi + encodeURIComponent(word) + '/pronunciations';
    let queryParams = {
      limit: 1,
      api_key: this.apiKey
    }
    request({uri: pronunciationUrl, qs: queryParams, json: true},
      function(er, response, body) {
      if (er) {
        return callback(er, null);
      }
      let returnText = body[0].raw;
      return callback(null, returnText);
    });
  }

  getAudio(word, callback) {
    let audioUrl = this.baseApi + encodeURIComponent(word) + '/audio';
    let queryParams = {
      limit: 1,
      api_key: this.apiKey
    }
    request({uri: audioUrl, qs: queryParams, json: true},
      function(er, response, body) {
      if (er) {
        return callback(er, null);
      }
      let returnText = body[0].fileUrl;
      return callback(null, returnText);
    });
  }
}

export default Dictionary;

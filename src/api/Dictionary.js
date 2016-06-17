'use strict';
const request = require('browser-request');
const _ = require('underscore');
const async = require('async');

class Dictionary {
  constructor() {
    this.baseApi = 'http://api.wordnik.com:80/v4/word.json/';
    this.apiKey = 'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
  }

  // Calls all the functions to give a total combined response
  lookupWord(word, callback) {
    async.parallel({
      meaning: (cb) => {
        this.getMeaning(word, (err, response) => {
          cb(err, response);
        });
      },
      example: (cb) => {
        this.getExample(word, (err, response) => {
          cb(err, response);
        });
      },
      pronunciation: (cb) => {
        this.getPronunciation(word, (err, response) => {
          cb(err, response);
        });
      },
      audio: (cb) => {
        this.getAudio(word, (err, response) => {
          cb(err, response);
        });
      },
    },
    function (err, results) {
      if (err) {
        callback(err, null);
      }
      callback(null, results);
    });
  }

  // Gets the meanings of a word along with parts of speed
  getMeaning(word, callback) {
    let meaningUrl = this.baseApi + encodeURIComponent(word) + '/definitions';
    let queryParams = {
      limit: 2,
      sourceDictionaries: 'all',
      api_key: this.apiKey
    };
    request({uri: meaningUrl, qs: queryParams, json: true},
      (err, response, body) => {
      let errCheck = this._checkForErrors(err, response, body);
      if (! _.isNull(errCheck)) {
        return callback(errCheck, null);
      }

      let returnText = body.map((item) => {
        return {partOfSpeech: item.partOfSpeech, meaning: item.text};
      });
      return callback(null, returnText);
    });
  }

  // Gets example sentences of a word along with its source
  getExample(word, callback) {
    let exampleUrl = this.baseApi + encodeURIComponent(word) + '/examples';
    let queryParams = {
      limit: 2,
      api_key: this.apiKey
    };
    request({uri: exampleUrl, qs: queryParams, json: true},
      (err, response, body) => {
      let errCheck = this._checkForErrors(err, response, body);
      if (! _.isNull(errCheck)) {
        return callback(errCheck, null);
      }

      let returnText = body.examples.map((item) => {
        return {example: item.text, source: item.title};
      });
      return callback(null, returnText);
    });
  }

  // Gets the phonetic representation of a word
  getPronunciation(word, callback) {
    let pronunciationUrl = this.baseApi + encodeURIComponent(word) + '/pronunciations';
    let queryParams = {
      limit: 1,
      api_key: this.apiKey
    };
    request({uri: pronunciationUrl, qs: queryParams, json: true},
      (err, response, body) => {
      let errCheck = this._checkForErrors(err, response, body);
      if (! _.isNull(errCheck)) {
        return callback(errCheck, null);
      }

      let returnText = body[0].raw;
      return callback(null, returnText);
    });
  }

  // Gets audio pronuunciation of a word
  getAudio(word, callback) {
    let audioUrl = this.baseApi + encodeURIComponent(word) + '/audio';
    let queryParams = {
      limit: 1,
      api_key: this.apiKey
    };
    request({uri: audioUrl, qs: queryParams, json: true},
      (err, response, body) => {
      let errCheck = this._checkForErrors(err, response, body);
      if (! _.isNull(errCheck)) {
        return callback(errCheck, null);
      }

      let returnText = body[0].fileUrl;
      return callback(null, returnText);
    });
  }

  // Helper function which checks for errors from API requests
  _checkForErrors(err, response, body) {
    if (err) {
      return err;
    } else if (response.statusCode != 200) {
      return body;
    } else if (_.isEmpty(body)) {
      return "Empty response";
    } else {
      return null;
    }
  }
}

export default Dictionary;

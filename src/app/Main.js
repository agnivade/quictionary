'use strict';
import Firebase from 'firebase';
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {deepOrange500,deepOrange700,limeA200,grey100,grey900,grey400,white} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Dictionary from '../api/Dictionary';
import ResponseSection from './ResponseSection';

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 50,
    color: grey100
  }
};

// Different search states
const searchState = {
  EMPTY_STATE: "empty",
  DONE_SUCCESS_STATE: "done",
  DONE_ERROR_STATE: "error",
  IN_PROGRESS_STATE: "inprogress"
};

// Setting up the color palette
const muiTheme = getMuiTheme({
  palette: {
    primary1Color: deepOrange500,
    primary2Color: deepOrange700,
    accent1Color: limeA200,
    textColor: grey100,
    alternateTextColor: white,
    canvasColor: grey900
  }
});

// Initializing firebase
// TODO: get this setting from a config file
Firebase.initializeApp({
  apiKey: "AIzaSyDes5f-3Rskw0dbPBbw1IhY68GoP-8dLpY",
  authDomain: "quictionary-c7eff.firebaseapp.com",
  databaseURL: "https://quictionary-c7eff.firebaseio.com",
  storageBucket: "quictionary-c7eff.appspot.com"
});
Firebase.auth().signInAnonymously().catch(function(error) {
  if (error) {
    console.error(error);
  }
});

class Main extends React.Component {
  constructor(props, context) {
    super(props, context);
    // Initializing dictionary
    this.dictionaryObj = new Dictionary();
    // Getting reference to the firebase DB
    this.firebaseDB = Firebase.database();
    // Binding this to the event handlers
    this.getResponse = this.getResponse.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    // Setting state
    this.state = {
      searchState: searchState.EMPTY_STATE,
      searchResponse: "",
      searchText: "", // searchText is the text that is shown in the results
      currentText: ""}; // currentText tracks the current text that is entered
  }

  componentDidMount() {
    // Focussing on the text box on page load
    setTimeout(() => {
      // Giving a 100 ms delay for a more visual transition effect
      this.refs.searchText.focus();
    }, 100);
  }

  getResponse() {
    // Setting searchState to true to show the loading circle
    this.setState({searchState: searchState.IN_PROGRESS_STATE});
    let word = this.refs.searchText.getValue();
    // Unless the entire word is an acronym, convert to lowercase
    if (word != word.toUpperCase()) {
      word = word.toLowerCase();
    }

    // Making the API call
    this.dictionaryObj.lookupWord(word, (err, response) => {
      if (err) {
        console.error(err);
        this.setState({
          searchState: searchState.DONE_ERROR_STATE,
          searchResponse: err,
          currentText: "",
        });
        return;
      }
      // Incrementing the counter for the word
      this.firebaseDB.ref('words/' + word).transaction(function(counter) {
        return counter+1;
      });
      this.setState({
        searchState: searchState.DONE_SUCCESS_STATE,
        searchResponse: response,
        searchText: word,
        currentText: "",
      });
    });
    this.refs.searchText.getInputNode().value = "";
  }

  onTextChange(e) {
    this.setState({currentText: e.target.value});
  }

  // Get the response if enter is pressed
  onKeyDown(e) {
    if (e.keyCode == 13) {
      this.getResponse();
    }
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <a className="github-fork-ribbon" href="https://github.com/agnivade/quictionary" title="Fork me on GitHub">Fork me on GitHub</a>
          <h1>Quictionary</h1>
          <TextField
            ref="searchText"
            floatingLabelText="Enter the word you are looking for"
            floatingLabelStyle={{color: grey100}}
            floatingLabelFocusStyle={{color: deepOrange500}}
            fullWidth={true}
            onChange={this.onTextChange}
            onKeyDown={this.onKeyDown}
          />
          <RaisedButton
            ref="searchBtn"
            label="Bring the Answer!"
            disabled={!this.state.currentText}
            disabledLabelColor={grey400}
            primary={true}
            onTouchTap={this.getResponse}
          />
          <ResponseSection
            searchState={this.state.searchState}
            searchResponse={this.state.searchResponse}
            allStates={searchState}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;

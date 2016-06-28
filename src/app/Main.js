'use strict';
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Dictionary from '../api/Dictionary';

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 50,
  },
  paper: {
    width: 600,
    margin: '0 auto',
    marginTop: 50,
    padding: 5,
    fontSize: 15
  },
  refresh: {
    position: 'relative',
  },
  entryStyle: {
    textAlign: 'left'
  }
};

// Different search states
const EMPTY_STATE = "empty";
const DONE_STATE = "done";
const IN_PROGRESS_STATE = "inprogress";

const muiTheme = getMuiTheme();

class Main extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.dictionaryObj = new Dictionary();
    this.handleTouchTap = this.handleTouchTap.bind(this);

    // Setting state
    this.state = {searchState: EMPTY_STATE, searchResponse: "", inputWord: ""};
  }

  handleTouchTap() {
    // Setting searchState to true to show the loading circle
    this.setState({searchState: IN_PROGRESS_STATE});
    let word = this.refs.searchText.input.value;

    // Making the API call
    this.dictionaryObj.lookupWord(word, (err, response) => {
      if (err) {
        return console.error(err);
      }
      this.setState({
        searchState: DONE_STATE,
        searchResponse: response,
        inputWord: word
      });
    });
    this.refs.searchText.input.value = "";
  }

  render() {
    // Creating the meaning and example section if the state is properly set
    let meaningSection = "";
    let exampleSection = "";
    if (this.state.searchState == DONE_STATE && this.state.searchResponse.meaning) {
      meaningSection = this.state.searchResponse.meaning.map((word, i) => {
                return (
                  <div key={i} style={styles.entryStyle}>
                  <i>{word.partOfSpeech}</i> {word.meaning}
                  </div>
                );
              });
    }
    if (this.state.searchState == DONE_STATE && this.state.searchResponse.example) {
      exampleSection = this.state.searchResponse.example.map((example, i) => {
                return (
                  <div key={i} style={styles.entryStyle}>
                  "{example.example}" ({example.source})
                  </div>
                );
              });
    }

    // Creating the response section depending on the state
    let responseSection = null;
    switch (this.state.searchState) {
      case EMPTY_STATE:
        responseSection = "";
        break;
      case IN_PROGRESS_STATE:
        responseSection = <RefreshIndicator
              size={40}
              left={window.innerWidth/2-20}
              top={40}
              status="loading"
              style={styles.refresh}
            />;
        break;
      case DONE_STATE:
        responseSection = <Paper
              style={styles.paper}
              zDepth={2}
            >
            <div>
            <strong>{this.state.inputWord}</strong>
            {this.state.searchResponse.pronunciation}
            <br />
            Meanings-
            {meaningSection}
            <br />
            Examples-
            {exampleSection}
            </div>
            </Paper>
        break;
    }
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <h1>Quictionary</h1>
          <TextField
            ref="searchText"
            floatingLabelText="Enter the word you are looking for"
            fullWidth={true}
          />
          <RaisedButton
            label="Bring the Answer!"
            secondary={true}
            onTouchTap={this.handleTouchTap}
          />
          {responseSection}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;

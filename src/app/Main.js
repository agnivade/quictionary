'use strict';
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {red500,red700,limeA200,grey100,grey900,grey400,white} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Dictionary from '../api/Dictionary';

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 50,
    color: grey100
  },
  paper: {
    width: 600,
    margin: '0 auto',
    marginTop: 50,
    padding: 5,
  },
  refresh: {
    position: 'relative',
  },
  entryStyle: {
    textAlign: 'left'
  },
  icon: {
    verticalAlign: 'text-bottom',
    cursor: 'pointer'
  }
};

// Different search states
const EMPTY_STATE = "empty";
const DONE_STATE = "done";
const IN_PROGRESS_STATE = "inprogress";

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: red500,
    primary2Color: red700,
    accent1Color: limeA200,
    textColor: grey100,
    alternateTextColor: white,
    canvasColor: grey900
  }});

class Main extends React.Component {
  constructor(props, context) {
    super(props, context);
    // Initializing dictionary
    this.dictionaryObj = new Dictionary();
    // Binding this to the event handlers
    this.getResponse = this.getResponse.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.playAudio = this.playAudio.bind(this);

    // Setting state
    this.state = {
      searchState: EMPTY_STATE,
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
    this.setState({searchState: IN_PROGRESS_STATE});
    let word = this.refs.searchText.getValue();

    // Making the API call
    this.dictionaryObj.lookupWord(word, (err, response) => {
      if (err) {
        return console.error(err);
      }
      this.setState({
        searchState: DONE_STATE,
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

  // Play the audio element on click
  playAudio() {
    this.refs.audioElem.play();
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
            <strong>{this.state.searchText}</strong>
            {this.state.searchResponse.pronunciation}
            <i
              ref="audioIcon"
              className="material-icons"
              onClick={this.playAudio}
              style={styles.icon}>
              volume_up
            </i>
            <audio
              ref="audioElem"
              src={this.state.searchResponse.audio}
              preload="auto">
            </audio>
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
          <a className="github-fork-ribbon" href="https://github.com/agnivade/quictionary" title="Fork me on GitHub">Fork me on GitHub</a>
          <h1>Quictionary</h1>
          <TextField
            ref="searchText"
            floatingLabelText="Enter the word you are looking for"
            floatingLabelStyle={{color: grey400}}
            floatingLabelFocusStyle={{color: red500}}
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
          {responseSection}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;

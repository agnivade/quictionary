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
    height: 100,
    width: 600,
    margin: '0 auto',
    marginTop: '50px',
  },
  refresh: {
    position: 'relative',
  },
};

const muiTheme = getMuiTheme();

class Main extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.dictionaryObj = new Dictionary();
    this.handleTouchTap = this.handleTouchTap.bind(this);
  }

  handleTouchTap() {
    let word = this.refs.searchText.input.value;
    this.dictionaryObj.lookupWord(word, function(err, response) {
      if (err) {
        return console.error(err);
      }
      console.log(`Meaning- ${JSON.stringify(response)}`);
    });
    this.refs.searchText.input.value = "";
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <h1>Quick Word Lookup</h1>
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
          <Paper
            children={<div>Store the response here</div>}
            style={styles.paper}
            zDepth={2}
          />
          <RefreshIndicator
            size={40}
            left={10}
            top={0}
            status="loading"
            style={styles.refresh}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;

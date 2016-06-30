'use strict';
import React from 'react';
import Paper from 'material-ui/Paper';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import {deepOrange700} from 'material-ui/styles/colors';

const styles = {
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

// This component holds the response section when we search for a word.
class ResponseSection extends React.Component {
  constructor(props, context) {
    super(props, context);

    // Binding the event handlers
    this.playAudio = this.playAudio.bind(this);
  }

  // Play the audio element on click
  playAudio() {
    this.refs.audioElem.play();
  }

  render() {
    // Creating the meaning and example section if the response is properly set
    let meaningSection = "";
    let exampleSection = "";
    if (this.props.searchState == this.props.allStates.DONE_SUCCESS_STATE &&
      this.props.searchResponse.meaning) {
      meaningSection = this.props.searchResponse.meaning.map((word, i) => {
                return (
                  <div key={i} style={styles.entryStyle}>
                  <i>{word.partOfSpeech}</i> {word.meaning}
                  </div>
                );
              });
    }
    if (this.props.searchState == this.props.allStates.DONE_SUCCESS_STATE &&
      this.props.searchResponse.example) {
      exampleSection = this.props.searchResponse.example.map((example, i) => {
                return (
                  <div key={i} style={styles.entryStyle}>
                  "{example.example}" ({example.source})
                  </div>
                );
              });
    }
    // Creating the response section depending on search state
    let responseSection = null;
    switch (this.props.searchState) {
      case this.props.allStates.EMPTY_STATE:
        break;
      case this.props.allStates.IN_PROGRESS_STATE:
        responseSection = <RefreshIndicator
              size={40}
              left={window.innerWidth/2-20}
              top={40}
              status="loading"
              style={styles.refresh}
            />;
        break;
      case this.props.allStates.DONE_SUCCESS_STATE:
        responseSection = <Paper
              style={styles.paper}
              zDepth={2}
            >
            <div>
            <strong>{this.props.searchText}</strong>
            {this.props.searchResponse.pronunciation}
            <i
              ref="audioIcon"
              className="material-icons"
              onClick={this.playAudio}
              style={styles.icon}>
              volume_up
            </i>
            <audio
              ref="audioElem"
              src={this.props.searchResponse.audio}
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
      case this.props.allStates.DONE_ERROR_STATE:
        responseSection = <Paper
              style={styles.paper}
              zDepth={2}
            >
            <div>
            <strong style={{color: deepOrange700}}>
            {this.props.searchResponse}
            </strong>
            </div>
            </Paper>
        break;
    }
    return (
      <div>{responseSection}</div>
    );
  }
}

export default ResponseSection;

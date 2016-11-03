import React, { Component } from 'react';

// Bootstrap components:
import { Button } from 'react-bootstrap';
import { ButtonGroup } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Glyphicon } from 'react-bootstrap';
import { FormGroup } from 'react-bootstrap';
import { ControlLabel } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { HelpBlock } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

//import Chessdiagram from '../../react-chessdiagram/build/dist.chessdiagram.js';
import Chessdiagram from 'react-chessdiagram';
import { knightsTour } from './knightsTour.js';
import { squareToFileRank } from './utility.js';

var Highlight = require('react-highlighter');

import './App.css';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      boardWidth: 8,
      boardHeight: 8,
      startSquare: 'a1',
      seqNumber: 1, // range [1 .. n]
      isPlaying: false,
      lastResult: [],
      lastMessage: '',
    }
  }

  componentDidMount () {
 //   this.setState({moveTimer: setInterval(this._showNextNove.bind(this,1000))});
  
  }
  
  componentWillUnmount () {
 //   clearInterval(this.state.moveTimer);
  }

  getValidationState() {
    let [file,rank] = squareToFileRank(this.state.startSquare);

    if(
      this.state.boardWidth > 26 || 
      this.state.boardHeight > 26 ||
      this.state.boardWidth < 1 ||
      this.state.boardHeight < 1 ||
      file > this.state.boardWidth - 1 ||
      rank > this.state.boardHeight - 1
    ) {
      return 'error';
    } else { 
      return 'success';
    } 
  }
 

  _showLastMove() {
    this.setState({seqNumber: this.state.lastResult.length});
  }

  _showNextMove() {
    this.setState({seqNumber: Math.min(this.state.seqNumber+1, this.state.lastResult.length)});
  }

  _showPrevMove() {
    this.setState({seqNumber: Math.max(1, this.state.seqNumber-1)});
  }

  _showFirstMove() {
    this.setState({seqNumber: 1});
  }

 calcKnightsTour() {
  const boardSizeHoriz=this.state.boardWidth;
  const boardSizeVert=this.state.boardHeight;
  const maxAttempts = 100;
  const attemptTheImpossible = true; // if true, attempt to complete tour starting from white square on 'odd' board (not possible to complete)

  if(this.getValidationState()==='error')
    return;

  let [i,j] = squareToFileRank(this.state.startSquare);
  let finalResult;
  if (attemptTheImpossible || (this.state.boardWidth & 1) === 0 || ((i ^ j) & 1) === 0 ) {
    let leastRemainingSquares = this.state.boardWidth * this.state.boardHeight;
    for (let attempt = 1; attempt <= maxAttempts; attempt++){
      let res=knightsTour(boardSizeHoriz, boardSizeVert, i, j, attempt === 1);
      if(res.unvisitedSquareCount < leastRemainingSquares) {
        leastRemainingSquares = res.unvisitedSquareCount;
        finalResult = Object.assign({},res);
      }
      if(res.success) {
        break;
      }
    }
  }

  this.setState({
    lastResult: finalResult.knightsPath, 
    lastMessage: finalResult.success ? 'complete' : 'incomplete: ' + finalResult.unvisitedSquareCount + ' squares'
  })

}

  render() {

    let seqNumber = this.state.seqNumber;
    let tourSquares = this.state.lastResult.slice(0, seqNumber); // sequence of squares visited in tour (as array)
    let positionDescriptor = tourSquares.map(sq => '-@' + sq); // blanked squares at each square of sequence
    positionDescriptor.push('N@' + tourSquares[seqNumber - 1]); // knight on last square of sequence

    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to the fascinating world of Knight's Tours !</h2>
        </div>
        <br/>
        <div className="container">
          <div className="row">
            <div ref="diagramContainer" className="col-sm-8">
              <Chessdiagram
                squareSize={this.refs.diagramContainer ? Math.min(80, 0.8 * this.refs.diagramContainer.clientWidth / this.state.boardWidth) : 45} 
                files={this.state.boardWidth} 
                ranks={this.state.boardHeight} 
                pieces={positionDescriptor}
              />
              <ButtonGroup bsSize="xsmall">
                <Button bsStyle="primary" className="btn-oldstyle" onClick={this._showFirstMove.bind(this)}><Glyphicon glyph="fast-backward" /></Button>
                <Button bsStyle="primary" className="btn-oldstyle" onClick={this._showPrevMove.bind(this)}><Glyphicon glyph="step-backward" /></Button>
                <Button bsStyle="primary" className="btn-oldstyle"><Glyphicon glyph="play" /></Button>
                <Button bsStyle="primary" className="btn-oldstyle" onClick={this._showNextMove.bind(this)}><Glyphicon glyph="step-forward" /></Button>
                <Button bsStyle="primary" className="btn-oldstyle" onClick={this._showLastMove.bind(this)}><Glyphicon glyph="fast-forward" /></Button>
              </ButtonGroup> 
            </div>
            <div className="col-sm-4">
              <br/>
              <Form horizontal={true}>
                <FormGroup
                  bsSize="small"
                  controlId="formParameters"
                >
                  <Col xs={3}>
                  <ControlLabel>Board Width</ControlLabel>
                  </Col>
                  <Col xs={3}>
                  <FormControl
                    type="number"
                    value={this.state.boardWidth}
                    placeholder="Enter text"
                    onChange={evt => this.setState({
                      boardWidth: Math.min(Math.max(1,evt.target.value),26), 
                      lastResult: [],
                      lastMessage: '',
                      seqNumber: 1
                    })}
                  />
                  </Col>
            
                  <Col xs={3}>
                  <ControlLabel>Board Height</ControlLabel>
                    </Col>
                  <Col xs={3}>
                  <FormControl
                    type="number"
                    value={this.state.boardHeight}
                    placeholder="Enter text"
                    onChange={evt => this.setState({
                      boardHeight: Math.min(Math.max(1,evt.target.value),26),
                      lastResult: [],
                      lastMessage: '',
                      seqNumber: 1
                    })}
                  />
                  </Col>
                </FormGroup>
              </Form>

              <HelpBlock>Maximum Board dimensions are 26 x 26.</HelpBlock>

              <Form>
                <FormGroup
                  bsSize="small"
                  controlId="formParameters"
                  validationState={this.getValidationState()}
                >  
                  <Col xs={3}>
                  <ControlLabel>Start square</ControlLabel>
                  </Col>
                  <Col xs={3}>
                  <FormControl
                    type="text"
                    value={this.state.startSquare}
                    placeholder="Enter text"
                    onChange={evt => this.setState({startSquare: evt.target.value})}
                  />
                  </Col>
                 
                  <Col xs={6}>
                     <Button bsStyle="primary" bsSize="xsmall" className="btn-oldstyle" onClick={evt => this.calcKnightsTour()}>Calculate!</Button>
                  </Col>
                </FormGroup>
              </Form>

              <Row>
                <Col xs={12}> 
                  
                  <p>
                    <Highlight search={tourSquares[seqNumber-1] || ''}>{this.state.lastResult.join(' ')}</Highlight>
                  </p>
                  <p>{this.state.lastMessage}</p>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

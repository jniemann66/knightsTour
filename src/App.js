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
// import { form } from 'react-bootstrap';
import { Form } from 'react-bootstrap';



//import Chessdiagram from '../../react-chessdiagram/build/dist.chessdiagram.js';
import Chessdiagram from 'react-chessdiagram';
import { knightsTour } from './knightsTour.js';
import { squareToFileRank } from './utility.js';

import './App.css';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      boardWidth: 8,
      boardHeight: 8,
      startSquare: 'a1',
      moveNumber: 0,
      isPlaying: false,
      lastResult: '',
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
      this.state.boardWidth < 2 ||
      this.state.boardHeight < 2 ||
      file > this.state.boardWidth - 1 ||
      rank > this.state.boardHeight - 1
    ) {
      return 'error';
    } else { 
      return 'success';
    } 
  }
 

  _showLastMove() {
    this.setState({moveNumber: this.state.lastResult.split(" ").length}); // to-do: wrong !!
  }

  _showNextMove() {
    this.setState({moveNumber: Math.min(this.state.moveNumber+1, this.state.lastResult.split(" ").length)});
  }

  _showPrevMove() {
    this.setState({moveNumber: Math.max(0,this.state.moveNumber-1)});
  }

  _showFirstMove() {
    this.setState({moveNumber: 0});
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
 //   console.log(this.state.lastResult);
//    console.log(this.state.moveNumber);
    let moveList = this.state.lastResult.split(" ").slice(0,this.state.moveNumber).map((s,i) => i === this.state.moveNumber-1 ? 'n@' + s : '-@' + s);
 //   console.log(moveList);
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
                pieces={moveList}
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
                    onChange={evt => this.setState({boardWidth: Math.min(Math.max(2,evt.target.value),26)})}
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
                    onChange={evt => this.setState({boardHeight: Math.min(Math.max(2,evt.target.value),26)})}
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
                  <p>{this.state.lastResult}</p>
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

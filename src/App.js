import React, { Component } from 'react';
import Webcam  from 'react-webcam';
import logo from './logo.svg';
import './App.css';


const API_URL = 'http://192.168.110.17:5000'


class App extends Component {
  constructor(props) {
    super(props);

    this.setRef = this.setRef.bind(this);
    this.start  = this.start.bind(this);
    this.stop   = this.stop.bind(this);
    this.capture   = this.capture.bind(this);
    this.upload   = this.upload.bind(this);
    this.compare   = this.compare.bind(this);
    this.state = {webcamStatus: true, imageSrc: "", message: ""};  
  }

  setRef (webcam) {
    this.webcam = webcam;
  }
  
  start() {
    this.setState({webcamStatus: true})
    console.log('start triggered!');
  }

  stop() {
    this.setState({webcamStatus: false})
    console.log('stop triggered!');
  }

  capture() {
    this.setState(
      {...this.state, 'imageSrc': this.webcam.getScreenshot()}
    );
  }

  getImageData() {
    if (this.state.imageSrc == "") {
      this.setState({...this.state, message: "error getting image data!" }) ;
      return null;
    } else {
      this.setState({...this.state, message: "" }) ;
      var _jpg = this.state.imageSrc.replace(/data:image\/jpeg;base64,/, '');
      return _jpg;
    }
  }

  compare() {
    var _jpg = this.getImageData();
    if (_jpg == null) return;
    
      fetch(API_URL + '/compare', {
        'method': 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          image: _jpg,
          faceset_id: 'test'
        }),
      }).then(response => response.json())
      .then(response => {
        console.log(response)
      }).catch(err => {
        console.log(err)
      })
  }
  
  upload() {
    var _jpg = this.getImageData();
    if (_jpg == null) return;

    fetch(API_URL + '/upload', {
        'method': 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          image: _jpg,
          faceset_id: 'test'
        }),
      }).then(response => response.json())
      .then(response => {
        console.log(response)
      }).catch(err => {
        console.log(err)
      })
  }


  render() {

    const webcamUI = ((this.state.webcamStatus == true) ?
      <Webcam
      audio={false}
      ref={this.setRef}
      screenshotFormat="image/jpeg"
    /> : 
    null);

    const message = this.state.message;

    return (
      <div className="App">
          <h4>{this.state.message}</h4>
        
        <p className="App-intro">
          {webcamUI}
          <img width={100} src={this.state.imageSrc}  />
        </p>
        
        <div>
          <button onClick={this.start}>Start</button>
          <button onClick={this.stop}>Stop</button>
          <button onClick={this.capture}>Capture photo</button>
          <button onClick={this.upload}>Upload</button>
          <button onClick={this.compare}>Compare</button>

        </div>
      </div>
    );
  }
}

export default App;

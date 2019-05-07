import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import config from './firebase-config';
import firebase from 'firebase';
import '@firebase/firestore';
import ReactDom from 'react-dom';
import Home from './screen/Home';
import Login from './screen/Login';
import FileUploader from 'react-firebase-file-uploader';
import {Provider} from 'react-redux';
import {createStore} from 'redux'
import reducer from './store/reducer';
import Router from './router';
const store = createStore(reducer);

class App extends Component {
  constructor(props){
    super (props); 
    this.state = {
      images : []
    }
  }

  componentWillMount(){
    //ketika mau render dia ngejalanin ini dlu 
    firebase.initializeApp(config);
  }
  
  render() {
    console.log(this.state.images)
    return (
      <Provider store={store}>
        <Router/>
      </Provider>
    );
  }
}

export default App;

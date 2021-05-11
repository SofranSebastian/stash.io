import React from 'react';

import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';

import MyStack from './routes/routes.js';

// import the different screens
import * as firebase from "firebase";
 
// Optionally import the services that you want to use
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

const customFonts = {
  'light-font' : require('./fonts/Helvetica-Light.ttf'),
  'normal-font' : require('./fonts/Helvetica-Normal.ttf'),
  'bold-font' : require('./fonts/Helvetica-Bold.ttf')
};

var firebaseConfig = {
  apiKey: "AIzaSyAFFBKNa4wOhoqMe4BEtgofQP09AxZpjhE",
  authDomain: "stashio-bf94b.firebaseapp.com",
  databaseURL: "https://stashio-bf94b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "stashio-bf94b",
  storageBucket: "stashio-bf94b.appspot.com",
  messagingSenderId: "642104949688",
  appId: "1:642104949688:web:9a3c50946b36678ac7ed4d"
};
export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      areFontsLoaded : false
    }
  }

  async _loadFontsAsync(){
    await Font.loadAsync(customFonts)
    this.setState({areFontsLoaded: true})
  }

  async componentDidMount() {
    this._loadFontsAsync();
    firebase.initializeApp(firebaseConfig);
  }

  render() {
    if(this.state.areFontsLoaded){
      return(
          <MyStack/>
      )
    }else{
      return <AppLoading/>
    }
  }
}

import React from 'react';

import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';

import MyStack from './routes/routes.js';

const customFonts = {
  'light-font' : require('./fonts/Helvetica-Light.ttf'),
  'normal-font' : require('./fonts/Helvetica-Normal.ttf'),
  'bold-font' : require('./fonts/Helvetica-Bold.ttf')
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

import React from 'react';
import {View, Text, StyleSheet, StatusBar, Alert, TouchableOpacity, Image, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

import * as firebase from "firebase";
export default class LogIn extends React.Component {
    constructor() {
        super();

        this.state = {
          email: "",
          password: ""
        }
    }

    componentDidMount() {
      
    }

    _handleStoreEmail = async() => {
        try{
            await AsyncStorage.setItem('email', this.state.email)
        }catch(e){
            Alert.alert(  "Error",
                          e.message,
                          [
                              {
                                  text:'Ok',
                                  onPress: () => console.log("Ok Pressed")
                              }
                          ]
            )
        }
    }

    _handleSignUp = () => {
      firebase.auth()
              .signInWithEmailAndPassword(this.state.email, this.state.password)
              .then( this._handleStoreEmail )
              .then( this._handleNavigation )
              .catch( error => Alert.alert("Error",
                                            error.message,
                                            [
                                              {
                                                text:'Ok',
                                                onPress: () => console.log("Ok Pressed")
                                              },
                                              {
                                                text:'Try Again',
                                                onPress: () => console.log("Try Again Pressed"),
                                                style: 'cancel'
                                              }
                                            ]
                              )
                    )
    }

    _handleNavigation = () => {
      this.props.navigation.navigate("MenuNavigator")
    }

    render() {
        return (  
          <View style={styles.container}>
           
                <StatusBar style="auto" />

                <View style={{flex:0.3, alignItems:'center', justifyContent:'center', marginBottom:30}}>
                    <Image  source={require('../images/icon_logo.png')} 
                            resizeMode="contain" 
                            style={{width:50,height:50}}/>
                    <Text style={{fontFamily:'bold-font', fontSize:20, color:'white', marginTop:'2%'}}>Let's start</Text>
                    <Text style={{fontFamily:'normal-font', fontSize:14, color:'white'}}>Join the community</Text>
                </View>

                <View style={{flex:0.5, alignItems:'center', justifyContent:'center', marginBottom:40}}>
                    <View>
                        <View style={{width:'85%'}}>
                            <Text style={{fontFamily:'normal-font', fontSize:16, color:'white'}}>Email</Text>
                        </View>
                        <View style={{backgroundColor:'#272b48', flexDirection:'row', borderRadius:5, alignItems:'center', height:50, width:'85%'}}>
                            <TextInput  placeholder="Enter your email address"
                                        placeholderTextColor='white'
                                        autoCapitalize="none"
                                        style={{  color:'white',
                                                  width:'90%',
                                                  marginHorizontal:'5%',
                                                  fontSize:14,
                                                  fontFamily:'normal-font'
                                              }}
                                        
                                        onChangeText={email => this.setState({email:email})}
                                        value={this.state.email}
                              />
                        </View>
                    </View>
                    <View style={{marginTop:'5%'}}>
                        <View style={{width:'85%'}}>
                            <Text style={{fontFamily:'normal-font', fontSize:16, color:'white'}}>Password</Text>
                        </View>
                        <View style={{backgroundColor:'#272b48', flexDirection:'row', borderRadius:5, alignItems:'center', height:50, width:'85%'}}>
                            <TextInput  secureTextEntry
                                        placeholder="Enter your password"
                                        placeholderTextColor='white'
                                        autoCapitalize="none"
                                        style={{  color:'white',
                                                  width:'90%',
                                                  marginHorizontal:'5%',
                                                  fontSize:14,
                                                  fontFamily:'normal-font'
                                              }}
                                        onChangeText={password => this.setState({password:password})}
                                        value={this.state.password}
                                />
                        </View>
                    </View>
                </View>

                <View style={{flex:0.2, alignItems:'center', justifyContent:'center', marginBottom:30}}>
                    <TouchableOpacity onPress={this._handleSignUp} style={{backgroundColor:"#00a0d4", width:'60%',height:40, borderRadius:5, alignItems:'center', justifyContent:'center'}} >
                        <Text style={{fontFamily:'bold-font', fontSize:18, color:'white'}}>LOG IN</Text>
                    </TouchableOpacity>
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', marginTop:'2%'}}>
                        <Text style={{fontFamily:'normal-font', fontSize:14, color:'white'}}>Clicked by accident?</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("SignUp")}>
                            <Text style={{fontFamily:'bold-font', fontSize:14, color:'#00a0d4'}}> REGISTER</Text>
                        </TouchableOpacity> 
                    </View>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:'#303463',
        flex:1
    },
});
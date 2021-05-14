import React from 'react';
import {View, Text, StyleSheet, StatusBar, Alert, TouchableOpacity, Image, TextInput, Dimensions, ScrollView} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import AsyncStorage from '@react-native-async-storage/async-storage'; 

import * as firebase from "firebase";

export default class Transfer extends React.Component {
    constructor() {
        super();

        this.state = {
            isSendButtonAvailable: false,
            chosenCurrency: '',
            chosenCurrencyValue: 0,
            amountEntered: 0,
            usernameEntered: '',
            emailFromUser: '',
            currenciesData: [],
            usersArray: []
        }
    }

    _handleGetStoredEmail = async() => {
        try{
            const email_value = await AsyncStorage.getItem('email')
            const email_formatted = email_value.split("@")[0].replace('.','').replace('_','').replace(/\d+/g,'')
            if(email_formatted !== null){
                this.setState({emailFromUser:email_formatted})
            }
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

    _handleGetValuesForItems = () =>{
        firebase.database()
        .ref('/users')
        .once('value')
        .then((snapshot) =>{

            let temporary_array = [];

            let temporary_label = '';
            let temporary_value = '';

            snapshot.forEach( (childSnapshot) => {

                if( childSnapshot.val().username === this.state.emailFromUser ){
                    let entries = Object.entries(childSnapshot.val().currencies)
                   
                    for( let i = 0 ; i < entries.length ; i++ ){

                        let temporary_item_object = {
                            label: '',
                            value: '',
                        }

                        temporary_label = entries[i][0];
                        temporary_value = entries[i][1];

                        temporary_item_object.label = temporary_label;
                        temporary_item_object.value = temporary_value;

                        temporary_array.push(temporary_item_object);
                    } 
                }
            })
            this.setState({currenciesData:temporary_array})
        })
    }

    _handleGetAllUsers = () =>{
        firebase.database()
        .ref('/users')
        .once('value')
        .then((snapshot) =>{

            let temporary_array = [];

            snapshot.forEach( (childSnapshot) => {
                temporary_array.push(childSnapshot.val().username)
            })

            this.setState({usersArray: temporary_array})
        })
    }

    componentDidMount() {
        this._handleGetStoredEmail()
        this._handleGetValuesForItems()
        this._handleGetAllUsers()
    }

    _handlerTransferCurrency = () =>{
        if(( this.state.usernameEntered !== '' ) &&
           ( this.state.amountEntered !== '') &&
           ( this.state.chosenCurrencyValue !== 0)
        ){
            console.log('E ok')
        }else{
            console.log('nu a completat tot')
        }
    }

    render() {
        return (  
            <View style={styles.container}>
                <Text style={{marginTop:'10%',color:'white', fontSize:18, fontFamily:'bold-font', marginLeft:'5%'}}>Transfer any currency</Text>
                <View style={{backgroundColor:'#272b48', flexDirection:'row', borderRadius:10, alignItems:'center', height:50, width:'90%', marginTop:'3%', marginHorizontal:'5%'}}>
                                    <TextInput  placeholder="Enter the username"
                                                placeholderTextColor='#b8b8b8'
                                                autoCapitalize="none"
                                                style={{  color:'white',
                                                        width:'90%',
                                                        marginHorizontal:'5%',
                                                        fontSize:14,
                                                        fontFamily:'normal-font'
                                                    }}
                                                onChangeText={ username => this.setState({usernameEntered:username})}
                                                value={this.state.usernameEntered}
                                        />
                </View>
                <View style={{backgroundColor:'#272b48', flexDirection:'row', borderRadius:10, alignItems:'center', height:50, width:'90%', marginTop:'3%', marginHorizontal:'5%'}}>
                    <TextInput  placeholder="Enter the amount you want to transfer"
                                placeholderTextColor='#b8b8b8'
                                autoCapitalize="none"
                                style={{  color:'white',
                                        width:'90%',
                                        marginHorizontal:'5%',
                                        fontSize:14,
                                        fontFamily:'normal-font'
                                    }}
                                keyboardType="numeric"
                                onChangeText={ amount => this.setState({amountEntered:amount})}
                                value={this.state.amountEntered}
                    />
                </View>
                <View style={{flexDirection:'row', width:'90%', marginHorizontal:'5%'}}>
                    <DropDownPicker
                        items={this.state.currenciesData}
                        placeholder='Pick your currency'
                        searchable={true}
                        searchablePlaceholder={"Search for a currency"}
                        containerStyle={{height: 50, width:'65%', marginTop:'3%'}}
                        arrowColor={'white'}
                        arrowSize={20}
                        labelStyle={{fontFamily:'normal-font'}}
                        placeholderStyle={{color:'#b8b8b8', fontSize:14, fontFamily:'normal-font'}}
                        style={{backgroundColor:'#272b48', borderWidth:0}}
                        selectedLabelStyle={{color:'white'}}
                        onChangeItem={item => this.setState({chosenCurrency:item.label, chosenCurrencyValue:item.value})}
                        dropDownMaxHeight={200}
                    />
                    <View style={{backgroundColor:'#272b48', flexDirection:'column', borderRadius:10, alignItems:'center', height:50, width:'32%', marginTop:'3%', marginLeft:"3%", justifyContent:'center'}}>
                        <Text style={{color:'white', fontSize:13, fontFamily:'bold-font', textAlign:'center'}}>SOLD</Text>
                        <Text style={{color:'white', fontSize:13, fontFamily:'bold-font', textAlign:'center'}}>{this.state.chosenCurrencyValue}</Text>
                    </View>
                </View>
                <View style={{position:'absolute', top:'75%', width:'90%', marginHorizontal:"5%" }}>
                    <TouchableOpacity   style={{ height:40, 
                                                width:'100%', 
                                                backgroundColor: '#0f1434', 
                                                borderRadius:5, 
                                                alignItems:'center', 
                                                justifyContent:'center'
                                        }}
                                        onPress={()=>this._handlerTransferCurrency()}  
                    >
                        <Text style={{color:'white', fontSize:14, fontFamily:'bold-font'}}>SEND</Text>
                    </TouchableOpacity>
                    <Text style={{marginTop:'4%', marginHorizontal:'8%',color:'white', fontSize:12, fontFamily:'bold-font', textAlign:'center'}}>
                        *Be careful who you transfer to because the process is not reversible.*
                    </Text>
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
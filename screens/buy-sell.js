import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Image, TextInput, Dimensions, ScrollView, RefreshControl, Modal} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';

import * as firebase from "firebase";

const dummyData = require('../data.json')

export default class BuyAndSell extends React.Component {
    constructor() {
        super();

        this.state = {
            cryptoData: [],
            refresh: false,
            isModalForBuyVisible: false,
            isModalForSellVisible: false,
            calculatedAmountForBuy: 0,
            cryptoSelected: '',
            cryptoSelectedValue: 0,
            emailFromUser: '',
            currenciesData:[],
            chosenCurrency: '',
            chosenCurrencySymbol: '',
            chosenCurrencyValue: 0,
            amountEntered: 0,
            oldValueCryptoForBuy: 0,
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

    _handleGetUSDFromUser = () =>{
        firebase.database()
        .ref('/users')
        .once('value')
        .then((snapshot) =>{

            var temporary_object = {};

            snapshot.forEach( (childSnapshot) => {

                if( childSnapshot.val().username === this.state.emailFromUser ){
                    temporary_object = childSnapshot.val().currencies.USD
                }
            })
            this.setState({chosenCurrencyValue:temporary_object})
        })
    }


    _handleGetAllCurrenciesFromUser = () =>{
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

    _handlerGetDataForTopTen = async() => {
        await fetch("http://ec2-3-66-169-251.eu-central-1.compute.amazonaws.com/", {"method": "GET"})
        .then( (response) => response.json() )
        .then((responseData) => this.setState({cryptoData : responseData.data}) )
        .catch( (error) => console.log(error))
    }

    _onRefresh(){
        this.setState({refresh: true});
        this._handleGetUSDFromUser();
        this._handlerGetDataForTopTen();
        this._handleGetAllCurrenciesFromUser();
        this.setState({refresh:false});
      }

    _onBuyPressHandler(cryptoName, cryptoValue){
        this.setState({ isModalForBuyVisible:true, 
                        cryptoSelected:cryptoName, 
                        cryptoSelectedValue:cryptoValue,
                    })
        for ( var i = 0 ; i < this.state.currenciesData.length ; i++ ){
            if(this.state.currenciesData[i].label === 'USD'){
                this.setState({chosenCurrencyValue:this.state.currenciesData[i].value})
            }
        }
    }

    _onSellPressHandler(cryptoName, cryptoValue){
        this.setState({ isModalForSellVisible:true, 
                        cryptoSelected:cryptoName, 
                        cryptoSelectedValue:cryptoValue,
                        amountEntered: 0,
                    })

        var found = false;
        var index = -1;

        for ( var i = 0 ; i < this.state.currenciesData.length ; i++ ){
            if(this.state.currenciesData[i].label === cryptoName){
                found = true,
                index = i
            }
        }

        if( found === true ){
            this.setState({ chosenCurrencyValue:this.state.currenciesData[index].value})
        }else{
            this.setState({ chosenCurrencyValue:0})
        }

        if(cryptoName === 'Bitcoin'){ this.setState({chosenCurrencySymbol:'BTC' })}
        if(cryptoName === 'Ethereum'){ this.setState({chosenCurrencySymbol:'ETH' })}
        if(cryptoName === 'BinanceCoin'){ this.setState({chosenCurrencySymbol:'BNB' })}
        if(cryptoName === 'Tether'){ this.setState({chosenCurrencySymbol:'USDT' })}
        if(cryptoName === 'Dogecoin'){ this.setState({chosenCurrencySymbol:'DOGE' })}
        if(cryptoName === 'Cardano'){ this.setState({chosenCurrencySymbol:'ADA' })}
        if(cryptoName === 'XRP'){ this.setState({chosenCurrencySymbol:'XRP' })}
        if(cryptoName === 'Polkadot'){ this.setState({chosenCurrencySymbol:'DOT' })}
        if(cryptoName === 'InternetComputer'){ this.setState({chosenCurrencySymbol:'ICP' })}
        if(cryptoName === 'BitcoinCash'){ this.setState({chosenCurrencySymbol:'BCH' })}
    }
    
    _onConfirmBuy = () => {
        if(this.state.amountEntered > this.state.chosenCurrencyValue){
            Alert.alert("Error",
                                "The amount is bigger than what you have.",
                                [
                                    {
                                        text:'Try Again',
                                        onPress: () => console.log("Try Again Pressed"),
                                        style: 'cancel'
                                    }
                                ]
                            )
        }else if(this.state.amountEntered < 50){
            Alert.alert("Error",
                                "The amount entered is too small. Minimum amount is 50$.",
                                [
                                    {
                                        text:'Try Again',
                                        onPress: () => console.log("Try Again Pressed"),
                                        style: 'cancel'
                                    }
                                ]
                            )
        }else{

            let day = new Date().getDate();
            let month = new Date().getMonth() + 1;

            let hours = new Date().getHours();
            let minutes = new Date().getMinutes();
            let seconds = new Date().getSeconds();

            let timeComposed = hours+":"+minutes+":"+seconds;
            let dateComposed = day + "/"+ month;
            let childPath = this.state.emailFromUser+"/"+hours+minutes+seconds;

            let path_buy = '/users/' + this.state.emailFromUser + '/currencies'
            let value_buy = Number(this.state.amountEntered/this.state.cryptoSelectedValue)
            let value_decrease = Number(this.state.chosenCurrencyValue) - Number(this.state.amountEntered)
            if(this.state.cryptoSelected === 'Bitcoin'){
                for( var i = 0 ; i < this.state.currenciesData.length ; i++ ){
                    if(this.state.currenciesData[i].label === 'Bitcoin'){
                        value_buy = value_buy + Number(this.state.currenciesData[i].value)
                    }
                }
                firebase.database().ref(path_buy).update({  Bitcoin : Number(value_buy.toFixed(3)),
                                                            USD : value_decrease })
                Alert.alert("Success!","The purchase is done.",[
                                                                {text:'Ok',onPress: () => console.log("Ok Pressed"),}
                                                            ])
                                                            firebase.database().ref('/history/').child(childPath).set({
                                                                action: 'transaction',
                                                                type: 'buy',
                                                                amount: Number(this.state.amountEntered/this.state.cryptoSelectedValue).toFixed(3).toString() +" Bitcoin",
                                                                amountEntered:this.state.amountEntered +" USD",
                                                                date: dateComposed,
                                                                time: timeComposed
                                                            })
                this.props.navigation.reset({index:0, routes:[{name:"BuyAndSell"}]});
            }
            if(this.state.cryptoSelected === 'Ethereum'){
                for( var i = 0 ; i < this.state.currenciesData.length ; i++ ){
                    if(this.state.currenciesData[i].label === 'Ethereum'){
                        value_buy = value_buy + Number(this.state.currenciesData[i].value)
                    }
                }
                firebase.database().ref(path_buy).update({  Ethereum : Number(value_buy.toFixed(3)),
                                                            USD : value_decrease })
                Alert.alert("Success!","The purchase is done.",[
                                                                {text:'Ok',onPress: () => console.log("Ok Pressed"),}
                                                            ])
                                                            firebase.database().ref('/history/').child(childPath).set({
                                                                action: 'transaction',
                                                                type: 'buy',
                                                                amount: Number(this.state.amountEntered/this.state.cryptoSelectedValue).toFixed(3).toString() +" Ethereum",
                                                                amountEntered:this.state.amountEntered +" USD",
                                                                date: dateComposed,
                                                                time: timeComposed
                                                            })
                this.props.navigation.reset({index:0, routes:[{name:"BuyAndSell"}]});
            }
            if(this.state.cryptoSelected === 'BinanceCoin'){
                for( var i = 0 ; i < this.state.currenciesData.length ; i++ ){
                    if(this.state.currenciesData[i].label === 'BinanceCoin'){
                        value_buy = value_buy + Number(this.state.currenciesData[i].value)
                    }
                }
                firebase.database().ref(path_buy).update({  BinanceCoin : Number(value_buy.toFixed(3)),
                                                            USD : value_decrease })
                Alert.alert("Success!","The purchase is done.",[
                                                                {text:'Ok',onPress: () => console.log("Ok Pressed"),}
                                                            ])
                                                            firebase.database().ref('/history/').child(childPath).set({
                                                                action: 'transaction',
                                                                type: 'buy',
                                                                amount: Number(this.state.amountEntered/this.state.cryptoSelectedValue).toFixed(3).toString() +" BinanceCoin",
                                                                amountEntered:this.state.amountEntered +" USD",
                                                                date: dateComposed,
                                                                time: timeComposed
                                                            })
                this.props.navigation.reset({index:0, routes:[{name:"BuyAndSell"}]});
            }
            if(this.state.cryptoSelected === 'Tether'){
                for( var i = 0 ; i < this.state.currenciesData.length ; i++ ){
                    if(this.state.currenciesData[i].label === 'Tether'){
                        value_buy = value_buy + Number(this.state.currenciesData[i].value)
                    }
                }
                firebase.database().ref(path_buy).update({  Tether : Number(value_buy.toFixed(3)),
                                                            USD : value_decrease })
                Alert.alert("Success!","The purchase is done.",[
                                                                {text:'Ok',onPress: () => console.log("Ok Pressed"),}
                                                            ])
                                                            firebase.database().ref('/history/').child(childPath).set({
                                                                action: 'transaction',
                                                                type: 'buy',
                                                                amount: Number(this.state.amountEntered/this.state.cryptoSelectedValue).toFixed(3).toString() +" Tether",
                                                                amountEntered:this.state.amountEntered +" USD",
                                                                date: dateComposed,
                                                                time: timeComposed
                                                            })
                this.props.navigation.reset({index:0, routes:[{name:"BuyAndSell"}]});
            }
            if(this.state.cryptoSelected === 'Dogecoin'){
                for( var i = 0 ; i < this.state.currenciesData.length ; i++ ){
                    if(this.state.currenciesData[i].label === 'Dogecoin'){
                        value_buy = value_buy + Number(this.state.currenciesData[i].value)
                    }
                }
                firebase.database().ref(path_buy).update({  Dogecoin : Number(value_buy.toFixed(3)),
                                                            USD : value_decrease })
                Alert.alert("Success!","The purchase is done.",[
                                                                {text:'Ok',onPress: () => console.log("Ok Pressed"),}
                                                            ])
                                                            firebase.database().ref('/history/').child(childPath).set({
                                                                action: 'transaction',
                                                                type: 'buy',
                                                                amount: Number(this.state.amountEntered/this.state.cryptoSelectedValue).toFixed(3).toString() +" Dogecoin",
                                                                amountEntered:this.state.amountEntered +" USD",
                                                                date: dateComposed,
                                                                time: timeComposed
                                                            })
                this.props.navigation.reset({index:0, routes:[{name:"BuyAndSell"}]});
            }
            if(this.state.cryptoSelected === 'Cardano'){
                for( var i = 0 ; i < this.state.currenciesData.length ; i++ ){
                    if(this.state.currenciesData[i].label === 'Cardano'){
                        value_buy = value_buy + Number(this.state.currenciesData[i].value)
                    }
                }
                firebase.database().ref(path_buy).update({  Cardano : Number(value_buy.toFixed(3)),
                                                            USD : value_decrease })
                Alert.alert("Success!","The purchase is done.",[
                                                                {text:'Ok',onPress: () => console.log("Ok Pressed"),}
                                                            ])
                                                            firebase.database().ref('/history/').child(childPath).set({
                                                                action: 'transaction',
                                                                type: 'buy',
                                                                amount: Number(this.state.amountEntered/this.state.cryptoSelectedValue).toFixed(3).toString() +" Cardano",
                                                                amountEntered:this.state.amountEntered +" USD",
                                                                date: dateComposed,
                                                                time: timeComposed
                                                            })
                this.props.navigation.reset({index:0, routes:[{name:"BuyAndSell"}]});
            }
            if(this.state.cryptoSelected === 'XRP'){
                for( var i = 0 ; i < this.state.currenciesData.length ; i++ ){
                    if(this.state.currenciesData[i].label === 'XRP'){
                        value_buy = value_buy + Number(this.state.currenciesData[i].value)
                    }
                }
                firebase.database().ref(path_buy).update({  XRP : Number(value_buy.toFixed(3)),
                                                            USD : value_decrease })
                Alert.alert("Success!","The purchase is done.",[
                                                                {text:'Ok',onPress: () => console.log("Ok Pressed"),}
                                                            ])
                                                            firebase.database().ref('/history/').child(childPath).set({
                                                                action: 'transaction',
                                                                type: 'buy',
                                                                amount: Number(this.state.amountEntered/this.state.cryptoSelectedValue).toFixed(3).toString() +" XRP",
                                                                amountEntered:this.state.amountEntered +" USD",
                                                                date: dateComposed,
                                                                time: timeComposed
                                                            })
                this.props.navigation.reset({index:0, routes:[{name:"BuyAndSell"}]});
            }
            if(this.state.cryptoSelected === 'Polkadot'){
                for( var i = 0 ; i < this.state.currenciesData.length ; i++ ){
                    if(this.state.currenciesData[i].label === 'Polkadot'){
                        value_buy = value_buy + Number(this.state.currenciesData[i].value)
                    }
                }
                firebase.database().ref(path_buy).update({  Polkadot : Number(value_buy.toFixed(3)),
                                                            USD : value_decrease })
                Alert.alert("Success!","The purchase is done.",[
                                                                {text:'Ok',onPress: () => console.log("Ok Pressed"),}
                                                            ])
                                                            firebase.database().ref('/history/').child(childPath).set({
                                                                action: 'transaction',
                                                                type: 'buy',
                                                                amount: Number(this.state.amountEntered/this.state.cryptoSelectedValue).toFixed(3).toString() +" Polkadot",
                                                                amountEntered:this.state.amountEntered +" USD",
                                                                date: dateComposed,
                                                                time: timeComposed
                                                            })
                this.props.navigation.reset({index:0, routes:[{name:"BuyAndSell"}]});
            }
            if(this.state.cryptoSelected === 'InternetComputer'){
                for( var i = 0 ; i < this.state.currenciesData.length ; i++ ){
                    if(this.state.currenciesData[i].label === 'InternetComputer'){
                        value_buy = value_buy + Number(this.state.currenciesData[i].value)
                    }
                }
                firebase.database().ref(path_buy).update({  InternetComputer : Number(value_buy.toFixed(3)),
                                                            USD : value_decrease })
                Alert.alert("Success!","The purchase is done.",[
                                                                {text:'Ok',onPress: () => console.log("Ok Pressed"),}
                                                            ])
                                                            firebase.database().ref('/history/').child(childPath).set({
                                                                action: 'transaction',
                                                                type: 'buy',
                                                                amount: Number(this.state.amountEntered/this.state.cryptoSelectedValue).toFixed(3).toString() +" InternetComputer",
                                                                amountEntered:this.state.amountEntered +" USD",
                                                                date: dateComposed,
                                                                time: timeComposed
                                                            })
                this.props.navigation.reset({index:0, routes:[{name:"BuyAndSell"}]});
            }
            if(this.state.cryptoSelected === 'BitcoinCash'){
                for( var i = 0 ; i < this.state.currenciesData.length ; i++ ){
                    if(this.state.currenciesData[i].label === 'BitcoinCash'){
                        value_buy = value_buy + Number(this.state.currenciesData[i].value)
                    }
                }
                firebase.database().ref(path_buy).update({  BinanceCoin : Number(value_buy.toFixed(3)),
                                                            USD : value_decrease })
                Alert.alert("Success!","The purchase is done.",[
                                                                {text:'Ok',onPress: () => console.log("Ok Pressed"),}
                                                            ])
                                                            firebase.database().ref('/history/').child(childPath).set({
                                                                action: 'transaction',
                                                                type: 'buy',
                                                                amount: Number(this.state.amountEntered/this.state.cryptoSelectedValue).toFixed(3).toString() +" BinanceCoin",
                                                                amountEntered:this.state.amountEntered +" USD",
                                                                date: dateComposed,
                                                                time: timeComposed
                                                            })
                this.props.navigation.reset({index:0, routes:[{name:"BuyAndSell"}]});
            }
        }   
    }
    _onConfirmSell = () => {
        if(this.state.amountEntered > this.state.chosenCurrencyValue){
            Alert.alert("Error",
                                "The amount is bigger than what you have.",
                                [
                                    {
                                        text:'Try Again',
                                        onPress: () => console.log("Try Again Pressed"),
                                        style: 'cancel'
                                    }
                                ]
                            )
        }else if(this.state.amountEntered*this.state.cryptoSelectedValue < 50){
                        Alert.alert("Error",
                                "The amount entered is too small. Minimum amount is 50$.",
                                [
                                    {
                                        text:'Try Again',
                                        onPress: () => console.log("Try Again Pressed"),
                                        style: 'cancel'
                                    }
                                ]
                            )
            
        }else{

            let day = new Date().getDate();
            let month = new Date().getMonth() + 1;

            let hours = new Date().getHours();
            let minutes = new Date().getMinutes();
            let seconds = new Date().getSeconds();

            let timeComposed = hours+":"+minutes+":"+seconds;
            let dateComposed = day + "/"+ month;
            let childPath = this.state.emailFromUser+"/"+hours+minutes+seconds;

            let path_buy = '/users/' + this.state.emailFromUser + '/currencies'
            let value_sell = Number(this.state.amountEntered*this.state.cryptoSelectedValue)
            let value_decrease = Number(this.state.chosenCurrencyValue) - Number(this.state.amountEntered)

            if(this.state.cryptoSelected === 'Bitcoin'){
                for( var i = 0 ; i < this.state.currenciesData.length ; i++ ){
                    if(this.state.currenciesData[i].label === 'USD'){
                        value_sell = Number(this.state.currenciesData[i].value) + value_sell
                    }
                }
                firebase.database().ref(path_buy).update({  Bitcoin : Number(value_decrease.toFixed(3)),
                                                            USD : value_sell })
                Alert.alert("Success!","The purchase is done.",[
                                                                {text:'Ok',onPress: () => console.log("Ok Pressed"),}
                                                            ])
                                                            firebase.database().ref('/history/').child(childPath).set({
                                                                action: 'transaction',
                                                                type: 'sell',
                                                                amount: Number(this.state.amountEntered*this.state.cryptoSelectedValue).toFixed(3).toString() +" USD",
                                                                amountEntered:this.state.amountEntered +" Bitcoin",
                                                                date: dateComposed,
                                                                time: timeComposed
                                                            })
                this.props.navigation.reset({index:0, routes:[{name:"BuyAndSell"}]});
            }
            if(this.state.cryptoSelected === 'Ethereum'){
                for( var i = 0 ; i < this.state.currenciesData.length ; i++ ){
                    if(this.state.currenciesData[i].label === 'USD'){
                        value_sell = Number(this.state.currenciesData[i].value) + value_sell
                    }
                }
                firebase.database().ref(path_buy).update({  Ethereum : Number(value_decrease.toFixed(3)),
                                                            USD : value_sell })
                Alert.alert("Success!","The sell is done.",[
                                                                {text:'Ok',onPress: () => console.log("Ok Pressed"),}
                                                            ])
                                                            firebase.database().ref('/history/').child(childPath).set({
                                                                action: 'transaction',
                                                                type: 'sell',
                                                                amount: Number(this.state.amountEntered*this.state.cryptoSelectedValue).toFixed(3).toString() +" USD",
                                                                amountEntered:this.state.amountEntered +" Ethereum",
                                                                date: dateComposed,
                                                                time: timeComposed
                                                            })
                this.props.navigation.reset({index:0, routes:[{name:"BuyAndSell"}]});
            }
            if(this.state.cryptoSelected === 'BinanceCoin'){
                for( var i = 0 ; i < this.state.currenciesData.length ; i++ ){
                    if(this.state.currenciesData[i].label === 'USD'){
                        value_sell = Number(this.state.currenciesData[i].value) + value_sell
                    }
                }
                firebase.database().ref(path_buy).update({  BinanceCoin : Number(value_decrease.toFixed(3)),
                                                            USD : value_sell })
                Alert.alert("Success!","The sell is done.",[
                                                                {text:'Ok',onPress: () => console.log("Ok Pressed"),}
                                                            ])
                                                            firebase.database().ref('/history/').child(childPath).set({
                                                                action: 'transaction',
                                                                type: 'sell',
                                                                amount: Number(this.state.amountEntered*this.state.cryptoSelectedValue).toFixed(3).toString() +" USD",
                                                                amountEntered:this.state.amountEntered +" BinanceCoin",
                                                                date: dateComposed,
                                                                time: timeComposed
                                                            })
                this.props.navigation.reset({index:0, routes:[{name:"BuyAndSell"}]});
            }
            if(this.state.cryptoSelected === 'Tether'){
                for( var i = 0 ; i < this.state.currenciesData.length ; i++ ){
                    if(this.state.currenciesData[i].label === 'USD'){
                        value_sell = Number(this.state.currenciesData[i].value) + value_sell
                    }
                }
                firebase.database().ref(path_buy).update({  Tether : Number(value_decrease.toFixed(3)),
                                                            USD : value_sell })
                Alert.alert("Success!","The sell is done.",[
                                                                {text:'Ok',onPress: () => console.log("Ok Pressed"),}
                                                            ])
                                                            firebase.database().ref('/history/').child(childPath).set({
                                                                action: 'transaction',
                                                                type: 'sell',
                                                                amount: Number(this.state.amountEntered*this.state.cryptoSelectedValue).toFixed(3).toString() +" USD",
                                                                amountEntered:this.state.amountEntered +" Tether",
                                                                date: dateComposed,
                                                                time: timeComposed
                                                            })
                this.props.navigation.reset({index:0, routes:[{name:"BuyAndSell"}]});
            }
            if(this.state.cryptoSelected === 'Dogecoin'){
                for( var i = 0 ; i < this.state.currenciesData.length ; i++ ){
                    if(this.state.currenciesData[i].label === 'USD'){
                        value_sell = Number(this.state.currenciesData[i].value) + value_sell
                    }
                }
                firebase.database().ref(path_buy).update({  Dogecoin : Number(value_decrease.toFixed(3)),
                                                            USD : value_sell })
                Alert.alert("Success!","The sell is done.",[
                                                                {text:'Ok',onPress: () => console.log("Ok Pressed"),}
                                                            ])
                                                            firebase.database().ref('/history/').child(childPath).set({
                                                                action: 'transaction',
                                                                type: 'sell',
                                                                amount: Number(this.state.amountEntered*this.state.cryptoSelectedValue).toFixed(3).toString() +" USD",
                                                                amountEntered:this.state.amountEntered +" Dogecoin",
                                                                date: dateComposed,
                                                                time: timeComposed
                                                            })
                this.props.navigation.reset({index:0, routes:[{name:"BuyAndSell"}]});
            }
            if(this.state.cryptoSelected === 'Cardano'){
                for( var i = 0 ; i < this.state.currenciesData.length ; i++ ){
                    if(this.state.currenciesData[i].label === 'USD'){
                        value_sell = Number(this.state.currenciesData[i].value) + value_sell
                    }
                }
                firebase.database().ref(path_buy).update({  Cardano : Number(value_decrease.toFixed(3)),
                                                            USD : value_sell })
                Alert.alert("Success!","The sell is done.",[
                                                                {text:'Ok',onPress: () => console.log("Ok Pressed"),}
                                                            ])
                                                            firebase.database().ref('/history/').child(childPath).set({
                                                                action: 'transaction',
                                                                type: 'sell',
                                                                amount: Number(this.state.amountEntered*this.state.cryptoSelectedValue).toFixed(3).toString() +" USD",
                                                                amountEntered:this.state.amountEntered +" Cardano",
                                                                date: dateComposed,
                                                                time: timeComposed
                                                            })
                this.props.navigation.reset({index:0, routes:[{name:"BuyAndSell"}]});
            }
            if(this.state.cryptoSelected === 'XRP'){
                for( var i = 0 ; i < this.state.currenciesData.length ; i++ ){
                    if(this.state.currenciesData[i].label === 'USD'){
                        value_sell = Number(this.state.currenciesData[i].value) + value_sell
                    }
                }
                firebase.database().ref(path_buy).update({  XRP : Number(value_decrease.toFixed(3)),
                                                            USD : value_sell })
                Alert.alert("Success!","The sell is done.",[
                                                                {text:'Ok',onPress: () => console.log("Ok Pressed"),}
                                                            ])
                                                            firebase.database().ref('/history/').child(childPath).set({
                                                                action: 'transaction',
                                                                type: 'sell',
                                                                amount: Number(this.state.amountEntered*this.state.cryptoSelectedValue).toFixed(3).toString() +" USD",
                                                                amountEntered:this.state.amountEntered +" XRP",
                                                                date: dateComposed,
                                                                time: timeComposed
                                                            })
                this.props.navigation.reset({index:0, routes:[{name:"BuyAndSell"}]});
            }
            if(this.state.cryptoSelected === 'Polkadot'){
                for( var i = 0 ; i < this.state.currenciesData.length ; i++ ){
                    if(this.state.currenciesData[i].label === 'USD'){
                        value_sell = Number(this.state.currenciesData[i].value) + value_sell
                    }
                }
                firebase.database().ref(path_buy).update({  Polkadot : Number(value_decrease.toFixed(3)),
                                                            USD : value_sell })
                Alert.alert("Success!","The sell is done.",[
                                                                {text:'Ok',onPress: () => console.log("Ok Pressed"),}
                                                            ])
                                                            firebase.database().ref('/history/').child(childPath).set({
                                                                action: 'transaction',
                                                                type: 'sell',
                                                                amount: Number(this.state.amountEntered*this.state.cryptoSelectedValue).toFixed(3).toString() +" USD",
                                                                amountEntered:this.state.amountEntered +" Polkadot",
                                                                date: dateComposed,
                                                                time: timeComposed
                                                            })
                this.props.navigation.reset({index:0, routes:[{name:"BuyAndSell"}]});
            }
            if(this.state.cryptoSelected === 'InternetComputer'){
                for( var i = 0 ; i < this.state.currenciesData.length ; i++ ){
                    if(this.state.currenciesData[i].label === 'USD'){
                        value_sell = Number(this.state.currenciesData[i].value) + value_sell
                    }
                }
                firebase.database().ref(path_buy).update({  InternetComputer : Number(value_decrease.toFixed(3)),
                                                            USD : value_sell })
                Alert.alert("Success!","The sell is done.",[
                                                                {text:'Ok',onPress: () => console.log("Ok Pressed"),}
                                                            ])
                                                            firebase.database().ref('/history/').child(childPath).set({
                                                                action: 'transaction',
                                                                type: 'sell',
                                                                amount: Number(this.state.amountEntered*this.state.cryptoSelectedValue).toFixed(3).toString() +" USD",
                                                                amountEntered:this.state.amountEntered +" InternetComputer",
                                                                date: dateComposed,
                                                                time: timeComposed
                                                            })
                this.props.navigation.reset({index:0, routes:[{name:"BuyAndSell"}]});
            }
            if(this.state.cryptoSelected === 'BitcoinCash'){
                for( var i = 0 ; i < this.state.currenciesData.length ; i++ ){
                    if(this.state.currenciesData[i].label === 'USD'){
                        value_sell = Number(this.state.currenciesData[i].value) + value_sell
                    }
                }
                firebase.database().ref(path_buy).update({  BitcoinCash : Number(value_decrease.toFixed(3)),
                                                            USD : value_sell })
                Alert.alert("Success!","The sell is done.",[
                                                                {text:'Ok',onPress: () => console.log("Ok Pressed"),}
                                                            ])
                                                            firebase.database().ref('/history/').child(childPath).set({
                                                                action: 'transaction',
                                                                type: 'sell',
                                                                amount: Number(this.state.amountEntered*this.state.cryptoSelectedValue).toFixed(3).toString() +" USD",
                                                                amountEntered:this.state.amountEntered +" BitcoinCash",
                                                                date: dateComposed,
                                                                time: timeComposed
                                                            })
                this.props.navigation.reset({index:0, routes:[{name:"BuyAndSell"}]});
            }
        }
    }

    componentDidMount() {
        
        this._handleGetUSDFromUser()
        this._handlerGetDataForTopTen()
        this._handleGetStoredEmail()
        this._handleGetAllCurrenciesFromUser()
    }


    render() {
        return (  
            <View style={styles.container}>
                
                <Text  style={{color:'white', fontSize:18, fontFamily:'bold-font', marginLeft:'5%', marginTop:'5%'}}>Table Legend</Text>
                <View style={{flexDirection:'row', marginHorizontal:'5%', marginBottom:'5%',height:50, width:'90%', backgroundColor:'#272b48', borderRadius:5, alignItems:'center', justifyContent:'space-around'}}>
                    <View style={{flexDirection:'row', flex:0.45, alignItems:'center'}}>
                        <Text style={{color:'white', fontSize:12, fontFamily:'bold-font'}}># </Text>
                        <Text style={{color:'white', fontSize:12, fontFamily:'bold-font'}}>Name </Text>
                        <Text style={{color:'#c9c9c9', fontSize:12, fontFamily:'bold-font'}}>Symbol</Text>
                    </View>
                    <View style={{flexDirection:'row', flex:0.5, alignItems:'center', justifyContent:'space-around'}}>
                        <Text style={{color:'white', fontSize:12, fontFamily:'bold-font'}}>Price($)/Unit</Text>
                        <Text style={{color:'white', fontSize:12, fontFamily:'bold-font'}}>Percent(7d)</Text>
                    </View>
                </View>
                <ScrollView horizontal={false} showsVerticalScrollIndicator={false} contentContainerStyle={{alignItems:'center', justifyContent:'center'}}
                            refreshControl={
                                <RefreshControl
                                refreshing={this.state.refresh}
                                onRefresh={this._onRefresh.bind(this)}
                                />
                            }
                >
                    {   this.state.cryptoData.length !== 0 ?
                                
                                this.state.cryptoData.map((item) => (
                                        <View key={item.id} style={{flex:1,flexDirection:'column', marginHorizontal:'5%', marginVertical:'2%',height:90, width:'90%', backgroundColor:'#272b48', borderRadius:5, alignItems:'center', justifyContent:'space-around'}}>

                                                <View style={{flexDirection:'row',  flex:0.5, alignItems:'center'}}>
                                                        <View style={{flexDirection:'row', alignItems:'center',flex:0.45}}>
                                                            <Text style={{color:'white', fontSize:12, fontFamily:'bold-font'}}>{item.cmc_rank}. </Text>
                                                            <Text style={{color:'white', fontSize:12, fontFamily:'bold-font'}}>{item.name} </Text>
                                                            <Text style={{color:'#c9c9c9', fontSize:12, fontFamily:'bold-font'}}>{item.symbol}</Text>
                                                        </View>
                                                        <View style={{flexDirection:'row', alignItems:'center',flex:0.5, justifyContent:'space-around'}}>
                                                            <Text style={{color:'white', fontSize:12, fontFamily:'bold-font'}}>${item.quote.USD.price.toFixed(1)}</Text>
                                                            <Text style={{color:'white', fontSize:12, fontFamily:'bold-font'}}>{item.quote.USD.percent_change_7d.toFixed(1)}%</Text>
                                                            <Image  source={ item.quote.USD.percent_change_7d.toFixed(1) > 0 ? require('../images/icon_going_up.png') : require('../images/icon_going_down.png')}
                                                                    style={{height:10, width:10}}
                                                            />
                                                        </View>
                                                </View>
                                                <View style={{flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'space-evenly'}}>
                                                    <TouchableOpacity   style={{height:30, width:80, backgroundColor:"#39b54a", borderRadius:5, alignItems:'center', justifyContent:'center'}}
                                                                        onPress={()=>this._onBuyPressHandler(item.name.replace(/\s+/g, ''), item.quote.USD.price.toFixed(1))}
                                                    >
                                                        <Text style={{color:'white', fontSize:14, fontFamily:'bold-font'}}>BUY</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity   style={{height:30, width:80, backgroundColor:'#ff0000', borderRadius:5, alignItems:'center', justifyContent:'center'}}
                                                                        onPress={()=>this._onSellPressHandler(item.name.replace(/\s+/g, ''), item.quote.USD.price.toFixed(1))}
                                                    >
                                                        <Text style={{color:'white', fontSize:12, fontFamily:'bold-font'}}>SELL</Text>
                                                    </TouchableOpacity>
                                                </View>
                                        </View>
                                    ))
                        :

                            <ActivityIndicator  size="large" color="white"/>
                        }
                    </ScrollView>
                    <Modal  animationType="slide"
                            visible={this.state.isModalForBuyVisible}
                            transparent
                    >
                    <View style={{  flex: 1,
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor:'#000000000000',

                    }}>
                        <View style={{  backgroundColor: "#00a0d4",
                                        flex:0.8,
                                        width: '90%',
                                        borderRadius:10,
                                        alignItems:'center',
                                        justifyContent:'center',
                            }}>
                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center',marginTop:'5%'}}>
                                    <Image source={require('../images/icon_logo.png')} style={{width:50, height:50}}/>
                            </View>
                            <View style={{flex:0.6, width:'100%', alignItems:'center'}}>
                                    <View style={{width:'90%', marginHorizontal:'5%', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                        <View style={{backgroundColor:'#272b48', flexDirection:'row', borderRadius:10, alignItems:'center', height:50}}>
                                            <TextInput  placeholder="Enter your amount"
                                                        placeholderTextColor='white'
                                                        autoCapitalize="none"
                                                        style={{  color:'white',
                                                                width:'65%',
                                                                fontSize:14,
                                                                marginLeft:'2%',
                                                                fontFamily:'normal-font',
                                                            }}
                                                        keyboardType="number-pad"
                                                        onChangeText={ amount => {  if(String(amount).startsWith('.') || String(amount).startsWith('-') ){
                                                                                                        Alert.alert(  "Error",
                                                                                                        'Only positive amounts please',
                                                                                                        [
                                                                                                            {
                                                                                                                text:'Ok',
                                                                                                                onPress: () => console.log("Ok Pressed")
                                                                                                            }
                                                                                                        ]
                                                                                        )
                                                                                        this.props.navigation.reset({index:0, routes:[{name:"BuyAndSell"}]});
                                                                                    }else{
                                                                                        this.setState({amountEntered:amount})
                                                                                    }
                                                                                    
                                                                                } 
                                                                    }
                                                        value={this.state.amountEntered}
                                            />
                                        </View>
                                        <View style={{backgroundColor:'#272b48', flexDirection:'column', borderRadius:10, alignItems:'center', height:50, width:'30%', justifyContent:'center'}}>
                                            <Text style={{color:'white', fontSize:12, fontFamily:'bold-font', textAlign:'center'}}>SOLD<Text style={{color:'#c9c9c9', fontSize:10, fontFamily:'bold-font'}}>(USD)</Text></Text>
                                            <Text style={{color:'white', fontSize:13, fontFamily:'bold-font', textAlign:'center'}}>{String(this.state.chosenCurrencyValue.toFixed(3)).replace('.',',')}</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection:'row', width:'90%', justifyContent:'center', marginTop:'5%'}}>
                                        <Text style={{color:'white', fontSize:16, fontFamily:'bold-font', textAlign:'center'}}>Est. value: </Text>
                                        <Text style={{color:'white', fontSize:16, fontFamily:'normal-font', textAlign:'center'}}>{(this.state.amountEntered/this.state.cryptoSelectedValue).toFixed(3)}</Text>
                                    </View>
                            </View>
                            <View style={{flexDirection:'row', width:'75%', justifyContent:'space-around',flex:0.2, alignItems:'center'}}>
                                <TouchableOpacity   style={{height:40, width:80, backgroundColor:"#1a6594", borderRadius:5, alignItems:'center', justifyContent:'center'}}
                                                    onPress={this._onConfirmBuy}
                                >
                                    <Text style={{color:'white', fontSize:14, fontFamily:'bold-font'}}>BUY</Text>
                                </TouchableOpacity>
                                <TouchableOpacity   style={{height:40, width:80, backgroundColor:'#0f1434', borderRadius:5, alignItems:'center', justifyContent:'center'}}
                                                    onPress={()=>this.setState({isModalForBuyVisible:false})}
                                >
                                    <Text style={{color:'white', fontSize:14, fontFamily:'bold-font'}}>DISMISS</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal  animationType="slide"
                            visible={this.state.isModalForSellVisible}
                            transparent
                    >
                    <View style={{  flex: 1,
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor:'#000000000000',

                    }}>
                        <View style={{  backgroundColor: "#00a0d4",
                                        flex:0.8,
                                        width: '90%',
                                        borderRadius:10,
                                        alignItems:'center',
                                        justifyContent:'center',
                            }}>
                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center',marginTop:'5%'}}>
                                    <Image source={require('../images/icon_logo.png')} style={{width:50, height:50}}/>
                            </View>
                            <View style={{flex:0.6, width:'100%', alignItems:'center'}}>
                                    <View style={{width:'90%', marginHorizontal:'5%', flexDirection:'column', justifyContent:'space-between', alignItems:'center'}}>
                                        
                                    <View style={{width:'90%', marginHorizontal:'5%', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                        <View style={{backgroundColor:'#272b48', flexDirection:'row', borderRadius:10, alignItems:'center', height:50}}>
                                            <TextInput  placeholder="Enter your amount"
                                                        placeholderTextColor='white'
                                                        autoCapitalize="none"
                                                        style={{  color:'white',
                                                                width:'65%',
                                                                fontSize:14,
                                                                marginLeft:'2%',
                                                                fontFamily:'normal-font',
                                                            }}
                                                        keyboardType="numeric"
                                                        onChangeText={ amount => {  if(String(amount).startsWith('.') || String(amount).startsWith('-') ){
                                                                                                        Alert.alert(  "Error",
                                                                                                        'Only positive amounts please',
                                                                                                        [
                                                                                                            {
                                                                                                                text:'Ok',
                                                                                                                onPress: () => console.log("Ok Pressed")
                                                                                                            }
                                                                                                        ]
                                                                                        )
                                                                                        this.props.navigation.reset({index:0, routes:[{name:"BuyAndSell"}]});
                                                                                    }else{
                                                                                        this.setState({amountEntered:amount})
                                                                                    }
                                                                                    
                                                                                } 
                                                                    }
                                                        value={this.state.amountEntered}
                                            />
                                        </View>
                                        <View style={{backgroundColor:'#272b48', flexDirection:'column', borderRadius:10, alignItems:'center', height:50, width:'30%', justifyContent:'center'}}>
                                            <Text style={{color:'white', fontSize:12, fontFamily:'bold-font', textAlign:'center'}}>SOLD <Text style={{color:'#c9c9c9', fontSize:10, fontFamily:'bold-font'}}>({this.state.chosenCurrencySymbol})</Text></Text>
                                            <Text style={{color:'white', fontSize:13, fontFamily:'bold-font', textAlign:'center'}}>{String(this.state.chosenCurrencyValue.toFixed(3)).replace('.',',')}</Text>
                                        </View>
                                    </View>
                                    </View>
                                    <View style={{flexDirection:'row', width:'90%', justifyContent:'center', marginTop:'5%'}}>
                                        <Text style={{color:'white', fontSize:16, fontFamily:'bold-font', textAlign:'center'}}>Est. value: </Text>
                                        <Text style={{color:'white', fontSize:16, fontFamily:'normal-font', textAlign:'center'}}>{(this.state.amountEntered*this.state.cryptoSelectedValue).toFixed(3)}</Text>
                                    </View>
                            </View>
                            <View style={{flexDirection:'row', width:'75%', justifyContent:'space-around',flex:0.2, alignItems:'center'}}>
                                <TouchableOpacity   style={{height:40, width:80, backgroundColor:"#1a6594", borderRadius:5, alignItems:'center', justifyContent:'center'}}
                                                    onPress={this._onConfirmSell}
                                >
                                    <Text style={{color:'white', fontSize:14, fontFamily:'bold-font'}}>SELL</Text>
                                </TouchableOpacity>
                                <TouchableOpacity   style={{height:40, width:80, backgroundColor:'#0f1434', borderRadius:5, alignItems:'center', justifyContent:'center'}}
                                                    onPress={()=>this.setState({isModalForSellVisible:false})}
                                >
                                    <Text style={{color:'white', fontSize:14, fontFamily:'bold-font'}}>DISMISS</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>    
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
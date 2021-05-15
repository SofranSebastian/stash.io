import React from 'react';
import {View, Text, StyleSheet, StatusBar, Alert, TouchableOpacity, Image, Modal, TextInput, Dimensions, ScrollView} from 'react-native';
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
            usersArray: [],
            oldCurrenciesData : {},
            isModalVisible: false,
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
            if( this.state.usersArray.includes(this.state.usernameEntered) === false){
                Alert.alert("Error",
                                "The user does not exist.",
                                [
                                    {
                                        text:'Try Again',
                                        onPress: () => console.log("Try Again Pressed"),
                                        style: 'cancel'
                                    }
                                ]
                            )
            }else{

                if( this.state.amountEntered > this.state.chosenCurrencyValue){
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
                }else{
                   

                            this.setState({isModalVisible:!this.state.isModalVisible})
                            
                            firebase.database()
                            .ref('/users')
                            .once('value')
                            .then((snapshot) =>{
                    
                                var temporary_object = {};
                    
                                snapshot.forEach( (childSnapshot) => {
                    
                                    if( childSnapshot.val().username === this.state.usernameEntered ){
                                        
                                        temporary_object = childSnapshot.val().currencies
                                    }
                                })
                                this.setState({oldCurrenciesData:temporary_object})
                            })
                         
                            
                }
            }
        }else{
            Alert.alert("Error",
                                "Please complete all the fields before sending.",
                                [
                                    {
                                        text:'Try Again',
                                        onPress: () => console.log("Try Again Pressed"),
                                        style: 'cancel'
                                    }
                                ]
                            )
        }
    }


    _handlerConfirmTransfer = () => {

                        let path = '/users/' + this.state.usernameEntered + '/currencies'
                        let path_me = '/users/' + this.state.emailFromUser + '/currencies'

                        let value = 0
                        let value_me = 0

                        if(this.state.chosenCurrency === 'USD'){
                            value = Number(this.state.oldCurrenciesData.USD) +  Number(this.state.amountEntered)
                            value_me = this.state.chosenCurrencyValue - this.state.amountEntered
                            firebase.database().ref(path).update({USD: value})
                            firebase.database().ref(path_me).update({USD: value_me})
                            Alert.alert("Success!","The transaction is done.",[
                                                                                {
                                                                                    text:'Ok',
                                                                                    onPress: () => console.log("Ok Pressed"),
                                                                                }
                                                                            ]
                                        )
                            this.props.navigation.reset({index:0, routes:[{name:"Transfer"}]});
                        }
                        if(this.state.chosenCurrency === 'Bitcoin'){
                            if(isNaN(this.state.oldCurrenciesData.Bitcoin)){
                                value = Number(this.state.amountEntered)
                            }else{
                                value = Number(this.state.oldCurrenciesData.Bitcoin) +  Number(this.state.amountEntered)
                            }
                            value_me = this.state.chosenCurrencyValue - this.state.amountEntered
                            firebase.database().ref(path).update({Bitcoin: value})
                            firebase.database().ref(path_me).update({Bitcoin: value_me})
                            Alert.alert("Success!","The transaction is done.",[
                                                                                {
                                                                                    text:'Ok',
                                                                                    onPress: () => console.log("Ok Pressed"),
                                                                                }
                                                                            ]
                                        )
                            this.props.navigation.reset({index:0, routes:[{name:"Transfer"}]});
                        }
                        if(this.state.chosenCurrency === 'Ethereum'){
                            if(isNaN(this.state.oldCurrenciesData.Ethereum)){
                                value = Number(this.state.amountEntered)
                            }else{
                                value = Number(this.state.oldCurrenciesData.Ethereum) +  Number(this.state.amountEntered)
                            }
                            value_me = this.state.chosenCurrencyValue - this.state.amountEntered
                            firebase.database().ref(path).update({Ethereum: value})
                            firebase.database().ref(path_me).update({Ethereum: value_me})
                            Alert.alert("Success!","The transaction is done.",[
                                                                                {
                                                                                    text:'Ok',
                                                                                    onPress: () => console.log("Ok Pressed"),
                                                                                }
                                                                            ]
                                        )
                            this.props.navigation.reset({index:0, routes:[{name:"Transfer"}]});
                        }
                        if(this.state.chosenCurrency === 'BinanceCoin'){
                            if(isNaN(this.state.oldCurrenciesData.BinanceCoin)){
                                value = Number(this.state.amountEntered)
                            }else{
                                value = Number(this.state.oldCurrenciesData.BinanceCoin) +  Number(this.state.amountEntered)
                            }
                            value_me = this.state.chosenCurrencyValue - this.state.amountEntered
                            firebase.database().ref(path).update({BinanceCoin: value})
                            firebase.database().ref(path_me).update({BinanceCoin: value_me})
                            Alert.alert("Success!","The transaction is done.",[
                                                                                {
                                                                                    text:'Ok',
                                                                                    onPress: () => console.log("Ok Pressed"),
                                                                                }
                                                                            ]
                                        )
                            this.props.navigation.reset({index:0, routes:[{name:"Transfer"}]});
                        }
                        if(this.state.chosenCurrency === 'Tether'){
                            if(isNaN(this.state.oldCurrenciesData.Tether)){
                                value = Number(this.state.amountEntered)
                            }else{
                                value = Number(this.state.oldCurrenciesData.Tether) +  Number(this.state.amountEntered)
                            }
                            value_me = this.state.chosenCurrencyValue - this.state.amountEntered
                            firebase.database().ref(path).update({Tether: value})
                            firebase.database().ref(path_me).update({Tether: value_me})
                            Alert.alert("Success!","The transaction is done.",[
                                                                                {
                                                                                    text:'Ok',
                                                                                    onPress: () => console.log("Ok Pressed"),
                                                                                }
                                                                            ]
                                        )
                            this.props.navigation.reset({index:0, routes:[{name:"Transfer"}]});
                        }
                        if(this.state.chosenCurrency === 'Dogecoin'){
                            if(isNaN(this.state.oldCurrenciesData.Dogecoin)){
                                value = Number(this.state.amountEntered)
                            }else{
                                value = Number(this.state.oldCurrenciesData.Dogecoin) +  Number(this.state.amountEntered)
                            }
                            value_me = this.state.chosenCurrencyValue - this.state.amountEntered
                            firebase.database().ref(path).update({Dogecoin: value})
                            firebase.database().ref(path_me).update({Dogecoin: value_me})
                            Alert.alert("Success!","The transaction is done.",[
                                                                                {
                                                                                    text:'Ok',
                                                                                    onPress: () => console.log("Ok Pressed"),
                                                                                }
                                                                            ]
                                        )
                            this.props.navigation.reset({index:0, routes:[{name:"Transfer"}]});
                        }
                        if(this.state.chosenCurrency === 'Cardano'){
                            if(isNaN(this.state.oldCurrenciesData.Cardano)){
                                value = Number(this.state.amountEntered)
                            }else{
                                value = Number(this.state.oldCurrenciesData.Cardano) +  Number(this.state.amountEntered)
                            }
                            value_me = this.state.chosenCurrencyValue - this.state.amountEntered
                            firebase.database().ref(path).update({Cardano: value})
                            firebase.database().ref(path_me).update({Cardano: value_me})
                            Alert.alert("Success!","The transaction is done.",[
                                                                                {
                                                                                    text:'Ok',
                                                                                    onPress: () => console.log("Ok Pressed"),
                                                                                }
                                                                            ]
                                        )
                            this.props.navigation.reset({index:0, routes:[{name:"Transfer"}]});
                        }
                        if(this.state.chosenCurrency === 'XRP'){
                            if(isNaN(this.state.oldCurrenciesData.XRP)){
                                value = Number(this.state.amountEntered)
                            }else{
                                value = Number(this.state.oldCurrenciesData.XRP) +  Number(this.state.amountEntered)
                            }
                            value_me = this.state.chosenCurrencyValue - this.state.amountEntered
                            firebase.database().ref(path).update({XRP: value})
                            firebase.database().ref(path_me).update({XRP: value_me})
                            Alert.alert("Success!","The transaction is done.",[
                                                                                {
                                                                                    text:'Ok',
                                                                                    onPress: () => console.log("Ok Pressed"),
                                                                                }
                                                                            ]
                                        )
                            this.props.navigation.reset({index:0, routes:[{name:"Transfer"}]});
                        }
                        if(this.state.chosenCurrency === 'Polkadot'){
                            if(isNaN(this.state.oldCurrenciesData.Polkadot)){
                                value = Number(this.state.amountEntered)
                            }else{
                                value = Number(this.state.oldCurrenciesData.Polkadot) +  Number(this.state.amountEntered)
                            }
                            value_me = this.state.chosenCurrencyValue - this.state.amountEntered
                            firebase.database().ref(path).update({Polkadot: value})
                            firebase.database().ref(path_me).update({Polkadot: value_me})
                            Alert.alert("Success!","The transaction is done.",[
                                                                                {
                                                                                    text:'Ok',
                                                                                    onPress: () => console.log("Ok Pressed"),
                                                                                }
                                                                            ]
                                        )
                            this.props.navigation.reset({index:0, routes:[{name:"Transfer"}]});
                        }
                        if(this.state.chosenCurrency === 'InternetComputer'){
                            if(isNaN(this.state.oldCurrenciesData.InternetComputer)){
                                value = Number(this.state.amountEntered)
                            }else{
                                value = Number(this.state.oldCurrenciesData.InternetComputer) +  Number(this.state.amountEntered)
                            }
                            value_me = this.state.chosenCurrencyValue - this.state.amountEntered
                            firebase.database().ref(path).update({InternetComputer: value})
                            firebase.database().ref(path_me).update({InternetComputer: value_me})
                            Alert.alert("Success!","The transaction is done.",[
                                                                                {
                                                                                    text:'Ok',
                                                                                    onPress: () => console.log("Ok Pressed"),
                                                                                }
                                                                            ]
                                        )
                            this.props.navigation.reset({index:0, routes:[{name:"Transfer"}]});
                        }
                        if(this.state.chosenCurrency === 'BitcoinCash'){
                            if(isNaN(this.state.oldCurrenciesData.BitcoinCash)){
                                value = Number(this.state.amountEntered)
                            }else{
                                value = Number(this.state.oldCurrenciesData.BitcoinCash) +  Number(this.state.amountEntered)
                            }
                            value_me = this.state.chosenCurrencyValue - this.state.amountEntered
                            firebase.database().ref(path).update({BitcoinCash: value})
                            firebase.database().ref(path_me).update({BitcoinCash: value_me})
                            Alert.alert("Success!","The transaction is done.",[
                                                                                {
                                                                                    text:'Ok',
                                                                                    onPress: () => console.log("Ok Pressed"),
                                                                                }
                                                                            ]
                                        )
                            this.props.navigation.reset({index:0, routes:[{name:"Transfer"}]});
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
                        <Text style={{color:'white', fontSize:13, fontFamily:'bold-font', textAlign:'center'}}>{String(this.state.chosenCurrencyValue.toFixed(3)).replace('.',',')}</Text>
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
                                        onPress={this._handlerTransferCurrency}  
                    >
                        <Text style={{color:'white', fontSize:14, fontFamily:'bold-font'}}>SEND</Text>
                    </TouchableOpacity>
                    <Text style={{marginTop:'4%', marginHorizontal:'8%',color:'white', fontSize:12, fontFamily:'bold-font', textAlign:'center'}}>
                        *Be careful who you transfer to because the process is not reversible.*
                    </Text>
                </View>
                <Modal  animationType="slide"
                            visible={this.state.isModalVisible}
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
                                    <Text style={{color:'white', fontSize:24, fontFamily:'bold-font', marginTop:'5%'}}>BUY & HODL</Text>
                            </View>
                            <View style={{flex:0.6, width:'100%', alignItems:'center'}}>
                                <Text>TO : {this.state.usernameEntered}</Text>
                                <Text>AMOUNT : {this.state.amountEntered}</Text>
                            </View>
                            <View style={{flexDirection:'row', width:'75%', justifyContent:'space-around',flex:0.2, alignItems:'center'}}>
                                <TouchableOpacity   style={{height:40, width:80, backgroundColor:"#1a6594", borderRadius:5, alignItems:'center', justifyContent:'center'}}
                                                    onPress={this._handlerConfirmTransfer}
                                >
                                    <Text style={{color:'white', fontSize:14, fontFamily:'bold-font'}}>CONFIRM</Text>
                                </TouchableOpacity>
                                <TouchableOpacity   style={{height:40, width:80, backgroundColor:'#0f1434', borderRadius:5, alignItems:'center', justifyContent:'center'}}
                                                    onPress={()=>this.setState({isModalVisible:false})}
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
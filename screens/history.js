import React from 'react';
import {View, StyleSheet, Alert, Text, ScrollView, RefreshControl, Image, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import * as firebase from "firebase";

export default class History extends React.Component {
    constructor() {
        super();

        this.state = {
          email: "",
          refresh: false,
          historyArray: [],
          activityIndicator: true,
        }
    }

    _onRefresh(){
        this.setState({refresh: true});
        this._handlerGetHistory();
        this.setState({refresh:false});
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

    _handlerGetHistory = () => {
        firebase.database()
                .ref('/history')
                .once('value')
                .then((snapshot) =>{

                    let temp_array = [];

                    let temp_action = "";
                    let temp_type = "";
                    let temp_time = "";
                    let temp_date = "";
                    let temp_amount = "";
                    let temp_amount_entered = "";

                    snapshot.forEach( (childSnapshot) =>{

                        if(childSnapshot.key === this.state.emailFromUser){
                            childSnapshot.forEach( (childSnapshot2) =>{
                                let temp_object = {
                                    action: "",
                                    type: "",
                                    date: "",
                                    amount: "",
                                    amount_entered: ""
                                }

                                temp_action = childSnapshot2.val().action
                                temp_type = childSnapshot2.val().type
                                temp_date = childSnapshot2.val().date
                                temp_time = childSnapshot2.val().time
                                temp_amount = childSnapshot2.val().amount
                                temp_amount_entered = childSnapshot2.val().amountEntered

                                temp_object.action = temp_action;
                                temp_object.type = temp_type;
                                temp_object.date = temp_date;
                                temp_object.time = temp_time;
                                temp_object.amount = temp_amount;
                                temp_object.amount_entered = temp_amount_entered;

                                temp_array.push(temp_object);
                            })
                        }
                    })
                    temp_array.sort( (a, b) => (a.time > b.time) ? -1 : 1 );
                    this.setState({historyArray:temp_array});
                    
                })
                if(this.state.activityIndicator === true){
                    this.setState({activityIndicator:false})
                }
    }

    componentDidMount() {
        this._handleGetStoredEmail()
        this._handlerGetHistory()
    }

    render() {
        return (  
          <View style={styles.container}>
            <Text  style={{color:'white', fontSize:24, fontFamily:'bold-font', marginLeft:'5%', marginTop:'5%'}}>Transaction History</Text>
            <Text  style={{color:'white', fontSize:14, fontFamily:'normal-font', marginLeft:'5%', marginTop:'1%', marginBottom:"3%"}}>*Down below you can see your history.*</Text>
            <ScrollView horizontal={false} showsVerticalScrollIndicator={false} contentContainerStyle={{alignItems:'center', justifyContent:'center'}}
                refreshControl={
                    <RefreshControl
                    refreshing={this.state.refresh}
                    onRefresh={this._onRefresh.bind(this)}
                    />
                }
            >   
            {this.state.historyArray.length !==0 ?

                  this.state.historyArray.map( (item) => (
                        <View style={{flex:1,flexDirection:'row', marginHorizontal:'5%', marginVertical:'2%',height:90, width:'90%', backgroundColor:'#272b48', borderRadius:5, alignItems:'center', justifyContent:'space-around'}} key={item.time}>
                            <View style={{flex:0.33, flexDirection:'column'}}>
                                <View style={{width:'100%', alignItems:'center', marginBottom:'5%'}}>
                                    <Text style={{color:'white', fontSize:12, fontFamily:'bold-font'}}>Transaction type</Text>
                                </View>
                                <View style={ item.type === "sell" ? {backgroundColor:"#ff0000", alignItems:'center', justifyContent:'center', marginHorizontal:'10%', height:25, borderRadius: 20} : 
                                                                    item.type === "buy" ? {backgroundColor:"#39b54a", alignItems:'center', justifyContent:'center' , marginHorizontal:'10%', height:25, borderRadius: 20} : 
                                                                                            {backgroundColor:'#00a0d4', alignItems:'center', justifyContent:'center' , marginHorizontal:'10%', height:25, borderRadius: 20} }>
                    
                                    <Text style={{color:'white', fontSize:14, fontFamily:'bold-font'}}>{item.type.toUpperCase()}</Text>
                                </View>
                            </View>
                            <View style={{flex:0.33, alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                                <View style={{width:'100%', alignItems:'center', marginBottom:'5%'}}>
                                    <Text style={{color:'white', fontSize:12, fontFamily:'bold-font'}}>Transaction date</Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <Image  source={require('../images/icon_calendar.png')} style={{width:20,height:20}}/>
                                    <Text style={{marginLeft:'5%', color:'white', fontSize:14, fontFamily:'bold-font'}}>{item.date}</Text>
                                </View>
                            </View>
                            <View style={{flex:0.33, alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                                <View style={{width:'100%', alignItems:'center', marginBottom:'5%'}}>
                                    <Text style={{color:'white', fontSize:12, fontFamily:'bold-font'}}>Amount</Text>
                                </View>
                                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                                    <Image  source={require('../images/icon_amount.png')} style={{width:20,height:20}}/>
                                    <Text style={{marginLeft:'5%', color:'white', fontSize:10, fontFamily:'bold-font'}}>{ item.type === "sell" ? item.amount_entered : item.amount}</Text>
                                </View>
                            </View>

                        </View>
                  )) 

                  :

                  
                  <ActivityIndicator  size="large" color="white"/>
              
            }
              </ScrollView>
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
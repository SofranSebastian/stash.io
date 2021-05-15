import React from 'react';
import {View, Text, StyleSheet, StatusBar, Alert, TouchableOpacity, Image, TextInput, Dimensions, ScrollView, RefreshControl} from 'react-native';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
  import AsyncStorage from '@react-native-async-storage/async-storage'; 

import * as firebase from "firebase";

export default class Wallet extends React.Component {
    constructor() {
        super();

        this.state = {
            emailFromUser : "",
            currenciesData : [],
            bitcoinData : {
                percent_1h: 0,
                percent_24h: 0,
                percent_7d: 0,
                percent_30d: 0,
                percent_60d: 0,
                percent_90: 0
            },
            refresh: false
        }
       
    }

    _handlerGetDataForBitcoinChart = async() => {
        await fetch("http://ec2-3-66-169-251.eu-central-1.compute.amazonaws.com/", {"method": "GET"})
        .then( (response) => response.json() )
        .then((responseData) => this.setState({bitcoinData : {
                                                                percent_1h: responseData.data[0].quote.USD.percent_change_1h,
                                                                percent_24h: responseData.data[0].quote.USD.percent_change_24h,
                                                                percent_7d: responseData.data[0].quote.USD.percent_change_7d,
                                                                percent_30d: responseData.data[0].quote.USD.percent_change_30d,
                                                                percent_60d: responseData.data[0].quote.USD.percent_change_60d,

                                                            } 
                                                }) 
            )
        .catch( (error) => console.log(error))
    }

    _handleGetCurrenciesForUser = () => {
        firebase.database()
                .ref('/users')
                .once('value')
                .then((snapshot) =>{
                    var temporary_array = [];
                    snapshot.forEach( (childSnapshot) => {
                        if( this.state.emailFromUser === childSnapshot.val().username ){
                            temporary_array = Object.entries(childSnapshot.val().currencies);
                            console.log(Object.entries(childSnapshot.val().currencies));
                        }
                    })
                this.setState({currenciesData:temporary_array})
                })
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

    _onRefresh(){
        this.setState({refresh: true});
        this._handlerGetDataForBitcoinChart();
        this.setState({refresh:false});
    }

    _onRefreshCurrencies(){
        this.setState({refresh: true});
        this._handleGetCurrenciesForUser();
        this.setState({refresh:false});
    }

    _handlerLogout = () =>{
        this.props.navigation.reset({index:0, routes:[{name:"LogIn"}]});
    }

    componentDidMount() {
        this._handleGetStoredEmail();
        this._handlerGetDataForBitcoinChart();
        this._handleGetCurrenciesForUser();
    }

    render() {
        return (  
            <View style={styles.container}>
                <View style={{flexDirection:'row', width:Dimensions.get("window").width, alignItems:'center'}}>
                    <View style={{marginLeft:'5%',marginTop:'5%', width:'75%'}}>
                        <Text style={{fontFamily:'normal-font', fontSize:18, color:'white'}}>Hello</Text>
                        <Text style={{fontFamily:'bold-font', fontSize:22, color:'white', marginTop:"-4%"}}>{this.state.emailFromUser}</Text>
                    </View>
                    <TouchableOpacity style={{ marginLeft:'5%'}} onPress={this._handlerLogout}>
                        <Image source={require('../images/icon_logout.png')} style={{width:30, height:30}}/>
                    </TouchableOpacity>
                </View>

                <View style={{height:200,marginVertical:'5%'}}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} 
                                refreshControl={
                                    <RefreshControl
                                    refreshing={this.state.refresh}
                                    onRefresh={this._onRefreshCurrencies.bind(this)}
                                    />
                                }
                    >
                                {
                                this.state.currenciesData.map((item) => (
                                        <View key={item[1]} style={{height:200, width:125, backgroundColor:'#272b48', marginHorizontal:5, borderRadius:20, alignItems:'center', justifyContent:'center'}}>
                                            <Text style={{color:'#303463', fontSize:28, fontFamily:'normal-font'}}>●</Text>
                                            <Text style={{color:'white', fontSize:14, fontFamily:'light-font'}}>Fiat:</Text>
                                            <Text style={{color:'white', fontSize:14, fontFamily:'bold-font'}}>{item[0]}</Text>
                                            <Text style={{color:'white', fontSize:14, fontFamily:'light-font'}}>Value:</Text>
                                            <Text style={{color:'white', fontSize:14, fontFamily:'bold-font'}}>{ Number.isInteger(item[1]) ?  item[1] : item[1].toFixed(3)}</Text>
                                            <Text style={{color:'#303463', fontSize:28, fontFamily:'normal-font'}}>●</Text>
                                        </View>
                                    ))
                                }
                    </ScrollView>
                </View>

                <ScrollView contentContainerStyle={{justifyContent:'center', alignItems:'center'}}
                            refreshControl={
                                <RefreshControl
                                refreshing={this.state.refresh}
                                onRefresh={this._onRefresh.bind(this)}
                                />
                            }
                >
                    <View style={{width:Dimensions.get("window").width-20}}>
                        <Text style={{fontFamily:'bold-font', fontSize:18, color:'white', marginTop:'2%'}}>Bitcoin Chart</Text>
                    </View>

                    { this.state.bitcoinData.percent_1h !== 0 ?  

                        <LineChart
                            data={{
                            labels: ["60d", "30d", "7d", "24h", "1h" ],
                            datasets: [
                                {
                                data: [
                                    this.state.bitcoinData.percent_60d,
                                    this.state.bitcoinData.percent_30d,
                                    this.state.bitcoinData.percent_7d,
                                    this.state.bitcoinData.percent_24h,
                                    this.state.bitcoinData.percent_1h,
                                ]
                                }
                            ]
                            }}
                            width={Dimensions.get("window").width-20} // from react-native
                            height={220}
                            yAxisSuffix="%"
                            yAxisInterval={1} // optional, defaults to 1
                            chartConfig={{
                            backgroundColor: "#303463",
                            backgroundGradientFrom: "#303463",
                            backgroundGradientTo: "#272b48",
                            decimalPlaces: 2, // optional, defaults to 2dp
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16
                            },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: "#272b48"
                            }
                            }}
                            bezier
                            style={{
                            marginVertical: 1,
                            borderRadius: 16
                            }}
                        />

                    :
                        <View style={{justifyContent:'center', alignItems:'center'}}>
                            <Text style={{fontFamily:'bold-font', fontSize:18, color:'white', marginTop:'2%'}}>Chart N/A. Couldn't retrieve data.</Text>
                            <Text style={{fontFamily:'bold-font', fontSize:18, color:'white', marginTop:'2%'}}>Server is down.</Text>
                        </View>
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
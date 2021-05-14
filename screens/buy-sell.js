import React from 'react';
import {View, Text, StyleSheet, StatusBar, Alert, TouchableOpacity, Image, TextInput, Dimensions, ScrollView, RefreshControl, Modal} from 'react-native';

import * as firebase from "firebase";

const dummyData = require('../data.json')

export default class BuyAndSell extends React.Component {
    constructor() {
        super();

        this.state = {
            cryptoData: dummyData.data,
            refresh: false,
            isModalForBuyVisible: false,
            isModalForSellVisible: false,
            calculatedAmountForBuy: 0,
        }
    }

    _handlerGetDataForTopTen = async() => {
        await fetch("http://ec2-3-66-169-251.eu-central-1.compute.amazonaws.com/", {"method": "GET"})
        .then( (response) => response.json() )
        .then((responseData) => this.setState({cryptoData : dummyData.data}) )
        .catch( (error) => console.log(error))
    }

    _onRefresh(){
        this.setState({refresh: true});
        this._handlerGetDataForTopTen();
        this.setState({refresh:false});
      }

    _onBuyPressHandler = () => {
        this.setState({isModalForBuyVisible:true})
    }

    componentDidMount() {
        this._handlerGetDataForTopTen()
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
                                {
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
                                                    <TouchableOpacity style={{height:30, width:80, backgroundColor:"#39b54a", borderRadius:5, alignItems:'center', justifyContent:'center'}}
                                                                        onPress={this._onBuyPressHandler}
                                                    >
                                                        <Text style={{color:'white', fontSize:14, fontFamily:'bold-font'}}>BUY</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={{height:30, width:80, backgroundColor:'#ff0000', borderRadius:5, alignItems:'center', justifyContent:'center'}}>
                                                        <Text style={{color:'white', fontSize:12, fontFamily:'bold-font'}}>SELL</Text>
                                                    </TouchableOpacity>
                                                </View>
                                        </View>
                                    ))
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
                                        flex:0.95,
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
                                    <View style={{backgroundColor:'black', flexDirection:'row', borderRadius:10, alignItems:'center', height:50, width:'90%', marginTop:'3%'}}>
                                    <TextInput  placeholder="Your amount"
                                                placeholderTextColor='white'
                                                autoCapitalize="none"
                                                style={{  color:'white',
                                                        width:'90%',
                                                        marginHorizontal:'5%',
                                                        fontSize:14,
                                                        fontFamily:'normal-font'
                                                    }}
                                                keyboardType="numeric"
                                                onChangeText={ sum => this.setState({calculatedAmountForBuy:sum/50000})}
                                                value={this.state.calculatedAmountForBuy}
                                        />
                                    </View>
                                    <Text style={{color:'black', fontSize:15, fontFamily:'bold-font'}}>{this.state.calculatedAmountForBuy}</Text>
                            </View>
                            <View style={{flexDirection:'row', width:'75%', justifyContent:'space-around',flex:0.2, alignItems:'center'}}>
                                <TouchableOpacity   style={{height:40, width:80, backgroundColor:"#1a6594", borderRadius:5, alignItems:'center', justifyContent:'center'}}
                                                    onPress={this._onBuyPressHandler}
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
import React from 'react';
import {Text, Image} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {NavigationContainer} from '@react-navigation/native';

import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs'

import Preview from '../screens/preview.js';
import SignUp from '../screens/sign-up.js';
import LogIn from '../screens/log-in.js';
import Wallet from '../screens/wallet.js';
import BuyAndSell from '../screens/buy-sell.js';
import Transfer from '../screens/transfer.js';


const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

function MyBottomTabNavigator(){
    return(
        <Tab.Navigator  initialRouteName="MenuNavigator"
                        activeColor="white"
                        style={{backgroundColor:"#303463"}}
                        barStyle={{ backgroundColor:"#272b48",
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    overflow: 'hidden',
                                    
                        }}
                        shifting={true}
        >
            <Tab.Screen name="Wallet"
                        component={Wallet}
                        options={{   
                            tabBarIcon: ({color}) => (
                              <Image  source={require('../images/icon_wallet.png')} style={{width:25,height:25}}/>
                            ),
                            tabBarLabel: <Text style={{fontWeight:'bold', fontSize:14}}>Wallet</Text>  
                        }}
            
            />
            <Tab.Screen name="BuyAndSell"
                        component={BuyAndSell}
                        options={{   
                            tabBarIcon: ({color}) => (
                                <Image  source={require('../images/icon_buy_and_sell.png')} style={{width:25,height:25}}/>
                            ),
                            tabBarLabel: <Text style={{fontWeight:'bold', fontSize:14}}>Buy/Sell</Text>  
                        }}
            
            />
             <Tab.Screen name="Transfer"
                        component={Transfer}
                        options={{   
                            tabBarIcon: ({color}) => (
                                <Image  source={require('../images/icon_transfer.png')} style={{width:25,height:25}}/>
                            ),
                            tabBarLabel: <Text style={{fontWeight:'bold', fontSize:14}}>Transfer</Text>  
                        }}
            
            />
        </Tab.Navigator>
    )
}

function MyStack() {
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen   name="Preview"
                                component={Preview}
                                options={
                                    ({navigation, route}) => ({
                                        headerShown: false,
                                    })
                                }
                />
                <Stack.Screen   name="SignUp"
                                component={SignUp}
                                options={
                                    ({navigation, route}) => ({
                                        headerShown: false,
                                    })
                                }
                />
                <Stack.Screen   name="LogIn"
                                component={LogIn}
                                options={
                                    ({navigation, route}) => ({
                                        headerShown: false,
                                    })
                                }
                />
                <Stack.Screen   name="MenuNavigator"
                                component={MyBottomTabNavigator}
                                options={
                                    ({navigation, route}) => ({
                                        headerShown: false,
                                    })
                                }
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MyStack;
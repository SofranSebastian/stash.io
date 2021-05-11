import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';

import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs'

import Preview from '../screens/preview.js';
import SignUp from '../screens/sign-up.js';
import LogIn from '../screens/log-in.js';


const Stack = createStackNavigator()

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
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MyStack;
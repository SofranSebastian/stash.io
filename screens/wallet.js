import React from 'react';
import {View, Text, StyleSheet, StatusBar, Alert, TouchableOpacity, Image, TextInput} from 'react-native';

import * as firebase from "firebase";

export default class Wallet extends React.Component {
    constructor() {
        super();

        this.state = {

        }
    }

    componentDidMount() {

    }


    render() {
        return (  
            <View style={styles.container}>
                <StatusBar style="auto" />
               <Text>Wallet Screen</Text>
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
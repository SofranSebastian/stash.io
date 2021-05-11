import React from 'react';
import {View, Text, StyleSheet, StatusBar, Alert, TouchableOpacity} from 'react-native';

import * as firebase from "firebase";
export default class SignUp extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {

    }

    _handleSignUp = () => {
      firebase.auth()
              .createUserWithEmailAndPassword("sofransebastian@yahoo.com", '123456')
              .then( () => console.log("Users Registered succesfully!"))
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

    render() {
        return (
            <View style={styles.container}>
                <StatusBar style="auto" />
                <Text>SignUP</Text>
                <TouchableOpacity onPress={this._handleSignUp}>
                  <Text>SIGNUP</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#303463'
    },
});
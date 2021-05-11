import React from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';

export default class LogIn extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {

    }


    render() {
        return (
            <View style={styles.container}>
                <StatusBar style="auto" />
                <Text>Login</Text>
                
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

import React from 'react';
import {View, Text, StyleSheet, StatusBar, Image} from 'react-native';

export default class SignUp extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar style="auto" />
                <Text>SignUP</Text>
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
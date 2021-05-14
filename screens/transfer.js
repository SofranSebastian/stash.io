import React from 'react';
import {View, Text, StyleSheet, StatusBar, Alert, TouchableOpacity, Image, TextInput, Dimensions, ScrollView} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import * as firebase from "firebase";

export default class Transfer extends React.Component {
    constructor() {
        super();

        this.state = {
            isDropdownPickerOpened: false,
            chosenCurrency: '1',
        }
    }

    componentDidMount() {

    }

    _setOpen = () => {
        this.setState({isDropdownPickerOpened:!this.state.isDropdownPickerOpened})
    }



    render() {
        return (  
            <View style={styles.container}>
                    
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
                                                onChangeText={ value => this.setState({calculatedAmountForBuy:value/50000})}
                                                value={this.state.calculatedAmountForBuy}
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
                                                onChangeText={ value => this.setState({calculatedAmountForBuy:value/50000})}
                                                value={this.state.calculatedAmountForBuy}
                                        />
                </View>
                <DropDownPicker
                items={[
                            {label: 'Item 1', value: 'item1'},
                            {label: 'Item 2', value: 'item2'},
                            {label: 'Item 3', value: 'item3'},
                            {label: 'Item 4', value: 'item4'},
                            {label: 'Item 5', value: 'item5'},
                            {label: 'Item 6', value: 'item6'},
                            {label: 'Item 7', value: 'item7'},
                        ]}
                placeholder='Pick your currency'
                searchable={true}
                searchablePlaceholder={"Search for a currency"}
                containerStyle={{height: 50, width:'90%', marginHorizontal:'5%', marginTop:'3%'}}
                arrowColor={'white'}
                arrowSize={20}
                labelStyle={{fontFamily:'normal-font'}}
                placeholderStyle={{color:'#b8b8b8', fontSize:14, fontFamily:'normal-font'}}
                style={{backgroundColor:'#272b48', borderWidth:0}}
                selectedLabelStyle={{color:'white'}}
                onChangeItem={item => this.setState({chosenCurrency:item.value})}
            />
                <View style={{position:'absolute', top:'90%', width:'90%', marginHorizontal:"5%" }}>
                    <TouchableOpacity   style={{height:40, width:'100%', backgroundColor:'#0f1434', borderRadius:5, alignItems:'center', justifyContent:'center', opacity:0.5}}
                                        disabled={false}   
                                        onPress={()=>console.log(this.state.chosenCurrency)}  
                    >
                        <Text style={{color:'white', fontSize:14, fontFamily:'bold-font'}}>SEND</Text>
                    </TouchableOpacity>
                </View>
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
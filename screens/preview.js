import React from 'react';
import {View, Text, StyleSheet, StatusBar, Image, TouchableOpacity} from 'react-native';
import AppIntroSlider from "react-native-app-intro-slider";

const slides = [
    {
        key: "one",
        title: "KEEP IT ORGANIZED",
        text: "Buy any available cryptocurrency with money right in the app or sell your cryptos for money.",
        image: require('../images/icon_organized.png')
    },
    {
        key: "two",
        title: "WALLET MANAGEMENT",
        text: "Store and manage all your digital currencies with ease without any worries.",
        image: require('../images/icon_wallet.png')
    },
    {
        key: "three",
        title: "TRANSFER",
        text: "Transfer any coin you have instantly and easily to anyone by following a simple process.",
        image: require('../images/icon_safe.png')
    }
]

export default class Preview extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {

    }

    _renderItem = ({item}) =>{
        return(
            <View style={{ flex:1, alignItems:'center', justifyContent:'center'}}>
                <Image source={item.image} resizeMode="cover" style={{width:150,height:150, marginVertical:'5%'}}/>
                <Text style={{color:'white', fontSize:24, fontFamily:'bold-font'}}>{item.title}</Text>
                <Text style={{color:'white', fontSize:16, fontFamily:'normal-font', marginHorizontal:'12%', textAlign:'center'}}>{item.text}</Text>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar style="auto" />
                <View style={{ flex:0.08, justifyContent:'center', alignItems:'flex-end',marginRight:'5%'}}>
                    <TouchableOpacity onPress={ () => this.props.navigation.navigate('SignUp') }>
                        <Text style={{color:'white', fontSize:18, fontFamily:'bold-font'}}>
                            SKIP
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex:0.9, marginBottom:'10%'}}>
                    <AppIntroSlider
                        renderItem={this._renderItem}
                        data = {slides}
                        activeDotStyle={{backgroundColor:"#00a0d4"}}
                        dotStyle={{backgroundColor:'#55597c'}}
                        nextLabel=""
                        doneLabel=""
                        
                    />
                </View>
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

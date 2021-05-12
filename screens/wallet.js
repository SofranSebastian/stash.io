import React from 'react';
import {View, Text, StyleSheet, StatusBar, Alert, TouchableOpacity, Image, TextInput, Dimensions, ScrollView} from 'react-native';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";

import * as firebase from "firebase";

export default class Wallet extends React.Component {
    constructor() {
        super();

        this.state = {
            dummyArray:[
                {
                    id:1,
                    fiat: "Bitcoin",
                    value: 0.01,
                },
                {
                    id:2,
                    fiat: "Ethereum",
                    value: 24.4,
                },
                {
                    id:3,
                    fiat: "USD",
                    value: 254.34,
                },
                {
                    id:4,
                    fiat: "DOGE",
                    value: 12313.2,
                },
                {
                    id:5,
                    fiat: "LITECOIN",
                    value: 156.2,
                },

            ]
        }
    }

    componentDidMount() {

    }


    render() {
        return (  
            <View style={styles.container}>
                <View style={{marginLeft:'5%',marginTop:'5%', width:Dimensions.get("window").width}}>
                    <Text style={{fontFamily:'normal-font', fontSize:18, color:'white'}}>Hello</Text>
                    <Text style={{fontFamily:'bold-font', fontSize:26, color:'white', marginTop:"-4%"}}>username</Text>
                </View>

                <View style={{height:200,marginVertical:'5%'}}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                                {
                                this.state.dummyArray.map((item) => (
                                        <View key={item.id} style={{height:200, width:125, backgroundColor:'#272b48', marginHorizontal:5, borderRadius:20, alignItems:'center', justifyContent:'center'}}>
                                            <Text style={{color:'#303463', fontSize:28, fontFamily:'normal-font'}}>●</Text>
                                            <Text style={{color:'white', fontSize:14, fontFamily:'normal-font'}}>Fiat:</Text>
                                            <Text style={{color:'white', fontSize:20, fontFamily:'bold-font'}}>{item.fiat}</Text>
                                            <Text style={{color:'white', fontSize:14, fontFamily:'normal-font'}}>Value:</Text>
                                            <Text style={{color:'white', fontSize:20, fontFamily:'bold-font'}}>{item.value}</Text>
                                            <Text style={{color:'#303463', fontSize:28, fontFamily:'normal-font'}}>●</Text>
                                        </View>
                                    ))
                                }
                    </ScrollView>
                </View>

                <View style={{justifyContent:'center', alignItems:'center'}}>
                    <View style={{width:Dimensions.get("window").width-20}}>
                        <Text style={{fontFamily:'bold-font', fontSize:18, color:'white', marginTop:'2%'}}>Bitcoin Chart</Text>
                    </View>
                    <LineChart
                        data={{
                        labels: ["1h", "24h", "7d", "30d", "60d", "90d"],
                        datasets: [
                            {
                            data: [
                            0.12684,
                            2.73229,
                            4.06216,
                            -4.98554,
                            0.12503,
                            26.8709,
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
import React from "react";
import {
    ActivityIndicator,
    Button,
    Dimensions, Image,
    LogBox,
    Modal,
    ScrollView,
    StyleSheet,
    Text, TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    CHANGE_PASSWORD, UPDATE_USER_INFO, VERIFY_INFO
} from "../../secrets";
import AsyncStorage from '@react-native-community/async-storage';
import {Picker} from "@react-native-community/picker";
import {setEmail} from "../api/token";

export default class changeEmail extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            email:'',
            new_email:'',
            send_success:false,
            verify_code:'',
        }
    }

    async componentDidMount() {
        this.setState({
            email:await AsyncStorage.getItem('@email'),
        })

    }

    async change_email(email){
        const AccessToken = await AsyncStorage.getItem('@access_token');
        const IdToken = await AsyncStorage.getItem('@auth_token');

        const result = await fetch(UPDATE_USER_INFO, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "Authorization": IdToken,
                "AccessToken" : AccessToken,
            },
            body: JSON.stringify({
                'attributes':[
                    {
                        'attributeName': 'email',
                        'attributeValue': email,
                    },
                ]
            }),
        });
        if(result.ok)
        {
            await setEmail(email)
            this.setState({
                email:email,
                send_success:true
            })
        }
        else {
            alert("Something went wrong!");
        }
    }

    async verify_send(verifyCode){
        const AccessToken = await AsyncStorage.getItem('@access_token');
        const IdToken = await AsyncStorage.getItem('@auth_token');

        const result = await fetch(VERIFY_INFO, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "Authorization": IdToken,
                "AccessToken" : AccessToken,
            },
            body: JSON.stringify({
                'attributeName': 'email',
                'verifyCode': verifyCode,}),
        });
        if(result.ok)
        {
            alert("Mail changed successfully!")
            this.setState({
                send_success:false,
            })
        }
        else
        {
            let responseJson =  await result.json();
            alert(responseJson.message)
        }
    }


    render()
    {
        return(
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.output}>
                    <Image
                        style={styles.logo}
                        source={require('../assets/Login.png')}
                    />
                    <Text style={styles.first_text}>Update your e-mail</Text>

<View>
                    <Text style={styles.second_text}>Email:</Text>
                    <TextInput
                        placeholder={this.state.email}
                        placeholderTextColor={'#868080'}
                        style={styles.input}
                        onChangeText={(text) => this.setState({
                            new_email:text,
                        })}
                    />
                    <TouchableOpacity onPress={()=>this.change_email(this.state.new_email)}>
                        <View style={styles.button}>
                            <Text style={{color:'#fff',fontSize:18,fontWeight:"bold",fontFamily:"Roboto"}}>Apply</Text>
                        </View>
                    </TouchableOpacity>

</View>
                    {this.state.send_success === true ?
                        <View style={{marginTop:'2%'}}>
                            <Text style={{color:'#fff'}}>Please type the code that we sent your email.</Text>
                            <Text style={styles.second_text}>Verify Code:</Text>
                            <TextInput
                        placeholder={"Type verify code..."}
                        placeholderTextColor={'#868080'}
                        style={styles.input}
                        onChangeText={(text) => this.setState({
                            verify_code:text,
                        })}
                        keyboardType='number-pad'
                            />
                        <TouchableOpacity onPress={()=>this.verify_send(this.state.verify_code)}>
                            <View style={styles.button}>
                                <Text style={{color:'#fff',fontSize:18,fontWeight:"bold",fontFamily:"Roboto"}}>Send</Text>
                            </View>
                        </TouchableOpacity>
                        </View>

                        : <View></View>}




                </View>
            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#262d3c",
    },
    output:{
        borderWidth: 1,
        borderRadius:5,
        borderColor: "#353f53",
        backgroundColor:"#353f53",
        padding:20,

    },
    logo:{
        alignSelf:"center",

    },
    first_text:{
        fontFamily:"Roboto",
        color:'#fff',
        fontSize:20,
        textAlign:"center",
        marginBottom: '5%',
    },
    second_text:{
        fontFamily: "Roboto",
        color:'#fff',
        fontSize: 15,
        textAlign: "left",
        marginTop:'2%',
        fontWeight: "bold",
    },
    input: {
        height: 40,
        width: 300,
        borderColor: 'gray',
        fontFamily:"Roboto",
        fontWeight:"bold",
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 2,
        marginBottom:'2%',
        color:'#474343',
        backgroundColor:'#E8F0FE',
        fontSize:18,
    },
    button:{
        alignItems:'center',justifyContent:"center",
        backgroundColor:'#2196F3',
        marginTop:'2%',
        borderWidth:2,
        borderRadius:5,
        borderColor:'#2196F3',
        minHeight:'9%'
    }
});

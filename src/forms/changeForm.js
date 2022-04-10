import React, { useState } from 'react';
import {ScrollView, StyleSheet, TextInput, Button, Text, View, Image, TouchableOpacity} from 'react-native';
import {setMessage, setResetToken, setToken, setUsername,setAccessToken} from '../api/token';
import {API_URL, LATEST_AP} from "../../secrets";
import AsyncStorage from "@react-native-community/async-storage";

const _retrieveData = async () => {
    return await AsyncStorage.getItem('changeUserName');
}


const usernameForm = ({ buttonText, onSubmit, children, onAuthentication }) => {
    const [username, setState] = useState('');
    const [password, onChangePassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    if (username == null || username === '' || username.length === 0)
    {
        _retrieveData().then((user)=> {
            setState(user)
        }).catch((error) => console.log(error))
    }

    const submit = () => {
        if(password === '')
        {
            alert("Please type new password!")
        }
        else
        {
            onSubmit(username, password)
                .then(async () => {

                    return fetch(API_URL, {
                        method: 'POST',
                        headers:{
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "username":username,
                            "password":password,
                        }),
                    }).then((response) => response.json()).then(async (responseJson) => {
                        let AccessToken = JSON.parse(JSON.stringify(responseJson.AuthenticationResult.AccessToken));
                        let IdToken = JSON.parse(JSON.stringify(responseJson.AuthenticationResult.IdToken));
                        await setToken(IdToken);
                        await setAccessToken(AccessToken);
                        onAuthentication();
                    }).catch(() => {
                        setErrorMessage('Something went wrong, Please try again!');
                    })
                })
                .catch((res) => {
                    setErrorMessage(res.error);
                });
        }
    };
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.output}>
                <Image
                    style={styles.logo}
                    source={require('../assets/Login.png')}
                />
<Text style={styles.first_text}>Change your password</Text>
                <Text style={styles.second_text}>Enter your credentials below</Text>
            <TextInput
                style={styles.input}
                //onChangeText={(text) => onChangeUsername(text)}
                editable={false}
                value={username}
                //keyboardType="username-address"
            />
            <TextInput
                style={styles.input}
                onChangeText={(text) => onChangePassword(text)}
                value={password}
                secureTextEntry
                placeholder={"New Password"}
            />
                <TouchableOpacity onPress={submit}>
                    <View style={styles.button}>
                        <Text style={{color:'#fff',fontSize:16,fontFamily:"Roboto"}}>CHANGE PASSWORD</Text>
                    </View>
                </TouchableOpacity>

            {errorMessage ? <Text style={{color:'#fff'}}>{errorMessage}</Text> : null}
            {children}
            </View>

        </ScrollView>
    );
};


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
        textAlign:"center"
    },
    second_text:{
        fontFamily: "Roboto",
        color:'#b4adad',
        fontSize: 15,
        textAlign: "center"
    },
    input: {
        height: 40,
        width: 300,
        borderColor: 'gray',
        fontFamily:"Roboto",
        fontWeight:"bold",
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 20,
        marginBottom:20,
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

export default usernameForm;

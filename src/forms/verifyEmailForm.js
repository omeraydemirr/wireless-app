import React, { useState } from 'react';
import {ScrollView, StyleSheet, TextInput, Button, Text, View, Image, TouchableOpacity} from 'react-native';
import {setChangeUserName, setMessage, setResetToken, setToken, setUsername} from '../api/token';

const usernameForm = ({ buttonText, onSubmit, children, onAuthentication }) => {
    const [verifyCode, onChangeVerifyCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const submit = () => {
        if(verifyCode === '')
        {
            alert("Please enter Verify Code!")
        }

        else
        {
        onSubmit(verifyCode)
            .then(async (res) => {
                await setChangeUserName('');
                onAuthentication();
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
                <Text style={styles.first_text}>Verify Code</Text>
                <Text style={styles.second_text}>Enter the verify code we sent to your email...</Text>

                <TextInput
                style={styles.input}
                onChangeText={(text) => onChangeVerifyCode(text)}
                value={verifyCode}
                placeholder={"Enter verify code..."}
                //keyboardType="username-address"
            />
                <TouchableOpacity onPress={submit}>
                    <View style={styles.button}>
                        <Text style={{color:'#fff',fontSize:17,fontFamily:"Roboto"}}>SEND</Text>
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
        padding:30,

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
        minHeight:'11%'
    }
});

export default usernameForm;

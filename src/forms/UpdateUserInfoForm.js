import React, { useState } from 'react';
import {ScrollView, StyleSheet, TextInput, Button, Text, Dimensions, View, Image, TouchableOpacity} from 'react-native';
import {setTimeZone, setMessage, setResetToken, setToken, setUsername} from '../api/token';
import {Picker} from "@react-native-community/picker";
import moment from "moment-timezone";

const usernameForm = ({ buttonText, onSubmit, children, onAuthentication }) => {
    const [name, onchangeName] = useState('');
    const [email, onChangeEmail] = useState('');
    const [selectedLanguage, onChangeSelectedLanguage] = useState('');
    const [selectedTimeZone, onChangeSelectedTimeZone] = useState('');


    const [errorMessage, setErrorMessage] = useState('');
    const submit = () => {
        if(name === '' || email === '' || selectedLanguage === '' || selectedTimeZone === '')
        {
            alert('Please select and fill all options!')
        }
        else
        {
            onSubmit(name, email,selectedLanguage,selectedTimeZone)

                .then(async (res) => {
                    await setTimeZone(selectedTimeZone)
                    onAuthentication();
                })
                .catch((res) => {
                    setErrorMessage("Something went wrong,please try later!");
                });
        }

    };

    /*
    for (let val=0;val< moment.tz.names().length;val++)
    {
        let mom = moment.tz.names()[val];
    }
     */
    let momentData = moment.tz.names().map((val,key) => {

        return(
            <Picker.Item value={val} label={val} key={key}/>
        )

    })

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.output}>
                <Image
                    style={styles.logo}
                    source={require('../assets/Login.png')}
                />
                <Text style={styles.first_text}>Update your information</Text>

            <TextInput
                placeholder={'Type your name...'}
                placeholderTextColor={'#868080'}
                style={styles.input}
                onChangeText={(text) => onchangeName(text)}
                value={name}
                //keyboardType="username-address"
            />
            <TextInput
                placeholder={'Type your e-mail...'}
                placeholderTextColor={'#868080'}
                style={styles.input}
                onChangeText={(text) => onChangeEmail(text)}
                value={email}
            />
                <Text style={styles.second_text}>Language</Text>

                <View style={styles.picker_view}>

            <Picker
                selectedValue={selectedLanguage}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => onChangeSelectedLanguage(itemValue)}

            >
                <Picker.Item label="Select Language..." value="" />

                <Picker.Item label="English" value="en" />
                <Picker.Item label="French" value="fr" />
            </Picker>
                </View>
                <Text style={styles.second_text}>Timezone</Text>

                <View style={styles.picker_view}>
            <Picker
                selectedValue={selectedTimeZone}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => onChangeSelectedTimeZone(itemValue)}
            >
                <Picker.Item label="Select Timezone..." value="" />
                {momentData}
            </Picker>
</View>
                <TouchableOpacity onPress={submit}>
                    <View style={styles.button}>
                        <Text style={{color:'#fff',fontSize:16,fontFamily:"Roboto"}}>UPDATE INFORMATION</Text>
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
        padding:40,

    },
    logo:{
        alignSelf:"center",

    },
    first_text:{
        fontFamily:"Roboto",
        color:'#fff',
        fontSize:20,
        textAlign:"center",
        marginBottom:10,
    },
    second_text:{
        fontFamily: "Roboto",
        color:'#b4adad',
        fontSize: 15,
        textAlign: "center"
    },
    picker_view:{
        borderColor:'#fff',
        borderWidth:1,
        borderRadius:5,
        alignItems:"center",
        marginBottom: 15,
        marginTop:10,
    },
    picker:
        {
            height: 50,
            width: 200,
            color:"#fff",
        },
    input: {
        height: 40,
        width: 300,
        borderColor: 'gray',
        fontFamily:"Roboto",
        fontWeight:"bold",
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10,
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

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
    CHANGE_PASSWORD, UPDATE_USER_INFO
} from "../../secrets";
import AsyncStorage from '@react-native-community/async-storage';

export default class changePassword extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            pre_password:'',
            new_password:'',
            confirm_password:''
        }
    }

    componentDidMount() {
    }

    async change_password(){
        if(this.state.new_password !== this.state.confirm_password)
        {
            alert("Passwords doesnt match!")
        }
        else
        {
            const AccessToken = await AsyncStorage.getItem('@access_token');
            const IdToken = await AsyncStorage.getItem('@auth_token');
            const UserID = await AsyncStorage.getItem('@username');
            const result = await fetch(CHANGE_PASSWORD + UserID, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": IdToken,
                    'AccessToken':AccessToken,
                },
                body:JSON.stringify({
                    "old_password":this.state.pre_password,
                    "new_password":this.state.new_password,
                })
            })
            if(result.ok)
            {
                alert("Password changed successfully!")
            }
            else
            {
                let new_result = await result.json();
                alert(new_result.message ? new_result.message.toString() : "Password could not change! Please try later!")
            }
        }
    }

    render()
    {
        return(
            <View style={styles.container}>


                <View style={styles.output}>
                    <Image
                        style={styles.logo}
                        source={require('../assets/Login.png')}
                    />
                    <Text style={styles.first_text}>Change your password</Text>

                    <Text style={styles.second_text}>Previous Password:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.setState({pre_password:text})}
                        secureTextEntry
                        //value={username}
                        //keyboardType="username-address"
                        placeholder={"Previous Password..."}
                    />

                    <Text style={styles.second_text}>New Password:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.setState({new_password:text})}
                        //value={password}
                        secureTextEntry
                        placeholder={"New Password..."}
                    />

                    <Text style={styles.second_text}>Confirm New Password:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.setState({confirm_password:text})
                        }
                        //value={password}
                        secureTextEntry
                        placeholder={"Confirm New Password..."}
                    />
                    <TouchableOpacity onPress={()=>this.change_password()}>
                        <View style={styles.button}>
                            <Text style={{color:'#fff',fontSize:16,fontFamily:"Roboto"}}>CHANGE PASSWORD</Text>
                        </View>
                    </TouchableOpacity>


                </View>

            </View>
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
        marginTop:'2%'
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
        marginTop:'5%',
        borderWidth:2,
        borderRadius:5,
        borderColor:'#2196F3',
        minHeight:'9%'
    }
});

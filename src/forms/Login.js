import React, { useState } from 'react';
import {ScrollView, StyleSheet, TextInput, Button, Text, View, Image, TouchableOpacity,Dimensions} from 'react-native';
import {
    setMessage,
    setResetToken,
    setToken,
    setUsername,
    setChangeUserName,
    setTimeZone,
    setAccessToken, setName, setEmail, setLanguage, setRole
} from '../api/token';
import AsyncStorage from "@react-native-community/async-storage";
import { useNavigation } from '@react-navigation/native';
import IIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from "react-native-video";
import ResetForm from "./resetForm";
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import {
    SEND_CODE_FORGOT_PASSWORD,
    NEW_PASSWORD_SAVE,
    API_URL,

} from "../../secrets";





//IF CLIENT FORGETS OWN PASSWORD AND VERIFY CODE
class NewPassword extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            verify_code:'',
            username:'',
            new_password:'',
            confirm_password:'',
        }
    }

    async componentDidMount() {
    }

    openLoginForm = () => {
        this.props.showLogin();
    }

    openForgot = () => {
        this.props.showForgot()
    }

    async save_password(verify_code,username,new_password,confirm_password){
        console.log("save password")
        if(new_password !== confirm_password)
        {
            alert("Passwords does not match! Please check.")
        }
        else
        {
            const result = await fetch(NEW_PASSWORD_SAVE, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'username': username,
                    'confirmationCode': verify_code,
                    'password':new_password,
                }),
            });
            if(result.ok)
            {
                alert("New password was saved successfully!")
                this.openLoginForm();
    
            }
            else {
                alert("Something went wrong! Please check your verify code.");
            }
        }
    }

    render()
    {
        return(
            <View >
       
<TouchableOpacity style={{position:"absolute",left:-50,top:20,color:'#fff',
flexDirection:"row",justifyContent:"space-evenly"}}
onPress={this.openForgot}
>
<HeaderBackButton
tintColor={'white'}
onPress={this.openForgot}
/>   
<Text style={{fontSize:24,color:'#fff'}}>BACK</Text>
</TouchableOpacity>





<View style={{alignSelf:"center",justifyContent:"center",flex:1}}>
<Text style={styles.first_text}>Verify Account</Text>
<Text style={[styles.second_text]}>Type verify code that we sent your email.</Text>


<View>
<View style={{
flexDirection: 'row',
justifyContent: 'center',
alignItems: 'center',
}}>
<IIcon style={{left:10,position:"absolute",zIndex:2
}} name="check-circle" color={'white'} size={25}  />
<TextInput
placeholder={"Type verify code"}
placeholderTextColor={'#b4adad'}
style={[styles.input, {fontWeight:"normal",paddingLeft:38}]}
onChangeText={(text) => this.setState({
verify_code:text,
})}
keyboardType='number-pad'
/>
</View>

<View style={{
flexDirection: 'row',
justifyContent: 'center',
alignItems: 'center',
}}>
<IIcon style={{left:10,position:"absolute",zIndex:2
}} name="account" color={'white'} size={25}  />
<TextInput
style={[styles.input, {fontWeight:"normal",paddingLeft:38}]}
onChangeText={(text) => this.setState({
username:text,
})}
placeholder={"Username"}
placeholderTextColor={'#b4adad'}
/>
</View>

<View style={{
flexDirection: 'row',
justifyContent: 'center',
alignItems: 'center',
}}>
<IIcon style={{left:10,position:"absolute",zIndex:2
}} name="lock" color={'white'} size={25}  />
<TextInput
style={[styles.input, {fontWeight:"normal",paddingLeft:38}]}
onChangeText={(text) => this.setState({
new_password:text,
})}
secureTextEntry
placeholder={"New Password"}
placeholderTextColor={'#b4adad'}
/>

</View>

<View style={{
flexDirection: 'row',
justifyContent: 'center',
alignItems: 'center',
}}>
<IIcon style={{left:10,position:"absolute",zIndex:2
}} name="lock" color={'white'} size={25}  />
<TextInput
style={[styles.input, {fontWeight:"normal",paddingLeft:38}]}
onChangeText={(text) => this.setState({
confirm_password:text,
})}
secureTextEntry
placeholder={"Confirm Password"}
placeholderTextColor={'#b4adad'}

/>
</View>




                        <TouchableOpacity onPress={()=>this.save_password(this.state.verify_code,this.state.username,this.state.new_password,this.state.confirm_password)}>
                            <View style={styles.button}>
                                <Text style={{color:'#fff',fontSize:18,fontWeight:"bold",fontFamily:"Roboto"}}>Submit</Text>
                                <IIcon name="chevron-right" color={'#fff'} size={25} />

                            </View>
                        </TouchableOpacity>

                    </View>

                </View>
            </View>
        )
    }

}

//IF CLIENT FORGETS OWN PASSWORD
class ForgotPassword extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            email:'',
        }
    }

    async componentDidMount() {
    }


    openNewPass = () => {
        this.props.showNewPass();
    }

    goBack = () => {
        this.props.showLogin();
    }



    async send_code(email){
        if(email === '')
        {
            alert("Email must be filled!")
        }
        else
        {
            const result = await fetch(SEND_CODE_FORGOT_PASSWORD + email, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if(result.ok)
            {
                this.openNewPass();
            }
            else {
                alert("Something went wrong! Please check your email.");
            }
        }

    }

    render()
    {
        return(
            <View>

<TouchableOpacity style={{position:"absolute",left:-50,top:20,color:'#fff',
flexDirection:"row",justifyContent:"space-evenly"}}
onPress={this.goBack}
>
<HeaderBackButton
tintColor={'white'}
onPress={this.goBack}
/>   
<Text style={{fontSize:24,color:'#fff'}}>BACK</Text>
</TouchableOpacity>


            <View style={{alignSelf:"center",justifyContent:"center",flex:1}}>
                
            <Text style={styles.first_text}>Forgot your password?</Text>
            <View>
            <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            }}>
            <IIcon style={{left:10,position:"absolute",zIndex:2
            }} name="email" color={'white'} size={25}  />
            <TextInput
            placeholder={"Type your email..."}
            placeholderTextColor={'#b4adad'}
            style={[styles.input, {fontWeight:"normal",paddingLeft:38}]}
            onChangeText={(text) => this.setState({
            email:text,
            })}
            />
            </View>
            <TouchableOpacity onPress={()=> this.send_code(this.state.email) }>
            <View style={styles.button}>
            <Text style={{color:'#fff',fontSize:18,fontWeight:"bold",fontFamily:"Roboto"}}>Send Code </Text>
            <IIcon name="chevron-right" color={'#fff'} size={25} />
            </View>
            </TouchableOpacity>
            </View>
            </View>
            </View>

        )
    }

}


export default class LoginComponent extends React.Component

{

    showNewPass = () => {
        this.setState({
            ShowNewPasswordForm:true,
            ShowResetForm:false,
        })

    }

    showLogin = () => {
        this.setState({ShowLoginForm:true,ShowResetForm:false,ShowNewPasswordForm:false,})
    }

    showForgot = () => {
    this.setState({
    ShowNewPasswordForm:false,
    ShowResetForm:true,

    })
    }


    constructor(props){
        super(props);
        this.state = {
            username:'',
            password:'',
            error_message:'',
            IdToken:'',
            User:'',
            name:'',
            email:'',
            TimeZone:'',
            language:'',
            role:'',

            ShowLoginForm:true,
            ShowResetForm:false,
            ShowNewPasswordForm:false,


        }

    }

        log_form = async ({ buttonText, onSubmit, children, onAuthentication}) => {

            const { username,password } = this.state;
    
            if(username === '' || password === '')
            {
                alert("Please fill in the blanks.")
            }
            else
            {
                onSubmit(username, password).then(async (res) => {
        
                    let message = res["message"];
                    let reset_token = res.AuthenticationResult['resetToken'];
                    let access_token = res.AuthenticationResult['AccessToken']
                    let status = await AsyncStorage.getItem('status');
                    if (message !== undefined)
                    {
                        await setMessage(message);
                    }
                    if (message === undefined || message === null)
                    {
                        await setMessage('');
                        await setResetToken('');
    
                    }
                    if (status === '201')
                    {
                        await setUsername(username);
                        await setChangeUserName(username);
                        await setResetToken(reset_token);
                    }
                    User = res["AuthenticationResult"]["username"];
                    name = res["AuthenticationResult"]["name"];
                    email = res["AuthenticationResult"]["email"];
                    TimeZone = res["AuthenticationResult"]["time_zone"];
                    language = res["AuthenticationResult"]["language"];
                    role = res["AuthenticationResult"]["role"];
                    IdToken = res["AuthenticationResult"]["IdToken"];
    
                    await setToken(IdToken);
                    await setAccessToken(access_token);
    
                    await setUsername(username);
                    await setRole(role);
                    await setName(name);
                    await setEmail(email);
                    await setTimeZone(TimeZone);
                    await setLanguage(language);
    
                    onAuthentication();
                })
                    .catch((res) => {
                        setErrorMessage(res.error);
                    });
            }
    
    
    
        
    
    } 

    submit = async () => {
            const { username,password } = this.state;

            if(username === '' || password === '')
            {
                alert("Please fill in the blanks.")
            }
            else
            {
                const auth_result = await fetch(API_URL, {
                    method: 'POST',
                    headers:{
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body:JSON.stringify({
                        "username": username,
                        "password": password
                      }),

                })
                if (auth_result.status === 200)
                {
                    let res = await auth_result.json()
                    let message = res["message"];
                    let reset_token = res?.authenticationResult['resetToken'] !== undefined ?  res?.AuthenticationResult['resetToken'] :'';
                    let access_token = res.authenticationResult['accessToken']
                    let status = await AsyncStorage.getItem('status');
                    if (message !== undefined)
                    {
                        await setMessage(message);
                    }
                    if (message === undefined || message === null)
                    {
                        await setMessage('');
                        await setResetToken('');
    
                    }
                    if (status === '201')
                    {
                        await setUsername(username);
                        await setChangeUserName(username);
                        await setResetToken(reset_token);
                    }
                    let User = res["authenticationResult"]["username"];
                    let name = res["authenticationResult"]["name"];
                    let email = res["authenticationResult"]["email"];
                    let TimeZone = res["authenticationResult"]["time_zone"];
                    let language = res["authenticationResult"]["language"];
                    let role = res["authenticationResult"]["role"];
                    let IdToken = res["authenticationResult"]["idToken"];

                    await setToken(IdToken);
                    await setAccessToken(access_token);
    
                    await setUsername(username);
                    await setRole(role);
                    await setName(name);
                    await setEmail(email);
                    await setTimeZone(TimeZone);
                    await setLanguage(language);
                    this.props.navigation.navigate("IndexStack")    
                }
                else if(auth_result.status === 201)
                {
                    this.props.navigation.navigate("ChangeLoginStack")    

                }


            }

    }


    
    render()
{
    const { username,password,ShowLoginForm} = this.state;

    return (
        <View style={styles.container}>
               <Video
          source={require("../assets/animation1.mp4")}
          style={styles.backgroundVideo}
          muted={true}
          repeat={true}
          resizeMode={"cover"}
          rate={1.0}
          ignoreSilentSwitch={"obey"}
        />

           {this.state.ShowLoginForm === true ? <View> 
               <View>
                <Image
                    style={styles.logo}
                    source={require('../assets/wifiapp.png')}
                />
<Text style={styles.first_text}>Welcome to Wi-Fi App </Text>

                <Text style={[styles.second_text]}>Enter your credentials below</Text>
                <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                }}>
                <IIcon style={{left:10,position:"absolute",zIndex:2
                }} name="account" color={'white'} size={25}  />
                <TextInput

                style={[styles.input, {fontWeight:"normal",paddingLeft:35}]}
                onChangeText={(text) => this.setState({username:text})}
                value={username}
                placeholder={"Username"}
                placeholderTextColor={'#b4adad'}

                //keyboardType="this.state.username-address"
                />
                </View>

                <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                }}>
                <IIcon style={{left:10,position:"absolute",zIndex:2
                }} name="lock" color={'white'} size={25}  />

                <TextInput

                style={[styles.input, {fontWeight:"normal",paddingLeft:35}]}
                onChangeText={(text) => this.setState({password:text})}
                //value={password}
                secureTextEntry
                placeholder={"Password"}
                placeholderTextColor={'#b4adad'}


                />
                </View>

                <TouchableOpacity onPress={this.submit}>
                    <View style={styles.button}>
                        <Text style={{color:'#fff',fontSize:18,fontFamily:"Roboto",fontWeight:"bold"}}>SIGN IN</Text>
                    </View>
                </TouchableOpacity>


<TouchableOpacity style={{marginTop:'5%',}} onPress={()=>this.setState({ShowResetForm:true,ShowLoginForm:false,})}>
    <View style={{justifyContent:"space-evenly",flexDirection:"row",width:280}}>
    <Text style={styles.second_text}>Did you forget your password?</Text>
    <Text style={[styles.second_text,{color:'#E8F0FE',fontWeight:"bold"}]}>Reset.</Text>
    </View>
        </TouchableOpacity>
            </View>
            <View style={{position: 'relative', bottom: -20}}>
                <Text style={styles.second_text}>Version: 0.0.9 </Text>
            </View>
            </View> :<View/>
            }

{this.state.ShowResetForm === true ?  <ForgotPassword  showNewPass={this.showNewPass} showLogin={this.showLogin} /> : <View/>}

{this.state.ShowNewPasswordForm === true ? <NewPassword showLogin={this.showLogin} showForgot={this.showForgot} />:<View/>}



        </View>
    );
    
}
}











const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#353f53",
    },
    backgroundVideo: {
        height: Dimensions.get("window").height,
        position: "absolute",
        top: 0,
        left: 0,
        alignItems: "stretch",
        bottom: 0,
        right: 0,
        opacity:0.55

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
        textAlign: "center",
        marginBottom:15,
    },
    input: {
        height: 45,
        width: 300,
        fontFamily:"Roboto",
        fontWeight:"bold",
        borderRadius: 20,
        marginTop: 10,
        marginBottom:10,
        color:'#E8F0FE',
        backgroundColor:'#5a6a8c',
        fontSize:18,
        paddingLeft:20,
    },
    button:{
        alignItems:'center',justifyContent:"center",
        flexDirection:"row",
        backgroundColor:'#323b4e',
        marginTop:'2%',
        borderRadius:20,
        height:40
    }
});


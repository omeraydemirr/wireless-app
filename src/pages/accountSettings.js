import React, { useState } from 'react';
import {View, Text, Button, Dimensions, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    setAccessToken,
    setChangeUserName, setEmail, setLanguage, setName,
    setResetToken,
    setStatus,
    setTimeZone,
    setToken,
    setUsername
} from "../api/token";



export default class AccountSettingsScreen extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            username:'',
            name:'',
            email:'',
            time_zone:'',
            language:'',
        }
    }

    async componentDidMount() {
        this.setState({
            username: await AsyncStorage.getItem('@username'),
            name:await AsyncStorage.getItem('@name'),
            email:await AsyncStorage.getItem('@email'),
            time_zone:await AsyncStorage.getItem('@timezone'),
            language:await AsyncStorage.getItem('@language'),
            loading:true,
        })
    }

    componentWillUnmount() {
        this.setState = (state,callback)=>{
            return;
        };
    }

    render()
    {
        return (
            <View style={{flex:1,backgroundColor:'#262d3c'}}>

                <View style={{width:"97%",backgroundColor:'#3e4a61',marginLeft:'1.5%',marginTop:'1%',borderRadius:5}}>
                    <Image
                        style={styles.userProfile}
                        source={require('../assets/userLogo.png')}
                    />

                    {this.state.loading === true ?
                        <View>
                        <Text style={{color:'#fff',alignSelf:"center",fontWeight:"bold",fontSize:20,marginTop:'0.1%',marginBottom:'5%'}}>omer</Text>
                        <View style={{flexDirection:"row",justifyContent:"space-evenly",marginBottom:10}}>
                            <View>
                                <Text style={{color:'#fff',fontWeight:"bold",fontSize:16}}>Username:</Text>
                                <Text style={{color:'#fff',fontWeight:"bold",fontSize:16}}>E-Mail:</Text>
                                <Text style={{color:'#fff',fontWeight:"bold",fontSize:16}}>Language:</Text>
                                <Text style={{color:'#fff',fontWeight:"bold",fontSize:16}}>Time Zone:</Text>

                            </View>
                            <View>
                                <Text style={{color:'#fff',fontSize:16}}>{this.state.username}</Text>
                                <Text style={{color:'#fff',fontSize:16}}>{this.state.email}</Text>
                                <Text style={{color:'#fff',fontSize:16}}>{this.state.language}</Text>
                                <Text style={{color:'#fff',fontSize:16}}>{this.state.time_zone}</Text>

                            </View>

                        </View>
                        </View>
                        : <View style={{flexDirection:"row",justifyContent:"space-evenly",marginTop:"10%"}}>
                            <ActivityIndicator animating={true} color={'#fff'} size={"large"} /></View>
                    }



                </View>

                <TouchableOpacity onPress={({props})=>this.props.navigation.navigate("ChangePasswordStack")}>
                <View style={{width:Dimensions.get("window").width,backgroundColor:'#353f53',marginTop:'1%',padding:'2.5%',flexDirection:"row",justifyContent:"space-between"}}>
                    <Text style={{color:'#fff',fontSize:19}}>Change Password</Text>
                    <Icon name="chevron-right" color={'#fff'} size={25} />
                </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={({props})=>this.props.navigation.navigate("ChangeEmailStack")}>
                <View style={{width:Dimensions.get("window").width,backgroundColor:'#353f53',marginTop:'1%',padding:'2.5%',flexDirection:"row",justifyContent:"space-between"}}>
                    <Text style={{color:'#fff',fontSize:19}}>Change E-Mail Address</Text>
                    <Icon name="chevron-right" color={'#fff'} size={25} />
                </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={({props})=>this.props.navigation.navigate("ChangeLocationStack")}>
                <View style={{width:Dimensions.get("window").width,backgroundColor:'#353f53',marginTop:'1%',padding:'2.5%',flexDirection:"row",justifyContent:"space-between"}}>
                    <Text style={{color:'#fff',fontSize:19}}>Change Time Zone / Language</Text>
                    <Icon name="chevron-right" color={'#fff'} size={25} />
                </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={({props})=>this.props.navigation.navigate("ResetFormStack")}>
                <View style={{width:Dimensions.get("window").width,backgroundColor:'#353f53',marginTop:'1%',padding:'2.5%',flexDirection:"row",justifyContent:"space-between"}}>
                    <Text style={{color:'#fff',fontSize:19}}>Reset Settings</Text>
                    <Icon name="chevron-right" color={'#fff'} size={25} />
                </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={async () =>{
                    await setToken('');
                    await setStatus('');
                    await setAccessToken('');
                    await setResetToken('');
                    await setUsername('');
                    await setChangeUserName('');
                    await setTimeZone('');
                    await setName('');
                    await setEmail('');
                    await setTimeZone('');
                    await setLanguage('')
                    this.props.navigation.navigate("LoginStack")
                }}>
                <View style={{width:Dimensions.get("window").width,backgroundColor:'#353f53',marginTop:'1%',padding:'2.5%',flexDirection:"row",justifyContent:"space-between"}}>
                    <Text style={{color:'#fff',fontSize:19}}>Log out</Text>
                    <Icon name="chevron-right" color={'#fff'} size={25} />
                </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = {
    userProfile: {
        width: 50,
        height: 50,
        borderRadius: 30,
        alignSelf:'center',
        marginTop:'5%'
    },
}

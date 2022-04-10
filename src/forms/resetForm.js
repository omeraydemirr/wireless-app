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
    CONTROLLER_GROUP, RESET_SETTINGS,
} from "../../secrets";
import AsyncStorage from '@react-native-community/async-storage';
import {
    setAccessToken, setChangeUserName,
    setEmail,
    setLanguage, setName,
    setResetToken,
    setStatus,
    setTimeZone,
    setToken,
    setUsername
} from "../api/token";
import CheckBox from 'react-native-check-box'
import AwesomeAlert from 'react-native-awesome-alerts';
import IIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {Table} from "react-native-table-component";


export default class resetForm extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            controller_id:'',
            reset_controller_switch:false,
            reset_wifi_switch:false,
            reset_friendly_names_switch:false,
            reset_user_account_switch:false,
            showAlert:false,

        }
    }




    async componentDidMount() {
        const IdToken = await AsyncStorage.getItem('@auth_token');
        const result = await fetch(CONTROLLER_GROUP, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "Authorization": IdToken,
            },
        }).then((response) => response.json())
            .then((responseJson)=>{
                this.setState({
                    controller_id:responseJson.ControllerGroup.cID
                })
        })

    }

    componentWillUnmount() {
        this.setState = (state,callback)=>{
            return;
        };
    }

    showAlert = () => {
        this.setState({
            showAlert: true,
        });
    };

    hideAlert = () => {
        this.setState({
            showAlert: false
        });
    };


    async reset_values (){
        const AccessToken = await AsyncStorage.getItem('@access_token');
        const IdToken = await AsyncStorage.getItem('@auth_token');
        const UserID = await AsyncStorage.getItem('@username');
        let controller = this.state.controller_id;

        let reset_controller = this.state.reset_controller_switch;
        let reset_wifi = this.state.reset_wifi_switch;
        let reset_friendly = this.state.reset_friendly_names_switch;
        let reset_user = this.state.reset_user_account_switch;


        let bool2s = (b) => b ? "True" : "False";
        const path = controller + "?resetController=" + bool2s(reset_controller) + "&resetSSID="
            + bool2s(reset_wifi) + "&resetInfo=" + bool2s(reset_friendly) + "&resetAccount=" + bool2s(reset_user)
        let api_url = (RESET_SETTINGS + UserID + "/" + path).toString();
        const result = await fetch(api_url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "Authorization": IdToken,
                'AccessToken':AccessToken,
            },
        })

        if (result.ok)
        {
            if(reset_user === false && reset_wifi === false && reset_controller === false && reset_friendly === false)
            {
                alert("Please select at least one choose");
            }
            else
            {
                alert("Selected values were reseted");
                if(reset_user === true)
                {
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
                    await setLanguage('');
                    this.props.navigation.navigate("LoginStack");
                }
            }


        }
        else
        {
            alert("Something went wrong!")
        }







    }

    render()
    {

        return(
            <ScrollView contentContainerStyle={styles.container}>
                <View style={{flex:1}}>
                    <View style={{backgroundColor:'#3e4a61',marginTop:'1%',borderRadius:5,minWidth:'97%',maxWidth:'97%',marginLeft:'1.5%',justifyContent:"center"}}>
                        <View style={{flexDirection:"row",justifyContent:"space-evenly",marginTop:'1.5%',marginBottom:'1.5%'}}>
                            <View>
                                <Text style={{color:'#fff',fontWeight:"bold",fontSize:18}}>Selected Controller:</Text>

                            </View>
                            <View>
                                <Text style={{color:'#fff',fontSize:19}}>{this.state.controller_id}</Text>
                            </View>

                        </View>
                    </View>


                        <View style={{width:Dimensions.get("window").width,backgroundColor:'#353f53',marginTop:'1.5%',padding:'2.5%',flexDirection:"row",justifyContent:"space-between"}}>
                           <View>
                            <Text style={{color:'#fff',fontSize:19}}>Reset Controller </Text>

                               <Text style={{color:'#fff',fontSize:13}}>( unprovisione the controller and delete analytic history) </Text>
                           </View>
                            <View>
                                <CheckBox
                                    checkBoxColor={'#fff'}
                                    isChecked={this.state.reset_controller_switch}
                                    onClick={() =>this.setState({reset_controller_switch:!this.state.reset_controller_switch})}
                                    style={{ transform: [{ scaleX: 1.25 }, { scaleY: 1.25 }] }}

                                />
                            </View>
                        </View>


                    <View style={{width:Dimensions.get("window").width,backgroundColor:'#353f53',marginTop:'1%',padding:'2.5%',flexDirection:"row",justifyContent:"space-between"}}>
                        <View>
                            <Text style={{color:'#fff',fontSize:19}}>Reset Wifi </Text>

                            <Text style={{color:'#fff',fontSize:13}}>( reset Wi-Fi credentials )</Text>
                        </View>
                        <View>
                            <CheckBox
                                checkBoxColor={'#fff'}
                                isChecked={this.state.reset_wifi_switch}
                                onClick={() =>this.setState({reset_wifi_switch:!this.state.reset_wifi_switch})}
                                style={{ transform: [{ scaleX: 1.25 }, { scaleY: 1.25 }] }}

                            />
                        </View>
                    </View>

                    <View style={{width:Dimensions.get("window").width,backgroundColor:'#353f53',marginTop:'1%',padding:'2.5%',flexDirection:"row",justifyContent:"space-between"}}>
                        <View>
                            <Text style={{color:'#fff',fontSize:19}}>Reset Friendly Names</Text>

                            <Text style={{color:'#fff',fontSize:13}}>( reset user set friendly names of devices )</Text>
                        </View>
                        <View>
                            <CheckBox
                                checkBoxColor={'#fff'}
                                isChecked={this.state.reset_friendly_names_switch}
                                onClick={() =>this.setState({reset_friendly_names_switch:!this.state.reset_friendly_names_switch})}
                                style={{ transform: [{ scaleX: 1.25 }, { scaleY: 1.25 }] }}

                            />
                        </View>
                    </View>

                    <View style={{width:Dimensions.get("window").width,backgroundColor:'#353f53',marginTop:'1%',padding:'2.5%',flexDirection:"row",justifyContent:"space-between"}}>
                        <Text style={{color:'#fff',fontSize:19}}>Reset User Account</Text>
                        <CheckBox
                            checkBoxColor={'#fff'}
                            isChecked={this.state.reset_user_account_switch}
                            onClick={() =>this.setState({reset_user_account_switch:!this.state.reset_user_account_switch})}
                            style={{ transform: [{ scaleX: 1.25 }, { scaleY: 1.25 }] }}

                        />
                    </View>

                    <TouchableOpacity onPress={()=>{
                        if(this.state.reset_controller_switch === false && this.state.reset_wifi_switch === false && this.state.reset_controller_switch === false && this.state.reset_friendly_names_switch === false)
                        {
                            alert("Please select at least one choose");
                        }
                        else
                        {
                            this.showAlert();
                        }
                    }}>
                        <View style={styles.button}>
                            <Text style={{color:'#fff',fontSize:20,fontFamily:"Roboto",fontWeight:"bold"}}>RESET</Text>
                        </View>

                        <AwesomeAlert
                            show={this.state.showAlert}
                            showProgress={false}
                            title="Warning"
                            message="Selected values will be reseted, are you sure?"
                            closeOnTouchOutside={true}
                            closeOnHardwareBackPress={false}
                            showCancelButton={true}
                            showConfirmButton={true}
                            cancelText="No, cancel"
                            confirmText="Yes, reset"
                            confirmButtonColor="#DD6B55"
                            onCancelPressed={() => {
                                this.hideAlert();
                            }}
                            onConfirmPressed={() => {
                                this.hideAlert();
                                this.reset_values();
                            }}
                        />

                    </TouchableOpacity>

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
        marginTop:'3%',
        borderWidth:2,
        borderRadius:5,
        borderColor:'#2196F3',
        minWidth:'50%',
        maxWidth:'50%',
        alignSelf: 'center',
    }
});

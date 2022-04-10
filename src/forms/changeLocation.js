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
import {setEmail, setLanguage, setTimeZone} from "../api/token";
import moment from "moment-timezone";

export default class changeLocation extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            time_zone:'',
            language:'',
        }
    }

    async componentDidMount() {
        this.setState({
            time_zone:await AsyncStorage.getItem('@timezone'),
            language:await AsyncStorage.getItem('@language'),
        })

    }

    async change_language(language){
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
                        'attributeName': 'language',
                        'attributeValue': language,
                    },
                ]
            }),
        });
        if(result.ok)
        {
            await setLanguage(language)
            this.setState({
                language:language,
            })
            alert("Language was changed to " + (language === "fr" ? "French" : "English"))
        }
        else {
            alert("Something went wrong!");
        }
    }

    async change_timezone(timezone){
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
                        'attributeName': 'time_zone',
                        'attributeValue': timezone,
                    },
                ]
            }),
        });
        if(result.ok)
        {
            await setTimeZone(timezone)
            this.setState({
                time_zone:timezone,
            })
            alert("Time Zone was changed to " + timezone);
        }
        else {
            alert("Something went wrong!");
        }
    }


    render()
    {
        let momentData = moment.tz.names().map((val,key) => {

            return(
                <Picker.Item value={val} label={val} key={key}/>
            )

        })

        return(
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.output}>
                    <Image
                        style={styles.logo}
                        source={require('../assets/Login.png')}
                    />
                    <Text style={styles.first_text}>Change Time Zone/Language</Text>


                    <View>

        <View>
        <Text style={styles.second_text}>Language:</Text>
        <View style={styles.picker_view}>
        <Picker
        selectedValue={this.state.language}
        style={styles.picker}
        onValueChange={(itemValue) => this.setState({language:itemValue})}
        >
        <Picker.Item label="Select Language..." value="" />
        <Picker.Item label="English" value="en" />
        <Picker.Item label="French" value="fr" />
        </Picker>

        </View>
        <TouchableOpacity onPress={()=>this.change_language(this.state.language)}>
        <View style={styles.button}>
        <Text style={{color:'#fff',fontSize:18,fontWeight:"bold",fontFamily:"Roboto"}}>SET</Text>
        </View>
        </TouchableOpacity>

        </View>


<View style={{marginTop:'5%'}}>
                        <Text style={styles.second_text}>Time Zone:</Text>
                        <View style={styles.picker_view}>
                            <Picker
                               selectedValue={this.state.time_zone}
                                style={styles.picker}
                                onValueChange={(itemValue, itemIndex) => this.setState({time_zone:itemValue})}
                            >
                                <Picker.Item label="Select Timezone..." value="" />
                                {momentData}

                            </Picker>
                        </View>

                        <TouchableOpacity onPress={()=>this.change_timezone(this.state.time_zone)}>
                            <View style={styles.button}  >
                                <Text style={{color:'#fff',fontSize:18,fontWeight:"bold",fontFamily:"Roboto"}}>SET</Text>
                            </View>
                        </TouchableOpacity>
</View>
                    </View>



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
    picker_view:{
        borderColor:'#fff',
        borderWidth:1,
        borderRadius:5,
        alignItems:"center",
        marginTop:"1%",
    },
    picker:
        {
            height: 50,
            width: 200,
            color:"#fff",
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

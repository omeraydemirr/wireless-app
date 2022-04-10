import React, {useState} from "react";
import {
    ActivityIndicator,
    Button,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Platform,
    ScrollView, SafeAreaView, TextInput, Keyboard, Modal, Image, TouchableHighlight, Alert

} from "react-native";
import {Picker} from "@react-native-community/picker";

import {
    ACCESS_CONTROL,
    CID_URL, CLIENT_INFO,
    GET_BASIC_CONF,
    LATEST_AP,
    LATEST_STA,

    NODE_URL,
    SINGLE_CONTROLLER,
    UPDATE_GNAME, UPDATE_STA_GNAME, WHITE_LIST_INFO
} from "../../secrets";
import AsyncStorage from '@react-native-community/async-storage';
import {TabView as ControlView, TabView as WhiteListView, SceneMap, TabBar} from 'react-native-tab-view';
import MultiSelect from 'react-native-multiple-select';
import DatePicker from 'react-native-date-picker';
import * as math from "mathjs";

import moment from "moment-timezone";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {Row, Table} from "react-native-table-component";
import {LogBox} from "react-native";
import TextInputMask from 'react-native-text-input-mask';



export default class Control extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            inputValue:'',
            user_role:'',
            //friendly
            cIDSource: [],
            ap_sta_macs: [],
            ap_sta_given_name: '',
            selectedCID: '',
            //wireless
            controllerSource: [],
            FiveSsid: '',
            FivePassword: '',
            TwoFourSsid: '',
            TwoFourPassword: '',
            GuestSsid: '',
            GuestPassword: '',

            ConfValue: true,
            GuestValue: false,


            //WHITELIST
            whitelist_source: [],
            client_value: '',
            white_index: 0,
            white_routes: [
                {key: "save", title: 'Save'},
                {key: "update", title: 'Update'},
            ],

            //SAVE
            config_data: [],
            clients_data:[],
            selected_clients:[],
            time_ranges:[],
            access_control_list:[],
            schedule:[],
            monday_check:false,
            tuesday_check:false,
            wednesday_check:false,
            thursday_check:false,
            friday_check:false,
            saturday_check:false,
            sunday_check:false,

            //UPDATE
            update_get_clients:[],
            update_client:'',

            update_get_configs:[],
            checked_value:false,
            check:{},


            //TIME PICKER
            date_time_visible: false,
            start_date_value: new Date(),
            end_date_value: this.return_end_date(),


            //TAB VIEW
            index: 0,
            routes: [
                {key: "wireless", title: 'Wireless Network Configuration'},
                {key: "friendly", title: 'Device Name Configuration'},
                {key: "whitelist", title: 'Access Control'}
            ],


        }


    }

    state = {cValue: '', controllerValue: '', apValue: '', nameValue: '', ApStaValue: '', selectedItems: []};

    onSelectedItemsChange = selectedItems => {
        this.setState({selected_clients:selectedItems,selectedItems});
    };


    updateController = (controllerValue) => {
        this.setState({controllerValue: controllerValue})
    }
    updateUser = (cValue) => {
        this.setState({cValue: cValue})
    }
    updateMac = (ApStaValue) => {
        this.setState({ApStaValue: ApStaValue})

    }

    async componentDidMount() {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        this.setState({user_role:await AsyncStorage.getItem("role")})
        const IdToken = await AsyncStorage.getItem('@auth_token');
        const myHeaders = new Headers();

        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', IdToken);
        if(this.state.user_role === "user")
        {
            await fetch(CID_URL, {
                method: 'GET',
                headers: myHeaders,
    
            })
                .then((response) => response.status === 200 ? response.status === 200 ? response.json() : '' : '')
                .then((responseJson) => {
                    let controllers = responseJson.homePopulation.data;
                    controllers.map((val) => {
                        this.state.cIDSource.push(val.controllerId);
                        this.state.controllerSource.push(val.controllerId);
                        this.state.whitelist_source.push(val.controllerId)
                    })
                    this.setState({
                        isLoading: false,
                    })
                    //
                    this.get_clients();
                    this.update_get_clients();
    
    
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        else if(this.state.user_role === "super" || this.state.user_role === "group")
        {
            this.setState({
                isLoading: false,
            })
        }

       
    }


    //FRIENDLY NAME FUNCTIONS
    get_ap_sta_list = async () => {
        const MyToken = await AsyncStorage.getItem('@auth_token');
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', MyToken);
        let ap_sta_mac_list = [];
        let cID = this.state.user_role === "user" ? this.state.cValue : this.state.inputValue;
        await fetch(LATEST_AP + cID, {
            method: 'GET',
            headers: myHeaders,

        }).then((response) => response.status === 200 ? response.json() : '')
            .then((responseJson) => {
                let MacAdresses = responseJson.apInfo.info;
                for (let i = 0; i < MacAdresses.length; i++) {
                    let cont = eval(MacAdresses)[i]["macAddress"];
                    let friendly = eval(MacAdresses)[i]["friendlyName"] ? eval(MacAdresses)[i]["friendlyName"] : eval(MacAdresses)[i]["vendorName"];
                    let given = eval(MacAdresses)[i]["givenName"];
                    ap_sta_mac_list.push(cont + " " + "(" + friendly + ")");
                }
            }).catch((error) => {
                console.log(error);
            })

        await fetch(LATEST_STA + cID, {
            method: 'GET',
            headers: myHeaders,

        }).then((response) => response.status === 200 ? response.json() : '')
            .then((responseJson) => {

                let MacAdress = responseJson.staInfo.info;
                for (let i = 0; i < MacAdress.length; i++) {
                    let cont = eval(MacAdress)[i]["macAddress"];
                    let friendly = eval(MacAdress)[i]["friendlyName"] ? eval(MacAdress)[i]["friendlyName"] : eval(MacAdress)[i]["vendorName"];
                    ap_sta_mac_list.push(cont + " " + "(" + friendly + ")");
                }
            }).catch((error) => {
                console.log(error);
            })
        this.setState({
            ap_sta_macs: ap_sta_mac_list,
        })

    }

    getApNames = async () => {
        const MyToken = await AsyncStorage.getItem('@auth_token');
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', MyToken);

        return fetch(LATEST_AP + this.state.cValue, {
            method: 'GET',
            headers: myHeaders,

        }).then((response) => response.status === 200 ? response.json() : '').then((responseJson) => {
            const arr = responseJson.apInfo.info;
            let ap_sta_value = this.state.ApStaValue
            ap_sta_value = ap_sta_value.substring(0, 17)
            const arre = arr.filter(item => item.macAddress === ap_sta_value)
            let given_name = '';
            given_name = arre[0]["givenName"];
            this.setState({
                ap_sta_given_name: given_name,
            })
        })
            .catch((error) => {
                console.log(error);
            })


    }

    getStaNames = async () => {
        const MyToken = await AsyncStorage.getItem('@auth_token');
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', MyToken);
        {
            return fetch(LATEST_STA + this.state.cValue, {
                method: 'GET',
                headers: myHeaders,

            }).then((response) => response.status === 200 ? response.json() : '').then((responseJson) => {
                const arr = responseJson.staInfo.info;
                let ap_sta_value = this.state.ApStaValue
                ap_sta_value = ap_sta_value.substring(0, 17)
                let arre = arr.filter(item => item.macAddress === ap_sta_value)
                if (arre.length === 0) {
                    getApNames();
                } else {
                    let given_name = '';
                    given_name = arre[0]["givenName"];
                    this.setState({
                        ap_sta_given_name: given_name,
                    })
                }
            })
                .catch((error) => {
                    console.log(error);
                })

        }
    }

    setApList = async () => {
        const MyToken = await AsyncStorage.getItem('@auth_token');
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', MyToken);
        let deviceMac = this.state.ApStaValue;
        deviceMac = deviceMac ? deviceMac.substring(0, 17) : '';
        let ap_sta_given_name = this.state.ap_sta_given_name;
        let cID = this.state.cValue;

        if (deviceMac === '' || cID === undefined) {
            alert("fill in the blanks!")
        } else {
            return fetch(UPDATE_STA_GNAME, {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(
                    {
                        cID: cID,
                        macAddress: deviceMac,
                        givenName: ap_sta_given_name,
                    })
            }).then((responseJson) => {
                alert("Given name was changed to " + ap_sta_given_name)
            })
                .catch((error) => {
                    console.log(error);
                })
        }


    }


//WIRELESS FUNCTIONS
    getBasicConf = async () => {
        const MyToken = await AsyncStorage.getItem('@auth_token');
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', MyToken);
        let cID = this.state.user_role === "user"  ? this.state.controllerValue :this.state.inputValue;
        return fetch(GET_BASIC_CONF + cID, {
            method: 'GET',
            headers: myHeaders,

        })
            .then((response) => response.status === 200 ? response.json() : '')
            .then((responseJson) => {
                //console.log(responseJson);
                let FiveSsid = responseJson.configurationSettings["5GHz"]['ssid'];
                let FivePassword = responseJson.configurationSettings["5GHz"]['password'];
                let TwoFourSsid = responseJson.configurationSettings["2.4GHz"]['ssid'];
                let TwoFourPassword = responseJson.configurationSettings["2.4GHz"]['password'];
                this.setState({
                    FiveSsid: FiveSsid,
                    FivePassword: FivePassword,
                    TwoFourSsid: TwoFourSsid,
                    TwoFourPassword: TwoFourPassword
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    setBasicConf = async () => {
        const MyToken = await AsyncStorage.getItem('@auth_token');
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', MyToken);
        let SameConfig = this.state.ConfValue;
        let GuestEnable = this.state.GuestValue;
        let FivePass = this.state.FivePassword;
        let FiveSsid = this.state.FiveSsid;
        let TwoFourPass = this.state.TwoFourPassword;
        let TwoFourSsid = this.state.TwoFourSsid;
        let GuestSsid = this.state.GuestSsid;
        let GuestPassword = this.state.GuestPassword;
        let ControllerId = this.state.controllerValue;
        if (ControllerId === undefined) {
            alert("Select Controller Mac!");
        }


        if (SameConfig === true && GuestEnable === false && ControllerId !== undefined) {
            return fetch(GET_BASIC_CONF + ControllerId, {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(
                    {
                        "desiredConfig":
                            {
                                isSameConfig: SameConfig,
                                isGuestEnabled: GuestEnable,
                                '5GHz': {
                                    password: FivePass,
                                    ssid: FiveSsid,
                                },
                            }
                    })
            })
                .then((response) => {
                    alert("ssid name and password were changed successfully!")
                })
                .then((responseJson) => {
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        if (SameConfig === true && GuestEnable === true && ControllerId !== undefined) {
            return fetch(GET_BASIC_CONF + ControllerId, {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(
                    {
                        "desiredConfig":
                            {
                                isSameConfig: SameConfig,
                                isGuestEnabled: GuestEnable,
                                '5GHz': {
                                    password: FivePass,
                                    ssid: FiveSsid,
                                },
                                'guest': {
                                    password: GuestPassword,
                                    ssid: GuestSsid,
                                }
                            }
                    })
            })
                .then((response) => {
                    response.status === 200 ? response.json() : ''
                    alert("ssid name and password were changed successfully!")
                })
                .then((responseJson) => {
                })
                .catch((error) => {
                    console.log(error);
                })

        }

        if (SameConfig === false && GuestEnable === true && ControllerId !== undefined) {
            return fetch(GET_BASIC_CONF + this.state.controllerValue, {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(
                    {
                        "desiredConfig":
                            {
                                'guest': {
                                    password: GuestPassword,
                                    ssid: GuestSsid,

                                },
                                isSameConfig: SameConfig,
                                isGuestEnabled: GuestEnable,
                                '5GHz': {
                                    password: FivePass,
                                    ssid: FiveSsid,
                                },
                                '2.4GHz': {
                                    password: TwoFourPass,
                                    ssid: TwoFourSsid,
                                },

                            }
                    })
            })
                .then((response) => {
                    response.status === 200 ? response.json() : ''
                    alert("ssid name and password were changed successfully!")
                })
                .then((responseJson) => {
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        if (SameConfig === false && GuestEnable === false && ControllerId !== undefined) {
            return fetch(GET_BASIC_CONF + this.state.controllerValue, {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(
                    {
                        "desiredConfig":
                            {
                                isSameConfig: SameConfig,
                                isGuestEnabled: GuestEnable,
                                '5GHz': {
                                    password: FivePass,
                                    ssid: FiveSsid,
                                },
                                '2.4GHz': {
                                    password: TwoFourPass,
                                    ssid: TwoFourSsid,
                                },
                            }
                    })
            })
                .then((response) => {
                    response.status === 200 ? response.json() : ''
                    alert("ssid name and password were changed successfully!")
                })
                .then((responseJson) => {
                })
                .catch((error) => {
                    console.log(error);
                })
        }

    }

//WHITELIST FUNCTIONS
    return_end_date() {
        let end = new Date();
        end.setHours(23, 59, 59, 999);
        return end;

    }

    return_time() {
        let first_actual_hour = this.state.start_date_value.toString().slice(15, 21)
        let first_date = this.state.start_date_value.toString().slice(0, 10)

        let second_actual_hour = this.state.end_date_value.toString().slice(15, 21)
        let second_date = this.state.end_date_value.toString().slice(0, 10)

        return first_date + "," + first_actual_hour + "  -   " + second_date + "," + second_actual_hour;

    }

    create_time_picker() {
        return <View style={{marginBottom: '5%',marginTop:'3%'}}>
            <View style={{flexDirection: "row", justifyContent: "space-around",width:Dimensions.get("window").width}}>

                <View>
                    <Text style={{color:'#fff',alignSelf:"center",fontWeight:"bold"}}>Start</Text>
                    <DatePicker
                        mode="time"
                        date={new Date()}
                        onDateChange={(time) => {
                            this.state.start_date_value = time
                        }
                        }
                        androidVariant="iosClone"
                        style={{
                            backgroundColor: '#262D3C',
                            width: Dimensions.get("window").width/2.20,
                            height: 100,
                            alignSelf: "center",
                            marginTop: "1%"
                        }}
                        accessibilityIgnoresInvertColors={true}
                        accessibilityComponentType={"button"}
                        dividerHeight={8}
                        textColor={'#fff'}
                        fadeToColor={"#262d3c"}

                    />
                </View>

                <View >
                    <Text style={{color:'#fff',fontWeight:"bold",alignSelf:"center"}}>End</Text>
                    <DatePicker
                        mode="time"
                        date={this.state.end_date_value}
                        onDateChange={(time) => {
                            this.state.end_date_value = time
                        }
                        }
                        androidVariant="iosClone"
                        style={{
                            backgroundColor: '#262D3C',
                            width: Dimensions.get("window").width/2.20,
                            height: 100,
                            alignSelf: "center",
                            marginTop: "1%"
                        }}
                        accessibilityIgnoresInvertColors={true}
                        accessibilityComponentType={"button"}
                        dividerHeight={8}
                        textColor={'#fff'}
                        fadeToColor={"#353F53"}

                    />
                </View>




            </View>




        </View>
    }

    create_date_buttons(){

        return <View style={{width:Dimensions.get("window").width/1.10,height:40,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
            <TouchableHighlight activeOpacity={1}
                                underlayColor={'white'}
                                style={this.state.monday_check === true ? styles.btnPress : styles.btnNormal}
                                onPress={()=> this.setState({monday_check:!this.state.monday_check})}

            >
                <Text style={{color:this.state.monday_check === true ? '#000' : '#fff',fontWeight:"bold",alignSelf:"center",fontSize:16}}>
                    Mon</Text>
            </TouchableHighlight>

            <TouchableHighlight activeOpacity={1}
                                underlayColor={'white'}
                                style={this.state.tuesday_check === true ? styles.btnPress : styles.btnNormal}
                                onPress={()=> this.setState({tuesday_check:!this.state.tuesday_check})}

            >
                <Text style={{color:this.state.tuesday_check === true ? '#000' : '#fff',fontWeight:"bold",alignSelf:"center",fontSize:16}}>
                    Tue</Text>
            </TouchableHighlight>

            <TouchableHighlight activeOpacity={1}
                                underlayColor={'white'}
                                style={this.state.wednesday_check === true ? styles.btnPress : styles.btnNormal}
                                onPress={()=> this.setState({wednesday_check:!this.state.wednesday_check})}

            >
                <Text style={{color:this.state.wednesday_check === true ? '#000' : '#fff',fontWeight:"bold",alignSelf:"center",fontSize:16}}>
                    Wed</Text>
            </TouchableHighlight>

            <TouchableHighlight activeOpacity={1}
                                underlayColor={'white'}
                                style={this.state.thursday_check === true ? styles.btnPress : styles.btnNormal}
                                onPress={()=> this.setState({thursday_check:!this.state.thursday_check})}

            >
                <Text style={{color:this.state.thursday_check === true ? '#000' : '#fff',fontWeight:"bold",alignSelf:"center",fontSize:16}}>
                    Thu</Text>
            </TouchableHighlight>

            <TouchableHighlight activeOpacity={1}
                                underlayColor={'white'}
                                style={this.state.friday_check === true ? styles.btnPress : styles.btnNormal}
                                onPress={()=> this.setState({friday_check:!this.state.friday_check})}

            >
                <Text style={{color:this.state.friday_check === true ? '#000' : '#fff',fontWeight:"bold",alignSelf:"center",fontSize:16}}>
                    Fri</Text>
            </TouchableHighlight>

            <TouchableHighlight activeOpacity={1}
                                underlayColor={'white'}
                                style={this.state.saturday_check === true ? styles.btnPress : styles.btnNormal}
                                onPress={()=> this.setState({saturday_check:!this.state.saturday_check})}

            >
                <Text style={{color:this.state.saturday_check === true ? '#000' : '#fff',fontWeight:"bold",alignSelf:"center",fontSize:16}}>
                    Sat</Text>
            </TouchableHighlight>
            <TouchableHighlight activeOpacity={1}
                                underlayColor={'white'}
                                style={this.state.sunday_check === true ? styles.btnPress : [styles.btnNormal,{borderRightColor: '#262d3c',}]}
                                onPress={()=> this.setState({sunday_check:!this.state.sunday_check})}

            >
                <Text style={{color:this.state.sunday_check === true ? '#000' : '#fff',fontWeight:"bold",alignSelf:"center",fontSize:16}}>
                    Sun</Text>
            </TouchableHighlight>


        </View>


    }


    //SAVE


    async get_clients(){
        const IdToken = await AsyncStorage.getItem('@auth_token');
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', IdToken);
        let cID = this.state.user_role === "user" ? this.state.controllerValue : this.state.inputValue;

        return fetch(CLIENT_INFO + cID, {
            method: 'GET',
            headers: myHeaders,

        })
            .then((response) => response.status === 200 ? response.json() : '')
            .then((responseJson) => {
                let dataArr = [];
                let clients_list = responseJson.ClientsInfo.clients;
                clients_list.map(item => {
                    let name = item.givenName ? ' (' + item.givenName + ')' : (item.friendlyName ? ' (' + item.friendlyName + ')' : '');
                    dataArr.push({
                        id: item.macAddr,
                        name: item.macAddr + name
                    });
                })
                this.setState({clients_data:dataArr})

            })
            .catch((error) => {
                console.log(error);
            })



    }

    async add_time_ranges (){
        let state = this.state;

        let start_time = state.start_date_value.toString().substring(16,21)
        let start_check = start_time + ":00";
        let a = start_check.split(':');
        let start_second = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

        let end_time = state.end_date_value.toString().substring(16,21)
        let end_check = end_time +  ":00";
        let b = end_check.split(':');
        let end_second = (+b[0]) * 60 * 60 + (+b[1]) * 60 + (+b[2]);

        if(start_second >= end_second)
        {
            alert("End time can't be bigger than start time!")
        }
        else {
            let days = [state.monday_check ? "Mon" : '',state.tuesday_check ? "Tue" : '',state.wednesday_check ? "Wed" : '',
                state.thursday_check ? "Thu" : '',state.friday_check ? "Fri" : '',state.saturday_check ? "Sat" : '',state.sunday_check ? "Sun" : '']
            let selected_days = []
            for (let day of days)
            {
                if(day !== '')
                {
                    selected_days.push(day)
                }
            }

            //FOR CHECKING IF CLIENT SELECTED DAY
            if(selected_days.length === 0)
            {
                alert("Please select a day.")
            }
            else if(this.state.selected_clients.length === 0)
            {
                alert("Please select a client.")
            }
            else
            {
                let time = start_time + " - " + end_time + " (" + selected_days + ")";
                this.setState({
                    config_data: [...this.state.config_data,
                        [time],
                    ]
                })

            }
        }
    }

    async save_configs (){
        const IdToken = await AsyncStorage.getItem('@auth_token');
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', IdToken);
        let state = this.state;

        for (let time of state.config_data)
        {

            let start_time = time.toString().substring(0,5) + ':00';
            let a = start_time.split(':');
            let start_second = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

            let end_time = time.toString().substring(8,13) + ':00';
            let b = end_time.split(':');
            let end_second = (+b[0]) * 60 * 60 + (+b[1]) * 60 + (+b[2]);

            let time_data = {
                start: parseInt(start_second),
                end: parseInt(end_second),
            }



            let dateVal = time.toString();
            let day_array = [dateVal.includes("Mon") ? 0 : '', dateVal.includes("Tue") ? 1 : '', dateVal.includes('Wed') ? 2 : '',
                dateVal.includes("Thu") ? 3 : '',dateVal.includes("Fri") ? 4 : '',dateVal.includes("Sat") ? 5 : '',dateVal.includes("Sun") ? 6 : ''
            ]
            let selected_date = [];
            for (let day of day_array)
            {
                if(day !== '')
                {
                    selected_date.push(day)
                }
            }

            let schedule = {
                timeRanges: [time_data],
                weekdays:selected_date,
            }

            state.schedule.push(schedule);

        }

        for (let mac of state.selected_clients)
        {
            let access_data = {
                "macAddress": mac,
                "accessMode": "scheduled",
                "enableDST": true,
                "timeZone": await AsyncStorage.getItem('@timezone'),
                "schedule": JSON.parse(JSON.stringify(state.schedule)),
            }

            state.access_control_list.push(access_data)

        }

        let cID = this.state.user_role === "user" ? this.state.controllerValue : this.state.inputValue;

        const result = await fetch(ACCESS_CONTROL + cID, {
            method: 'POST',
            headers: myHeaders,
            body:JSON.stringify(
                {
                    "accessControlList": state.access_control_list,
                }


            ),
        }).then((response) => {
            if(response.status === 200)
            {
                alert("Saved successfully!")
            }
            else
            {
                alert("Something went wrong,try later.")
            }
        })


        this.setState({
            access_control_list:[],
            schedule:[],
        })
        this.update_get_clients();

    }


    //UPDATE
    async update_get_configs(client){
        const IdToken = await AsyncStorage.getItem('@auth_token');
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', IdToken);
        client = client.toString().substr(0,17);
        
        let cID = this.state.user_role === "user" ? this.state.controllerValue : this.state.inputValue;

        await fetch(ACCESS_CONTROL + cID + "/" + client, {
            method: 'GET',
            headers: myHeaders,

        })
            .then((response) => response.status === 200 ? response.json() : '')
            .then((responseJson) => {
                let config_array =  [];
                let get_configs = responseJson.accessControlList[0].schedule;
                get_configs.map((item) => {
                    let weekdays = []
                    let config_days = []
                    let start_second = item.timeRanges[0].start
                    let start_hour = new Date(start_second * 1000).toISOString().substr(11,8).substr(0,5)
                    let end_second = item.timeRanges[0].end
                    let end_hour = new Date(end_second * 1000).toISOString().substr(11, 8).substr(0,5)
                    weekdays = item.weekdays;
                    for (let day of weekdays)
                    {
                        day === 0 ? day = 'Mon' : day === 1 ? day = 'Tue' : day === 2 ? day = 'Wed':
                            day === 3 ? day = "Thu" : day === 4 ? day = "Fri" : day === 5 ? day = "Sat":
                                day === 6 ? day = "Sun" : '';
                        config_days.push(day)
                    }
                    config_array.push([start_hour + " - " + end_hour + " (" + config_days + ")"])
                })

                this.setState({update_get_configs:config_array})
            })
            .catch((error) => {
                console.log(error);
            })


    }

    async update_get_clients ()
    {
        const IdToken = await AsyncStorage.getItem('@auth_token');
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', IdToken);
        let mac_array = [];
        let cID = this.state.user_role === "user" ? this.state.controllerValue : this.state.inputValue;

        await fetch(ACCESS_CONTROL + cID, {
            method: 'GET',
            headers: myHeaders,

        })
            .then((response) => response.status === 200 ? response.json() : '')
            .then((responseJson) => {
                let get_clients = responseJson.accessControlList
                get_clients.map((item) => {
                    let client = item.macAddress + (item?.friendlyName ? " (" + item.friendlyName + ")" : '');
                    mac_array.push(client)
                })
                this.setState({update_get_clients:mac_array})
            })
            .catch((error) => {
                console.log(error);
            })

    }

    add_update_time_ranges (){
        let state = this.state;

        let start_time = state.start_date_value.toString().substring(16,21)
        let start_check = start_time + ":00";
        let a = start_check.split(':');
        let start_second = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

        let end_time = state.end_date_value.toString().substring(16,21)
        let end_check = end_time +  ":00";
        let b = end_check.split(':');
        let end_second = (+b[0]) * 60 * 60 + (+b[1]) * 60 + (+b[2]);

        if(start_second >= end_second)
        {
            alert("End time can't be bigger than start time!")
        }
        else
            {
                let days = [state.monday_check ? "Mon" : '',state.tuesday_check ? "Tue" : '',state.wednesday_check ? "Wed" : '',
                    state.thursday_check ? "Thu" : '',state.friday_check ? "Fri" : '',state.saturday_check ? "Sat" : '',state.sunday_check ? "Sun" : '']
                let selected_days = []
                for (let day of days)
                {
                    if(day !== '')
                    {
                        selected_days.push(day)
                    }
                }

                //FOR CHECKING IF CLIENT SELECTED DAY
                if(selected_days.length === 0)
                {
                    alert("Please select a day.")
                }
                else if(this.state.update_client === '')
                {
                    alert("Please select a client.")
                }
                else
                {
                    let time = start_time + " - " + end_time + " (" + selected_days + ")";
                    this.setState({
                        update_get_configs: [...this.state.update_get_configs,
                            [time],
                        ]
                    })

                }
        }


    }

    async delete_configs ()
    {
        const IdToken = await AsyncStorage.getItem('@auth_token');
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', IdToken);
        let client = this.state.update_client.substr(0,17)
        let cID = this.state.user_role === "user" ? this.state.controllerValue : this.state.inputValue;

        await fetch(ACCESS_CONTROL + cID + "/" + client, {
            method: 'DELETE',
            headers: myHeaders,

        })
            .then((response) => {
                if(response.status === 200)
                {
                    alert("Config settings of : " + client + " was deleted successfully!" )
                    this.setState({update_get_configs:[]})
                }
                else
                {
                    alert("Something went wrong,please try later.")
                }
            })
            .catch((error) => {
                console.log(error);
            })
        this.update_get_clients();

    }

    async update_configs (){
        const IdToken = await AsyncStorage.getItem('@auth_token');
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', IdToken);
        let state = this.state;

        for (let time of state.update_get_configs)
        {

            let start_time = time.toString().substring(0,5) + ':00';
            let a = start_time.split(':');
            let start_second = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

            let end_time = time.toString().substring(8,13) + ':00';
            let b = end_time.split(':');
            let end_second = (+b[0]) * 60 * 60 + (+b[1]) * 60 + (+b[2]);

            let time_data = {
                start: parseInt(start_second),
                end: parseInt(end_second),
            }



            let dateVal = time.toString();
            let day_array = [dateVal.includes("Mon") ? 0 : '', dateVal.includes("Tue") ? 1 : '', dateVal.includes('Wed') ? 2 : '',
                dateVal.includes("Thu") ? 3 : '',dateVal.includes("Fri") ? 4 : '',dateVal.includes("Sat") ? 5 : '',dateVal.includes("Sun") ? 6 : ''
            ]
            let selected_date = [];
            for (let day of day_array)
            {
                if(day !== '')
                {
                    selected_date.push(day)
                }
            }

            let schedule = {
                timeRanges: [time_data],
                weekdays:selected_date,
            }

            state.schedule.push(schedule);

        }


        let access_data = {
                "macAddress": state.update_client.substr(0,17),
                "accessMode": "scheduled",
                "enableDST": true,
                "timeZone": await AsyncStorage.getItem('@timezone'),
                "schedule": JSON.parse(JSON.stringify(state.schedule)),
            }

            state.access_control_list.push(access_data)

        let cID = this.state.user_role === "user" ? this.state.controllerValue : this.state.inputValue;


        const result = await fetch(ACCESS_CONTROL + cID + "/" + state.update_client.substr(0,17), {
            method: 'POST',
            headers: myHeaders,
            body:JSON.stringify(
                {
                    "accessControlList": state.access_control_list[0],
                }


            ),
        }).then((response) => {
            if(response.status === 200)
            {
                alert("Updated successfully!")
            }
            else
            {
                alert("Something went wrong,try later.")
            }
        })



        this.setState({
            access_control_list:[],
            schedule:[],
        })
        this.update_get_clients();

    }






    render() {
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, backgroundColor: '#262d3c'}}>
                    <View style={{flex: 0.5}}>
                        <ActivityIndicator animating={true} color={'#fff'} style={{flex: 1}} size={"large"}/>
                        <Text style={{color: '#fff', marginLeft: "40%"}}>Loading...</Text>
                    </View>
                </View>
            )
        } else {

            //controllerID-Wireless
            let controllerMacs = this.state.controllerSource;
            let controllerValue = this.state.controllerValue;
            let controllerMac = [];
            for (let i = 0; i < controllerMacs.length; i++) {
                let controller = eval(controllerMacs)[i];
                controllerMac.push(controller);
            }

            let WirelessControllers = controllerMac.map((val, key, array) => {
                return (<Picker.Item value={val} label={val} key={key}/>
                )
            });


            let MacControllersID = this.state.cIDSource;
            let cVal = this.state.cValue;
            let contID = [];
            for (let i = 0; i < MacControllersID.length; i++) {
                let cont = eval(MacControllersID)[i];
                contID.push(cont);
            }

            let contData = contID.map((val, key, array) => {
                return (
                    <Picker.Item label={val} value={val} key={key}/>
                )
            });


            let ApStaVal = this.state.ApStaValue;

            //ap_sta_macs
            let ap_sta_macs = this.state.ap_sta_macs;
            let ap_sta_macs_array = [];
            for (let i = 0; i < ap_sta_macs.length; i++) {
                let macs = eval(ap_sta_macs)[i];
                ap_sta_macs_array.push(macs);
            }
            let ap_sta_macs_picker_data = ap_sta_macs_array.map((val, key) => {
                return (
                    <Picker.Item label={val} value={val} key={key}/>
                )
            })

            let ConfValue = this.state.ConfValue;
            let GuestValue = this.state.GuestValue;

            //whitelist
            const {selectedItems} = this.state;

            //update
            let update_get_clients = this.state.update_get_clients;
            let get_clients_array = [];
            for(let i = 0; i < update_get_clients.length; i++)
            {
                let clients = eval(update_get_clients)[i];
                get_clients_array.push(clients)
            }

            let get_update_client_picker = get_clients_array.map((val, key) => {
                    return (
                        <Picker.Item label={val} value={val} key={key}/>
                    )

                }

            )

            return (
                <View style={styles.MainContainer}>
                    <ControlView
                        navigationState={this.state}
                        renderScene={({route}) => {
                            switch (route.key) {
                                case "wireless":
                                    return <ScrollView>
                                        <View style={styles.WifiMainContainer}>
                                            <Image source={require('../assets/icons8-settings-32.png')}
                                                   styles={{alignSelf: 'center'}}/>
                                            <Text style={styles.first_text}>Wi-Fi Configuration Settings</Text>
                                            <Text style={styles.second_text}>Controller</Text>
                                            {
                                                this.state.user_role === "user" ? <View style={styles.wifi_picker_view}>
                                                <Picker
                                                    style={styles.wifi_picker} accessibilityValue={true}
                                                    selectedValue={controllerValue}
                                                    onValueChange={(controllerValue) => {
                                                        this.getBasicConf();
                                                        this.setState({controllerValue: controllerValue})
                                                    }}>
                                                    <Picker.Item label={'Select Controller'} value={''}/>
                                                    {WirelessControllers}
                                                </Picker>
                                                </View> : <View>
                                                <TextInputMask
                                                onEndEditing={(e) => {
                                                let mac = e.nativeEvent.text.toLowerCase()
                                                this.setState({
                                                inputValue:mac
                                                })
                                                this.getBasicConf();

                                                }}
                                                placeholder={this.state.inputValue}
                                                placeholderTextColor={'#000'}
                                                mask={"[__]:[__]:[__]:[__]:[__]:[__]"}
                                                style={{color:'#474343',
                                                backgroundColor:'#E8F0FE',width:300,fontSize:18,borderRadius:10,fontWeight:"bold"}}
                                                onSubmitEditing={(e) => {
                                                let mac = e.nativeEvent.text.toLowerCase()
                                                this.setState({
                                                inputValue:mac
                                                })
                                                this.getBasicConf();

                                                }}
                                                mask={"[__]:[__]:[__]:[__]:[__]:[__]"}
                                                />
                                                </View>
                                            }
                                        

                                            <Text style={styles.second_text}>Configuration Value</Text>
                                            <View style={styles.wifi_picker_view}>
                                                <Picker style={styles.wifi_picker} accessibilityValue={true}
                                                        selectedValue={ConfValue} onValueChange={(ConfValue) =>
                                                    this.setState({ConfValue: ConfValue})
                                                }>
                                                    <Picker.Item label={"Same Configuration"} value={true}/>
                                                    <Picker.Item label={"Different Configuration"} value={false}/>

                                                </Picker>
                                            </View>

                                            <Text style={styles.second_text}>Guest Enable</Text>
                                            <View style={styles.wifi_picker_view}>
                                                <Picker style={styles.wifi_picker} accessibilityValue={true}
                                                        selectedValue={GuestValue} onValueChange={(GuestValue) => {
                                                    this.setState({GuestValue: GuestValue})
                                                }}>
                                                    <Picker.Item label={"Yes"} value={true}/>
                                                    <Picker.Item label={"No"} value={false}/>

                                                </Picker>
                                            </View>

                                            {this.state.ConfValue === true ? <View>

                                                <View style={{marginTop: 20}}>

                                                    <Text style={styles.second_text}>SSID:</Text>
                                                    <TextInput style={styles.wifi_text_input}
                                                               placeholder={this.state.FiveSsid}
                                                               onSubmitEditing={(e) => this.setState({FiveSsid: e.nativeEvent.text})}
                                                               placeholderTextColor={'#000'}
                                                    />

                                                    <Text style={styles.second_text}>Password:</Text>
                                                    <TextInput style={styles.wifi_text_input}
                                                               placeholder={this.state.FivePassword}
                                                               onSubmitEditing={(e) => this.setState({FivePassword: e.nativeEvent.text})}
                                                               placeholderTextColor={'#000'}

                                                    />
                                                </View>
                                            </View> : <View>
                                                <View style={{marginBottom: 10, marginTop: 20}}>
                                                    <Text style={styles.second_text}>5GHZ - SSID:</Text>
                                                    <TextInput style={styles.wifi_text_input}
                                                               placeholder={this.state.FiveSsid}
                                                               onSubmitEditing={(e) => this.setState({FiveSsid: e.nativeEvent.text})}
                                                               placeholderTextColor={'#000'}

                                                    />

                                                    <Text style={styles.second_text}>5GHZ - Password:</Text>
                                                    <TextInput style={styles.wifi_text_input}
                                                               placeholder={this.state.FivePassword}
                                                               onSubmitEditing={(e) => this.setState({FivePassword: e.nativeEvent.text})}
                                                               placeholderTextColor={'#000'}
                                                    />
                                                </View>


                                                <View style={{marginBottom: 20}}>
                                                    <Text style={styles.second_text}>2.4 GHZ - SSID:</Text>
                                                    <TextInput style={styles.wifi_text_input}
                                                               placeholder={this.state.TwoFourSsid}
                                                               onSubmitEditing={(e) => this.setState({TwoFourSsid: e.nativeEvent.text})}
                                                               placeholderTextColor={'#000'}

                                                    />
                                                    <Text style={styles.second_text}>2.4 GHZ - Password:</Text>
                                                    <TextInput style={styles.wifi_text_input}
                                                               placeholder={this.state.TwoFourPassword}
                                                               onSubmitEditing={(e) => this.setState({TwoFourPassword: e.nativeEvent.text})}
                                                               placeholderTextColor={'#000'}
                                                    />
                                                </View>
                                            </View>

                                            }

                                            {this.state.GuestValue === true ?
                                                <View>
                                                    <View>
                                                        <Text style={styles.second_text}>Guest Network - SSID:</Text>
                                                        <TextInput style={styles.wifi_text_input}
                                                                   placeholder={this.state.GuestSsid}
                                                                   onSubmitEditing={(e) => this.setState({GuestSsid: e.nativeEvent.text})}
                                                                   placeholderTextColor={'#000'}

                                                        />
                                                        <Text style={styles.second_text}>Guest Network -
                                                            Password:</Text>
                                                        <TextInput style={styles.wifi_text_input}
                                                                   placeholder={this.state.GuestPassword}
                                                                   onSubmitEditing={(e) => this.setState({GuestPassword: e.nativeEvent.text})}
                                                                   placeholderTextColor={'#000'}
                                                        />
                                                    </View>
                                                </View> : <View/>
                                            }

                                            <View style={{marginTop: 10, marginBottom: 10,}}>
                                                <Button title={"Configure"} onPress={this.setBasicConf}/>
                                            </View>
                                        </View>
                                    </ScrollView>;
                                case "friendly":
                                    return <ScrollView>
                                        <View style={styles.WifiMainContainer}>

                                            <Image source={require('../assets/icons8-male-user-32.png')}
                                                   styles={{alignSelf: 'center'}}/>
                                            <Text style={styles.first_text}>Device Name Configuration</Text>
                                            <Text style={styles.second_text}>Controller</Text>
                                            
                                            {this.state.user_role === "user" ? <View style={styles.friendly_picker_view}>
                                                <Picker style={styles.friendly_picker} accessibilityValue={true}
                                                        selectedValue={cVal}
                                                        onValueChange={(cVal) => {
                                                            this.get_ap_sta_list();
                                                            this.setState({
                                                                cValue: cVal,
                                                                ApStaValue: '',
                                                                ap_sta_friendly_name: ''
                                                            });
                                                        }}
                                                >
                                                    <Picker.Item label={"Select Controller"} value={''}/>
                                                    {contData}
                                                </Picker>
                                            </View> : <View>
                                                <TextInputMask
                                                onEndEditing={(e) => {
                                                let mac = e.nativeEvent.text.toLowerCase()
                                                this.setState({
                                                inputValue:mac,
                                                ApStaValue: '',
                                                ap_sta_friendly_name: ''
                                                })
                                                this.get_ap_sta_list();

                                                }}
                                                placeholder={""}
                                                placeholderTextColor={'#000'}
                                                mask={"[__]:[__]:[__]:[__]:[__]:[__]"}
                                                style={{color:'#474343',
                                                backgroundColor:'#E8F0FE',width:300,fontSize:18,borderRadius:10,fontWeight:"bold"}}
                                                onSubmitEditing={(e) => {
                                                let mac = e.nativeEvent.text.toLowerCase()
                                                this.setState({
                                                    inputValue:mac,
                                                    ApStaValue: '',
                                                    ap_sta_friendly_name: ''
                                                    })
                                                this.get_ap_sta_list();

                                                }}
                                                mask={"[__]:[__]:[__]:[__]:[__]:[__]"}
                                                />
                                                </View>
                            }

                                            <Text style={styles.second_text}>MAC Address</Text>
                                            <View style={styles.friendly_picker_view}>
                                                <Picker style={styles.friendly_picker} accessibilityValue={true}
                                                        selectedValue={ApStaVal}
                                                        onValueChange={(ApStaVal) => {
                                                            this.setState({ApStaValue: ApStaVal,})
                                                            this.getStaNames();
                                                        }}
                                                >
                                                    <Picker.Item label={"Select Mac:"} value={''}/>
                                                    {ap_sta_macs_picker_data}
                                                </Picker>
                                            </View>


                                            <Text style={styles.first_text}>Device Name</Text>
                                            <TextInput
                                                style={styles.friendly_text_input}
                                                placeholder={this.state.ap_sta_given_name ? this.state.ap_sta_given_name.toString() : ''}
                                                onSubmitEditing={e => this.setState({ap_sta_given_name: e.nativeEvent.text})}
                                                placeholderTextColor={'#000'}
                                            />


                                            <View style={{flexDirection: "row", marginTop: 20}}>
                                                <Button title="SAVE" onPress={this.setApList}/>
                                            </View>


                                        </View>
                                    </ScrollView>;
                                case "whitelist":
                                    return <WhiteListView renderScene={({route}) => {
                                        switch (route.key) {
                                            case "save":
                                                return <View style={styles.AccessMainContainer}>

                                                    <ScrollView contentContainerStyle={styles.AccessUnderContainer}>
                                                        <View style={{alignItems:"center",marginBottom:50
                                                        }}>
                                                        <Image source={require('../assets/icons8-settings-32.png')}
                                                               styles={{alignSelf: 'center'}}/>
                                                        <Text style={styles.first_text}>SAVE</Text>
                                                        
                                                        {this.state.user_role === "user" ? <View style={[styles.friendly_picker_view,{backgroundColor:'#262d3c',width: Dimensions.get("window").width/1.25,borderColor:'#262d3c'}]}>
                                                    <Picker style={[styles.friendly_picker,{backgroundColor:'#262d3c',width: Dimensions.get("window").width/1.25,color:'#fff',fontWeight:"bold",
                                                    height:this.state.user_role === "user" ? 30 : 40,borderRadius:20
                                                }]}  accessibilityValue={true}
                                                    selectedValue={controllerValue}
                                                    onValueChange={(controllerValue) => {
                                                        this.setState({controllerValue: controllerValue})
                                                        this.get_clients();
                                                    }}>
                                                    <Picker.Item label={'Select Controller'} value={''}/>
                                                    {WirelessControllers}
                                                </Picker>
                                                </View>:
            
                                                <TextInputMask
                                                onEndEditing={(e) => {
                                                let mac = e.nativeEvent.text.toLowerCase()
                                                this.setState({
                                                inputValue:mac
                                                })
                                                this.get_clients();
                                                }}
                                                placeholder={"Type Mac..."}
                                                placeholderTextColor={'#fff'}
                                                mask={"[__]:[__]:[__]:[__]:[__]:[__]"}
                                                style={{color:'#E8F0FE',
                                                backgroundColor:'#262d3c',width: Dimensions.get("window").width/1.25,
                                                fontSize:18,borderRadius:10,fontWeight:"bold"}}
                                                onSubmitEditing={(e) => {
                                                let mac = e.nativeEvent.text.toLowerCase()
                                                this.setState({
                                                inputValue:mac
                                                })
                                                this.get_clients();
                                                }}
                                                mask={"[__]:[__]:[__]:[__]:[__]:[__]"}
                                                />
                                                }

                                                        <View style={{
                                                            width: Dimensions.get("window").width/1.25,
                                                            marginTop: '3%'
                                                        }}>
                                                            <MultiSelect
                                                                styleItemsContainer={{backgroundColor: '#262d3c'}}
                                                                styleSelectorContainer={{backgroundColor: '#262d3c'}}
                                                                styleListContainer={{
                                                                    backgroundColor: '#262d3c',
                                                                    borderRadius:10,
                                                                }}
                                                                styleDropdownMenuSubsection={{
                                                                    backgroundColor: '#262d3c',
                                                                    borderRadius:10,
                                                                }}
                                                                styleDropdownMenu={{
                                                                    backgroundColor: '#262d3c',
                                                                    borderRadius:10,
                                                                }}
                                                                styleInputGroup={{
                                                                    backgroundColor: '#262d3c',
                                                                    borderRadius:10,
                                                                }}
                                                                styleMainWrapper={{
                                                                    backgroundColor: '#262d3c',
                                                                    borderRadius:10,
                                                                }}
                                                                styleRowList={{backgroundColor: '#262d3c'}}
                                                                styleTextDropdown={{
                                                                    backgroundColor: '#262d3c',
                                                                    fontSize: 16,
                                                                    fontWeight: "bold",
                                                                    textAlign: 'center'
                                                                }}
                                                                styleTextDropdownSelected={{
                                                                    backgroundColor: '#262d3c',
                                                                    fontSize: 16,
                                                                    fontWeight: "bold",
                                                                    textAlign: 'center'
                                                                }}
                                                                textColor={'#fff'}
                                                                hideTags
                                                                items={this.state.clients_data}
                                                                uniqueKey="id"
                                                                ref={(component) => {
                                                                    this.multiSelect = component
                                                                }}
                                                                onSelectedItemsChange={this.onSelectedItemsChange}
                                                                selectedItems={selectedItems}
                                                                selectText="Select Clients"
                                                                searchInputPlaceholderText="Search Items..."
                                                                onChangeInput={(text) => console.log(text)}
                                                                altFontFamily="ProximaNova-Light"
                                                                tagRemoveIconColor="#fff"
                                                                tagBorderColor="#fff"
                                                                tagTextColor="#fff"
                                                                selectedItemTextColor="#fff"
                                                                selectedItemIconColor="#fff"
                                                                itemTextColor="#fff"
                                                                displayKey="name"
                                                                searchInputStyle={{color: '#262d3c'}}
                                                                submitButtonColor="#353f53"
                                                                submitButtonText="Submit"

                                                            />
                                                            <View>
                                                                {this.multiSelect && this.multiSelect.getSelectedItemsExt(selectedItems)}

                                                            </View>

                                                        </View>


                                                        {this.create_time_picker()}
                                                            <Text style={styles.second_text}>Date</Text>
                                                            {this.create_date_buttons()}

                                            <View style={{flexDirection:"row",justifyContent:"center",width:Dimensions.get("window").width/2,marginTop:'3%'}}>
                                                <TouchableOpacity style={{justifyContent: "center",borderWidth:1,borderRadius:10,borderColor:'#fff',padding:5}} onPress={() => this.add_time_ranges()}>
                                                    <View style={{flexDirection:"row",alignItems:"center",marginTop:'2%',marginBottom:'2%'}}>
                                                        <Text style={{color:'#fff',fontWeight:"bold",fontSize:16,marginRight:'1%'}}>ADD</Text>
                                                        <Icon name={"plus-circle"} style={{alignSelf:"center"}} size={25} color={'#fff'}/>
                                                    </View>
                                                </TouchableOpacity>

                                            </View>
                                                            {this.state.config_data.length === 0 ? <View/>

                                                            :<View>
                                                                    <Text style={[styles.second_text,{marginTop:'4%',alignSelf:"center"}]}>
                                                                        Added Time Ranges
                                                                    </Text>
                                                                    <View style={{flexDirection:"row",justifyContent:"space-between",width:Dimensions.get("window").width/1.05}}>
                                                                        <View style={{alignItems:"center",justifyContent:"center"}}>
                                                                            <TouchableOpacity onPress={()=>{this.save_configs()}}>
                                                                                <View style={[styles.button,{marginBottom:'2%'}]}>
                                                                                    <Text style={{color: '#fff', fontSize: 16, fontFamily: "Roboto"}}>SAVE</Text>
                                                                                </View>
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                        <View style={{backgroundColor: '#262d3c', maxHeight: 150, borderRadius: 10,alignSelf:"flex-start",justifyContent:"flex-start"}}>


                                                                            <ScrollView nestedScrollEnabled = {true}>
                                                                                <View style={{marginBottom:50}}>
                                                                                    <Table>
                                                                                        {
                                                                                            this.state.config_data.map((rowData, index) => (
                                                                                                <View
                                                                                                    style={{width: Dimensions.get("window").width / 1.35}}
                                                                                                    key={index}>
                                                                                                    <View style={{flexDirection: "row", justifyContent: "space-evenly",
                                                                                                    }}>

                                                                                                        <Row key={index} data={rowData} style={styles.row} textStyle={styles.text} widthArr={[Dimensions.get("window").width/1.50]}
                                                                                                        />
                                                                                                        <TouchableOpacity onPress={() => {
                                                                                                            let array = this.state.config_data;
                                                                                                            array.splice(index, 1);
                                                                                                            this.setState({config_data: array,
                                                                                                            })
                                                                                                        }}
                                                                                                        >
                                                                                                            <Icon size={25}
                                                                                                                  color={'#fff'}
                                                                                                                  name={"delete"}
                                                                                                            />
                                                                                                        </TouchableOpacity>

                                                                                                    </View>
                                                                                                </View>
                                                                                            ))}
                                                                                    </Table>
                                                                                </View>
                                                                            </ScrollView>
                                                                        </View>



                                                                    </View>
                                                                </View>


                                                            }

                                                        </View>


                                                    </ScrollView>

                                                </View>

                                            case "update":
                                                return <View style={styles.AccessMainContainer}>
                                                    <ScrollView contentContainerStyle={styles.AccessUnderContainer}>

                                                    <Image source={require('../assets/icons8-settings-32.png')}
                                                    styles={{alignSelf: 'center'}}/>
                                                    <Text style={styles.first_text}>UPDATE</Text>

                                                    {this.state.user_role === "user" ? <View style={[styles.friendly_picker_view,{backgroundColor:'#262d3c',width: Dimensions.get("window").width/1.25,borderColor:'#262d3c'}]}>
                                                    <Picker
                                                    style={[styles.friendly_picker,{backgroundColor:'#262d3c',width: Dimensions.get("window").width/1.25,color:'#fff',fontWeight:"bold",borderColor:'#262d3c'
                                                }]} 
                                                    accessibilityValue={true}
                                                    selectedValue={controllerValue}
                                                    onValueChange={(controllerValue) => {
                                                        this.setState({controllerValue: controllerValue})
                                                        this.update_get_clients();
                                                    }}>
                                                    <Picker.Item label={'Select Controller'} value={''}/>
                                                    {WirelessControllers}
                                                </Picker>
                                                </View>:<TextInputMask
                                                onEndEditing={(e) => {
                                                let mac = e.nativeEvent.text.toLowerCase()
                                                this.setState({
                                                inputValue:mac
                                                })
                                                this.update_get_clients()

                                                }}
                                                placeholder={"Type Mac..."}
                                                placeholderTextColor={'#fff'}
                                                mask={"[__]:[__]:[__]:[__]:[__]:[__]"}
                                                style={{color:'#E8F0FE',
                                                backgroundColor:'#262d3c',width: Dimensions.get("window").width/1.25,
                                                fontSize:18,borderRadius:10,fontWeight:"bold"}}
                                                onSubmitEditing={(e) => {
                                                let mac = e.nativeEvent.text.toLowerCase()
                                                this.setState({
                                                inputValue:mac
                                                })
                                                this.update_get_clients()

                                                }}
                                                mask={"[__]:[__]:[__]:[__]:[__]:[__]"}
                                                />

                                                }

                                                    <View style={[styles.friendly_picker_view,{backgroundColor:'#262d3c',width: Dimensions.get("window").width/1.25,borderColor:'#262d3c'}]}>
                                                    <Picker style={[styles.friendly_picker,{backgroundColor:'#262d3c',width: Dimensions.get("window").width/1.25,color:'#fff',fontWeight:"bold",
                                                    height:this.state.user_role === "user" ? 30 : 40,borderRadius:20
                                                }]} 
                                                    accessibilityValue={true}
                                                    selectedValue={this.state.update_client} onValueChange={(val)=>{
                                                        this.setState({update_client:val})
                                                        this.update_get_configs(val)
                                                    }}
                                                    >

                                                    <Picker.Item label={"Select Client"} value={''} key={''}/>
                                                    {get_update_client_picker}

                                                    </Picker>
                                                    </View>

                                                        {this.create_time_picker()}

                                                        <Text style={styles.second_text}>Date</Text>
                                                        {this.create_date_buttons()}

                                                        <View style={{marginTop:'1%'}}>
                                                            <TouchableOpacity style={{justifyContent: "center",alignSelf:'center'}} onPress={() => this.add_update_time_ranges()}>
                                                                <View style={{flexDirection:"row",alignItems:"center",marginTop:'2%',marginBottom:'2%',borderWidth:1,borderRadius:10,borderColor:'#fff',padding:5}}>
                                                                    <Text style={{color:'#fff',fontWeight:"bold",fontSize:16,marginRight:'1%'}}>ADD</Text>
                                                                    <Icon name={"plus-circle"} style={{alignSelf:"center"}} size={25} color={'#fff'}/>
                                                                </View>
                                                            </TouchableOpacity>
                                                        <Text style={[styles.second_text,{alignSelf:"center"}]}>Configurations</Text>
                                                        <View style={{flexDirection:"row",justifyContent:"space-between",width:Dimensions.get("window").width/1.05}}>

                                                            <View style={{alignItems:"center",justifyContent:"center"}}>
                                                                <TouchableOpacity style={{justifyContent: "center"}} onPress={() =>{
                                                                    if(this.state.update_client === '')
                                                                    {
                                                                        alert("Please,select a client.")
                                                                    }
                                                                    else{
                                                                        Alert.alert(
                                                                            "Are you sure?",
                                                                            "Config settings of " + this.state.update_client + " will be deleted!",
                                                                            [
                                                                                {
                                                                                    text: "Cancel",
                                                                                    style: "cancel"
                                                                                },
                                                                                { text: "OK", onPress: () => this.delete_configs() }
                                                                            ]
                                                                        );
                                                                    }

                                                                    }}>
                                                                    <View style={{flexDirection:"row",alignItems:"center",marginBottom:'15%',borderWidth:1,borderRadius:10,borderColor:'#fff',padding:3}}>
                                                                        <Text style={{color:'#fff',fontWeight:"bold",fontSize:14,marginRight:'1%'}}>DELETE</Text>
                                                                        <Icon name={"delete"} style={{alignSelf:"center"}} size={23} color={'#fff'}/>
                                                                    </View>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity onPress={()=>{
                                                                    if(this.state.update_client === '')
                                                                    {
                                                                        alert("Please,select a client.")
                                                                    }
                                                                    else {
                                                                        this.update_configs();
                                                                    }
                                                                   }}>
                                                                    <View style={[styles.button,{marginTop:'2%'}]}>
                                                                        <Text style={{color: '#fff', fontSize: 16, fontFamily: "Roboto"}}>UPDATE</Text>
                                                                    </View>
                                                                </TouchableOpacity>

                                                            </View>

                                                    <View style={{marginBottom: 2,width:300,backgroundColor:'#262d3c',minHeight:100,maxHeight:100,borderRadius:10}}>
                                                        <ScrollView>
                                                    <View style={{marginBottom: 30}}>

                                                    <Table>
                                                        {
                                                            this.state.update_get_configs.map((rowData, index) => (
                                                                <View
                                                                    style={{width: Dimensions.get("window").width / 1.40}}
                                                                    key={index}>
                                                                    <View style={{flexDirection: "row", justifyContent: "space-evenly",
                                                                    }}>

                                                                        <Row key={index} data={rowData} style={styles.row} textStyle={styles.text} widthArr={[Dimensions.get("window").width/1.50]}
                                                                        />
                                                                        <TouchableOpacity onPress={() => {
                                                                            let array = this.state.update_get_configs;
                                                                            array.splice(index, 1);
                                                                            this.setState({update_get_configs: array,
                                                                            })
                                                                        }
                                                                        }>
                                                                            <Icon size={25}
                                                                                  color={'#fff'}
                                                                                  name={"delete"}
                                                                            />
                                                                        </TouchableOpacity>

                                                                    </View>
                                                                </View>
                                                            ))}
                                                    </Table>
                                                    </View>
                                                    </ScrollView>
                                                    </View>
                                                        </View>
                                                </View>

                                                    </ScrollView>
                                                    </View>
                                                    }
                                                    }}
                                                    onIndexChange={index => this.setState({white_index: index})}
                                                    navigationState={{index: this.state.white_index, routes: this.state.white_routes
                                                    }}
                                                    renderTabBar={props => <TabBar {...props} indicatorStyle={{backgroundColor: '#fff', maxHeight: '5%'}}
                                                    style={{backgroundColor: '#353f53', marginTop: '5%', width: Dimensions.get("window").width / 1.25, alignSelf: 'center', borderRadius: 10
                                                    }}
                                                    tabStyle={{backgroundColor: '#353f53', maxHeight: 50, borderRadius: 10}} // here
                                                    renderLabel={({route, focused, color}) => (
                                                    <Text style={{color, margin: 5, fontSize: 16, fontFamily: "Roboto"
                                                    }}>
                                                    {route.title}
                                                    </Text>
                                                    )}/>}

                                                    />

                                default:
                                    return null;

                            }


                        }}
                        renderTabBar={props => <TabBar {...props}
                        indicatorStyle={{ backgroundColor: 'white'}}
                        style={{backgroundColor: '#353f53',
                        }}
                        />}                        
                        onIndexChange={index => this.setState({index})}
                        initialLayout={{width: Dimensions.get('window').width}}

                    />

                </View>

            )

        }

    }

}


const styles = StyleSheet.create({
    MainContainer :{
        flex:1,
        backgroundColor:"#262d3c",
        paddingTop:0,
        paddingBottom:5,

    },
    WhiteListMain:{
        backgroundColor:"#353f53",
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:"3%",
        marginBottom:"3%",
        borderWidth:1,
        borderRadius:5,
        borderColor:"#353f53",
        padding:20,
    },
    AccessMainContainer :{
        flex:1,
        backgroundColor:"#262d3c",
        marginTop:'5%',
        paddingBottom:5,
    },
    AccessUnderContainer:{
            backgroundColor:"#353f53",
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth:1,
            borderRadius:5,
            borderColor:"#353f53",
            margin:5,
            marginTop:0,
            paddingBottom:20,
    },
    WifiMainContainer:{
        backgroundColor:"#353f53",
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth:1,
        borderRadius:5,
        borderColor:"#353f53",
        margin:20
    },
    FriendlyMainContainer:{
        backgroundColor:"#353f53",
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:"20%",
        marginBottom:"3%",
        borderWidth:1,
        borderRadius:5,
        borderColor:"#353f53",
        padding:20,
    },
    wifi_picker:{
        height: 30,
        width: 297  ,
        backgroundColor:'#E8F0FE',
        borderRadius:12,
    },
    wifi_picker_view:{
        backgroundColor:'#E8F0FE',
        width:300,
        borderColor:'#E8F0FE',
        borderWidth:2,
        borderRadius:5,
        marginBottom: 10,
        marginTop:10,
        alignItems: 'center',
        justifyContent: 'center',

    },
    wifi_text_input:{
        height: 40,
        width: 300,
        borderColor: 'gray',
        fontFamily:"Roboto",
        fontWeight:"bold",
        borderWidth: 1,
        borderRadius: 5,

        color:'#474343',
        backgroundColor:'#E8F0FE',
        fontSize:18,
    },
    friendly_picker:{
        height: 30,
        width: 297,
        backgroundColor:'#E8F0FE',
        borderRadius:12,
    },
    friendly_picker_view:{
        backgroundColor:'#E8F0FE',
        width:300,
        borderColor:'#E8F0FE',
        borderWidth:1,
        borderRadius:5,
        marginBottom: 10,
        marginTop:10,
        alignItems: 'center',
        justifyContent: 'center',

    },
    friendly_text_input:{
        height: 40,
        width: 300,
        borderColor: 'gray',
        fontFamily:"Roboto",
        fontWeight:"bold",
        borderWidth: 1,
        borderRadius: 5,

        color:'#474343',
        backgroundColor:'#E8F0FE',
        fontSize:18,
    },
    first_text:{
        fontFamily:"Roboto",
        color:'#fff',
        fontSize:20,
        textAlign:"center",
        marginBottom:10,
        fontStyle:"italic",
        fontWeight: "bold"
    },
    second_text:{
        fontFamily: "Roboto",
        color:'#E8F0FE',
        fontSize: 15,
        textAlign: "left",
        fontWeight:'bold',
    },
    modal_view: {
        backgroundColor: 'rgba(24,24,24,0.8)',
        justifyContent: 'center',
        flex: 1,
    },
    modal_under_view: {
        backgroundColor: 'rgba(109,108,108,0.8)',
        height: 200,
        flex: 0.50,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'rgba(139,136,136,0.8)'
    },
    date_modal_view: {
        backgroundColor: 'rgba(24,24,24,0.8)',
        justifyContent: 'center',
        flex: 1,
    },
    date_modal_under_view: {
        height: 240,
        flex: 0.65,

    },
    modal_close_button:
        {
            position:"absolute",
            bottom:0,
            alignSelf:"center"
        },
    modal_text_view:{
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor:'rgba(109,108,108,0.8)',
        height:200,
        flex:0.25,
        borderWidth:1,
        borderRadius:5,
        borderColor:'rgba(139,136,136,0.8)'},
    text_border:{
        fontFamily: "Roboto",
        color:'#E8F0FE',
        fontSize: 15,
        textAlign: "left",
        fontWeight:'bold',
    },
    text_border_view:{
      borderWidth:1,
      borderRadius:5,
      borderColor:  '#E8F0FE',
      padding:10,
        marginTop:5,
        marginBottom:10,
    },
    date_button:{
        alignItems:'center',
        justifyContent:"center",
        alignSelf: "center",
        width:Dimensions.get("window").width/1.30,
        backgroundColor:'#262d3c',
        marginTop:'2%',
        borderWidth:2,
        borderRadius:20,
        borderColor:'#353F53',
        height:Dimensions.get("window").height/15,

    },
    button:{
        alignItems:'center',
        justifyContent:"center",
        backgroundColor:'#2196F3',
        marginTop:'2%',
        borderWidth:2,
        borderRadius:10,
        borderColor:'#2196F3',
        height:35,
        maxHeight:35,
        width:Dimensions.get("window").width/5.5
    },
    text: {
        color:'#fff',
        fontWeight:'bold',
        margin:5},
    btnNormal: {
        backgroundColor:'#262d3c',
        height: 30,
        width: 50,
        borderRightColor: '#fff',
        borderRightWidth:1,
        borderRadius:5,
        borderTopRightRadius:0,
        borderBottomRightRadius:0,
    },
    btnPress: {
        backgroundColor:'#fff',
        borderColor: '#353f53',
        borderWidth: 1,
        height: 30,
        width: 50,
        borderRadius:5,
        borderTopRightRadius:0,
        borderBottomRightRadius:0,
    }

});




import React, {useState} from 'react';
import {
    View,
    Text,
    Button,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    Modal,
    TextInput, TouchableOpacity, Switch
} from 'react-native';
import {Table, Row, } from 'react-native-table-component';

import Topology from "../components/topology";
import AsyncStorage from "@react-native-community/async-storage";
import {
    CID_URL,
    TOPOLOGY_INFO,
    HOME_INFO,
    HEALTH_INFO,
    EVENTS_INFO,
    LATEST_AP,
    UPDATE_AP_GNAME,
    UPDATE_STA_GNAME,
    LATEST_STA,
    ON_DEMAND_STA,
    ON_DEMAND_AP
} from "../../secrets";
import {Picker} from "@react-native-community/picker";
import IIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment-timezone";
import * as math from "mathjs"
import AwesomeAlert from 'react-native-awesome-alerts';
import TextInputMask from 'react-native-text-input-mask';
import {Modalize} from "react-native-modalize";

export default class Live extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            single_controller:false,
            inputValue:'',
            user_role:'',
            cSource:[],
            auto_refresh:false,
            auto_refresh_timer:'',
            events_timer:'',
            events_activation_timer:'',
            is_mounted:false,


            //INFO TABS
            all_tabs:[],
            first_tab:[],
            second_tab:[],
            third_tab:[],

            //MODAL
            modal_views:[],


            //HOME INFO & VERSION INFO
            mac_address:'',
            last_seen:'',
            country:'',
            region:'',
            city:'',
            status:'',
            ip_address:'',
            cVersion:'',
            cdVersion:'',


            //HEALTH INFO
            last_report_time:'',
            last_data_time:'',
            device_up_time:'',
            teapot_up_time:'',


            //EVENTS
            tableHead: ['Device Name', 'MAC Address', 'Event Name'],
            widthArr: [40, 60, 80, 100, 120, 140, 160, 180, 200],
            events_data:[],
            current_events:[],
            isCurrentEvent:false,
            showAlert:false,
            events_detail_array:[],
            selected_index:0,
            //AP
            ap_mac_list:[],
            ap_mac_value:'',
            ap_info_list:[],
            ap_given_name:'',

            //STA
            sta_mac_list:[],
            sta_mac_value:'',
            sta_info_list:[],
            sta_given_name:'',

            //TOPOLOGY
            topology_height:'100%',
            topology:[],
            topology_last_seen:'',
            data_node:'',
            link_data:'',
            topologyStat:'',
            refreshPage: [],
        }

    }

    state = {contValue: ''}

    home_modal = React.createRef();
    clients_modal = React.createRef();
    ap_modal = React.createRef();
    events_modal = React.createRef();


    openModal = (value) => {
        const home_modal = this.home_modal.current 
        const clients_modal = this.clients_modal.current
        const ap_modal = this.ap_modal.current
        const events_modal = this.events_modal.current
        value === "home" ? home_modal.open() : value === "clients" ? clients_modal.open() : 
        value === "ap" ? ap_modal.open() : value === "events" ? events_modal ? events_modal.open() : '' : '';
    }


    updateTopology = (contValue) => {
        this.setState({ contValue: contValue })
    }
    auto_refresh = (value) => {
        this.setState({auto_refresh:value})
    }
    showAlert = (data,index) => {
        this.setState({
            showAlert: true,
            selected_index:index,
            events_detail_array:data,
        });
    };

    hideAlert = () => {
        this.setState({
            showAlert: false
        });
    };

    auto_refresh_activating (button_active)
    {
        if(button_active === true)
        {
            this.auto_refresh_timer && clearInterval(this.auto_refresh_timer)
            this.auto_refresh_timer = setInterval(()=>{
                this.functionCombined();
            },60000)
        }
        else
        {
            this.auto_refresh_timer && clearInterval(this.auto_refresh_timer)
        }
    }
    convertSecondstoDate = (seconds) => {
        let d = seconds / 8.64e4 | 0;
        let H = (seconds % 8.64e4) / 3.6e3 | 0;
        let m = (seconds % 3.6e3)  / 60 | 0;
        let s = seconds % 60;
        return `${d} days - ${(H < 10 ? '0' + H.toString() : H)}:${(m < 10 ? '0' + m.toString() : m)}:${(s < 10 ? '0' + s.toString() : s)}`
    }

    async componentDidMount() {
        const IdToken = await AsyncStorage.getItem('@auth_token');
        const myHeaders = new Headers();
        myHeaders.append('Content-Type','application/json');
        myHeaders.append('Authorization',IdToken);
        this.setState({user_role:await AsyncStorage.getItem("role")})
        if(this.state.user_role === "user")
        {
            await fetch(CID_URL, {
                method: 'GET',
                headers:myHeaders,

            }).then(response=>response.status === 200 ? response.json() : null).then((responseJson) => {
                    let controllers = responseJson.homePopulation.data
                    let single_controller = false;
                    controllers.map((val)=>{
                        this.state.cSource.push(val.controllerId)
                    })
                    this.state.cSource.length === 1 ? single_controller = true : single_controller = false;
                    this.setState({
                        isLoading:false,
                        single_controller:single_controller,
                    })
                    
                    if(this.state.single_controller)
                    {
                        this.events_timer && clearInterval(this.events_timer);
                        this.events_activation_timer && clearTimeout(this.events_activation_timer);
                        this.events_timer = setInterval(()=> {
                            this.get_current_events();
                        },10000)
                        this.set_modal_views();
                        this.getTopologyData();
                    }
                })
                .catch((error)=> {
                    console.log(error);

                })
        }
        else if(this.state.user_role === "super" || this.state.user_role === "group"){
            this.setState({
                isLoading:false,
                single_controller:false,
                })
        }
            
        this.setState({is_mounted:true,})
    }

    componentWillUnmount() {
        this.auto_refresh_timer && clearInterval(this.auto_refresh_timer);
        this.events_timer && clearInterval(this.events_timer);
        this.events_activation_timer && clearTimeout(this.events_activation_timer);
        this.setState = (state,callback)=>{
            return;
        };
    }

    async set_modal_views ()
    {
        const cID = this.state.single_controller === true ? this.state.cSource : this.state.user_role === "user" ? this.state.contValue : this.state.inputValue;
        const IdToken = await AsyncStorage.getItem('@auth_token');
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', IdToken);
        await fetch(HOME_INFO + cID, {
            method: 'GET',
            headers: myHeaders,

        }).then(response => response.status === 200 ? response.json() : null)
            .then((responseJson) => {
                this.setState({
                    mac_address:responseJson.controllerInfo.controllerId,
                    last_seen:responseJson.controllerInfo.lastseenTime,
                    country:responseJson.controllerInfo.location.country,
                    region:responseJson.controllerInfo.location.region,
                    city:responseJson.controllerInfo.location.city,
                    status:responseJson.controllerInfo.status,
                    ip_address:responseJson.controllerInfo.wanIp,
                    cVersion:responseJson.controllerInfo.cVersion,
                    cdVersion:responseJson.controllerInfo.cdVersion,
                })
            })
            .catch((error) => {
                console.log(error);
            })
        await fetch(HEALTH_INFO + cID, {
            method: 'GET',
            headers: myHeaders,

        }).then(response => response.status === 200 ? response.json() : null)
            .then((responseJson) => {
                let health_info = responseJson.teapotHealthInfo.info;
                this.setState({
                    last_report_time:health_info[0].reportTime,
                    last_data_time:health_info[0].lastDataTimeFromLocalAgent,
                    device_up_time:health_info[0].deviceUptime !== undefined ? health_info[0].deviceUptime : '-',
                    teapot_up_time:health_info[0].teapotUptime,
                })
            })
            .catch((error) => {
                console.log(error);
            })



        //EVENTS
        let events_list = [];
        let events_array = [];
        await fetch(EVENTS_INFO + cID + "?interval=last_hour", {
            method: 'GET',
            headers: myHeaders,

        }).then(response => response.status === 200 ? response.json() : null)
            .then((responseJson) => {
                events_list = responseJson.alarmsInfo.info
                events_list.forEach(({macAddress,alarm,friendlyName}) => {
                    events_array.push([friendlyName,macAddress,alarm.name,(<IIcon name="information" color={'white'} size={20}  />),new Date(alarm.lastSeenTime).toUTCString().substr(5,17),alarm.count,alarm.definition]);
                })

                this.setState({
                    events_data:events_array,
                })
            })
            .catch((error) => {
                this.events_timer && clearInterval(this.events_timer);
                console.log(error);
            })

        //AP MODAL

        await fetch(LATEST_AP + cID, {
            method: 'GET',
            headers: myHeaders,

        }).then((response) => response.status === 200 ? response.json() : null)
            .then((responseJson) => {
                let ap_info = responseJson.apInfo.info;
                let ap_list = [];
                ap_info.forEach(({macAddress,friendlyName,givenName,vendorName,capacity,channel,configuration,linkType,ip,SSID}) => {
                    this.state.ap_mac_list.push(macAddress + " " +"(" + (friendlyName ? friendlyName : vendorName) + ")");
                })
            }).catch((error) => {
                console.log(error);
            })

        //STA MODAL
        await fetch(LATEST_STA + cID, {
            method: 'GET',
            headers: myHeaders,

        }).then((response) => response.status === 200 ? response.json() : null)
            .then((responseJson) => {{
                let sta_mac_list = responseJson.staInfo.info;
                sta_mac_list.forEach(({macAddress,friendlyName,vendorName}) => {
                    this.state.sta_mac_list.push(macAddress + " " +"(" + (friendlyName ? friendlyName : vendorName) + ")");

                })
            }}).catch((error) => {
                console.log(error);
            })




        this.setState({
            modal_views: <View style={{flexDirection:"row",justifyContent:"space-between",width:'70%',borderRadius:5}}>


<TouchableOpacity style={{alignItems:'center',justifyContent:"center",}}  onPress={()=> this.openModal("home")}>
    <View style={style.modal_buttons}>

    <Text style={style.modal_button_texts}>
HOME
</Text>
    </View>

</TouchableOpacity>



<TouchableOpacity style={{alignItems:'center',justifyContent:"center",}}  onPress={()=>this.openModal("clients")}>
    <View style={style.modal_buttons}>
    <Text style={style.modal_button_texts}>
CLIENT
</Text>
    </View>

</TouchableOpacity>


<TouchableOpacity style={{alignItems:'center',justifyContent:"center",}}  onPress={()=>this.openModal("ap")}>
    <View style={style.modal_buttons}>

    <Text style={style.modal_button_texts}>
AP
</Text>
    </View>

</TouchableOpacity>

<TouchableOpacity style={{alignItems:'center',justifyContent:"center",}} onPress={()=>this.openModal("events")}>
    <View style={style.modal_buttons}>
    <Text style={style.modal_button_texts}>
EVENTS
</Text>
    </View>
</TouchableOpacity>

    </View>,
            modal_is_open:true



        })
    }

    async get_current_events ()
    {
        const cID = this.state.single_controller === true ? this.state.cSource : this.state.user_role === "user" ? this.state.contValue : this.state.inputValue;
        const IdToken = await AsyncStorage.getItem('@auth_token');
        const myHeaders = new Headers();
        myHeaders.append('Content-Type','application/json');
        myHeaders.append('Authorization',IdToken);
        //EVENTS


        let events_list = [];
        let events_array = [];
        await fetch(EVENTS_INFO + cID + "?interval=last_hour", {
            method: 'GET',
            headers: myHeaders,

        }).then(response => response.status === 200 ? response.json() : null)
            .then((responseJson) => {
                events_list = responseJson.alarmsInfo.info
                if(events_list.length !== 0)
                {
                    events_list.forEach(({macAddress,alarm,friendlyName}) => {
                        events_array.push([friendlyName,macAddress,alarm.name,math.round(new Date().getTime()/1000),alarm.count,alarm.definition,alarm.lastSeenTime]);
                    })
                }

                if(events_array.length !== 0)
                {
                let last_seen_event = events_array[0][3];
                let now_time =  Date.now().toString().slice(0,-3);
                let friendly_name = events_array[0][0]
                let mac_address = events_array[0][1]
                let event_name = events_array[0][2]
                let last_seen = moment.utc(events_array[0][6]).local().format('YYYY-MM-DD HH:mm:ss')
                let count = events_array[0][4]
                if ((now_time-last_seen_event) <= 60)
                {
                    this.events_activation_timer = setTimeout(()=>
                    {
                        let screen_width = Dimensions.get("window").width

                        this.setState({
                            current_events:<View style={{backgroundColor:"#353f53",borderWidth:0.5,borderColor:'#353f53',borderRadius:5,marginTop:"0.5%",width:'96%',marginBottom:'0.5%'}}>
                                    <ScrollView horizontal={true}>
                                <Table borderStyle={{borderWidth: 0.5, borderColor: '#c8e1ff',borderRadius:5}}>
                                    <Row style={style.title} widthArr={[screen_width/2.85,screen_width/4.25,screen_width/4.75,screen_width/6.50]}
                                         textStyle={style.text} data={["Mac Address","Event","Last Seen","Count"]} />
                                    <Row style={style.title} widthArr={[screen_width/2.85,screen_width/4.25,screen_width/4.75,screen_width/6.50]}
                                         textStyle={style.text} data={[mac_address + (friendly_name ? " (" + friendly_name +")" : ''),event_name,last_seen,count]} />

                                </Table>
                                    </ScrollView>
                            </View>,
                            isCurrentEvent:true,
                        });
                    }, 3000);

                    this.setState({
                        current_events:<View style={{marginTop:"8%",width:'96%',marginBottom:'7%'}}><ActivityIndicator  animating={true} color={'#fff'} size={"large"}/></View>,
                    })
                }
                else
                {
                    this.setState({
                        current_events:[],
                        isCurrentEvent:false,
                    })
                }

            }
            })
            .catch((error) => {
                console.log(error);
            })

    }

    async get_ap_modal_list (ap_mac_value)
    {
        if(ap_mac_value === '')
        {
                this.setState({ap_info_list:[],ap_given_name:''})
        }
        else {
            const cID = this.state.single_controller === true ? this.state.cSource : this.state.user_role === "user" ? this.state.contValue : this.state.inputValue;
            const IdToken = await AsyncStorage.getItem('@auth_token');
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', IdToken);
            await fetch(LATEST_AP + cID, {
                method: 'GET',
                headers: myHeaders,

            }).then((response) => response.status === 200 ? response.json() : null)
                .then((responseJson) => {
                    let access_point = ap_mac_value.substring(0,17);
                    let ap_info = responseJson.apInfo.info;
                    ap_info === null ? this.setState({ap_info_list:[],ap_given_name:''}) : '';
                    let ap_list = [];
                    ap_list =  ap_info.filter(item => item.macAddress === access_point)
                    ap_list.forEach(({macAddress,friendlyName,givenName,vendorName,capacity,channel,configuration,linkType,ip,ssid}) => {
                        this.state.ap_info_list = [ssid.five,ssid.two,channel.five,channel.two,configuration,ip,linkType];
                        this.setState({ap_given_name:(givenName ? givenName : '')})
                    })
                }).catch((error) => {
                    console.log(error);
                })
        }

    }

    async get_sta_modal_list (sta_mac_value)
    {
        if(sta_mac_value === '')
        {
            this.setState({
                sta_info_list:[],sta_given_name:'',
            })
        }
        else
            {
                const cID = this.state.single_controller === true ? this.state.cSource : this.state.user_role === "user" ? this.state.contValue : this.state.inputValue;
                const IdToken = await AsyncStorage.getItem('@auth_token');
                const myHeaders = new Headers();
                myHeaders.append('Content-Type', 'application/json');
                myHeaders.append('Authorization', IdToken);
                await fetch(LATEST_STA + cID, {
                    method: 'GET',
                    headers: myHeaders,

                }).then((response) => response.status === 200 ? response.json() : null).then((responseJson) => {
                    let sta_info = responseJson.staInfo.info;
                    let sta_info_list = [];
                    sta_info_list = sta_info.filter(item => item.macAddress === sta_mac_value.substring(0,17))
                    sta_info_list.forEach(({IP,macAddress,friendlyName,givenName,vendor,antenna,lastSeen,rssi,rxRate,txRate,linkType}) => {
                        this.state.sta_info_list = [macAddress,IP,antenna.two,antenna.five,new Date(lastSeen).toUTCString().substr(5,17),rssi,txRate,rxRate,linkType];
                        this.setState({sta_given_name:(givenName ? givenName : '')})

                    })


                }).catch((error) => {
                    console.log(error);
                })

            }


    }


    async set_ap_name (controller,device_mac,given_name) {
        let new_device = device_mac.substring(0,17)
        const MyToken = await AsyncStorage.getItem('@auth_token');
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', MyToken);
        return fetch(UPDATE_AP_GNAME, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(
                {
                    cID: controller.toString(),
                    macAddress:new_device.toString(),
                    givenName: given_name.toString(),
                })
        }).then((responseJson)=> {
            responseJson.status === 200 ? alert("Given name was changed to " + given_name) :
            alert("Given name could not change to " + given_name + "   ,please try later.") 
            })
            .catch((error) => {
                console.log(error);
            })

    }

    async set_sta_names (controller,device_mac,given_name) {
        let new_device = device_mac.substring(0,17)
        const MyToken = await AsyncStorage.getItem('@auth_token');
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', MyToken);
        return fetch(UPDATE_STA_GNAME, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(
                {
                    cID: controller.toString(),
                    macAddress:new_device.toString(),
                    givenName: given_name.toString(),
                })
        }).then((responseJson)=> {
                responseJson.status === 200 ? alert("Given name was changed to " + given_name) :
                alert("Given name could not change to " + given_name + "   ,please try later.") 
        
        })
            .catch((error) => {
                console.log(error);
            })

    }
    
    


    async getTopologyData  () {
        const IdToken = await AsyncStorage.getItem('@auth_token');
        const cID = this.state.single_controller === true ? this.state.cSource : this.state.user_role === "user" ? this.state.contValue : this.state.inputValue;
        if((cID === undefined || cID === "") && this.state.is_mounted === true)
        {
            alert("Please Select Mac Address..")
        }
        else
        {
            await fetch(TOPOLOGY_INFO + cID, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": IdToken,
                },
            }).then(response=> response.status === 200 ? response.json() : null)
                .then((responseJson)=>
                {
                    let topology11 = responseJson.topologyInfo;
                    let topologyStat = responseJson.topologyStats;
                    let topology_time = "( " + moment.utc(new Date()).local().format('YYYY-MM-DD HH:mm:ss') +")";
                    //console.log("topology1 :        " + JSON.stringify(topology11))
                    //console.log("topologystat:      " + JSON.stringify(topologyStat));
                    //let GateWay =  JSON.stringify(responseJson.TopologyInfo.lookupInfo);

                    let topology = topology11.sort(function (a,b) {
                        if(a.nodeType === "GW" && (b.nodeType === "Root" || b.nodeType === "Extender" || b.nodeType === "STA"))
                        {
                            return -1;
                        }
                        if(a.nodeType === "Root" && (b.nodeType === "Extender" || b.nodeType === "STA"))
                        {
                            return -1;
                        }
                        if(a.nodeType === "Extender" &&  b.nodeType === "STA")
                        {
                            return -1;
                        }
                        if(a.nodeType === "STA")
                        {
                            return 1;
                        }
                        return 0;
                    })

                    this.setState({
                        topology: <Topology
                                    topology_information={topology}
                                    topology_stat={topologyStat}
                                    topology_id={"live"}
                                    topology_time={topology_time}
                                />
                    })
                }).catch((error)=>
                    console.log(error));

        }

    }



    async functionCombined()
    {
        this.setState({
            refreshPage:[],
            topology:[],
            modal_views:[],
            ap_mac_list:[],
            sta_mac_list:[],
        })
        this.set_modal_views();
        this.getTopologyData();
    }


    render() {

        let ap_mac_list = this.state.ap_mac_list.map((val,key) =>{
            return (

                <Picker.Item label={val} value={val} key={key}/>

            )
        })
        let sta_mac_list = this.state.sta_mac_list.map((val,key) =>{
            return (

                <Picker.Item label={val} value={val} key={key}/>

            )
        })
        if (this.state.isLoading) {
            return (
                    <View style={{flex: 1, backgroundColor: "#262d3c"}}>
                        <View style={{flex:0.5}}>
                            <ActivityIndicator animating={true} color={'#fff'} style={{flex:1}} size={"large"} />
                            <Text style={{color:'#fff',marginLeft:"40%"}}>Loading...</Text>
                        </View>
                    </View>
            )
        }

    else
        { let cSrc = this.state.cSource.map((val, key, array) => {
            return (

                <Picker.Item label={val} value={val} key={key}/>

            )
        });
            return (
                <View style={{alignItems: 'center', backgroundColor: "#262d3c",flex:1}}>

                    {this.state.single_controller === true ? <View/> : this.state.user_role === "user" ? <View style={{flexDirection: "row",marginTop: "1%"}}>
                        <View style={{backgroundColor: '#2196F3',padding:5,borderWidth:1,borderColor:'#2196F3',borderRadius:5}}>
                        <Picker style={{height: 35, width: 207, color: "#fff", borderRadius: 12}}
                                accessibilityValue={true}
                                selectedValue={this.state.contValue} onValueChange={this.updateTopology}
                        >
                            <Picker.Item label={"Select Mac Address"} value={''} key={''}/>
                            {cSrc}
                        </Picker>
                        </View>
                        <View style={{paddingLeft:"5%",paddingTop:"2%"}}>
                            <Button title={"TOPOLOGY"} onPress={() => this.functionCombined()}/>
                        </View>
                    </View> :<View>
        <TextInputMask
            onEndEditing={(e) => {
                let mac = e.nativeEvent.text.toLowerCase()
                this.setState({
                    inputValue:mac
                })
                this.functionCombined()  
            }}
            placeholder={"Type Mac..."}
            placeholderTextColor={'#fff'}
            mask={"[__]:[__]:[__]:[__]:[__]:[__]"}
            style={{backgroundColor:'#353f53',color:'#fff',width:150,borderRadius:10,fontWeight:"bold",marginTop:'1%'}}
            onSubmitEditing={(e) => {
                let mac = e.nativeEvent.text.toLowerCase()
                this.setState({
                    inputValue:mac
                })
                this.functionCombined()  
            }}
            mask={"[__]:[__]:[__]:[__]:[__]:[__]"}
        />
    </View>
                        }
                    {this.state.current_events}
                    <View style={{height:this.state.isCurrentEvent ? '85%' : this.state.user_role !== "user" ? '90%' :'100%',width:'100%',alignSelf:'center',alignItems:'center'}}>
                    {this.state.topology}
                
                    <View style={{flexDirection:"row",marginTop:'1%',justifyContent:"space-between",width:'96%'}}>
                        {this.state.modal_is_open ? <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",marginRight:'5%',backgroundColor:"#353f53",borderWidth:1,borderColor:'#353f53',borderRadius:5}}>
                            <View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={this.state.auto_refresh === true ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            value={this.state.auto_refresh}
                            onValueChange={() => {
                                !this.state.auto_refresh === true ? alert("Page will be reloaded in every minute!") : '';
                                this.auto_refresh(!this.state.auto_refresh);
                                this.auto_refresh_activating(!this.state.auto_refresh);
                            }}
                        />
                            </View>
                        <TouchableOpacity onPress={()=>this.functionCombined()}>
                            <View style={{backgroundColor:"#2196F3",borderRadius:5,borderColor:"#2196f3",borderWidth:1,}}>
                                <IIcon name="refresh" color={'white'} size={25} />
                            </View>
                        </TouchableOpacity>
                        </View>:<View></View>}



                        {this.state.modal_views}
                    </View>
                    </View>

                    <Modalize
                        ref={this.home_modal}
                        adjustToContentHeight={true}

>
                        <View style={style.modal_view}>
                            <View style={style.modal_under_view}>
                                <Text style={style.first_text}>HOME INFO</Text>
                                <View style={{flexDirection:'row', justifyContent: 'space-between',marginTop:5}}>
                                    <View style={{marginLeft:15}} >
                                        <Text style={{color:'#fff',}}><IIcon name="power" color={'white'} size={16} />Status:</Text>
                                        <Text style={{color:'#fff'}}><IIcon name="wifi" color={'white'} size={16}  />MAC Address:</Text>
                                        <Text style={{color:'#fff'}}><IIcon name="ip" color={'white'} size={16} />IP:</Text>
                                        <Text style={{color:'#fff'}}><IIcon name="timer-outline" color={'white'} size={16}  />Last Seen Time:</Text>
                                        <Text style={{color:'#fff'}}><IIcon name="map-marker" color={'white'} size={16} />Location:</Text>
                                        <Text style={{color:'#fff',}}><IIcon name="rocket-launch-outline" color={'white'} size={16} />TEApot Controller Version:</Text>
                                        <Text style={{color:'#fff'}}><IIcon name="google-cloud" color={'white'} size={16}  />Cloud Daemon Version:</Text>
                                        <Text style={{color:'#fff',}}><IIcon name="timer-outline" color={'white'} size={16} />Last Report Time:</Text>
                                        <Text style={{color:'#fff'}}><IIcon name="timer-outline" color={'white'} size={16}  />Last Data Time:</Text>
                                        <Text style={{color:'#fff'}}><IIcon name="information" color={'white'} size={16}  />Root Pod Up Time:</Text>
                                        <Text style={{color:'#fff'}}><IIcon name="information" color={'white'} size={16}  />TEApot Up Time:</Text>
                                    </View>
                                    <View style={{marginRight:35}}>
                                        <Text style={{color:'#fff',fontWeight:"bold"}}> {this.state.status} </Text>
                                        <Text style={{color:'#fff',fontWeight:"bold"}}> {this.state.mac_address}</Text>
                                        <Text style={{color:'#fff',fontWeight:"bold"}}> {this.state.ip_address}</Text>
                                        <Text style={{color:'#fff',fontWeight:"bold"}}> {moment.utc(this.state.last_seen).local().format('YYYY-MM-DD HH:mm:ss')}</Text>
                                        <Text style={{color:'#fff',fontWeight:"bold"}}> {this.state.country}-{this.state.region}-{this.state.city}</Text>
                                        <Text style={{color:'#fff',fontWeight:"bold"}}> {this.state.cVersion} </Text>
                                        <Text style={{color:'#fff',fontWeight:"bold"}}> {this.state.cdVersion}</Text>
                                        <Text style={{color:'#fff',fontWeight:"bold"}}> {moment.utc(this.state.last_report_time).local().format('YYYY-MM-DD HH:mm:ss')} </Text>
                                        <Text style={{color:'#fff',fontWeight:"bold"}}> {moment.utc(this.state.last_data_time).local().format('YYYY-MM-DD HH:mm:ss')}</Text>
                                        <Text style={{color:'#fff',fontWeight:"bold"}}> {this.convertSecondstoDate(this.state.device_up_time)}</Text>
                                        <Text style={{color:'#fff',fontWeight:"bold"}}> {this.convertSecondstoDate(this.state.teapot_up_time)}</Text>
                                    </View>
                                </View>

                            </View>
                        </View>




                    </Modalize>



<Modalize ref={this.events_modal}
adjustToContentHeight={true}>

    <View style={style.events_modal_view}>
        <View style={style.events_modal_under_view}>
            <Text style={style.first_text}>EVENTS</Text>
            <ScrollView>
            <View style={{marginBottom:50}}>
                <Table>
                <Row data={this.state.tableHead} style={style.title} widthArr={[Dimensions.get("window").width/4.25,Dimensions.get("window").width/2.85,Dimensions.get("window").width/4.75,Dimensions.get("window").width/6.50]}
                     textStyle={style.text}/>
                    {
                        this.state.events_data.map((rowData, index) => (
                            <View key={index}>
                            <TouchableOpacity onPress={() => this.showAlert(rowData,index)}>
                            <Row
                                key={index}
                                data={rowData.slice(0,4)}
                                style={style.row}
                                textStyle={style.text}
                                widthArr={[(Dimensions.get("window").width/4.25),(Dimensions.get("window").width/2.85),(Dimensions.get("window").width/4.75),(Dimensions.get("window").width/6.50)]}
                            />
                            </TouchableOpacity>
                            </View>
                        ))

                    }
                    <AwesomeAlert
                        show={this.state.showAlert}
                        showProgress={true}
                        title="DETAILS"
                        customView={<View style={{justifyContent:'space-between',flexDirection:"row",}}>
                                <View>
                                    <Text><IIcon name="timer-outline" color={'white'} size={16}  />Seen:</Text>
                                    <Text><IIcon name="timer-outline" color={'white'} size={16} />Count:</Text>
                                    <Text><IIcon name="information" color={'white'} size={16}  />Event:</Text>

                                </View>
                                <View>
                                    {this.state.events_detail_array.slice(4,7).map((item,key) =>(
                                        <Text key={key} style={{fontWeight:"bold",flexShrink:1}}>{item}</Text>
                                    ))}
                                </View>
                            </View>}
                        closeOnTouchOutside={true}
                        closeOnHardwareBackPress={false}
                        showCancelButton={true}
                        cancelText="X"
                        confirmButtonColor="#DD6B55"
                        onCancelPressed={() => {
                            this.hideAlert();
                        }}
                        onConfirmPressed={() => {
                            this.hideAlert();
                        }}
                    />
                </Table>
            </View>
        </ScrollView>
        </View>
    </View>
</Modalize>
                    
<Modalize
ref={this.ap_modal}
adjustToContentHeight={true}>
<View style={style.modal_view}>
<View style={[style.modal_under_view,{flex:0.50}]}>
<Text style={style.first_text}>AP INFO</Text>
<Picker style={{height: 35, width: 287, color: "#fff", borderRadius: 12,alignSelf:"center"}}
accessibilityValue={true}
selectedValue={this.state.ap_mac_value} onValueChange={(itemValue)=>{
this.get_ap_modal_list(itemValue).then(()=> this.setState({
ap_mac_value:itemValue}))
}}
>
<Picker.Item label={"Select Device"} value={''} key={''}/>
{ap_mac_list}
</Picker>

<View style={{flexDirection:'row', justifyContent: 'space-between',marginTop:5,marginBottom:50}}>
<View style={{marginLeft:25,marginTop:3}} >
<Text style={style.first_text}>Friendly Name:</Text>
<Text style={{color:'#fff',marginTop:15}}><IIcon name="access-point-network" color={'white'} size={16}  />SSID (5 GHz):</Text>
<Text style={{color:'#fff',}}><IIcon name="access-point-network" color={'white'} size={16} />SSID (2.4 GHz):</Text>
<Text style={{color:'#fff',}}><IIcon name="sine-wave" color={'white'} size={16} />Channel(5 GHz):</Text>
<Text style={{color:'#fff',}}><IIcon name="sine-wave" color={'white'} size={16} />Channel(2.4 GHz):</Text>
<Text style={{color:'#fff',}}><IIcon name="router-wireless-settings" color={'white'} size={16} />Configuration:</Text>
<Text style={{color:'#fff',}}><IIcon name="rocket-launch-outline" color={'white'} size={16} />IP:</Text>
<Text style={{color:'#fff',}}><IIcon name="lan-connect" color={'white'} size={16} />Connection Type:</Text>


</View>
<View style={{marginRight:35}}>
<TextInput
style={[style.friendly_text_input,{marginBottom:14}]}
editable={true}
onEndEditing={e => {
    let ap_name = e.nativeEvent.text
    this.setState({
    ap_given_name:ap_name,
    })
    this.set_ap_name((this.state.single_controller === true ? this.state.cSource : this.state.user_role === "user" ? this.state.contValue : this.state.inputValue),
    this.state.ap_mac_value,ap_name)
}}
placeholder={this.state.ap_given_name}
placeholderTextColor={'#100f0f'}
/>
{this.state.ap_info_list.map((item,key) => (
<Text key={key} style={{color:'#ffffff',fontWeight:"bold"}}>{item}</Text>
))}
</View>
</View>
<View style={[style.modal_close_button,{flexDirection:'row'}]}>
</View>
</View>
</View>
</Modalize>

    <Modalize 
    ref={this.clients_modal}
    adjustToContentHeight={true}>
    <View style={style.modal_view}>
    <View style={[style.modal_under_view,{flex:0.60}]}>
    <Text style={style.first_text}>CLIENT INFO</Text>
    <Picker style={{height: 35, width: 287, color: "#fff", borderRadius: 12,alignSelf:"center"}}
    accessibilityValue={true}
    selectedValue={this.state.sta_mac_value} onValueChange={(itemValue)=>{
    this.get_sta_modal_list(itemValue).then(()=> this.setState({
    sta_mac_value:itemValue}))
    }}
    >
    <Picker.Item label={"Select Device"} value={''} key={''}/>
    {sta_mac_list}
    </Picker>

    <View style={{flexDirection:'row', justifyContent: 'space-between',marginTop:5,marginBottom:50}}>
    <View style={{marginLeft:25,marginTop:3}} >
    <Text style={style.first_text}>Friendly Name:</Text>
    <Text style={{color:'#fff',marginTop:15}}><IIcon name="wifi" color={'white'} size={16}  />MAC ID:</Text>
    <Text style={{color:'#fff',}}><IIcon name="ip" color={'white'} size={16} />LAN IP:</Text>
    <Text style={{color:'#fff',}}><IIcon name="router-wireless" color={'white'} size={16} />Capability (2.4 GHz):</Text>
    <Text style={{color:'#fff',}}><IIcon name="router-wireless" color={'white'} size={16} />Capability (5 GHz):</Text>
    <Text style={{color:'#fff',}}><IIcon name="timer-outline" color={'white'} size={16}  />Last Seen:</Text>
    <Text style={{color:'#fff',}}><IIcon name="rss" color={'white'} size={16} />RSSI:</Text>
    <Text style={{color:'#fff',}}><IIcon name="download" color={'white'} size={16} />Downlink:</Text>
    <Text style={{color:'#fff',}}><IIcon name="upload" color={'white'} size={16} />Uplink:</Text>
    <Text style={{color:'#fff',}}><IIcon name="network-outline" color={'white'} size={16} />AP Connections:</Text>

    </View>
    <View style={{marginRight:35}}>
    <TextInput
    style={[style.friendly_text_input,{width:150,marginBottom:14}]}
    editable={true}
    onEndEditing={e => {
    let sta_name = e.nativeEvent.text;
    this.setState({
    sta_given_name:sta_name,
    
    })
    this.set_sta_names((this.state.single_controller === true ? this.state.cSource : this.state.user_role === "user" ? this.state.contValue : this.state.inputValue)
        ,this.state.sta_mac_value,sta_name)
    }}
    placeholder={this.state.sta_given_name}
    placeholderTextColor={'#100f0f'}
    />
    {this.state.sta_info_list.map((item,key) => (
    <Text key={key} style={{color:'#ffffff',fontWeight:"bold"}}>{item}</Text>
    ))}
    </View>
    </View>
    <View style={[style.modal_close_button,{flexDirection:'row'}]}>
    </View>
    </View>
    </View>
    </Modalize>




                </View>



            );

        }
    }
}

const style = {
    modal_view: {
        backgroundColor: '#353f53',
        justifyContent: 'center',
    },
    modal_under_view: {
        backgroundColor: '#353f53',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'rgba(139,136,136,0.8)'
    },
    modal_buttons:{
        backgroundColor:'#2196F3',
        borderRadius:15,
        padding:(9,8,9,8),

    },
    modal_button_texts:{
        color:'#fff',
        fontFamily:"Roboto",
        fontWeight:"bold",
        textShadowColor:'#135184',
        fontSize:15,
        //textShadowRadius:30,
    },
    modal_close_button:
        {
            position:"absolute",
            bottom:0,
            alignSelf:"center"
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

    events_modal_view: {
        backgroundColor: '#353f53',
        },
    events_modal_under_view:{
        backgroundColor: '#353f53',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'rgba(139,136,136,0.8)',
        padding:10,
    },
    head: {
        height: 40,
        fontStyle: 'italic',
        fontFamily:"Roboto",
    },
    text: {
        color:'#fff',
        fontWeight:'bold',
        margin:5},
    row: {
        flexDirection: 'row',
        borderColor: 'rgba(139,136,136,0.8)',
        borderRadius:5,
        borderWidth:1,
        marginTop:2},
    friendly_text_input:{
        height: 40,
        width: 200,
        borderColor: 'gray',
        fontFamily:"Roboto",
        fontWeight:"bold",
        borderWidth: 1,
        borderRadius: 5,

        color:'#474343',
        backgroundColor:'#E8F0FE',
        fontSize:18,
    },
}



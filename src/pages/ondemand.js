import React from "react";
import {
ActivityIndicator,
Button,
Dimensions,
LogBox,
Modal,
ScrollView,
StyleSheet,
Text, TextInput,
TouchableOpacity,
View,
} from "react-native";
import {
CID_URL, EVENTS_INFO, HEALTH_INFO,
HIGHLIGHT_INFO, HOME_INFO, LATEST_AP, LATEST_STA,
NODE_INFO, ON_DEMAND_AP, ON_DEMAND_EVENTS_INFO, ON_DEMAND_HEALTH_INFO, ON_DEMAND_HOME_INFO, ON_DEMAND_STA,
ON_DEMAND_TOPOLOGY,
SCORES_URL,
TOPOLOGY_INFO, UPDATE_AP_GNAME,UPDATE_STA_GNAME,
VENDOR_INFO
} from "../../secrets";
import AsyncStorage from '@react-native-community/async-storage';
import {TabView,TabBar} from 'react-native-tab-view';
import {Card} from '../components/card';
import {ECharts} from "react-native-echarts-wrapper";
import IIcon from "react-native-vector-icons/MaterialCommunityIcons";
import DatePicker from 'react-native-date-picker'
import moment from "moment-timezone";
import * as math from "mathjs";
import {Row, Table} from "react-native-table-component";
import AwesomeAlert from "react-native-awesome-alerts";
import {Picker} from "@react-native-community/picker";
import Topology from "../components/topology";
import TextInputMask from 'react-native-text-input-mask';
import {Modalize} from "react-native-modalize";

export default class OnDemand extends React.Component {

constructor(props) {
super(props);
global.__classOnDemandThis = this;
this.state = {
isLoading: true,
user_role:"",
cValue:'',
contValue: '',
inputValue:'',
controller_array: [],
single_controller: '',
chart_array: [],
network_chart:[],
client_chart:[],
coverage_chart:[],
interference_chart:[],
interference5_chart:[],

//Overview
pie_chart_array:[],
vendor_chart:[],

date_time_visible:false,
time_value: this.maximum_date(),

card_array: [],
//
time_picker: [],
selected_time: '',
isDatePickerVisible: false,
isTimePickerVisible: false,
graph_chart_array: [],
index: 0,
routes: [
{key: 'highlights', title: 'HIGHLIGHTS'},
{key: 'overview', title: 'OVERVIEW'},
{key: 'topology', title: 'TOPOLOGY'},

],


//TOPOLOGY
topology:[],
topology_information:[],
topology_last_seen:'',
data_node:'',
link_data:'',
topologyStat:'',

//MODAL
modal_views:[],
home_info_visible:false,
ap_visible:false,
sta_visible:false,
events_visible:false,

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
}

}

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

updateValue = (contValue) => {
this.setState({ contValue: contValue })
}

display_home_info_modal(show){
this.setState({home_info_visible: show})
}
display_ap_modal(show){
this.setState({ap_visible: show})
}
display_sta_modal(show){
this.setState({sta_visible: show})
}
display_events_modal(show){
this.setState({events_visible: show})
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



async componentDidMount() {
//LogBox.ignoreLogs(['Animated: `useNativeDriver`'],['Warning: `Failed prop type`']);
//LogBox.ignoreAllLogs();
LogBox.ignoreLogs(["Warning: Failed prop type: Invalid prop `minuteInterval` of value `60` supplied to `DatePickerAndroid`, expected one of [1,2,3,4,5,6,10,12,15,20,30]."]);
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
.then((response) => response.status === 200 ? response.json() : '')
.then((responseJson) => {
let controllers = responseJson.homePopulation.data
let single_controller = false;
controllers.map((val) => {
this.state.controller_array.push(val.controllerId)
})
this.state.controller_array.length === 1 ? single_controller = true : single_controller = false;
this.setState({
isLoading: false,
single_controller: single_controller,
})
if(this.state.single_controller) {
this.setState({
    cValue:this.state.controller_array[0]
})
this.functions_combined();
}
}).catch((error) => {
console.log(error);
})
}
else if(this.state.user_role === "super" || this.state.user_role === "group")
{
this.setState({
isLoading:false,
single_controller:false,
})
}

}

//-------------- HIGHLIGHTS TAB ---------------//
// PROGRESS BAR
create_progress_chart = (name, center_first, value, data_name) => {
let chart = {
name: name,
center: [center_first, '55%'],
data: [{
value: value,
name: data_name,
}],
title: option_styles.title,
type: option_styles.type,
itemStyle: option_styles.itemStyle,
progress: option_styles.progress,
detail: option_styles.detail,
axisLine: option_styles.axisLine,
pointer: option_styles.pointer,
axisTick: option_styles.axisTick,
axisLabel: option_styles.axisLabel,
splitLine: option_styles.splitLine,
};
return chart
}
async get_scores(time_value) {
this.setState({
network_chart: [],
client_chart:[],
coverage_chart:[],
interference_chart:[],
interference5_chart:[],
graph_chart_array:[]})
let start_hour = moment(time_value).format("YYYY-MM-DDTHH:mm").toString();
let last_hour  = moment(time_value).add(1,"hour").format("YYYY-MM-DDTHH:00").toString()
const MyToken = await AsyncStorage.getItem('@auth_token');
const myHeaders = new Headers();
const controllerID = this.state.single_controller === true ? this.state.cValue : this.state.user_role === "user" ? this.state.contValue : this.state.inputValue;
let date_url = "?startdate="+start_hour+"&enddate="+last_hour+"&interval=hourly";
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('Authorization', MyToken);

return fetch(SCORES_URL + controllerID + date_url, {
method: 'GET',
headers: myHeaders,

})
.then((response) => response.status === 200 ? response.json() : '')
.then((responseJson) => {
//"?startdate=2021-02-16T17:00&enddate=2021-02-16T18:00&interval=hourly"
let score_list = responseJson.scoresStatus;
let network_score = responseJson.scoresStatus[0].networkScores.score;
let coverage_score = responseJson.scoresStatus[0].coverageScores.score;
let client_score = responseJson.scoresStatus[0].clientScores.score;
let interference_score = responseJson.scoresStatus[0].interferenceScores.score;
let interference5_score = responseJson.scoresStatus[0].interferenceScores5.score;

let network_node = []
let client_node = []
let coverage_node = []
let interference_node = []
let interference5_node = []
score_list.map((item) => {
if (item.networkScores) {
network_node.push(this.create_progress_chart("Network", "50%", network_score, "NETWORK"));
}

if (item.clientScores) {
client_node.push(this.create_progress_chart("Client", "50%", client_score, "CLIENT"))
}
if (item.coverageScores) {
coverage_node.push(this.create_progress_chart("Coverage", "50%", coverage_score, "COVERAGE"))
}
if (item.interferenceScores) {
interference_node.push(this.create_progress_chart("Interference", "50%", interference_score, "INTERFERENCE 2.4"))

}
if (item.interferenceScores5) {
interference5_node.push(this.create_progress_chart("Interference5", "50%", interference5_score, "INTERFERENCE 5"))
}


})

this.setState({
network_chart: network_node,
client_chart:client_node,
coverage_chart:coverage_node,
interference_chart:interference_node,
interference5_chart:interference5_node,
})

let network_option = {
tooltip: option_styles.tooltip,
series: this.state.network_chart,
};
let client_option = {
tooltip: option_styles.tooltip,
series: this.state.client_chart,
}
let coverage_option = {
tooltip: option_styles.tooltip,
series: this.state.coverage_chart,
}
let interference_option ={
tooltip: option_styles.tooltip,
series: this.state.interference_chart,
}
let interference5_option = {
tooltip: option_styles.tooltip,
series: this.state.interference5_chart,
}

this.setState({
graph_chart_array: <ScrollView contentContainerStyle={{marginTop:"1%"}}  horizontal={true}>
<View style={styles.graph_array}>
    <ECharts
        option={network_option}
        backgroundColor={'#353f53'}
    />
</View>
<View style={styles.graph_array}>
    <ECharts
        option={client_option}
        backgroundColor={'#353f53'}
    />
</View>
<View style={styles.graph_array}>
    <ECharts
        option={coverage_option}
        backgroundColor={'#353f53'}
    />
</View>
<View style={styles.graph_array}>
    <ECharts
        option={interference_option}
        backgroundColor={'#353f53'}
    />
</View>
<View style={styles.graph_array}>
    <ECharts
        option={interference5_option}
        backgroundColor={'#353f53'}
    />
</View>
</ScrollView>
})
})
.catch((error) => {
console.log(error);
})

}

//HIGHLIGHTS
async get_highlights(time_value) {
let start_hour = moment(time_value).format("YYYY-MM-DDTHH:mm").toString();
let last_hour  = moment(time_value).add(1,"hour").format("YYYY-MM-DDTHH:00").toString()
let date_url = "?startdate="+start_hour+"&enddate="+last_hour+"&interval=hourly"
const MyToken = await AsyncStorage.getItem('@auth_token');
const myHeaders = new Headers();
const controllerID = this.state.single_controller === true ? this.state.cValue : this.state.user_role === "user" ? this.state.contValue : this.state.inputValue;
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('Authorization', MyToken);
return fetch(HIGHLIGHT_INFO + controllerID + date_url, {
method: 'GET',
headers: myHeaders,
})
.then((response) => response.status === 200 ? response.json() : '')
.then((responseJson) => {
//CARD CONTENTS

let fastest_client = responseJson.highlightInfo[0].info.fastestClient?.givenName !== undefined ? responseJson.highlightInfo[0].info.fastestClient?.givenName.toString() :
(responseJson.highlightInfo[0].info.fastestClient?.friendlyName !== undefined ? responseJson.highlightInfo[0].info.fastestClient?.friendlyName
: (responseJson.highlightInfo[0].info.fastestClient?.macAddress !== undefined ? responseJson.highlightInfo[0].info.fastestClient?.macAddress : '-'))


let fastest_client_text = responseJson.highlightInfo[0].info.fastestClient !== undefined ? (responseJson.highlightInfo[0].info.fastestClient?.rate?.toString() + " " +
responseJson.highlightInfo[0].info.fastestClient?.rateUnit?.toString()) : '-'

let most_mobile_client = responseJson.highlightInfo[0].info.mostMobileClient?.givenName !== undefined ? responseJson.highlightInfo[0].info.mostMobileClient?.givenName?.toString() :
(responseJson.highlightInfo[0].info.mostMobileClient?.friendlyName ? responseJson.highlightInfo[0].info.mostMobileClient?.friendlyName
: (responseJson.highlightInfo[0].info.mostMobileClient?.macAddress ? responseJson.highlightInfo[0].info.mostMobileClient?.macAddress : '-' ))

let most_mobile_client_text = responseJson.highlightInfo[0].info.mostMobileClient?.score !== undefined ? "Score:" + responseJson.highlightInfo[0].info.mostMobileClient?.score?.toString() : '-'

let least_mobile_client = responseJson.highlightInfo[0].info.leastMobileClient?.givenName !== undefined ?
responseJson.highlightInfo[0].info.leastMobileClient.givenName : (responseJson.highlightInfo[0].info.leastMobileClient.friendlyName ? responseJson.highlightInfo[0].info.leastMobileClient.friendlyName
: responseJson.highlightInfo[0].info.leastMobileClient.macAddress)

let least_mobile_client_text = responseJson.highlightInfo[0].info.leastMobileClient !== undefined ?  "Score:" + responseJson.highlightInfo[0].info.leastMobileClient?.score : '-';

let heaviest_downloader = responseJson.highlightInfo[0].info.heaviestDownloader?.givenName !== undefined ? responseJson.highlightInfo[0].info.heaviestDownloader.givenName :
(responseJson.highlightInfo[0].info.heaviestDownloader?.friendlyName ? responseJson.highlightInfo[0].info.heaviestDownloader?.friendlyName
: (responseJson.highlightInfo[0].info.heaviestDownloader?.macAddress !== undefined ? responseJson.highlightInfo[0].info.heaviestDownloader?.macAddress : '-'))

let heaviest_downloader_text = responseJson.highlightInfo[0].info.heaviestDownloader !== undefined ? (responseJson.highlightInfo[0].info.heaviestDownloader.traffic?.toString() + "   " + responseJson.highlightInfo[0].info.heaviestDownloader.trafficUnit?.toString()) : '-';

let most_utilized_interface = responseJson.highlightInfo[0].info.mostUtilizedInterface?.givenName  !== undefined ? responseJson.highlightInfo[0].info.mostUtilizedInterface.givenName?.toString() :(responseJson.highlightInfo[0].info.mostUtilizedInterface.friendlyName ? responseJson.highlightInfo[0].info.mostUtilizedInterface.friendlyName
: (responseJson.highlightInfo[0].info.mostUtilizedInterface.macAddress !== undefined ? responseJson.highlightInfo[0].info.mostUtilizedInterface.macAddress : '-'))

let most_utilized_text = responseJson.highlightInfo[0].info.mostUtilizedInterface !== undefined ? [responseJson.highlightInfo[0].info.mostUtilizedInterface.type?.toString(),responseJson.highlightInfo[0].info.mostUtilizedInterface.givenName?.toString(),responseJson.highlightInfo[0].info.mostUtilizedInterface.score] : '-'

let least_utilized_interface = responseJson.highlightInfo[0].info.leastUtilizedInterface?.givenName !== undefined ?
responseJson.highlightInfo[0].info.leastUtilizedInterface.givenName : (responseJson.highlightInfo[0].info.leastUtilizedInterface.friendlyName ? responseJson.highlightInfo[0].info.leastUtilizedInterface.friendlyName
: (responseJson.highlightInfo[0].info.leastUtilizedInterface.macAddress !== undefined ? responseJson.highlightInfo[0].info.leastUtilizedInterface.macAddress :'-'));

let least_utilized_text = responseJson.highlightInfo[0].info.leastUtilizedInterface !== undefined ?
[responseJson.highlightInfo[0].info.leastUtilizedInterface.type?.toString(),responseJson.highlightInfo[0].info.leastUtilizedInterface.apInfo.givenName?.toString(), responseJson.highlightInfo[0].info.leastUtilizedInterface.score] : '-'

this.setState({
card_array: <View style={{
flexDirection: "row",
flex: 0.62,
justifyContent: "space-around",
}}>
<View>
    <Card style={styles.success_theme}>
        <View style={styles.card_content_view}>
            <View style={styles.card_title_view}>
                <Text style={styles.card_title}>FASTEST CLIENT</Text>
            </View>
            <View style={styles.card_icon}>
                <IIcon name={"rocket-launch-outline"} color='#fff' size={30}/>
            </View>
        </View>
        <View style={styles.card_content_head}>
            <Text style={styles.card_content_device}>{fastest_client ? fastest_client : ''}</Text>
            <Text style={styles.card_content_text}>{fastest_client_text ? fastest_client_text : ''}</Text>
        </View>
    </Card>
    <Card>
        <View style={styles.card_content_view}>
            <View style={styles.card_title_view}>
                <Text style={styles.card_title}>MOST MOBILE</Text>
                <Text style={styles.card_title}>CLIENT</Text>
            </View>
            <View style={styles.card_icon}>
                <Text><IIcon name={"airplane-takeoff"} color='#fff' size={30}/></Text>
            </View>
        </View>
        <View style={styles.card_content_head}>
            <Text style={styles.card_content_device}>{most_mobile_client ? most_mobile_client : ''}</Text>
            <Text style={styles.card_content_text}>{most_mobile_client_text ? most_mobile_client_text : ''}</Text>
        </View>
    </Card>

    <Card style={styles.danger_theme}>
        <View style={styles.card_content_view}>
            <View style={styles.card_title_view}>
                <Text style={styles.card_title}>MOST IMMOBILE</Text>
                <Text style={styles.card_title}>DEVICE</Text>
            </View>
            <View style={styles.card_icon}>
                <Text><IIcon name={"stop-circle-outline"} color='#fff' size={30}/></Text>
            </View>
        </View>
        <View style={styles.card_content_head}>
            <Text style={styles.card_content_device}>{least_mobile_client ? least_mobile_client : ''}</Text>
            <Text style={styles.card_content_text}>{least_mobile_client_text ? least_mobile_client_text : ''}</Text>
        </View>
    </Card>


</View>

<View>
    <Card>
        <View style={styles.card_content_view}>
            <View style={styles.card_title_view}>
                <Text style={styles.card_title}>HEAVIEST</Text>
                <Text style={styles.card_title}>DOWNLOADER</Text>
            </View>
            <View style={styles.card_icon}>
                <Text><IIcon name={"download"} color='#fff' size={30}/></Text>
            </View>
        </View>
        <View style={styles.card_content_head}>
            <Text style={styles.card_content_device}>{heaviest_downloader ? heaviest_downloader : ''}</Text>
            <Text style={styles.card_content_text}>{heaviest_downloader_text ? heaviest_downloader_text : ''}</Text>
        </View>
    </Card>

    <Card style={styles.danger_theme}>
        <View style={styles.card_content_view}>
            <View style={styles.card_title_view}>
                <Text style={styles.card_title}>LEAST UTILIZED</Text>
                <Text style={styles.card_title}>INTERFACE</Text>
            </View>
            <View style={styles.card_icon}>
                <Text><IIcon name={"wifi-strength-1"} color='#fff' size={30}/></Text>
            </View>
        </View>
        <View style={styles.card_content_head}>
            <Text style={styles.card_content_device}>{least_utilized_interface ? least_utilized_interface : ''}</Text>
            <Text style={styles.card_content_text}>{least_utilized_text[0] ? least_utilized_text[0] : ''}</Text>
            <Text style={[styles.card_content_text,{marginTop:'10%'}]}>{least_utilized_text[1] ? least_utilized_text[1] : ''}</Text>
            <Text style={[styles.card_content_text,{marginTop:'20%'}]}>Score:{least_utilized_text[2] ? least_utilized_text[2] : ''}</Text>


        </View>
    </Card>

    <Card style={styles.success_theme}>
        <View style={styles.card_content_view}>
            <View style={styles.card_title_view}>
                <Text style={styles.card_title}>MOST UTILIZED</Text>
                <Text style={styles.card_title}>INTERFACE</Text>
            </View>
            <View style={styles.card_icon}>
                <Text><IIcon name={"wifi"} color='#fff' size={30}/></Text>
            </View>
        </View>
        <View style={styles.card_content_head}>
            <Text style={styles.card_content_device}>{most_utilized_interface ? most_utilized_interface : ''}</Text>
            <Text style={styles.card_content_text}>{most_utilized_text[0] ? most_utilized_text[0] : ''}</Text>
            <Text style={[styles.card_content_text,{marginTop:'10%'}]}>{most_utilized_text[1] ? most_utilized_text[1] : ''}</Text>
            <Text style={[styles.card_content_text,{marginTop:'20%'}]}>Score:{most_utilized_text[2] ? most_utilized_text[2] : ''}</Text>

        </View>
    </Card>

</View>
</View>

})
})
.catch((error) => {
console.log(error);
this.setState({
card_array: <View style={{
flexDirection: "row",
flex: 0.62,
justifyContent: "space-around",
}}>
<View>
    <Card style={styles.success_theme}>
        <View style={styles.card_content_view}>
            <View style={styles.card_title_view}>
                <Text style={styles.card_title}>FASTEST CLIENT</Text>
            </View>
            <View style={styles.card_icon}>
                <IIcon name={"rocket-launch-outline"} color='#fff' size={30}/>
            </View>
        </View>
    </Card>
    <Card>
        <View style={styles.card_content_view}>
            <View style={styles.card_title_view}>
                <Text style={styles.card_title}>MOST MOBILE</Text>
                <Text style={styles.card_title}>CLIENT</Text>
            </View>
            <View style={styles.card_icon}>
                <Text><IIcon name={"airplane-takeoff"} color='#fff' size={30}/></Text>
            </View>
        </View>
    </Card>

    <Card style={styles.danger_theme}>
        <View style={styles.card_content_view}>
            <View style={styles.card_title_view}>
                <Text style={styles.card_title}>MOST IMMOBILE</Text>
                <Text style={styles.card_title}>DEVICE</Text>
            </View>
            <View style={styles.card_icon}>
                <Text><IIcon name={"stop-circle-outline"} color='#fff' size={30}/></Text>
            </View>
        </View>
    </Card>


</View>

<View>
    <Card>
        <View style={styles.card_content_view}>
            <View style={styles.card_title_view}>
                <Text style={styles.card_title}>HEAVIEST</Text>
                <Text style={styles.card_title}>DOWNLOADER</Text>
            </View>
            <View style={styles.card_icon}>
                <Text><IIcon name={"download"} color='#fff' size={30}/></Text>
            </View>
        </View>
    </Card>

    <Card style={styles.danger_theme}>
        <View style={styles.card_content_view}>
            <View style={styles.card_title_view}>
                <Text style={styles.card_title}>LEAST UTILIZED</Text>
                <Text style={styles.card_title}>INTERFACE</Text>
            </View>
            <View style={styles.card_icon}>
                <Text><IIcon name={"wifi-strength-1"} color='#fff' size={30}/></Text>
            </View>
        </View>
    </Card>

    <Card style={styles.success_theme}>
        <View style={styles.card_content_view}>
            <View style={styles.card_title_view}>
                <Text style={styles.card_title}>MOST UTILIZED</Text>
                <Text style={styles.card_title}>INTERFACE</Text>
            </View>
            <View style={styles.card_icon}>
                <Text><IIcon name={"wifi"} color='#fff' size={30}/></Text>
            </View>
        </View>
    </Card>

</View>
</View>

})

})


}

//TIME FUNCTIONS
date_time_modal(show){
this.setState({date_time_visible: show})
}
return_date_title() {
return this.state.time_value.toString().slice(0, 10)
}
return_time_title() {
let new_date =  new Date().toString().slice(15,18);
let actual_hour = this.state.time_value.toString().slice(15, 18)
let new_hour = parseInt(actual_hour.slice(0,3)-1)
if(actual_hour === new_date)
{
return " " + new_hour + ":00"
}
else if(actual_hour === "00:00")
{
return "00:00";
}
else
{
return this.state.time_value.toString().slice(15, 21);
}
}
maximum_date()
{
let date = new Date();
date.setHours(date.getHours()-4);
return new Date(moment(date).format("YYYY-MM-DDTHH:00"));
}

create_time_picker(){
return <View style={{flex: 0.05}}>
<TouchableOpacity onPress={()=>{this.date_time_modal(true)}}>
<View style={styles.date_button}>
<Text style={{color:'#fff',fontWeight:"bold",fontSize:16,fontFamily:"Roboto"}}>{this.return_date_title()}{this.return_time_title()}</Text>
</View>
</TouchableOpacity>
<Modal
animationType={"none"}
transparent={true}
visible={this.state.date_time_visible}
onRequestClose={() => {
this.date_time_modal(false)
}}>
<View style={styles.date_modal_view}>
<View style={styles.date_modal_under_view}>
<Text style={styles.first_text}>DATE/TIME</Text>
<View>
    <DatePicker
        mode="datetime"
        date={this.state.time_value}
        onDateChange={(time)=>{
            this.state.time_value = time
        }
        }
        minuteInterval={60}
        androidVariant="iosClone"
        maximumDate={this.maximum_date()}
        style={{backgroundColor:'#262D3C',width:300,height:180,alignSelf:"center",marginTop:"1%"}}
        accessibilityIgnoresInvertColors={true}
        accessibilityComponentType={"button"}
        dividerHeight={10}
        textColor={'#fff'}
        fadeToColor={"#353F53"}

    />
</View>
<View style={[styles.modal_close_button,{flexDirection:'row'}]}>
    <Button title={"OK"}
            color={'#5ed2d1'}
            onPress={() =>{
                this.return_time_title();
                this.date_time_modal(false);
                this.functions_combined()
            }
            }
    />
</View>
</View>
</View>
</Modal>
</View>
}


//-------------- END - HIGHLIGHTS TAB - END ---------------//



//-------------- OVERVIEW TAB ---------------//
create_pie_chart_series = (chart_name,data) => {
let series = [{
name: chart_name,
data: data,
type: pie_option_styles.type,
center: pie_option_styles.center,
radius: pie_option_styles.radius,
avoidLabelOverlap: pie_option_styles.avoidLabelOverlap,
label: pie_option_styles.label,
highlight: pie_option_styles.highlight,
labelLine:pie_option_styles.labelLine,
animationType: pie_option_styles.animationType,
animationEasing: pie_option_styles.animationEasing,
animationDelay: function (idx) {
return Math.random() * 200;
}

}]
return series;
}


async get_pie_chart_info(time_value){
this.setState({pie_chart_array:<View>
<View style={{flexDirection:"row",justifyContent:"space-between",marginTop:'30%'}}>
<ActivityIndicator  animating={true} color={'#fff'} style={{flex: 1}} size={"large"} />
<ActivityIndicator  animating={true} color={'#fff'} style={{flex: 1}} size={"large"} />
</View>
<View style={{flexDirection:"row",justifyContent:"space-between",marginTop:'50%'}}>
<ActivityIndicator  animating={true} color={'#fff'} style={{flex: 1}} size={"large"} />
<ActivityIndicator  animating={true} color={'#fff'} style={{flex: 1}} size={"large"} />
</View>
</View>})
let start_hour = moment(time_value).format("YYYY-MM-DDTHH:mm").toString();
let last_hour  = moment(time_value).add(1,"hour").format("YYYY-MM-DDTHH:00").toString()
const MyToken = await AsyncStorage.getItem('@auth_token');
const myHeaders = new Headers();
const controllerID = this.state.single_controller === true ? this.state.cValue : this.state.user_role === "user" ? this.state.contValue : this.state.inputValue;
let date_url = "?startdate="+start_hour+"&enddate="+last_hour+"&interval=hourly";
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('Authorization', MyToken);
let vendor_option = {};
let con_type_option = {};
let protocol_option = {};
let antenna_option = {};
await fetch(VENDOR_INFO + controllerID + date_url, {
method: 'GET',
headers: myHeaders,

})
.then((response) => response.status === 200 ? response.json() : '')
.then((responseJson) => {
let vendor_array = [];
let vendor_series = [];
let vendor_data = responseJson.VendorInfo;
//console.log("response json vendor :         " + JSON.stringify(responseJson))
vendor_data[0].Info.forEach(item => {
vendor_array.push({ value: item.count,name: (item.name.length > 10 ? item.name.substring(0,(item.name.length > 6 ? 6 : item.name.length)) : item.name)})
})
vendor_series = this.create_pie_chart_series("Clients", vendor_array);
vendor_option = {
title: {
    text: "Clients by Vendor",
    bottom: '-2.5%',
    left: 'center',
    textStyle: {
        color: '#fff',
        fontSize: 13,
        fontWeight:"bold",
    },
},
tooltip: pie_option_styles.tooltip,
color: pie_option_styles.color,
legend: pie_option_styles.legend,
series: vendor_series,
}

})
.catch((error) => {
console.log(error);
})

await fetch(NODE_INFO + controllerID + date_url, {
method: 'GET',
headers: myHeaders,

})
.then((response) => response.status === 200 ? response.json() : '')
.then((responseJson) => {

let con_type_data = [{name:"Ethernet",value:responseJson.NodeInfo[0].Info.sta.ethernet?.total},{name:"2.4 GHz",value:responseJson.NodeInfo[0].Info.sta.wireless["24GHz"]},{name:"5 GHz",value:responseJson.NodeInfo[0].Info.sta.wireless["5GHz"]}]
let con_type_series = this.create_pie_chart_series("Connection Type",con_type_data);
con_type_option = {
title: {
text: "Clients by Connection Type",
bottom: '-2.5%',
left: 'center',
textStyle: {
    color: '#fff',
    fontSize: 13,
    fontWeight:"bold",
},
},
tooltip: pie_option_styles.tooltip,
color: pie_option_styles.color,
legend: pie_option_styles.legend,
series: con_type_series,
}

let protocol_data = [{name:"11ac",value: responseJson.NodeInfo[0].Info.sta.protocols["11ac"]},
{name:"11ax",value: responseJson.NodeInfo[0].Info.sta.protocols["11ax"]},
{name:"11b",value: responseJson.NodeInfo[0].Info.sta.protocols["11b"]},
{name:"11g",value: responseJson.NodeInfo[0].Info.sta.protocols["11g"]},
{name:"11n",value: responseJson.NodeInfo[0].Info.sta.protocols["11n"]}];
let protocol_series = this.create_pie_chart_series("Protocols",protocol_data)
protocol_option = {
title: {
text: "Clients by Protocol",
bottom: '-2.5%',
left: 'center',
textStyle: {
    color: '#fff',
    fontSize: 13,
    fontWeight:"bold",
},
},
tooltip: pie_option_styles.tooltip,
color: pie_option_styles.color,
legend: pie_option_styles.legend,
series: protocol_series,
}

let antenna_data = [{name:"1x1",value:responseJson.NodeInfo[0].Info.sta.protocols["1x1"]},
{name:"2x2",value:responseJson.NodeInfo[0].Info.sta.protocols["2x2"]},
{name:"3x3",value:responseJson.NodeInfo[0].Info.sta.protocols["3x3"]},
{name:"4x4",value:responseJson.NodeInfo[0].Info.sta.protocols["4x4"]}]
let antenna_series = this.create_pie_chart_series("Antenna",antenna_data)
antenna_option = {
title: {
text: "Clients by Antenna",
bottom: '-2.5%',
left: 'center',
textStyle: {
    color: '#fff',
    fontSize: 13,
    fontWeight:"bold",
},
},
tooltip: pie_option_styles.tooltip,
color: pie_option_styles.color,
legend: pie_option_styles.legend,
series: antenna_series,
}
})
.catch((error) => {
console.log(error);
})
this.setState({
pie_chart_array: <View>
<View style={{flexDirection:"row",justifyContent:"space-around",height:260,marginTop:"3%"}}>

<View style={{width:"45%",height:"100%",borderRadius:5,borderColor:'#fff',borderWidth:1,}}>
<ECharts
    option={vendor_option}
    backgroundColor={'#353f53'}
/>
</View>
<View style={{width:"45%",height:"100%",borderRadius:5,borderColor:'#fff',borderWidth:1,}}>
<ECharts
    option={con_type_option}
    backgroundColor={'#353f53'}
/>
</View>
</View>

<View style={{flexDirection:"row",justifyContent:"space-around",height:260,marginTop:'2%',}}>
<View style={{width:"45%",height:"100%",borderRadius:5,borderColor:'#fff',borderWidth:1,}}>
<ECharts
    option={protocol_option}
    backgroundColor={'#353f53'}
/>
</View>
<View style={{width:"45%",height:"100%",borderRadius:5,borderColor:'#fff',borderWidth:1,}}>
<ECharts
    option={antenna_option}
    backgroundColor={'#353f53'}
/>
</View>
</View>
</View>
})


}

//-------------- END - OVERVIEW TAB - END ---------------//


//-------------- TOPOLOGY TAB --------------//

async getTopologyData  (time_value) {
this.setState({topology:[]});
let start_hour = moment(time_value).format("YYYY-MM-DDTHH:mm").toString();
let last_hour  = moment(time_value).add(1,"hour").format("YYYY-MM-DDTHH:00").toString()
const IdToken = await AsyncStorage.getItem('@auth_token');
const controllerID = this.state.single_controller === true ? this.state.cValue : this.state.user_role === "user" ? this.state.contValue : this.state.inputValue;
let date_url = "?startdate="+start_hour+"&enddate="+last_hour+"&interval=hourly";

if(controllerID === undefined || controllerID === "")
{
alert("Please Select Mac Address..")
}
else
{
await fetch(ON_DEMAND_TOPOLOGY + controllerID + date_url, {
method: 'GET',
headers: {
Accept: 'application/json',
'Content-Type': 'application/json',
"Authorization": IdToken,
},
}).then(response=> response.status === 200 ? response.json() : '')
.then((responseJson)=>
{
let topology11 = responseJson.topologyInfo
let topologyStats = responseJson.topologyStats
let topology_time =  "( " + this.return_date_title() + " ," +this.return_time_title() + ")";
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
topology:
<Topology
    topology_information={topology}
    topology_stat={topologyStats}
    topology_id={"on-demand"}
    topology_time={topology_time}
/>
})
})
.catch((error)=>
{
console.log(error);
})
}
}



//MODALS
convertSecondstoDate = (seconds) => {
let d = seconds / 8.64e4 | 0;
let H = (seconds % 8.64e4) / 3.6e3 | 0;
let m = (seconds % 3.6e3)  / 60 | 0;
let s = seconds % 60;
return `${d} days - ${(H < 10 ? '0' + H.toString() : H)}:${(m < 10 ? '0' + m.toString() : m)}:${(s < 10 ? '0' + s.toString() : s)}`
}
async get_ap_modal_list (ap_mac_value,time_value)
{
let start_hour = moment(time_value).format("YYYY-MM-DDTHH:mm").toString();
let last_hour  = moment(time_value).add(1,"hour").format("YYYY-MM-DDTHH:00").toString()
let date_url = "?startdate="+start_hour+"&enddate="+last_hour+"&interval=hourly";
if(ap_mac_value === '')
{
this.setState({ap_info_list:[],ap_given_name:''})
}
else {
const cID = this.state.single_controller === true ? this.state.cValue : this.state.user_role === "user" ? this.state.contValue : this.state.inputValue;
const IdToken = await AsyncStorage.getItem('@auth_token');
const myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('Authorization', IdToken);
await fetch(ON_DEMAND_AP + cID + date_url,  {
method: 'GET',
headers: myHeaders,

}).then((response) => response.status === 200 ? response.json() : '')
.then((responseJson) => {
    let access_point = ap_mac_value.substring(0,17);
    let ap_info = responseJson.apInfo[0].info;
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

async get_sta_modal_list (sta_mac_value,time_value)
{
if(sta_mac_value === '')
{
this.setState({
sta_info_list:[],sta_given_name:'',
})
}
else
{
const cID = this.state.single_controller === true ? this.state.cValue : this.state.user_role === "user" ? this.state.contValue : this.state.inputValue;
const IdToken = await AsyncStorage.getItem('@auth_token');
const myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('Authorization', IdToken);
let start_hour = moment(time_value).format("YYYY-MM-DDTHH:mm").toString();
let last_hour  = moment(time_value).add(1,"hour").format("YYYY-MM-DDTHH:00").toString()
let date_url = "?startdate="+start_hour+"&enddate="+last_hour+"&interval=hourly";
await fetch(ON_DEMAND_STA + cID + date_url, {
method: 'GET',
headers: myHeaders,

}).then((response) => response.status === 200 ? response.json() : '').then((responseJson) => {
let sta_info = responseJson.staInfo[0].info;
let sta_info_list = [];
sta_info_list = sta_info.filter(item => item.macAddress === sta_mac_value.substring(0,17))
sta_info_list.forEach(({ip,macAddress,friendlyName,givenName,vendor,antenna,lastSeenTime,rssi,rxRate,txRate,linkType}) => {
this.state.sta_info_list = [macAddress,ip,antenna?.two,antenna?.five,new Date(lastSeenTime).toUTCString().substr(5,17),rssi,txRate,rxRate,linkType];
this.setState({sta_given_name:(givenName ? givenName : ''),})

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



async set_modal_views (time_value)
{
let start_hour = moment(time_value).format("YYYY-MM-DDTHH:mm").toString();
let last_hour  = moment(time_value).add(1,"hour").format("YYYY-MM-DDTHH:00").toString()
let date_url = "?startdate="+start_hour+"&enddate="+last_hour+"&interval=hourly";
const controllerID = this.state.single_controller === true ? this.state.cValue : this.state.user_role === "user" ? this.state.contValue : this.state.inputValue;
const IdToken = await AsyncStorage.getItem('@auth_token');
const myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('Authorization', IdToken);

await fetch(ON_DEMAND_HOME_INFO + controllerID + date_url, {
method: 'GET',
headers: myHeaders,

}).then(response => response.status === 200 ? response.json() : '')
.then((responseJson) => {
let res = responseJson.controllerInfo[0]
this.setState({
mac_address:res.controllerId,
last_seen:res.lastSeenTime,
country:res.location.country,
region:res.location.region,
city:res.location.city,
status:res.status,
ip_address:res.wanIp,
cVersion:res.cVersion,
cdVersion:res.cdVersion,
})
})
.catch((error) => {
console.log(error);
})
await fetch(ON_DEMAND_HEALTH_INFO + controllerID + date_url, {
method: 'GET',
headers: myHeaders,

}).then(response => response.status === 200 ? response.json() : '')
.then((responseJson) => {
let health_info = responseJson.teapotHealthInfo[0].info[0];
this.setState({
last_report_time:health_info.reportTime,
last_data_time:health_info.lastDataTimeFromLocalAgent,
device_up_time:health_info.deviceUptime,
teapot_up_time:health_info.teapotUptime,
})
})
.catch((error) => {
console.log(error);
})



//EVENTS
let events_list = [];
let events_array = [];
await fetch(ON_DEMAND_EVENTS_INFO + controllerID + date_url, {
method: 'GET',
headers: myHeaders,

}).then(response => response.status === 200 ? response.json() : '')
.then((responseJson) => {
events_list = responseJson.alarmsInfo[0].info
events_list.forEach(({macAddress,alarms,friendlyName}) => {
events_array.push([friendlyName,macAddress,alarms[0].name,(<IIcon name="information" color={'white'} size={20}  />),new Date(alarms[0].lastSeenTime).toUTCString().substr(5,17),alarms[0].count,alarms[0].definition]);
})
this.setState({
events_data:events_array,
})
})
.catch((error) => {
console.log(error);
})

//AP MODAL

await fetch(ON_DEMAND_AP + controllerID + date_url, {
method: 'GET',
headers: myHeaders,

}).then((response) => response.status === 200 ? response.json() : null)
.then((responseJson) => {
    let ap_info = responseJson.apInfo[0].info;
    let ap_list = [];
    ap_info.forEach(({macAddress,friendlyName,givenName,vendorName,capacity,channel,configuration,linkType,ip,SSID}) => {
        this.state.ap_mac_list.push(macAddress + " " +"(" + (friendlyName ? friendlyName : vendorName) + ")");
    })
}).catch((error) => {
    console.log(error);
})

//STA MODAL
await fetch(ON_DEMAND_STA + controllerID + date_url, {
method: 'GET',
headers: myHeaders,

}).then((response) => response.status === 200 ? response.json() : '')
.then((responseJson) => {
let sta_mac_list = []
sta_mac_list = responseJson.staInfo[0]?.info;
sta_mac_list.forEach(({macAddress,friendlyName,vendorName}) => {
this.state.sta_mac_list.push(macAddress + " " +"(" + (friendlyName ? friendlyName : vendorName) + ")");

})
this.state.sta_mac_list.push("020202002")
}).catch((error) => {
console.log(error);
})




this.setState({
    modal_views:<View style={{flexDirection:"row",justifyContent:"space-between",width:"95%",marginTop:'1%'}}>
    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",borderWidth:1,borderColor:'#353f53',borderRadius:5}}>
    <View>
    <TouchableOpacity onPress={()=>{this.date_time_modal(true)}}>
        <View style={styles.topology_time_button}>
            <Text style={{color:'#fff',fontWeight:"bold",fontSize:16,fontFamily:"Roboto"}}><IIcon name={"calendar-clock"} size={30}/></Text>
        </View>
    </TouchableOpacity>
    </View>
    
    </View>
    
    <View style={{flexDirection:"row",justifyContent:"space-around",width:'70%'}}>
    <TouchableOpacity style={{alignItems:'center',justifyContent:"center",}}  onPress={()=> this.openModal("home")}>
    <View style={styles.modal_buttons}>
    
    <Text style={styles.modal_button_texts}>
        HOME
    </Text>
    </View>
    
    </TouchableOpacity>
    
    
    
    <TouchableOpacity style={{alignItems:'center',justifyContent:"center",}}  onPress={()=> this.openModal("clients")}>
    <View style={styles.modal_buttons}>
    
    <Text style={styles.modal_button_texts}>
        CLIENT
    </Text>
    </View>
    
    </TouchableOpacity>
    
    
    <TouchableOpacity style={{alignItems:'center',justifyContent:"center",}}  onPress={()=> this.openModal("ap")}>
    <View style={styles.modal_buttons}>
    
    <Text style={styles.modal_button_texts}>
        AP
    </Text>
    </View>
    
    </TouchableOpacity>
    
    <TouchableOpacity style={{alignItems:'center',justifyContent:"center",}} onPress={()=> this.openModal("events")}>
    <View style={styles.modal_buttons}>
    <Text style={styles.modal_button_texts}>
        EVENTS
    </Text>
    </View>
    </TouchableOpacity>
    
    </View>
    </View>,
    modal_is_open:true
    
    
    
    })


}



//-------------- END - TOPOLOGY TAB - END -------------//


macPicker () {

let cSrc = this.state.controller_array.map((val, key, array) => {
return (

<Picker.Item label={val} value={val} key={key}/>

)
});

return (
<View style={{flexDirection: "row",marginTop: "1%",justifyContent:"space-around"}}>
<View style={{backgroundColor: '#2196F3',padding:5,borderWidth:1,borderColor:'#2196F3',borderRadius:5}}>
<Picker style={{height: 35, width: 150, color: "#fff", borderRadius: 12}}
    accessibilityValue={true}
    selectedValue={this.state.contValue} onValueChange={(contValue)=>{
this.state.contValue = contValue;
this.functions_combined()
}
}
>
<Picker.Item label={"Mac Address"} value={''} key={''}/>
{cSrc}
</Picker>
</View>

<View>
{this.create_time_picker()}
</View>
</View>
)
}

inputView (){

return (
    <View style={{flexDirection: "row",marginTop: "1%",justifyContent:"space-around"}}>
    <View>
        <TextInputMask
            onEndEditing={(e) => {
                let mac = e.nativeEvent.text.toLowerCase()
                this.setState({
                    inputValue:mac
                })
                this.functions_combined()          
            }}
            placeholder={"Type Mac..."}
            placeholderTextColor={'#fff'}
            mask={"[__]:[__]:[__]:[__]:[__]:[__]"}
            style={{backgroundColor:'#353f53',color:'#fff',width:150,borderRadius:10,fontWeight:"bold"}}
            onSubmitEditing={(e) => {
                let mac = e.nativeEvent.text.toLowerCase()
                this.setState({
                    inputValue:mac
                })
                this.functions_combined()
            }}
            mask={"[__]:[__]:[__]:[__]:[__]:[__]"}
        />
    </View>

    <View>
        {this.create_time_picker()}
    </View>
</View>
)
}

functions_combined () {
this.get_scores(this.state.time_value);
this.get_highlights(this.state.time_value);
this.get_pie_chart_info(this.state.time_value);
this.getTopologyData(this.state.time_value);
this.set_modal_views(this.state.time_value);
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
<View style={{flex: 0.5}}>
<ActivityIndicator animating={true} color={'#fff'} style={{flex: 1}} size={"large"}/>
<Text style={{color: '#fff', marginLeft: "40%"}}>Loading...</Text>
</View>
</View>
)
} else {
return (
<View style={styles.MainContainer}>
<TabView
swipeEnabled={false}
navigationState={this.state}
renderTabBar={props => <TabBar {...props}
indicatorStyle={{ backgroundColor: 'white'}}
style={{backgroundColor: '#353f53',
}}
/>}
renderScene={({route}) => {
    switch (route.key) {
        case "highlights":
            return <ScrollView>
            <View style={styles.MainContainer}>

                {this.state.single_controller === true ? this.create_time_picker()
                    : this.state.user_role === "user" ? this.macPicker() : this.inputView()}


                <View style={{flex: 0.035}}>
                    <Text
                    style={styles.title}>SCORES</Text></View>
                <View style={{flex: 0.30}}>
                    {this.state.graph_chart_array}
                </View>
                <View style={{flex: 0.010,marginTop:'2%'}}><Text style={styles.title}>HIGHLIGHTS</Text></View>
                {this.state.card_array}
            </View>
            </ScrollView>;
        case "overview":
            return <ScrollView>
            <View style={styles.MainContainer}>
                {this.state.single_controller === true ? this.create_time_picker()
                    : this.state.user_role === "user" ? this.macPicker() : this.inputView()}
                    {this.state.pie_chart_array}

            </View>
            </ScrollView>;
        case "topology":
            return <View style={{backgroundColor: "#262d3c",flex:1,alignItems:"center"}}>

                {this.state.topology}
                {this.state.modal_views}


                <Modal
                    animationType={"none"}
                    transparent={true}
                    visible={this.state.date_time_visible}
                    onRequestClose={() => {
                        this.date_time_modal(false)
                    }}>
                    <View style={styles.date_modal_view}>
                        <View style={styles.date_modal_under_view}>
                            <Text style={styles.first_text}>DATE/TIME</Text>
                            <View>
                                <DatePicker
                                    mode="datetime"
                                    date={this.state.time_value}
                                    onDateChange={(time)=>{
                                        this.state.time_value = time
                                    }
                                    }
                                    minuteInterval={60}
                                    androidVariant="iosClone"
                                    maximumDate={this.maximum_date()}
                                    style={{backgroundColor:'#262D3C',width:300,height:180,alignSelf:"center",marginTop:"1%"}}
                                    accessibilityIgnoresInvertColors={true}
                                    accessibilityComponentType={"button"}
                                    dividerHeight={10}
                                    textColor={'#fff'}
                                    fadeToColor={"#353F53"}

                                />
                            </View>
                            <View style={[styles.modal_close_button,{flexDirection:'row'}]}>
                                <Button title={"OK"}
                                        color={'#5ed2d1'}
                                        onPress={() =>{
                                            this.return_time_title();
                                            this.date_time_modal(false);
                                            this.functions_combined();

                                        }
                                        }
                                />
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modalize
                    ref={this.home_modal}
                    adjustToContentHeight={true}>

                    <View style={styles.modal_view}>
                        <View style={styles.modal_under_view}>
                            <Text style={styles.first_text}>HOME INFO</Text>
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
                                    <Text style={{color:'#fff',fontWeight:"bold"}}> {new Date(this.state.last_seen).toUTCString().substr(5,17)}</Text>
                                    <Text style={{color:'#fff',fontWeight:"bold"}}> {this.state.country}-{this.state.region}-{this.state.city}</Text>
                                    <Text style={{color:'#fff',fontWeight:"bold"}}> {this.state.cVersion} </Text>
                                    <Text style={{color:'#fff',fontWeight:"bold"}}> {this.state.cdVersion}</Text>
                                    <Text style={{color:'#fff',fontWeight:"bold"}}> {new Date(this.state.last_report_time).toUTCString().substr(5,17)} </Text>
                                    <Text style={{color:'#fff',fontWeight:"bold"}}> {new Date(this.state.last_data_time).toUTCString().substr(5,17)}</Text>
                                    <Text style={{color:'#fff',fontWeight:"bold"}}> {this.convertSecondstoDate(this.state.device_up_time)}</Text>
                                    <Text style={{color:'#fff',fontWeight:"bold"}}> {this.convertSecondstoDate(this.state.teapot_up_time)}</Text>
                                </View>
                            </View>

                        </View>
                    </View>




                </Modalize>

                <Modalize ref={this.events_modal}
                        adjustToContentHeight={true}>

                    <View style={styles.events_modal_view}>
                        <View style={styles.events_modal_under_view}>
                            <Text style={styles.first_text}>EVENTS</Text>
                            <ScrollView>
                                <View style={{marginBottom:50}}>
                                    <Table>
                                        <Row data={this.state.tableHead} widthArr={[100,130,100,60]}
                                                textStyle={styles.text}/>
                                        {
                                            this.state.events_data.map((rowData, index) => (
                                                <View key={index}>
                                                    <TouchableOpacity onPress={() => this.showAlert(rowData,index)}>
                                                        <Row
                                                            key={index}
                                                            data={rowData.slice(0,4)}
                                                            style={styles.row}
                                                            textStyle={styles.text}
                                                            widthArr={[100,130,100,60]}
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
                    adjustToContentHeight={true}
>
                    <View style={styles.modal_view}>
                        <View style={[styles.modal_under_view,{flex:0.50}]}>
                            <Text style={styles.first_text}>AP INFO</Text>
                            <Picker style={{height: 35, width: 287, color: "#fff", borderRadius: 12,alignSelf:"center"}}
                                    accessibilityValue={true}
                                    selectedValue={this.state.ap_mac_value} onValueChange={(itemValue)=>{
                                this.get_ap_modal_list(itemValue,this.state.time_value).then(()=> this.setState({
                                    ap_mac_value:itemValue}))
                            }}
                            >
                                <Picker.Item label={"Select Device"} value={''} key={''}/>
                                {ap_mac_list}
                            </Picker>

                            <View style={{flexDirection:'row', justifyContent: 'space-between',marginTop:5,marginBottom:50}}>
                                <View style={{marginLeft:25,marginTop:3}} >
                                    <Text style={styles.first_text}>Friendly Name:</Text>
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
                                        style={[styles.friendly_text_input,{marginBottom:14}]}
                                        editable={true}
                                        onEndEditing={e => {
                                            let ap_name = e.nativeEvent.text
                                            this.setState({
                                                ap_given_name:ap_name
                                            })
                                            this.set_ap_name((this.state.single_controller === true ? this.state.cValue : this.state.user_role === "user" ? this.state.contValue :
                                            this.state.inputValue),this.state.ap_mac_value,ap_name)
                                        }}
                                        placeholder={this.state.ap_given_name}
                                        placeholderTextColor={'#100f0f'}
                                    />
                                    {this.state.ap_info_list.map((item,key) => (
                                        <Text key={key} style={{color:'#ffffff',fontWeight:"bold"}}>{item}</Text>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>
                </Modalize>
                <Modalize
                    ref={this.clients_modal}
                    adjustToContentHeight={true}
>
                    <View style={styles.modal_view}>
                        <View style={[styles.modal_under_view,{flex:0.60}]}>
                            <Text style={styles.first_text}>CLIENT INFO</Text>
                            <Picker style={{height: 35, width: 287, color: "#fff", borderRadius: 12,alignSelf:"center"}}
                                    accessibilityValue={true}
                                    selectedValue={this.state.sta_mac_value} onValueChange={(itemValue)=>{
                                this.get_sta_modal_list(itemValue,this.state.time_value).then(()=> this.setState({
                                    sta_mac_value:itemValue}))
                            }}
                            >
                                <Picker.Item label={"Select Device"} value={''} key={''}/>
                                {sta_mac_list}
                            </Picker>

                            <View style={{flexDirection:'row', justifyContent: 'space-between',marginTop:5,marginBottom:50}}>
                                <View style={{marginLeft:25,marginTop:3}} >
                                    <Text style={styles.first_text}>Friendly Name:</Text>
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
                                        style={[styles.friendly_text_input,{width:150,marginBottom:14}]}
                                        editable={true}
                                        onEndEditing={e => {
                                            let sta_name = e.nativeEvent.text;
                                            this.setState({
                                                sta_given_name:sta_name,
                                            })
                                            this.set_sta_names((this.state.single_controller === true ? 
                                                this.state.cValue : this.state.user_role === "user" ? this.state.contValue : this.state.inputValue),this.state.sta_mac_value,sta_name)
                                        }}
                                        placeholder={this.state.sta_given_name}
                                        placeholderTextColor={'#100f0f'}
                                    />
                                    {this.state.sta_info_list.map((item,key) => (
                                        <Text key={key} style={{color:'#ffffff',fontWeight:"bold"}}>{item}</Text>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>
                </Modalize>

                </View>
        default:
            return null;

    }


}}
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
graph_array:{height: 130, width: 180,borderRadius:5,borderColor:'#fff',borderWidth:1,marginLeft:10},
item:{
alignSelf:'stretch',
},
date_modal_view: {
backgroundColor: 'rgba(24,24,24,0.8)',
justifyContent: 'center',
flex: 1,
},
date_modal_under_view: {
height: 240,
flex: 0.35,

},
title:{color:'#fff',marginLeft:'3%',marginTop:'0.5%',fontWeight:"bold"},
success_theme: {backgroundColor:"#4caf50"},
danger_theme:{backgroundColor:"#795548"},
card_content_head:{alignSelf:"flex-start",position:"absolute",top:50},
card_content_view:{flexDirection:"row",justifyContent:"space-between"},
card_icon:{position:"absolute",right:0,padding:10},
card_title:{color:'#fff',fontWeight:"bold",fontFamily:"Roboto"},
card_title_view:{marginTop:10},
card_content_device:{color:'#fff',fontWeight:"bold",fontFamily:"Roboto",fontSize:16},
card_content_text:{color:'#fff',fontFamily:"Roboto",position:"absolute",left:95,top:22},
date_button:{
alignItems:'center',
justifyContent:"center",
alignSelf: "center",
width:200,
backgroundColor:'#353F53',
marginTop:'2%',
borderWidth:2,
borderRadius:5,
borderColor:'#353F53',
minHeight:'9%'
},
topology_time_button:{
alignItems:'center',
justifyContent:"center",
width:100,
backgroundColor:'#353F53',
borderWidth:2,
borderRadius:5,
borderColor:'#353F53',
},
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
    fontFamily:"Roboto",
    fontWeight:"bold",
    textShadowColor:'#135184',
    fontSize:15,
    color:'#fff'
},
modal_close_button:
{
position:"absolute",
bottom:0,
alignSelf:"center"
},
events_modal_view: {
    backgroundColor: '#353f53',
    flex:1,
    justifyContent: 'center',
    alignItems:'center'
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
row: {
    flexDirection: 'row',
    borderColor: 'rgba(139,136,136,0.8)',
    borderRadius:5,
    borderWidth:1,
    marginTop:2},
text: {
color:'#fff',
fontWeight:'bold',
margin:5},
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
});


const pie_option_styles = {
tooltip: {
trigger: 'item',
triggerOn: "mousemove",
formatter: function (params) {
return "<div style='text-align: center'>" + params['name'] + "<br/>" + 'Count: ' + params['value'] + "<br/>" + 'Per: ' + params['percent'] + '%' + "</div>";
}

},
color: [
"#b5e9ff",
"#76abc6",
"#9fd4ec",
"#6197b4",
"#8abfd9",
"#387090",
"#4d83a1",
"#004c6d",
"#215e7e",
],
legend: {
orient: 'horizontal',
left: 'left',
textStyle: {
color: '#fff',
fontFamily:"Roboto",
fontWeight:"bold",
},
icon:'circle',
},
type: 'pie',
center: ["50%", '57%'],
radius: ['0%', '85%'],
avoidLabelOverlap: false,
label: {
show: false,
position: 'center'
},
highlight: {
label: {
rotate: "tangential",
show: true,
color: '#fff',
textBorderWidth: 3,
textBorderColor: '#004c6d',
verticalAlign: "middle",
fontSize: 14,
formatter: function (params) {
return params['name'];
}
}
},
emphasis: {
label: {
rotate: "tangential",
show: true,
color: '#fff',
verticalAlign: "middle",
textBorderWidth: 3,
textBorderColor: '#004c6d',
fontSize: 14,
formatter: function (params) {
if (params['name'].length > 15) {
let name = '';
for (let item of params['name'].split(' ')) {
name += item + '\n';
}
return name;

}
return params['name'];
}
},

},
labelLine: {
show: true,
},
animationType: 'scale',
animationEasing: 'elasticOut',
animationDelay: function (idx) {
return Math.random() * 200;
}
}

const option_styles = {
tooltip:{
formatter: '<a style="color: white">{a}</a> <br/>{b} : {c}%',
show:false,
},
type: 'gauge',
title: {
offsetCenter: [0, '106%'],
fontSize: 15,
color:'#fff',
fontWeight: "bold",
fontFamily:"Roboto"
},
itemStyle:{
color: 'auto',
shadowColor: 'rgba(77,208,225,0.20)',
shadowBlur: 10,
shadowOffsetX: 2,
shadowOffsetY: 2
},
detail:{
valueAnimation: true,
formatter: function (value) {
return value;
},
offsetCenter: [0, '55%'],
shadowBlur: 10,
shadowOffsetX: 2,
shadowOffsetY: 2,
shadowColor: 'rgba(77,208,225,0.20)',
borderWidth: 0,
width: '50%',
borderRadius: 8,
lineHeight: 20,
height: 20,
padding: [1, 4, 0, 4],
fontWeight:"bold",
color: '#fff',
fontSize: 14,
rich: {
value: {

},
},

},
axisLine:{
roundCap:true,
lineStyle: {
width: 12,
color: [
[0.25, '#D32F2F'],
[0.5, '#FB8C00'],
[0.75, '#00ACC1'],
[1, '#43A047']
],
shadowBlur: 10,
shadowOffsetX: 2,
shadowOffsetY: 2,
shadowColor: 'rgba(77,208,225,0.20)',
}
},

pointer: {
icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
length: '75%',
width: 6,
offsetCenter: [0, '5%']
},

axisTick: {
splitNumber: 20,
lineStyle: {
width: 2,
color: 'auto'
}
},
axisLabel: {
fontSize:12,
fontWeight: "bold",
distance: -35,

},
splitLine: {
length: 15,
lineStyle: {
width: 2,
color:"auto",
}
},
progress:{
show: true
},

}



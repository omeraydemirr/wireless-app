import {ECharts} from "react-native-echarts-wrapper";
import React, {Component} from 'react';
import {
    View,
} from 'react-native';
import * as math from "mathjs"
import IIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment-timezone";


let ap_theta = 0.79108;
let theta = 0.79108;
let theta4 = 0.93;
let theta5 = 0.53;
let theta6 = 0.21;

let theta_45_root = 2.34;
let theta_75_root = 3.13;

let theta_ext1 = 0.79108;
let theta_ext1_4 = -0.80;
let theta_ext1_5 = -1.10;
let theta_ext1_6 = -1.25;

let theta_ext2 = 0.79108;
let theta_ext2_4 = 0.20;
let theta_ext2_5 = 0.10;
let theta_ext2_6 = -0.15;

//FOR 45 DEGREE
let theta_ext3 = 0.79108;
let theta_ext3_4 = 0.20;
let theta_ext3_5 = 0.10;
let theta_ext3_6 = -0.15;

//FOR 75
let theta_ext33 = 0.79108;
let theta_ext33_4 = -0.80;
let theta_ext33_5 = -1.10;
let theta_ext33_6 = -1.25;

const TopologyProps = {
    topology_information:[],
    topology_stat:'',
    topology_id:'',
    topology_time:'',
}


export default class Topology extends React.Component<TopologyProps>{

    create_gw_node = (name, fname,xPos, yPos,type,data)=>
    {
        let node = {
            name:name,
            label:{
                fontWeight:"bold",
                fontSize:18,
                show: true,formatter: function (params) {
                    if (params.data.name === params.data.labelText) {
                        return params.data.name.substring(params.data.name.length - 5, params.data.name.length).toUpperCase()
                    }
                    if (params.data.labelText.length > 10) {
                        return params.data.labelText.substring(0, params.data.labelText.length > 6 ? 6 : params.data.labelText.length) + '...'
                    }
                    return params.data.labelText

                }
            },
            labelText:fname,
            itemStyle:{
                color:'#7289ab',
            },
            nodeType:type,
            x: xPos,
            y: yPos,
            symbolSize: 40,
            symbol: 'roundRect',
            data: {
                ip: data.ip,
                mac: data.mac,
                lastSeen:moment.utc(data.lastSeen).local().format('YYYY-MM-DD HH:mm:ss').toString(),
                vendor:data.vendor
            },


        };
        return node
    }
    create_ap_ethernet_node = (name,fname, xPos, yPos,type,data)=>
    {
        let node = {
            name:name,
            label:{
                fontWeight:"bold",
                fontSize:18,
                show: true,formatter: function (params) {
                    if (params.data.name === params.data.labelText) {
                        return params.data.name.substring(params.data.name.length - 5, params.data.name.length).toUpperCase()
                    }
                    if (params.data.labelText.length > 10) {
                        return params.data.labelText.substring(0, params.data.labelText.length > 6 ? 6 : params.data.labelText.length) + '...'
                    }
                    return params.data.labelText

                }
            },
            labelText:fname,
            itemStyle:{

                color:'#8684f1',

            },
            x: xPos,
            y: yPos,
            symbolSize: 30,
            nodeType:type,
            data: {
                ip: data.ip,
                mac: data.mac,
                twoFourSsid:data.twoFourSsid,
                fiveSsid:data.fiveSsid,
                twoFourChannel:data.twoFourChannel,
                fiveChannel:data.fiveChannel,
                lastSeen:moment.utc(data.lastSeen).local().format('YYYY-MM-DD HH:mm:ss').toString()
                ,
                vendor:data.vendor
            },


        };
        return node
    }


    create_sta_wireless_node = (name,fname, xPos, yPos,type,data,style)=>
    {
        let node = {
            name:name,
            label:
                {
                    show: true,formatter: function (params) {
                        if (params.data.name === params.data.labelText) {
                            return params.data.name.substring(params.data.name.length - 5, params.data.name.length).toUpperCase()
                        }
                        if (params.data.labelText.length > 5) {
                            return params.data.labelText.substring(0, params.data.labelText.length > 2 ? 2: params.data.labelText.length) + '...'
                        }
                        return params.data.labelText
                    }
                },
            labelText:fname,
            x: xPos,
            y: yPos,
            symbolSize: 23,
            nodeType:type,
            data: {
                ip: data.ip,
                mac: data.mac,
                rssi:data.rssi,
                downLink:data.downlink,
                upLink:data.uplink,
                lastSeen:moment.utc(data.lastSeen).local().format('YYYY-MM-DD HH:mm:ss').toString(),
                vendor:data.vendor
            },
            itemStyle:{
                color: style.color,
                borderColor: style.borderColor,
                borderWidth: style.borderWidth,
                borderType: 'solid',
            },


        };
        return node
    }

    create_excessive_sta_wireless_node = (name,fname, xPos, yPos,type,sta_list)=>
    {
        let node = {
            name:name,
            label:
                {
                    fontSize:18,
                    fontWeight:"bold",
                    show: true,formatter: function (params) {
                        return params.data.labelText;

                    }
                },
            labelText:fname,
            symbol: 'circle',
            x: xPos,
            y: yPos,
            symbolSize:20,
            nodeType:type,

            itemStyle:{
                color: '#f3b619', borderWidth: 8, borderColor: 'rgb(243,187,69)', size: 20
            },
            sta_list:sta_list,

        };
        return node
    }

    create_excessive_sta_wireless_link = (source,target)=>
    {
        let link = {
            source: source,
            target: target,
        }
        return link;
    }

    create_gateway_sta_node = (name,fname, xPos, yPos,type,sta_list,node_name)=>
    {
        let node = {
            name:name,
            label:
                {
                    fontSize:17,
                    fontWeight:"bold",
                    show: true,formatter: function (params) {
                        return params.data.node_name;

                    }
                },
            labelText:fname,
            symbol: 'roundRect',
            x: xPos,
            y: yPos,
            symbolSize:17,
            nodeType:type,

            itemStyle:{
                color: ' #5c5757', borderWidth: 8, borderColor: 'rgb(92, 87, 87)', size: 18
            },
            sta_list:sta_list,
            node_name:node_name

        };
        return node
    }


    create_ap_ethernet_link = (source,target,type)=>
    {
        let link = {
            source: source,
            target: target,
            linkType: type,
            lineStyle: {
                curveness: 0,
                type: "solid",
                width: 2.5
            },

        }
        return link;
    }
    create_ap_wireless_link = (source,target,type)=>
    {
        let link = {
            source: source,
            target: target,
            linkType: type,
            lineStyle: {
                curveness: 0,
                type: "solid",
                width: 1,
                color: "#2ac69b"
            },

        }
        return link;
    }
    create_sta_wireless_link = (source,target,type,data,itemStyle)=>
    {
        let link = {
            source: source,
            target: target,
            linkType: type,
            lineStyle: {
                color: itemStyle.color,
                curveness: itemStyle.curve,
                type: itemStyle.type,
                width: itemStyle.width
            },
            data: {
                from: data.from,
                to: data.to,
                rssi: data.rssi,
                downLink: data.downlink,
                upLink: data.uplink,
                linkType: data.linkType,

            }
        }
        return link;
    }

    create_hidden_node = (xPos, yPos) => {
        let node = {
            name: 'staHidden',
            label: {show: true, formatter: function(params, ticket, callback) {
                    return ''
                }},
            labelText: '',
            nodeType: 'Hidden',
            x: xPos,
            y: yPos,
            symbolSize: 0,
            symbol: 'circle',
            category: 0,
            itemStyle: {
                color: '#fff',
                borderColor: '#fff',
                borderType: 'solid',
            }
        };
        return node
    }
    create_hidden_node1 = (xPos, yPos) => {
        let node = {
            name: 'staHidden1',
            label: {show: true, formatter: function(params, ticket, callback) {
                    return ''
                }},
            labelText: '',
            nodeType: 'Hidden',
            x: xPos,
            y: yPos,
            symbolSize: 0,
            symbol: 'circle',
            category: 0,
            itemStyle: {
                color: '#fff',
                borderColor: '#fff',
                borderType: 'solid',
            }
        };
        return node
    }
    create_hidden_node2 = (xPos, yPos) => {
        let node = {
            name: 'staHidden2',
            label: {show: true, formatter: function(params, ticket, callback) {
                    return ''
                }},
            labelText: '',
            nodeType: 'Hidden',
            x: xPos,
            y: yPos,
            symbolSize: 0,
            symbol: 'circle',
            category: 0,
            itemStyle: {
                color: '#fff',
                borderColor: '#fff',
                borderType: 'solid',
            }
        };
        return node
    }
    create_hidden_node3 = (xPos, yPos) => {
        let node = {
            name: 'staHidden3',
            label: {show: true, formatter: function(params, ticket, callback) {
                    return ''
                }},
            labelText: '',
            nodeType: 'Hidden',
            x: xPos,
            y: yPos,
            symbolSize: 0,
            symbol: 'circle',
            category: 0,
            itemStyle: {
                color: '#fff',
                borderColor: '#fff',
                borderType: 'solid',
            }
        };
        return node
    }
    create_hidden_node4 = (xPos, yPos) => {
        let node = {
            name: 'staHidden4',
            label: {show: true, formatter: function(params, ticket, callback) {
                    return ''
                }},
            labelText: '',
            nodeType: 'Hidden',
            x: xPos,
            y: yPos,
            symbolSize: 0,
            symbol: 'circle',
            category: 0,
            itemStyle: {
                color: '#fff',
                borderColor: '#fff',
                borderType: 'solid',
            }
        };
        return node
    }

    create_hidden_node5 = (xPos, yPos) => {
        let node = {
            name: 'staHidden5',
            label: {show: true, formatter: function(params, ticket, callback) {
                    return ''
                }},
            labelText: '',
            nodeType: 'Hidden',
            x: xPos,
            y: yPos,
            symbolSize: 0,
            symbol: 'circle',
            category: 0,
            itemStyle: {
                color: '#fff',
                borderColor: '#fff',
                borderType: 'solid',
            }
        };
        return node
    }
    create_hidden_node6 = (xPos, yPos) => {
        let node = {
            name: 'staHidden6',
            label: {show: true, formatter: function(params, ticket, callback) {
                    return ''
                }},
            labelText: '',
            nodeType: 'Hidden',
            x: xPos,
            y: yPos,
            symbolSize: 0,
            symbol: 'circle',
            category: 0,
            itemStyle: {
                color: '#fff',
                borderColor: '#fff',
                borderType: 'solid',
            }
        };
        return node
    }
       create_hidden_node7 = (xPos, yPos) => {
        let node = {
            name: 'staHidden7',
            label: {show: true, formatter: function(params, ticket, callback) {
                    return ''
                }},
            labelText: '',
            nodeType: 'Hidden',
            x: xPos,
            y: yPos,
            symbolSize: 0,
            symbol: 'circle',
            category: 0,
            itemStyle: {
                color: '#fff',
                borderColor: '#fff',
                borderType: 'solid',
            }
        };
        return node
    }


    create_hidden_link = (source, target) => {
        let link = {
            source: source,
            target: target,
            linkType: 'ethernet',
            data: {
                linkType: 'Ethernet Link'
            }
        };
        return link
    }
    find_link_type = (linkType) => {
        let linkName;
        let linkstyle;
        let staLinkType;
        if (linkType === '0' || linkType === '1') {
            linkstyle = { color: '#c1b6b6', width: 2, type: 'solid', curveness: 0 };
            linkName = 'Ethernet Link';
            staLinkType = 'eth';
        } else if (linkType === '100' || linkType === '101' || linkType === '103') {
            linkstyle = { color: '#ff600b', width: 2, type: 'solid', curveness: 0 };
            linkName = '2.4 GHz Link';
            staLinkType = 'two';
        } else if(linkType === '102' || linkType === '104' || linkType === '105') {
            linkstyle = { color: '#6eb3ff', width: 2, type: 'solid', curveness: 0 };
            linkName = '5 GHz Link';
            staLinkType = 'five';
        } else {
            linkstyle = { color: '#444444', width: 2, type: 'solid', curveness: 0 }
            linkName = 'Ethernet Link';
            staLinkType = 'eth';
        }
        return {style: linkstyle, name: linkName, staLinkType: staLinkType}
    }

    find_sta_style = (rssi) => {
        let style = '';
        let staRssi;
        let catType = 0;
        if (rssi && rssi < -78) {
            style = { color: '#EF5350', borderWidth: 4, borderColor: 'rgba(221, 107, 102, 0.5)', size: 20 };
            catType = 9;
            staRssi = 'alarm';
        } else if (rssi && rssi < -65) {
            style = { color: '#FF7043', borderWidth: 4, borderColor: 'rgba(234, 126, 83, 0.5)', size: 20 }
            catType = 8;
            staRssi = 'warning';
        } else if (rssi) {
            style = { color: '#66BB6A', borderWidth: 4, borderColor: 'rgba(141, 193, 169, 0.5)', size: 20 };
            catType = 7;
            staRssi = 'success';
        }
        else {
            style = { color: '#78909C', width: 3, type: 'solid', curveness: 0 }
            catType = 10;
            staRssi = '';
        }
        return {style: style, category: catType, rssiType: staRssi}
    }

    set_sta_positions = (sta_count)  => {
        let x = 0
        let y = 0
        let r = 80;
        x = sta_count === 1 ? 500 + r * math.cos(1.57517) :
            sta_count === 4 ? 500 + r * math.cos(theta4):
                sta_count === 5 ? 500 + r * math.cos(theta5):
                    sta_count === 6 ? 500 + r * math.cos(theta6): 500 + r * math.cos(theta)
        y = sta_count === 1 ? 180 + r * math.sin(1.57517):
            sta_count === 4 ? 180 + r * math.sin(theta4):
                sta_count === 5 ? 180 + r * math.sin(theta5):
                    sta_count === 6 ? 180 + r * math.sin(theta6): 180 + r * math.sin(theta)
        sta_count === 1 ? theta += 0 :
            sta_count === 2 ? theta += 1.56736 :
                sta_count === 3 ? theta += 0.78409 :
                    sta_count === 4 && theta4 !== 3.48 ? theta4 += 1.275 : sta_count === 4 && theta4 === 3.48  ? theta4 += 2.479:
                        sta_count === 5 && theta5 !== 3.6799999999999997 ? theta5 += 1.05 : sta_count === 5 && theta5 === 3.6799999999999997 ? theta5 += 2.07:
                            sta_count === 6 && theta6 !== 3.81 ? theta6 += 0.90: sta_count === 6 && theta6 === 3.81 ? theta6 += 1.83:
                                sta_count === 7 && (theta === 0.79108 || theta === 2.35844 || theta === 3.13858 || theta === 5.48608) && theta !== 6.266220000000001 ? theta += 0.78014 :
                                    sta_count === 7 && (theta !== 0.79108 || theta !== 2.35844 || theta !== 3.13858 || theta !== 5.48608) && theta !== 6.266220000000001 ? theta += 1.56736 :
                                        sta_count === 7 && theta === 6.266220000000001 ? theta -= 3.90778 : 20
        return {x:x,y:y};
    }


    set_sta_positions_with_extender = (sta_count,type,angle_x,angle_y,angle_value) => {
        let x = 0;
        let y = 0;
        let r = 38;
        if(type === "Root")
        {
            if(angle_value === 90)
            {
                x = sta_count === 1 ? angle_x + r * math.cos(3.13858) : sta_count === 2 ? angle_x + r * math.cos(3.92966-theta):angle_x + r * math.cos(theta)
                y = sta_count === 1 ? angle_y + r * math.sin(3.13858) :sta_count === 2 ? angle_y + r * math.sin(3.92966-theta):angle_y + r * math.sin(theta)
                sta_count === 1 ? theta += 0 : sta_count === 2 ? theta += 3.1456: sta_count === 3 ? theta += 2.3475 : sta_count === 4 ? theta += 1.56736 :
                    sta_count === 5 && theta ===  5.49316 ? theta +=0.78014: sta_count === 5 && theta !==  5.49316 ? theta +=1.56736:
                        sta_count === 6 && (theta === 0.79108 || theta === 3.9187199999999995) ? theta += 1.56736:
                            sta_count === 6 && (theta !== 0.79108 || theta !== 3.9187199999999995) ? theta += 0.78014:20

            }
            else if(angle_value === 45)
            {
                x = sta_count === 1 ? angle_x + r * math.cos(2.34) :
                    sta_count === 2 ? angle_x + r * math.cos(theta_45_root):
                        angle_x + r * math.cos(theta_45_root)
                y = sta_count === 1 ? angle_y + r * math.sin(2.34) :
                    sta_count === 2 ? angle_y + r * math.sin(theta_45_root):
                        angle_y + r * math.sin(theta_45_root)
                sta_count === 1 ? theta_45_root += 0 :
                    sta_count === 2 ? theta_45_root += 3.16108:
                        sta_count === 3 ? theta_45_root += 1.6075 :
                            sta_count === 4 ? theta_45_root += 1.16736 :
                                sta_count === 5 ? theta_45_root += 0.95108:
                                    sta_count === 6 ? theta_45_root += 0.79108:20
            }
            else if(angle_value === 75)
            {
                x = sta_count === 1 ? angle_x + r * math.cos(3.92) :
                    sta_count === 2 ? angle_x + r * math.cos(theta_75_root+0.45):
                        sta_count === 3 ? angle_x + r * math.cos(5.35-theta_75_root):
                            angle_x + r * math.cos(theta_75_root)

                y = sta_count === 1 ? angle_y + r * math.sin(3.92) :
                    sta_count === 2 ? angle_y + r * math.sin(theta_75_root+0.45):
                        sta_count === 3 ? angle_y + r * math.sin(5.35-theta_75_root):
                            angle_y + r * math.sin(theta_75_root)

                sta_count === 1 ? theta_75_root += 0 :
                    sta_count === 2 ? theta_75_root -= 3.1508:
                        sta_count === 3 ? theta_75_root -= 1.5775 :
                            sta_count === 4 ? theta_75_root += 1.31108 :
                                sta_count === 5 ? theta_75_root += 1.05108:
                                    sta_count === 6 ? theta_75_root += 0.85108:20
            }

        }
        else if (type === "Extender1")
        {
            if(angle_value === 45)
            {
                x = sta_count === 1 ? angle_x + r * math.cos(3*theta_ext1) :
                    sta_count === 2 ? angle_x + r * math.cos(3.93169-(2*theta_ext1)):
                        sta_count === 4 ? angle_x + r * math.cos(theta_ext1_4):
                            sta_count === 5 ? angle_x + r * math.cos(theta_ext1_5):
                                sta_count === 6 ? angle_x + r * math.cos(theta_ext1_6): angle_x + r * math.cos(theta_ext1)

                y = sta_count === 1 ? angle_y + r * math.sin(3*theta_ext1) :
                    sta_count === 2 ? angle_y + r * math.sin(3.93169-(2*theta_ext1)):
                        sta_count === 4 ? angle_y + r * math.sin(theta_ext1_4):
                            sta_count === 5 ? angle_y + r * math.sin(theta_ext1_5):
                                sta_count === 6 ? angle_y + r * math.sin(theta_ext1_6): angle_y + r * math.sin(theta_ext1)

                sta_count === 1 ? theta_ext1 += 0 :
                    sta_count === 2 ? theta_ext1 += 1.56736 :
                        sta_count === 3 ? theta_ext1 += 0.78108+theta_ext1: //2.13409 :
                            sta_count === 4 && theta_ext1_4 !== 3.48 ? theta_ext1_4+= 1.275 : sta_count === 4 && theta_ext1_4 === 3.48  ? theta_ext1_4 += 2.479:
                                sta_count === 5 && theta_ext1_5 !== 3.6799999999999997 ? theta_ext1_5 += 1.05 : sta_count === 5 && theta_ext1_5 === 3.6799999999999997 ? theta_ext1_5 += 2.07:
                                    sta_count === 6 && theta_ext1_6 !== 3.81 ? theta_ext1_6+= 0.90: sta_count === 6 && theta_ext1_6 === 3.81 ? theta_ext1_6 += 1.83:20
            }
            else if(angle_value === 90)
            {
                x = sta_count === 1 ? angle_x + r * math.cos(3.13858) :
                    sta_count === 2 ? angle_x + r * math.cos(3.92966-theta_ext1): angle_x + r * math.cos(theta_ext1)
                y = sta_count === 1 ? angle_y + r * math.sin(3.13858) :sta_count === 2 ? angle_y + r * math.sin(3.92966-theta_ext1):angle_y + r * math.sin(theta_ext1)
                sta_count === 1 ? theta_ext1 += 0 : sta_count === 2 ? theta_ext1 += 3.1456: sta_count === 3 ? theta_ext1 += 2.3475 : sta_count === 4 ? theta_ext1 += 1.56736 :
                    sta_count === 5 && theta_ext1 ===  5.49316 ? theta_ext1 +=0.78014: sta_count === 5 && theta_ext1 !==  5.49316 ? theta_ext1 +=1.56736:
                        sta_count === 6 && (theta_ext1 === 0.79108 || theta_ext1 === 3.9187199999999995) ? theta_ext1 += 1.56736:
                            sta_count === 6 && (theta_ext1 !== 0.79108 || theta_ext1 !== 3.9187199999999995) ? theta_ext1 += 0.78014:20
            }
        }

        else if (type === "Extender2")

        {
            if(angle_value === 45)
            {
                x = sta_count === 1 ? angle_x + r * math.cos(theta_ext2) :
                    sta_count === 2 ? angle_x + r * math.cos(theta_ext2):
                        sta_count === 3 ? angle_x + r * math.cos(theta_ext2):
                            sta_count === 4 ? angle_x + r * math.cos(theta_ext2_4):
                                sta_count === 5 ? angle_x + r * math.cos(theta_ext2_5):
                                    sta_count === 6 ? angle_x + r * math.cos(theta_ext2_6): angle_x + r * math.cos(theta_ext2)


                y = sta_count === 1 ? angle_y + r * math.sin(theta_ext2) :
                    sta_count === 2 ? angle_y + r * math.sin(theta_ext2):
                        sta_count === 3 ? angle_y + r * math.sin(theta_ext2):
                            sta_count === 4 ? angle_y + r * math.sin(theta_ext2_4):
                                sta_count === 5 ? angle_y + r * math.sin(theta_ext2_5):
                                    sta_count === 6 ? angle_y + r * math.sin(theta_ext2_6): angle_y + r * math.sin(theta_ext2)

                sta_count === 1 ? theta_ext2 += 0 :
                    sta_count === 2 ? theta_ext2 += 3.12 :
                        sta_count === 3 ? theta_ext2 += 1.55922 :
                            sta_count === 4 && theta_ext2_4 !== 3.48 ? theta_ext2_4+= 1.275 : sta_count === 4 && theta_ext2_4 === 3.48  ? theta_ext2_4 += 2.479:
                                sta_count === 5 && theta_ext2_5 !== 3.6799999999999997 ? theta_ext2_5 += 1.05 : sta_count === 5 && theta_ext2_5 === 3.6799999999999997 ? theta_ext2_5 += 2.07:
                                    sta_count === 6 && theta_ext2_6 !== 3.81 ? theta_ext2_6+= 0.90: sta_count === 6 && theta_ext2_6 === 3.81 ? theta_ext2_6 += 1.83:20
            }
            else if (angle_value === 90)
            {
                x = sta_count === 1 ? angle_x + r * math.cos(3.13858) : sta_count === 2 ? angle_x + r * math.cos(3.92966-theta_ext2):angle_x + r * math.cos(theta_ext2)
                y = sta_count === 1 ? angle_y + r * math.sin(3.13858) :sta_count === 2 ? angle_y + r * math.sin(3.92966-theta_ext2):angle_y + r * math.sin(theta_ext2)
                sta_count === 1 ? theta_ext2 += 0 : sta_count === 2 ? theta_ext2 += 3.1456: sta_count === 3 ? theta_ext2 += 2.3475 : sta_count === 4 ? theta_ext2 += 1.56736 :
                    sta_count === 5 && theta_ext2 ===  5.49316 ? theta_ext2 +=0.78014: sta_count === 5 && theta_ext2 !==  5.49316 ? theta_ext2 +=1.56736:
                        sta_count === 6 && (theta_ext2 === 0.79108 || theta_ext2 === 3.9187199999999995) ? theta_ext2 += 1.56736:
                            sta_count === 6 && (theta_ext2 !== 0.79108 || theta_ext2 !== 3.9187199999999995) ? theta_ext2 += 0.78014:20
            }


        }
        else if (type === "Extender3")
        {
            if(angle_value === 90)
            {
                x = sta_count === 1 ? angle_x + r * math.cos(3.13858) : sta_count === 2 ? angle_x + r * math.cos(3.92966-theta_ext3):angle_x + r * math.cos(theta_ext3)
                y = sta_count === 1 ? angle_y + r * math.sin(3.13858) : sta_count === 2 ? angle_y + r * math.sin(3.92966-theta_ext3):angle_y + r * math.sin(theta_ext3)
                sta_count === 1 ? theta_ext3 += 0 : sta_count === 2 ? theta_ext3 += 3.1456: sta_count === 3 ? theta_ext3 += 2.3475 : sta_count === 4 ? theta_ext3 += 1.56736 :
                    sta_count === 5 && theta_ext3 ===  5.49316 ? theta_ext3 +=0.78014: sta_count === 5 && theta_ext3 !==  5.49316 ? theta_ext3 +=1.56736:
                        sta_count === 6 && (theta_ext3 === 0.79108 || theta_ext3 === 3.9187199999999995) ? theta_ext3 += 1.56736:
                            sta_count === 6 && (theta_ext3 !== 0.79108 || theta_ext3 !== 3.9187199999999995) ? theta_ext3 += 0.78014:20
            }
            else if(angle_value === 45)
            {
                x = sta_count === 1 ? angle_x + r * math.cos(theta_ext3) :
                    sta_count === 2 ? angle_x + r * math.cos(theta_ext3):
                        sta_count === 3 ? angle_x + r * math.cos(theta_ext3):
                            sta_count === 4 ? angle_x + r * math.cos(theta_ext3_4):
                                sta_count === 5 ? angle_x + r * math.cos(theta_ext3_5):
                                    sta_count === 6 ? angle_x + r * math.cos(theta_ext3_6): angle_x + r * math.cos(theta_ext3)


                y = sta_count === 1 ? angle_y + r * math.sin(theta_ext3) :
                    sta_count === 2 ? angle_y + r * math.sin(theta_ext3):
                        sta_count === 3 ? angle_y + r * math.sin(theta_ext3):
                            sta_count === 4 ? angle_y + r * math.sin(theta_ext3_4):
                                sta_count === 5 ? angle_y + r * math.sin(theta_ext3_5):
                                    sta_count === 6 ? angle_y + r * math.sin(theta_ext3_6): angle_y + r * math.sin(theta_ext3)

                sta_count === 1 ? theta_ext3 += 0 :
                    sta_count === 2 ? theta_ext3 += 3.12 :
                        sta_count === 3 ? theta_ext3 += 1.55922 :
                            sta_count === 4 && theta_ext3_4 !== 3.48 ? theta_ext3_4+= 1.275 : sta_count === 4 && theta_ext3_4 === 3.48  ? theta_ext3_4 += 2.479:
                                sta_count === 5 && theta_ext3_5 !== 3.6799999999999997 ? theta_ext3_5 += 1.05 : sta_count === 5 && theta_ext3_5 === 3.6799999999999997 ? theta_ext3_5 += 2.07:
                                    sta_count === 6 && theta_ext3_6 !== 3.81 ? theta_ext3_6+= 0.90: sta_count === 6 && theta_ext3_6 === 3.81 ? theta_ext3_6 += 1.83:20
            }
            else if(angle_value === 75)
            {
                x = sta_count === 1 ? angle_x + r * math.cos(3*theta_ext33) :
                    sta_count === 2 ? angle_x + r * math.cos(3.93169-(2*theta_ext33)):
                        sta_count === 4 ? angle_x + r * math.cos(theta_ext33_4):
                            sta_count === 5 ? angle_x + r * math.cos(theta_ext33_5):
                                sta_count === 6 ? angle_x + r * math.cos(theta_ext33_6): angle_x + r * math.cos(theta_ext33)

                y = sta_count === 1 ? angle_y + r * math.sin(3*theta_ext33) :
                    sta_count === 2 ? angle_y + r * math.sin(3.93169-(2*theta_ext33)):
                        sta_count === 4 ? angle_y + r * math.sin(theta_ext33_4):
                            sta_count === 5 ? angle_y + r * math.sin(theta_ext33_5):
                                sta_count === 6 ? angle_y + r * math.sin(theta_ext33_6): angle_y + r * math.sin(theta_ext33)

                sta_count === 1 ? theta_ext33 += 0 :
                    sta_count === 2 ? theta_ext33 += 1.56736 :
                        sta_count === 3 ? theta_ext33 += 0.78108+theta_ext33: //2.13409 :
                            sta_count === 4 && theta_ext33_4 !== 3.48 ? theta_ext33_4+= 1.275 : sta_count === 4 && theta_ext33_4 === 3.48  ? theta_ext33_4 += 2.479:
                                sta_count === 5 && theta_ext33_5 !== 3.6799999999999997 ? theta_ext33_5 += 1.05 : sta_count === 5 && theta_ext33_5 === 3.6799999999999997 ? theta_ext33_5 += 2.07:
                                    sta_count === 6 && theta_ext33_6 !== 3.81 ? theta_ext33_6+= 0.90: sta_count === 6 && theta_ext33_6 === 3.81 ? theta_ext33_6 += 1.83:20
            }


        }
        return {x:x,y:y};
    }


    set_ap_positions = (ap_count)  => {
        let x = 0
        let y = 0
        let r = 80;
        x = ap_count === 1 ? 500 + r * math.cos(1.57517) :0
        y = ap_count === 1 ? 180 + r * math.sin(1.57517):0
        ap_count === 1 ? ap_theta += 0 :
            ap_count === 2 ? ap_theta += 1.56736 :0
        return {x:x,y:y};
    }


    render()
    {

        let is_GW_exist = false;
        let node_type = ''
        let root_name = ''
        let ext_name = ''
        let ext2_name = ''
        let ext3_name = ''
        let sta_name = ''
        let data_node = []
        let link_data = []
        let root_mac = ''
        let ext_mac = ''
        let ext2_mac = ''
        let ext3_mac = ''
        let gateway_angle = []
        let root_angle = []
        let ext_angle = []
        let ext2_angle = []
        let ext3_angle = []
        let x = 0;
        let y = 0;
        let angle = 90

        let gateway_counter = 1;
        let gateway_sta_list_counter = 1;
        let root_sta_counter = 1;
        let root_sta_list_counter = 1;

        let ext_sta_counter = 1;
        let ext_sta_list_counter = 1;

        let ext2_sta_counter = 1;
        let ext2_sta_list_counter = 1;

        let ext3_sta_counter = 1;
        let ext3_sta_list_counter = 1;
        let gateway_sta_list = [];
        let root_sta_list = [];
        let ext_sta_list = []
        let ext2_sta_list = []
        let ext3_sta_list = []

        let ext_connection = this.props.topology_stat.extender1?.connectionType;
        let ext_parentMac = this.props.topology_stat.extender1?.parentMacAddress;
        let ext2_connection = this.props.topology_stat.extender2?.connectionType;
        let ext2_parentMac = this.props.topology_stat.extender2?.parentMacAddress;
        let ext3_connection = this.props.topology_stat.extender3?.connectionType;
        let ext3_parentMac = this.props.topology_stat.extender3?.parentMacAddress;
        let ext3_state = this.props.topology_stat.extender3
        let all_gateway = ext_connection === "ethernet" && ext2_connection === "ethernet"&& ext3_connection === "ethernet"
        this.props.topology_information.map((item) =>

        {
            node_type = item.nodeType
            if(node_type === "GW")
            {
                is_GW_exist = true
                this.props.topology_stat.extender1 === undefined ? y = 100 : y = 140
                let data = {"ip":item.lookupInfo.ip,"mac":item.nodeMacAddress,"lastseen":item.lastSeenTime,"vendor":item.lookupInfo.vendorName}
                if((ext_connection === "ethernet" || ext2_connection === "ethernet") && !all_gateway)
                {
                    x = 500+60*math.cos(6.28)
                    y = 80+60*math.sin(6.28)
                    data_node.push(this.create_gw_node("GW","GATEWAY",x,y,"GW",data))
                    data_node.push(this.create_hidden_node(500,100))
                    data_node.push(this.create_hidden_node1((499.5+60*math.cos(6.28)),(100+60*math.sin(6.28))))
                    data_node.push(this.create_hidden_node2((500+60*math.cos(3.14)),(100+60*math.sin(3.14))))
                    data_node.push(this.create_hidden_node3((510+78*math.cos(5.40)),(160+78*math.sin(5.40))))
                    link_data.push(this.create_ap_ethernet_link("GW","staHidden1","ethernet"))
                    link_data.push(this.create_ap_ethernet_link("staHidden1","staHidden","ethernet"))
                    ext2_connection === "ethernet" ? link_data.push(this.create_ap_ethernet_link("staHidden","staHidden2","ethernet")): ""
                    gateway_angle = {
                        x:x,
                        y:y,
                        angle:90,
                    }
                }
                else if(all_gateway)
                {
                    x = 530+60*math.cos(6.28)
                    y = 100+60*math.sin(6.28)
                    data_node.push(this.create_gw_node("GW","GATEWAY",x,y,"GW",data))
                    data_node.push(this.create_hidden_node(510,100))
                    data_node.push(this.create_hidden_node1((500+60*math.cos(6.28)),(100+60*math.sin(6.28))))
                    data_node.push(this.create_hidden_node2((500+60*math.cos(3.14)),(100+60*math.sin(3.14))))
                    data_node.push(this.create_hidden_node3((500+78*math.cos(5.40)),(160+78*math.sin(5.40))))
                    data_node.push(this.create_hidden_node4((545+70*math.cos(3.14)),(100+70*math.sin(3.14))))
                    link_data.push(this.create_ap_ethernet_link("GW","staHidden1","ethernet"))
                    link_data.push(this.create_ap_ethernet_link("staHidden1","staHidden","ethernet"))
                    link_data.push(this.create_ap_ethernet_link("staHidden","staHidden2","ethernet"))
                    gateway_angle = {
                        x:x,
                        y:y,
                        angle:90,
                    }
                }
                else {
                    x = 500
                    y = 100
                    data_node.push(this.create_gw_node("GW","GATEWAY",x,y,"GW",data))
                    gateway_angle = {
                        x:x,
                        y:y,
                        angle:90,
                    }
                }
            }


            if(node_type === "Root")
            {
                root_name = item.lookupInfo.givenName ? item.lookupInfo.givenName : item.nodeMacAddress;
                root_mac = item.nodeMacAddress
                x = all_gateway ? 510 : 500
                y = 160
                let ap_data = {"ip":item.lookupInfo.ip,"mac":root_mac,"twoFourSsid":item.ssid2,"fiveSsid":item.ssid5,"twoFourChannel":item.channel2,
                    "fiveChannel":item.channel5 , "lastseen":item.lastSeenTime,"vendor":item.lookupInfo.vendorName}
                let angle = ext_connection === "wireless" && ext2_connection === "ethernet" ? angle = 45:
                    ext_connection === "ethernet" && ext2_connection === "wireless" ? angle = 75:
                        angle = 90;
                root_angle = {
                    x:x,
                    y:y,
                    angle:angle,
                }
                if(ext_connection === "ethernet" || ext2_connection === "ethernet" )
                {
                    data_node.push(this.create_ap_ethernet_node(root_mac,root_name,x,y,"Root",ap_data))
                    link_data.push(this.create_ap_ethernet_link(root_mac,"staHidden","ethernet"))
                }
                else
                {

                    data_node.push(this.create_ap_ethernet_node(root_mac,root_name,x,y,"Root",ap_data))
                    link_data.push(this.create_ap_ethernet_link(root_mac,"GW","ethernet"))
                    data_node.push(this.create_hidden_node(500,300))
                }


            }
            if(node_type === "Extender")
            {


                if(item.nodeMacAddress === this.props.topology_stat.extender1.macAddress) {
                    ext_name = item.lookupInfo.givenName ? item.lookupInfo.givenName : item.nodeMacAddress;
                    ext_mac = item.nodeMacAddress
                    let ext_data = {
                        "ip": item.lookupInfo.ip,
                        "mac": ext_mac,
                        "twoFourSsid": item.ssid2,
                        "fiveSsid": item.ssid5,
                        "twoFourChannel": item.channel2,
                        "fiveChannel": item.channel5,
                        "lastseen": item.lastSeenTime,
                        "vendor": item.lookupInfo.vendorName
                    }
                    if(ext_connection === "wireless")
                    {

                        let x = 500
                        let y = 260
                        if(ext2_connection === "ethernet" || ext2_parentMac === root_mac)
                        {
                            x = 500 + 80 * math.cos(0.79)
                            y = 200 + 80 * math.sin(0.79)
                            angle= 45
                        }
                        ext_angle = {
                            x:x,
                            y:y,
                            angle:angle,
                        }
                        let ethernet_link = this.create_ap_ethernet_link(ext_mac, root_mac, "ethernet")
                        let wireless_link = this.create_ap_wireless_link(ext_mac, root_mac, "wireless")
                        let link = ext_connection === "ethernet" ? ethernet_link : wireless_link
                        data_node.push(this.create_ap_ethernet_node(ext_mac, ext_name, x, y, "Extender", ext_data))
                        link_data.push(link)
                    }
                    else if(ext_connection === "ethernet")
                    {
                        let x = all_gateway ? (500 + 80 * math.cos(0.90)) : (510 + 80 * math.cos(0.90))
                        let y = all_gateway ? (-30 + 80 * math.sin(0.90)) : (192 + 80 * math.sin(0.90))

                        angle = 90;
                        ext_angle = {
                            x:x,
                            y:y,
                            angle:angle,
                        }
                        data_node.push(this.create_ap_ethernet_node(ext_mac, ext_name, x, y, "Extender", ext_data))
                        link_data.push(this.create_ap_ethernet_link(ext_mac, "staHidden3", "ethernet"))
                    }


                }

                else if(item.nodeMacAddress === this.props.topology_stat.extender2.macAddress)
                {
                    ext2_name = item.lookupInfo.givenName ? item.lookupInfo.givenName : item.nodeMacAddress;
                    ext2_mac = item.nodeMacAddress
                    let ext_data = {
                        "ip": item.lookupInfo.ip,
                        "mac": ext2_mac,
                        "twoFourSsid": item.ssid2,
                        "fiveSsid": item.ssid5,
                        "twoFourChannel": item.channel2,
                        "fiveChannel": item.channel5,
                        "lastseen": item.lastSeenTime,
                        "vendor": item.lookupInfo.vendorName
                    }

                    if(ext2_connection === "wireless" && ext2_parentMac === root_mac)
                    {
                        x = 500 + 80 * math.cos(2.35)
                        y = 200 + 80 * math.sin(2.35)
                        angle = 45;
                        ext2_angle = {
                            x:x,
                            y:y,
                            angle:angle
                        }
                        let wireless_link = this.create_ap_wireless_link(ext2_mac,root_mac,"wireless")
                        let ethernet_link = this.create_ap_ethernet_link(ext2_mac,root_mac,"ethernet")
                        let link = ext2_connection === "wireless" ? wireless_link : ethernet_link
                        data_node.push(this.create_ap_ethernet_node(ext2_mac, ext2_name, x, y, "Extender2", ext_data))
                        link_data.push(link)
                    }
                    else if(ext2_connection === "ethernet" )
                    {
                        x = 500 + 80 * math.cos(2.41)
                        y = all_gateway ? 200 + 80 * math.sin(2.41) : 200 + 80 * math.sin(2.41)
                        ext2_angle = {
                            x:x,
                            y:y,
                            angle:90
                        }
                        data_node.push(this.create_ap_ethernet_node(ext2_mac, ext2_name, x, y, "Extender2", ext_data))
                        link_data.push(this.create_ap_ethernet_link(ext2_mac,"staHidden2","ethernet"))
                    }



                    else if(ext2_connection === "wireless" && ext2_parentMac === ext_mac)
                    {
                        ext2_name = item.lookupInfo.givenName ? item.lookupInfo.givenName : item.nodeMacAddress;
                        ext2_mac = item.nodeMacAddress
                        let connection_type = this.props.topology_stat.extender1.connectionType;
                        x = 500
                        y = 340
                        connection_type === "wireless" ? angle = 90 : angle = 45;
                        ext2_angle = {
                            x:x,
                            y:y,
                            angle:90,
                        }
                        data_node.push(this.create_ap_ethernet_node(ext2_mac, ext2_name, x, y, "Extender2", ext_data))
                        link_data.push(this.create_ap_wireless_link(item.parentMacAddress, ext2_mac,"wireless"))
                    }


                }

                else if(item.nodeMacAddress === this.props.topology_stat.extender3.macAddress)
                {
                    ext3_name = item.lookupInfo.givenName ? item.lookupInfo.givenName : item.nodeMacAddress;
                    ext3_mac = item.nodeMacAddress;
                    let ext_data = {
                        "ip": item.lookupInfo.ip,
                        "mac": ext3_mac,
                        "twoFourSsid": item.ssid2,
                        "fiveSsid": item.ssid5,
                        "twoFourChannel": item.channel2,
                        "fiveChannel": item.channel5,
                        "lastseen": item.lastSeenTime,
                        "vendor": item.lookupInfo.vendorName
                    }
                    if(ext3_connection === "ethernet" && !all_gateway)
                    {
                        x = 500
                        y = 360
                        ext3_angle = {
                            x:x,
                            y:y,
                            angle:90,
                        }
                        data_node.push(this.create_ap_ethernet_node(ext3_mac, ext3_name, x, y, "Extender3", ext_data))
                        data_node.push(this.create_hidden_node5((550+60*math.cos(6.28)),(100+60*math.sin(6.28))))
                        data_node.push(this.create_hidden_node6(550+60*math.cos(6.28),360))
                        link_data.push(this.create_ap_ethernet_link("staHidden5","staHidden1","ethernet"))
                        link_data.push(this.create_ap_ethernet_link("staHidden6","staHidden5","ethernet"))
                        link_data.push(this.create_ap_ethernet_link(ext3_mac,"staHidden6","ethernet"))



                    }
                    else if(ext3_connection === "ethernet" && all_gateway)
                    {
                        x = 545 + 70 * math.cos(3.14);
                        y = -60 + 70 * math.sin(3.14)
                        ext3_angle = {
                            x:x,
                            y:y,
                            angle:90,
                        }
                        data_node.push(this.create_ap_ethernet_node(ext3_mac, ext3_name, x, y, "Extender3", ext_data))
                        link_data.push(this.create_ap_ethernet_link(ext3_mac,"staHidden4","ethernet"))

                    }
                    else if(ext3_connection === "wireless")
                    {
                        x = 500
                        y = 360
                        ext3_angle = {
                            x:x,
                            y:y,
                            angle:ext3_parentMac === root_mac ? 90 : ext3_parentMac === ext_mac ? 45 : ext3_parentMac === ext2_mac ? 75 : 90,
                        }
                        data_node.push(this.create_ap_ethernet_node(ext3_mac, ext3_name, x, y, "Extender3", ext_data))
                        link_data.push(this.create_ap_wireless_link(ext3_mac,ext3_parentMac,"wireless"))
                    }

                }
            }



            if(node_type === "STA")
            {

                if(item.parentMacAddress === root_mac)
                {
                    sta_name = item.lookupInfo.givenName ? item.lookupInfo.givenName : (item.lookupInfo.friendlyName ? item.lookupInfo.friendlyName : item.nodeMacAddress)
                    let sta_count = this.props.topology_stat.root.staCount !== undefined ? this.props.topology_stat.root.staCount : 1;

                    let link = this.find_link_type(item.linkType);
                    let link_style = link.style; let linkName = link.name; let staLinkName = link.name;
                    let find_sta_style = this.find_sta_style(item.rssi? item.rssi : null);
                    let sta_style = find_sta_style.style;
                    let sta_rssi = find_sta_style.rssiType;
                    let type = "Root";
                    let set_position;
                    this.props.topology_stat.extender1=== undefined ? set_position = this.set_sta_positions(sta_count,type) :
                        set_position = this.set_sta_positions_with_extender(sta_count,type,root_angle.x,root_angle.y,root_angle.angle);
                    x = set_position.x;
                    y = set_position.y;
                    let data = {"ip":item.lookupInfo.ip,"mac":item.nodeMacAddress,"rssi":item.rssi,"downlink":item.txRate,"uplink":item.rxRate,
                        "lastseen":item.lastSeenTime,"vendor":item.lookupInfo.vendorName? item.lookupInfo.vendorName : "undefined","from":root_name,"to":sta_name,"linkType":staLinkName}
                    let staStyle = {"color":sta_style.color,"borderColor":sta_style.borderColor,"borderWidth":sta_style.borderWidth};
                    let linkStyle = {"color":link_style.color,"curveness":link_style.curveness,"type":link_style.type,"width":link_style.width};

                    if(root_sta_list_counter < sta_count)
                    {
                        root_sta_list.push(data);
                        root_sta_list_counter++;
                    }
                    else if(root_sta_list_counter === sta_count)
                    {
                        root_sta_list.push(data);
                        root_sta_list_counter++;
                    }

                    if((sta_count < 6 && this.props.topology_stat.extender1 === undefined) || (sta_count < 7 && this.props.topology_stat.extender1 !== undefined))
                    {
                        data_node.push(this.create_sta_wireless_node(item.nodeMacAddress,sta_name,x,y,'STA',data,staStyle))
                        link_data.push(this.create_sta_wireless_link(item.nodeMacAddress,root_mac,"wireless",data,linkStyle))

                    }
                    else if(sta_count > 6 && this.props.topology_stat.extender1 !== undefined )
                    {

                        while (root_sta_counter< 2)
                        {

                            data_node.push(this.create_excessive_sta_wireless_node("root_ap_sta",this.props.topology_stat.root.staCount.toString(),(root_angle.x+18*math.cos(5.50)),(root_angle.y+18*math.sin(5.50)),"rootSta",root_sta_list))
                            link_data.push(this.create_excessive_sta_wireless_link("root_ap_sta",root_mac))
                            root_sta_counter++;
                        }
                    }
                    else if(sta_count >7 && this.props.topology_stat.extender1 === undefined )
                    {
                        while (root_sta_counter<=1)
                        {

                            data_node.push(this.create_excessive_sta_wireless_node("root_ap_sta",this.props.topology_stat.root.staCount.toString(),(root_angle.x+18*math.cos(2.26)),(root_angle.y+18*math.sin(5.50)),"rootSta",root_sta_list))
                            link_data.push(this.create_excessive_sta_wireless_link("root_ap_sta",root_mac))
                            root_sta_counter++;
                        }
                    }
                    else{
                        data_node.push(this.create_sta_wireless_node(item.nodeMacAddress,sta_name,x,y,'STA',data,staStyle))
                        link_data.push(this.create_sta_wireless_link(item.nodeMacAddress,root_mac,"wireless",data,linkStyle))
                    }

                }
                if(item.parentMacAddress === ext_mac)
                {
                    sta_name = item.lookupInfo.givenName ? item.lookupInfo.givenName : (item.lookupInfo.friendlyName ? item.lookupInfo.friendlyName : item.nodeMacAddress)
                    let link = this.find_link_type(item.linkType);
                    let link_style = link.style; let linkName = link.name; let staLinkName = link.name;
                    let find_sta_style = this.find_sta_style(item.rssi? item.rssi : null);
                    let sta_style = find_sta_style.style;
                    let sta_count = this.props.topology_stat.extender1.staCount;
                    let type = "Extender1"
                    let set_position = this.set_sta_positions_with_extender(sta_count,type,ext_angle.x,ext_angle.y,ext_angle.angle)
                    x = set_position.x;
                    y = set_position.y;
                    let data = {"ip":item.lookupInfo.ip,"mac":item.nodeMacAddress,"rssi":item.rssi,"downlink":item.txRate,"uplink":item.rxRate,
                        "lastseen":item.lastSeenTime,"vendor":item.lookupInfo.vendorName? item.lookupInfo.vendorName : "undefined","from":root_name,"to":sta_name,"linkType":staLinkName}
                    let staStyle = {"color":sta_style.color,"borderColor":sta_style.borderColor,"borderWidth":sta_style.borderWidth};
                    let linkStyle = {"color":link_style.color,"curveness":link_style.curveness,"type":link_style.type,"width":link_style.width};
                    if(ext_sta_list_counter < sta_count)
                    {
                        ext_sta_list.push(data);
                        ext_sta_list_counter++;
                    }
                    else if(ext_sta_list_counter === sta_count)
                    {
                        ext_sta_list.push(data);
                        ext_sta_list_counter++;
                    }



                    if(sta_count > 6)
                    {
                        while (ext_sta_counter< 2)
                        {
                            data_node.push(this.create_excessive_sta_wireless_node("ext_ap_sta",this.props.topology_stat.extender1.staCount.toString(),(ext_angle.x+18*math.cos(5.50)),(ext_angle.y+18*math.sin(5.50)),"extSta",ext_sta_list))
                            link_data.push(this.create_excessive_sta_wireless_link("ext_ap_sta",ext_mac))
                            ext_sta_counter++;
                        }
                    }
                    else
                    {
                        data_node.push(this.create_sta_wireless_node(item.nodeMacAddress,sta_name,x,y,'STA',data,staStyle))
                        link_data.push(this.create_sta_wireless_link(item.nodeMacAddress,ext_mac,"wireless",data,linkStyle))
                    }


                }
                if(item.parentMacAddress === ext2_mac)
                {
                    sta_name = item.lookupInfo.givenName ? item.lookupInfo.givenName : (item.lookupInfo.friendlyName ? item.lookupInfo.friendlyName : item.nodeMacAddress)
                    let link = this.find_link_type(item.linkType);
                    let link_style = link.style; let linkName = link.name; let staLinkName = link.name;
                    let find_sta_style = this.find_sta_style(item.rssi? item.rssi : null);
                    let sta_style = find_sta_style.style;
                    let sta_count = this.props.topology_stat.extender2.staCount;
                    let type = "Extender2"
                    let set_position = this.set_sta_positions_with_extender(sta_count,type,ext2_angle.x,ext2_angle.y,ext2_angle.angle)
                    x = set_position.x;
                    y = set_position.y;
                    let data = {"ip":item.lookupInfo.ip,"mac":item.nodeMacAddress,"rssi":item.rssi,"downlink":item.txRate,"uplink":item.rxRate,
                        "lastseen":item.lastSeenTime,"vendor":item.lookupInfo.vendorName? item.lookupInfo.vendorName : "undefined","from":root_name,"to":sta_name,"linkType":staLinkName}
                    let staStyle = {"color":sta_style.color,"borderColor":sta_style.borderColor,"borderWidth":sta_style.borderWidth};
                    let linkStyle = {"color":link_style.color,"curveness":link_style.curveness,"type":link_style.type,"width":link_style.width};
                    if(ext2_sta_list_counter < sta_count)
                    {
                        ext2_sta_list.push(data);
                        ext2_sta_list_counter++;
                    }
                    else if(ext2_sta_list_counter === sta_count)
                    {
                        ext2_sta_list.push(data);
                        ext2_sta_list_counter++;
                    }





                    if(sta_count > 6)
                    {
                        while (ext2_sta_counter< 2)
                        {
                            data_node.push(this.create_excessive_sta_wireless_node("ext2_ap_sta",this.props.topology_stat.extender2.staCount.toString(),
                                (ext2_angle.x+18*math.cos(5.50)),(ext2_angle.y+18*math.sin(5.50)),"ext2Sta",ext2_sta_list))
                            link_data.push(this.create_excessive_sta_wireless_link("ext2_ap_sta",ext2_mac))
                            ext2_sta_counter++;
                        }
                    }
                    else
                    {
                        data_node.push(this.create_sta_wireless_node(item.nodeMacAddress,sta_name,x,y,'STA',data,staStyle))
                        link_data.push(this.create_sta_wireless_link(item.nodeMacAddress,ext2_mac,"wireless",data,linkStyle))
                    }


                }
                if(item.parentMacAddress === ext3_mac)
                {
                    sta_name = item.lookupInfo.givenName ? item.lookupInfo.givenName : (item.lookupInfo.friendlyName ? item.lookupInfo.friendlyName : item.nodeMacAddress)
                    let link = this.find_link_type(item.linkType);
                    let link_style = link.style; let linkName = link.name; let staLinkName = link.name;
                    let find_sta_style = this.find_sta_style(item.rssi? item.rssi : null);
                    let sta_style = find_sta_style.style;
                    let sta_count = this.props.topology_stat.extender3.staCount;
                    let type = "Extender3"
                    let set_position = this.set_sta_positions_with_extender(sta_count,type,ext3_angle.x,ext3_angle.y,ext3_angle.angle)
                    x = set_position.x;
                    y = set_position.y;
                    let data = {"ip":item.lookupInfo.ip,"mac":item.nodeMacAddress,"rssi":item.rssi,"downlink":item.txRate,"uplink":item.rxRate,
                        "lastseen":item.lastSeenTime,"vendor":item.lookupInfo.vendorName? item.lookupInfo.vendorName : "undefined","from":root_name,"to":sta_name,"linkType":staLinkName}
                    let staStyle = {"color":sta_style.color,"borderColor":sta_style.borderColor,"borderWidth":sta_style.borderWidth};
                    let linkStyle = {"color":link_style.color,"curveness":link_style.curveness,"type":link_style.type,"width":link_style.width};

                    if(ext3_sta_list_counter < sta_count)
                    {
                        ext3_sta_list.push(data);
                        ext3_sta_list_counter++;
                    }
                    else if(ext3_sta_list_counter === sta_count)
                    {
                        ext3_sta_list.push(data);
                        ext3_sta_list_counter++;
                    }



                    if(sta_count > 6)
                    {
                        while(ext3_sta_counter<2)
                        {
                            data_node.push(this.create_excessive_sta_wireless_node("ext3_ap_sta",this.props.topology_stat.extender3.staCount.toString(),
                                (ext3_angle.x+15*math.cos(5.50)),(ext3_angle.y+15*math.sin(5.50)),"ext3Sta",ext3_sta_list))
                            link_data.push(this.create_excessive_sta_wireless_link("ext3_ap_sta",ext3_mac))
                            ext3_sta_counter++;
                        }
                    }
                    else
                    {
                        data_node.push(this.create_sta_wireless_node(item.nodeMacAddress,sta_name,x,y,'STA',data,staStyle))
                        link_data.push(this.create_sta_wireless_link(item.nodeMacAddress,ext3_mac,"wireless",data,linkStyle))
                    }

                }
                if(item.parentMacAddress === "ff:ff:ff:ff:ff:ff")
                {
                    sta_name = item.lookupInfo.givenName ? item.lookupInfo.givenName : (item.lookupInfo.friendlyName ? item.lookupInfo.friendlyName : item.nodeMacAddress)
                    let sta_count = this.props.topology_stat.ethernet.staCount;
                    let link = this.find_link_type(item.linkType);
                    let link_style = link.style; let linkName = link.name; let staLinkName = link.name;
                    let data = {"ip":item.lookupInfo.ip,"mac":item.nodeMacAddress,"rssi":item.rssi,"downlink":item.txRate,"uplink":item.rxRate,
                    "lastseen":item.lastSeenTime,"vendor":item.lookupInfo.vendorName? item.lookupInfo.vendorName : "undefined","from":root_name,"to":sta_name,"linkType":staLinkName}
                    if(gateway_sta_list_counter < sta_count)
                    {
                        gateway_sta_list.push(data);
                        gateway_sta_list_counter++;
                    }
                    else if(gateway_sta_list_counter=== sta_count)
                    {
                        gateway_sta_list.push(data);
                        gateway_sta_list_counter++;
                    }

                    while (gateway_counter < 2)
                    {
                        data_node.push(this.create_gateway_sta_node("gw_ap_sta",this.props.topology_stat.ethernet.staCount.toString(),
                        (all_gateway ? gateway_angle.x+30 : gateway_angle.x-35),(all_gateway ? gateway_angle.y+35:gateway_angle.y),"gwSta",gateway_sta_list,"Eth..."))
                        gateway_counter++;
                    }

                    
    

                }

            }
        })
        if(this.props.topology_information.length !== 0)
        {
            if(is_GW_exist === false) {
                this.props.topology_stat.extender1 === undefined ? y = 100 : y = 140
                let data = {
                    "ip": "unknown",
                    "mac": "unknown",
                    "lastseen": "unknown",
                    "vendor": "unknown"
                }
                if (this.props.topology_stat.extender1?.connectionType === "ethernet" || this.props.topology_stat.extender2?.connectionType === "ethernet") {
                    x = 500 + 60 * math.cos(6.28)
                    y = 80 + 60 * math.sin(6.28)
                    data_node.push(this.create_gw_node("GW", "GATEWAY", x, y, "GW", data))
                    data_node.push(this.create_hidden_node(500, 100))
                    data_node.push(this.create_hidden_node1((500 + 60 * math.cos(6.28)), (100 + 60 * math.sin(6.28))))
                    data_node.push(this.create_hidden_node2((500 + 60 * math.cos(3.14)), (100 + 60 * math.sin(3.14))))
                    data_node.push(this.create_hidden_node3((500 + 78 * math.cos(5.40)), (160 + 78 * math.sin(5.40))))

                    link_data.push(this.create_ap_ethernet_link("GW", "staHidden1", "ethernet"))
                    link_data.push(this.create_ap_ethernet_link("staHidden1", "staHidden", "ethernet"))
                    this.props.topology_stat.extender2?.parentMacAddress !== this.props.topology_stat.root?.macAddress ? link_data.push(this.create_ap_ethernet_link("staHidden", "staHidden2", "ethernet")) : ""
                }
                else {
                    x = 500
                    y = 100
                    data_node.push(this.create_gw_node("GW","GATEWAY",x,y,"GW",data))

                }
            }

        }

        //console.log("data node:     " + JSON.stringify(data_node));
        let topology_array_data = []
        let topology_array_links = []
        topology_array_data.push(data_node);
        topology_array_links.push(link_data)
        //console.log("topology array data    " + JSON.stringify(topology_array_data));

        const option = {
            title: {
                text: 'Network Topology '  + this.props.topology_time,
                textStyle:{
                    color:'#fff',
                    fontFamily:"Roboto",
                },
            },
            tooltip: {
                show: true,
                position: function (point, params, dom, rect, size) {
                    if(params.data.nodeType === 'GW')
                    {
                        return [0, '68%'];
                    }
                    else if (params.dataType === 'edge')
                    {
                       return [0,'66%']
                    }
                    else if (params.data.nodeType === 'STA')
                    {
                        return [0,'55%']
                    }
                    else if(params.data.nodeType === 'rootSta' || params.data.nodeType === 'extSta' || params.data.nodeType === 'ext2Sta' || params.data.nodeType === 'ext3Sta' || params.data.nodeType === 'gwSta')
                    {
                        let edge_position = []
                        let sta_count = parseInt(params.data.labelText)
                        if(sta_count <= 7)
                        {
                            edge_position = [0,'60%']     
                        }
                        else if(sta_count > 7 && sta_count < 12) {
                            edge_position = [0,'40%']
                        }
                        else if(sta_count >= 12 && sta_count <= 15)
                        {
                            edge_position = [0,'30%']
                        }
                        else if(sta_count > 15 && sta_count <= 18)
                        {
                            edge_position = [0,'20%']

                        }
                        else if(sta_count > 18)
                        {
                            edge_position = [0,0]
                        }
                        return edge_position
                    }
                    else
                    {
                        return [0,'55%']
                    }
                },
                trigger:'item',
                triggerOn: "mousemove",
                enterable:false,
                backgroundColor:'rgba(38,45,60,0.90)',
                formatter:function (params) {
                    if (params.dataType === 'edge')
                    {
                        if (params.data.linkType === 'wireless') {
                            let component =  '<div style="width:100vw;height:100vw;float:left;">'+
                            '<div style="margin:0 50px;"><div style="width:20px;height:20px;border-radius:10px;background-color:' + params.color + ';float:left;margin-right:2%"></div>' +'<div style="color:#ffffff;font-size:18px;font-weight:bold;">'+ params.data.data.linkType.toUpperCase() + '</div></div>'+
                            '<div style="margin:5px 50px;font-size:16px;">'+'<table><thead><tr><td>FROM:</td><th>'+ params.data.data.from +'</th></tr><tr><td>TO:</td><th>' + params.data.data.to +'</th></tr>' +
                            '<tr><td>RSSI:</td><th>'+ params.data.data.rssi +'</th></tr><tr><td>Downlink:</td><th>'+ params.data.data.downLink + "  Mbps" +'</th></tr><tr><td>Uplink:</td><th>'+ params.data.data.upLink + "    Mbps" + '</th></tr>' + 
                            '</thead></table></div</div>'
                            return component
                        }
                    }

                    if (params.dataType === 'node') {
                        if (params.data.nodeType === 'GW') {                            
                            let component =  '<div style="width:100vw;height:100vw;float:left;">'+
                            '<div style="margin:0 30px;"><div style="width:20px;height:20px;border-radius:10px;background-color:' + params.color + ';float:left;margin-right:2%"></div>' +'<div style="color:#ffffff;font-size:18px;font-weight:bold;">'+params.data.labelText +  "     ( INTERNET )" + '</div></div>'+
                            '<div style="margin:10px 30px;font-size:16px;">'+'<table><thead><tr><td>Local IP:</td><th>'+ params.data.data.ip +'</th></tr><tr><td>MAC Address:</td><th>' + params.data.data.mac +'</th></tr><tr><td>Vendor:</td><th>' + params.data.data.vendor +'</th></tr><tr><td>Last Seen:</td><th>' + params.data.data.lastSeen   +'</th></tr></thead></table>' + '</div>'+
                            '</div>'


                            return component
                        }
                        else if (params.data.nodeType === 'Root') {
                            let b_style = 'border: 1px solid white;border-collapse: collapse;border-radius:10px;padding-right:5px;padding-left:5px';  
                            
                            let component =  '<div style="width:100vw;height:100vw;float:left;">'+
                            '<div style="margin:0 30px;"><div style="width:20px;height:20px;border-radius:10px;background-color:' + params.color + ';float:left;margin-right:2%"></div>' +'<div style="color:#ffffff;font-size:18px;font-weight:bold;">'+params.data.labelText +'</div></div>'+
                            '<div style="margin:10px 30px;font-size:16px">'+'<table><thead><tr><td>Local IP:</td><th>'+ params.data.data.ip +'</th></tr><tr><td>MAC Address:</td><th>' + params.data.data.mac +'</th></tr><tr><td>Vendor:</td><th>' + params.data.data.vendor +'</th></tr><tr><td>Last Seen:</td><th>' + params.data.data.lastSeen   +'</th></tr></thead></table>' + '</div>'+
                            '<div style="margin:0 30px;float:left"><table style="' + b_style+'"><thead><tr><th style="visibility:hidden"></th><td style="' + b_style+'">SSID</td><td style="' + b_style+'">Channel</td></tr></thead><tbody><tr><td style="' + b_style+'">2.4 GHz</td><th style="' + b_style+'">'+ params.data.data.twoFourSsid + '</th><th style="' + b_style+'">'+ params.data.data.twoFourChannel +'</th></tr><tr><td style="' + b_style+'">5 GHz</td><th style="' + b_style+'">'+ params.data.data.fiveSsid +'</th><th style="' + b_style+'">' + params.data.data.fiveChannel + '</th></tr></tbody></table></div>'+                            
                            '</div>'
                            return component


                        }
                        else if (params.data.nodeType === 'Extender') {
                            let b_style = 'border: 1px solid white;border-collapse: collapse;border-radius:10px;padding-right:5px;padding-left:5px';  
                            
                            let component =  '<div style="width:100vw;height:100vw;float:left;">'+
                            '<div style="margin:0 30px;"><div style="width:20px;height:20px;border-radius:10px;background-color:' + params.color + ';float:left;margin-right:2%"></div>' +'<div style="color:#ffffff;font-size:18px;font-weight:bold;">'+params.data.labelText + '</div></div>'+
                            '<div style="margin:10px 30px;font-size:16px;">'+'<table><thead><tr><td>Local IP:</td><th>'+ params.data.data.ip +'</th></tr><tr><td>MAC Address:</td><th>' + params.data.data.mac +'</th></tr><tr><td>Vendor:</td><th>' + params.data.data.vendor +'</th></tr><tr><td>Last Seen:</td><th>' + params.data.data.lastSeen   +'</th></tr></thead></table>' + '</div>'+
                            '<div style="margin:0 30px;float:left"><table style="' + b_style+'"><thead><tr><th style="visibility:hidden"></th><td style="' + b_style+'">SSID</td><td style="' + b_style+'">Channel</td></tr></thead><tbody><tr><td style="' + b_style+'">2.4 GHz</td><th style="' + b_style+'">'+ params.data.data.twoFourSsid + '</th><th style="' + b_style+'">'+ params.data.data.twoFourChannel +'</th></tr><tr><td style="' + b_style+'">5 GHz</td><th style="' + b_style+'">'+ params.data.data.fiveSsid +'</th><th style="' + b_style+'">' + params.data.data.fiveChannel + '</th></tr></tbody></table></div>'+                            
                            '</div>'


                            return component
                        }

                        else if (params.data.nodeType === 'Extender2') {
                            let b_style = 'border: 1px solid white;border-collapse: collapse;border-radius:10px;padding-right:5px;padding-left:5px';  
                            
                            let component =  '<div style="width:100vw;height:100vw;float:left;">'+
                            '<div style="margin:0 30px;"><div style="width:20px;height:20px;border-radius:10px;background-color:' + params.color + ';float:left;margin-right:2%"></div>' +'<div style="color:#ffffff;font-size:18px;font-weight:bold;">'+params.data.labelText + '</div></div>'+
                            '<div style="margin:10px 30px;font-size:16px;">'+'<table><thead><tr><td>Local IP:</td><th>'+ params.data.data.ip +'</th></tr><tr><td>MAC Address:</td><th>' + params.data.data.mac +'</th></tr><tr><td>Vendor:</td><th>' + params.data.data.vendor +'</th></tr><tr><td>Last Seen:</td><th>' + params.data.data.lastSeen   +'</th></tr></thead></table>' + '</div>'+
                            '<div style="margin:0 30px;float:left"><table style="' + b_style+'"><thead><tr><th style="visibility:hidden"></th><td style="' + b_style+'">SSID</td><td style="' + b_style+'">Channel</td></tr></thead><tbody><tr><td style="' + b_style+'">2.4 GHz</td><th style="' + b_style+'">'+ params.data.data.twoFourSsid + '</th><th style="' + b_style+'">'+ params.data.data.twoFourChannel +'</th></tr><tr><td style="' + b_style+'">5 GHz</td><th style="' + b_style+'">'+ params.data.data.fiveSsid +'</th><th style="' + b_style+'">' + params.data.data.fiveChannel + '</th></tr></tbody></table></div>'+                            
                            '</div>'


                            return component
                        }

                        else if (params.data.nodeType === 'Extender3') {
                            let b_style = 'border: 1px solid white;border-collapse: collapse;border-radius:10px;padding-right:5px;padding-left:5px';  
                            
                            let component =  '<div style="width:100vw;height:100vw;float:left;">'+
                            '<div style="margin:0 30px;"><div style="width:20px;height:20px;border-radius:10px;background-color:' + params.color + ';float:left;margin-right:2%"></div>' +'<div style="color:#ffffff;font-size:18px;font-weight:bold;">'+params.data.labelText + '</div></div>'+
                            '<div style="margin:10px 30px;font-size:16px;">'+'<table><thead><tr><td>Local IP:</td><th>'+ params.data.data.ip +'</th></tr><tr><td>MAC Address:</td><th>' + params.data.data.mac +'</th></tr><tr><td>Vendor:</td><th>' + params.data.data.vendor +'</th></tr><tr><td>Last Seen:</td><th>' + params.data.data.lastSeen   +'</th></tr></thead></table>' + '</div>'+
                            '<div style="margin:0 30px;float:left"><table style="' + b_style+'"><thead><tr><th style="visibility:hidden"></th><td style="' + b_style+'">SSID</td><td style="' + b_style+'">Channel</td></tr></thead><tbody><tr><td style="' + b_style+'">2.4 GHz</td><th style="' + b_style+'">'+ params.data.data.twoFourSsid + '</th><th style="' + b_style+'">'+ params.data.data.twoFourChannel +'</th></tr><tr><td style="' + b_style+'">5 GHz</td><th style="' + b_style+'">'+ params.data.data.fiveSsid +'</th><th style="' + b_style+'">' + params.data.data.fiveChannel + '</th></tr></tbody></table></div>'+                            
                            '</div>'


                            return component
                        }

                        else if (params.data.nodeType === 'STA') {
                            let b_style = 'border: 1px solid white;border-collapse: collapse;border-radius:10px;padding-right:5px;padding-left:5px';  
                            
                            let component =  '<div style="width:100vw;height:100vw;float:left;">'+
                            '<div style="margin:0 30px;"><div style="width:20px;height:20px;border-radius:10px;background-color:' + params.color + ';float:left;margin-right:2%"></div>' +'<div style="color:#ffffff;font-size:18px;font-weight:bold;">'+params.data.labelText + '</div></div>'+
                            '<div style="margin:10px 30px;font-size:16px;">'+'<table><thead><tr><td>Local IP:</td><th>'+ params.data.data.ip +'</th></tr><tr><td>MAC Address:</td><th>' + params.data.data.mac +'</th></tr><tr><td>Last Seen:</td><th>' + params.data.data.lastSeen   +'</th></tr>' +
                            '<tr><td>RSSI:</td><th>'+ params.data.data.rssi +'</th></tr><tr><td>Downlink:</td><th>'+ params.data.data.downLink + "  Mbps" + '</th></tr><tr><td>Uplink:</td><th>'+ params.data.data.upLink + "   Mbps" + '</th></tr><tr><td>Vendor:</td><th>' + params.data.data.vendor +'</th></tr>' + 
                            '</thead></table></div</div>'
                            return component
                        }
                        else if (params.data.nodeType === 'rootSta') {
                            //alert(JSON.stringify(params.data.seven_node));
                            let device = [];
                            //let ip = [];
                            let mac = [];
                            for(let i=0; i<params.data.sta_list.length;i++)
                            {
                                device += "<ul style=list-style-type:none;padding:1px;margin:1px><li>"+ eval(params.data.sta_list)[i]["to"].substr(0,12)+"</li></ul>"
                                mac += "<ul style=list-style-type:none;padding:1px;margin:1px><li>"  + eval(params.data.sta_list)[i]["mac"] +"</li></ul>"
                                //ip +=  "<li>" +eval(params.data.root_sta_list)[i]["ip"]+"</li>"
                            }
                            
                            return '<div style="width:100vw;height:100vw;float:left;">'+
                            '<div style="margin:0 20px;font-size:16px;"><table><tr><td>DEVICE NAME</td><td style="padding-left:50px;">MAC ADDRESS</td></tr><tr><th>'+ device +'</th><th style="padding-left:50px;">'+ mac +'</th></tr></table></div>'+
                            '</div>'
                        }
                        else if (params.data.nodeType === 'extSta') {
                            //alert(JSON.stringify(params.data.seven_node));
                            let device = [];
                            //let ip = [];
                            let mac = [];
                            for(let i=0; i<params.data.sta_list.length;i++)
                            {
                                device += "<ul style=list-style-type:none;padding:1px;margin:1px><li>"+ eval(params.data.sta_list)[i]["to"].substr(0,12)+"</li></ul>"
                                mac += "<ul style=list-style-type:none;padding:1px;margin:1px><li>"  + eval(params.data.sta_list)[i]["mac"] +"</li></ul>"
                                //ip +=  "<li>" +eval(params.data.root_sta_list)[i]["ip"]+"</li>"
                            }

                            return '<div style="width:100vw;height:100vw;float:left;">'+
                            '<div style="margin:0 20px;font-size:16px;"><table><tr><td>DEVICE NAME</td><td style="padding-left:50px;">MAC ADDRESS</td></tr><tr><th>'+ device +'</th><th style="padding-left:50px;">'+ mac +'</th></tr></table></div>'+
                            '</div>'
                        }
                        else if (params.data.nodeType === 'ext2Sta') {
                            //alert(JSON.stringify(params.data.seven_node));
                            let device = [];
                            //let ip = [];
                            let mac = [];
                            for(let i=0; i<params.data.sta_list.length;i++)
                            {
                                device += "<ul style=list-style-type:none;padding:1px;margin:1px><li>"+ eval(params.data.sta_list)[i]["to"].substr(0,12)+"</li></ul>"
                                mac += "<ul style=list-style-type:none;padding:1px;margin:1px><li>"  + eval(params.data.sta_list)[i]["mac"] +"</li></ul>"
                                //ip +=  "<li>" +eval(params.data.root_sta_list)[i]["ip"]+"</li>"
                            }

                            return '<div style="width:100vw;height:100vw;float:left;">'+
                            '<div style="margin:0 20px;font-size:16px;"><table><tr><td>DEVICE NAME</td><td style="padding-left:50px;">MAC ADDRESS</td></tr><tr><th>'+ device +'</th><th style="padding-left:50px;">'+ mac +'</th></tr></table></div>'+
                            '</div>'
                        }
                        else if (params.data.nodeType === 'ext3Sta') {
                            //alert(JSON.stringify(params.data.seven_node));
                            let device = [];
                            //let ip = [];
                            let mac = [];
                            for(let i=0; i<params.data.sta_list.length;i++)
                            {
                                device += "<ul style=list-style-type:none;padding:1px;margin:1px><li>"+ eval(params.data.sta_list)[i]["to"].substr(0,12)+"</li></ul>"
                                mac += "<ul style=list-style-type:none;padding:1px;margin:1px><li>"  + eval(params.data.sta_list)[i]["mac"] +"</li></ul>"
                                //ip +=  "<li>" +eval(params.data.root_sta_list)[i]["ip"]+"</li>"
                            }

                            return '<div style="width:100vw;height:100vw;float:left;">'+
                            '<div style="margin:0 20px;font-size:16px;"><table><tr><td>DEVICE NAME</td><td style="padding-left:50px;">MAC ADDRESS</td></tr><tr><th>'+ device +'</th><th style="padding-left:50px;">'+ mac +'</th></tr></table></div>'+
                            '</div>'
                        }
                        else if (params.data.nodeType === 'gwSta') {
                            //alert(JSON.stringify(params.data.seven_node));
                            let device = [];
                            //let ip = [];
                            let mac = [];
                            for(let i=0; i<params.data.sta_list.length;i++)
                            {
                                device += "<ul style=list-style-type:none;padding:1px;margin:1px><li>"+ eval(params.data.sta_list)[i]["to"].substr(0,12)+"</li></ul>"
                                mac += "<ul style=list-style-type:none;padding:1px;margin:1px><li>"  + eval(params.data.sta_list)[i]["mac"] +"</li></ul>"
                                //ip +=  "<li>" +eval(params.data.root_sta_list)[i]["ip"]+"</li>"
                            }

                            return '<div style="width:100vw;height:2300vw;float:left;">'+
                            '<div style="margin:0 20px;font-size:16px;"><table><tr><td>ETHERNET CLIENTS</td><td style="padding-left:50px;">MAC ADDRESS</td></tr><tr><th>'+ device +'</th><th style="padding-left:50px;">'+ mac +'</th></tr></table></div>'+
                            '</div>'
                        }


                    }
                },
            },
            series: [
                {
                    animation:false,
                    type: 'graph',
                    layout:'none',
                    symbolSize: 30,
                    roam: true,
                    label: {
                        show: true,
                        fontWeight: 'bold',
                        fontFamily:"Roboto",
                        fontSize: 14,
                        textBorderWidth: 1,
                        textBorderColor: 'auto',
                    },
                    labelText:'!23123',
                    edgeSymbol: ['circle', ''],
                    edgeSymbolSize: [3, 20],
                    data:topology_array_data[0],
                    links: topology_array_links[0],
                    lineStyle: {
                        opacity: 0.9,
                        width: 2,
                    },
                    emphasis: {
                        lineStyle: {
                            width: 10
                        },
                    },
                }
            ]
        };
        ap_theta = 0.79108;
        theta = 0.79108;
        theta4 = 0.93;
        theta5 = 0.53;
        theta6 = 0.21;
        theta_45_root = 2.34;
        theta_75_root = 3.13;
        theta_ext1 = 0.79108;
        theta_ext1_4 = -0.80;
        theta_ext1_5 = -1.10;
        theta_ext1_6 = -1.25;
        theta_ext2 = 0.79108;
        theta_ext2_4 = 0.20;
        theta_ext2_5 = 0.10;
        theta_ext2_6 = -0.15;
        theta_ext3 = 0.79108;
        theta_ext3_4 = 0.20;
        theta_ext3_5 = 0.10;
        theta_ext3_6 = -0.15;
        theta_ext33 = 0.79108;
        theta_ext33_4 = -0.80;
        theta_ext33_5 = -1.10;
        theta_ext33_6 = -1.25;
        return(
            <View style={{height:'90%',width:'100%',color:'#fff',marginTop:'0.5%',borderRadius:5,borderColor:'#353f53',borderWidth:1}}>
            <ECharts
                option={option}
                backgroundColor="#353f53"
            />
        </View>

        )



    }

}


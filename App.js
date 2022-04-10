import 'react-native-gesture-handler';

import * as React from 'react';
import {useEffect, useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {NavigationContainer,useIsFocused} from '@react-navigation/native';
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList,} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import OnDemand from './src/pages/ondemand';
import Control from './src/pages/control';
import Header from './src/components/header';
import LoginComponent from './src/forms/Login'
import verifyEmail from './src/authentication/verifyEmail'
import userAttributes from './src/authentication/userAttributes';
import Live from './src/pages/live';
//Added for user profile image:
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    setAccessToken,
    setChangeUserName, setEmail, setLanguage, setName,
    setResetToken,
    setStatus,
    setTimeZone,
    setToken,
    setUsername
} from './src/api/token';
import AsyncStorage from '@react-native-community/async-storage';
import ChangeLoginScreen from "./src/authentication/firstChange";
import SplashScreen from 'react-native-splash-screen';
import {CID_URL} from "./secrets";
import accountSettings from "./src/pages/accountSettings";
import changePassword from "./src/forms/changePassword";
import changeEmail from "./src/forms/changeEmail";
import changeLocation from "./src/forms/changeLocation";
import resetForm from "./src/forms/resetForm";



/*
              inactiveBackgroundColor={"#fff"}

              inactiveTintColor={"#b34"}
              activeBackgroundColor={"#fff"}
              activeTintColor={"#d6dc1a"}
 */

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
let UserID;
let TimeZone;
const Username = async () => {
  UserID = await AsyncStorage.getItem('@username');
  TimeZone = await AsyncStorage.getItem('@timezone')
};

function BottomTabStack() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: 'white',
        inactiveTintColor: 'gray',

        style: {
          backgroundColor: '#262d3c',
          height: 50,
        },
        labelStyle: {
          textAlign: 'center',
          fontSize: 16,
        },
      }}>
      <Tab.Screen
        name="OnDemand"
        component={OnDemand}
        options={{
          tabBarLabel: 'On-Demand',
          tabBarIcon: ({color, size}) => (
            <Icon name="sine-wave" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Live"
        component={Live}
        options={{
            unmountOnBlur:true, //refresh component did mount
            tabBarLabel: 'Live',
          tabBarIcon: ({color, size}) => (
            <Icon name="sync" color={color} size={size} />
          ),
        }}

      />
      <Tab.Screen
        name="Control"
        component={Control}
        options={{
          tabBarLabel: 'Control',
          tabBarIcon: ({color, size}) => (
            <Icon name="cog-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

//FOR EDITING SIDE BAR

function CustomDrawerContent(props) {
  Username();
  return (
    <DrawerContentScrollView
      style={{
        backgroundColor: '#353f53',
        itemStyle: {marginVertical: 5},
      }}
      {...props}>
      <View style={styles.drawerHeader}>
        <Image
          style={styles.TEAlogo}
          source={require('../TEAmob/src/assets/wifiapp.png')}
        />
        <View>
          <Text style={styles.headerText}>Wi-Fi App</Text>
        </View>
      </View>
      <View style={styles.drawerDivider} />
      <View style={{height: 60}}>
        <View style={styles.profilePlacement}>
          <Image
            style={styles.userProfile}
            source={require('../TEAmob/src/assets/userLogo.png')}
          />
          {/* <Avatar
            rounded
            source={require('../TEAmob/src/assets/Omer.jpg')}
          /> */}
          <View style={styles.NamePlacement}>
            <Text style={styles.userText}> {UserID} </Text>
            <View style={{flexDirection: 'row'}}>
              <Image
                style={styles.locationImage}
                source={require('../TEAmob/src/assets/icons8-marker-32.png')}/>
              <Text style={{color: '#fff'}}> {TimeZone} </Text>
            </View>
          </View>
          {/* <TextInput
            editable={false}
            style={{color: white, fontSize: 15}}
            value={'Username:   ' + 'userID'}
          /> */}
        </View>
        <View style={styles.settingsPlacement}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('Control');
            }}>
            <Image
              style={styles.settingsImage}
              source={require('../TEAmob/src/assets/icons8-settings-32.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
      <DrawerItemList {...props}>
        <DrawerItem
          label="Index"
          onPress={() => {
            props.navigation.navigate('IndexStack');
          }}
        />
        <DrawerItem
          label="Login"
          onPress={() => {
            props.navigation.navigate('LoginStack');
          }}
        />
          <DrawerItem
              label="Account Settings"
              onPress={() => props.navigation.navigate("AccountSettingsStack")
              }
          />
      </DrawerItemList>
      <DrawerItem
        icon={({color, size}) => (
          <Icon name="exit-to-app" color={'white'} size={size} />
        )}
        label="Log Out"
        inactiveTintColor="#fff"
        onPress={async () => {
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
          props.navigation.navigate('LoginStack');
        }}
      />
    </DrawerContentScrollView>
  );
}

/*
function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';

  switch (routeName) {
    case 'OnDemand':
      return 'OnDemand';
    case 'ExploreScreen':
      return 'Explore';
    case 'BottomTabStack':
      return 'Home';
  }
}
*/

function LoginStack({navigation}) {
    return (
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>
            <Stack.Screen
                name="LoginStack"
                component={LoginComponent}
        />
        </Stack.Navigator>
    );

}

function IndexStack({navigation}) {
    const isFocused = useIsFocused();
    return isFocused ? <Stack.Navigator>
      <Stack.Screen
        name="BottomTabStack"
        component={BottomTabStack}
        options={({navigation}) => ({
          headerTitle: () => <Header navigation={navigation} />,
          headerStyle: {
            backgroundColor: '#353f53', //Set Header color
          },
        })}
      />
    </Stack.Navigator> :<Stack.Navigator>
        <Stack.Screen name={"IntroStack"} options={({navigation}) => ({
            headerTitle: () => <Header navigation={navigation} />,
            headerStyle: {
                backgroundColor: '#353f53', height:56//Set Header color
            },
        })}>
            {props =><View  {...props}  style={{flex: 1, backgroundColor: "#262d3c"}}>
                <View style={{flex:0.5}}>
                    <ActivityIndicator animating={true} color={'#fff'} style={{flex:1}} size={"large"} />
                    <Text style={{color:'#fff',marginLeft:"40%"}}>Loading...</Text>
                </View>
            </View>}

        </Stack.Screen>
    </Stack.Navigator>
  ;
}

function ChangeLoginStack({ navigation }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ChangeLoginStack"
                component={ChangeLoginScreen}
                options={({ navigation }) => ({
                    headerTintColor:'#fff',
                    headerTitle: 'Change Password',
                    headerTitleAlign:'center',
                    headerStyle: {
                        backgroundColor: '#353f53', //Set Header color
                    },
                })}/>
        </Stack.Navigator>
    );
}

function UpdateUserInfo({ navigation }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="UpdateUserStack"
                component={userAttributes}
                options={({ navigation }) => ({
                    headerTintColor:'#fff',
                    headerTitle: 'Update Informations',
                    headerTitleAlign:'center',
                    headerStyle: {
                        backgroundColor: '#353f53', //Set Header color
                    },
                })}/>
        </Stack.Navigator>
    );
}

function VerifyInfo({ navigation }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="VerifyStack"
                component={verifyEmail}
                options={({ navigation }) => ({
                    headerTintColor:'#fff',
                    headerTitle: 'Verify Code',
                    headerTitleAlign:'center',
                    headerStyle: {
                        backgroundColor: '#353f53', //Set Header color
                    },
                })}/>
        </Stack.Navigator>
    );
}

function AccountSettings ({navigation}){
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="AccountSettingsStack"
                component={accountSettings}
                options={({navigation}) => ({
                    headerLeft: (props) => (
                        <HeaderBackButton
                            {...props}
                            onPress={() => {
                                navigation.navigate("IndexStack")
                            }}
                        />
                    ),
                    headerTintColor:'#fff',
                    headerTitle: "Account Settings",
                    headerTitleAlign:'center',
                    headerStyle: {
                        backgroundColor: '#353f53', //Set Header color
                    },
                })}
            />

        </Stack.Navigator>
    );
}
function ChangePasswordStack({ navigation }) {
    return (
        <Stack.Navigator>
            <Stack.Screen

                name="ChangePasswordStack"
                component={changePassword}
                options={({ navigation }) => ({
                    headerLeft: (props) => (
                        <HeaderBackButton
                            {...props}
                            onPress={() => {
                                navigation.navigate("AccountSettingsStack")
                            }}
                        />
                    ),
                    headerTintColor:'#fff',
                    headerTitle: 'Change Password',
                    headerTitleAlign:'center',
                    headerStyle: {
                        backgroundColor: '#353f53', //Set Header color
                    },
                })}/>
        </Stack.Navigator>
    );
}
function ChangeEmailStack({ navigation }) {
    return (
        <Stack.Navigator>
            <Stack.Screen

                name="ChangeEmailStack"
                component={changeEmail}
                options={({ navigation }) => ({
                    headerLeft: (props) => (
                        <HeaderBackButton
                            {...props}
                            onPress={() => {
                                navigation.navigate("AccountSettingsStack")
                            }}
                        />
                    ),
                    headerTintColor:'#fff',
                    headerTitle: 'Change Email',
                    headerTitleAlign:'center',
                    headerStyle: {
                        backgroundColor: '#353f53', //Set Header color
                    },
                })}/>
        </Stack.Navigator>
    );
}

function ChangeLocationStack({ navigation }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ChangeLocationStack"
                component={changeLocation}
                options={({ navigation }) => ({
                    headerLeft: (props) => (
                        <HeaderBackButton
                            {...props}
                            onPress={() => {
                                navigation.navigate("AccountSettingsStack")
                            }}
                        />
                    ),
                    headerTintColor:'#fff',
                    headerTitle: 'Change Time Zone/Language',
                    headerTitleAlign:'center',
                    headerStyle: {
                        backgroundColor: '#353f53', //Set Header color
                    },
                })}/>
        </Stack.Navigator>
    );
}

function ResetFormStack({ navigation }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ResetFormStack"
                component={resetForm}
                options={({ navigation }) => ({
                    headerLeft: (props) => (
                        <HeaderBackButton
                            {...props}
                            onPress={() => {
                                navigation.navigate("AccountSettingsStack")
                            }}
                        />
                    ),
                    headerTintColor:'#fff',
                    headerTitle: 'Reset Settings',
                    headerTitleAlign:'center',
                    headerStyle: {
                        backgroundColor: '#353f53', //Set Header color
                    },
                })}/>
        </Stack.Navigator>
    );
}


//FOR EDITING SIDE BAR drawerContent={(props) => <CustomDrawerContent {...props} />}>

//For Release   initialRouteName="LoginStack"
/*drawerContentOptions={
  {
    activeTintColor: '#f5f5f5',
    color:'#fff',
    backgroundColor:'#353f53',
    itemStyle: { marginVertical: 5 },

  }}>*/

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        const IdToken = await AsyncStorage.getItem('@auth_token');
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', IdToken);
        let cid_result = await fetch(CID_URL, {
            method: 'GET',
            headers: myHeaders,
        })
        if(cid_result.status === 200)
        {
            this.props.navigation.navigate("IndexStack");
        }
        if(cid_result.status === 401)
        {
            this.props.navigation.navigate("LoginStack");
        }
        //this.props.navigation.navigate(userToken ? 'IndexStack' : 'LoginStack');
    };

    // Render any loading content that you like here
    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen
                    name="BottomTabStack"
                    component={BottomTabStack}
                    options={({navigation}) => ({
                        headerTitle: () => <Header navigation={navigation} />,
                        headerStyle: {
                            backgroundColor: '#353f53', //Set Header color
                        },
                    })}
                />
            </Stack.Navigator>
        );
    }
}



export default function  App(){
    useEffect(()=>{
        SplashScreen.hide()
    },[])
    return (
        <NavigationContainer>
            <Drawer.Navigator
                //screenOptions={{ gestureEnabled: false }}
                initialRouteName="AuthScreen"
                drawerContentOptions={{
                    //activeBackgroundColor: '#353f53',
                    activeTintColor: '#fff', //#aaa4b0
                    inactiveTintColor: '#fff',
                }}
                drawerContent={(props) => {
                    const filteredProps = {
                        ...props,
                        state: {
                            ...props.state,
                            routeNames: props.state.routeNames.filter(
                                routeName => routeName !== 'ChangeLoginStack' && routeName !== 'ChangePasswordStack'  && routeName !== 'ChangeEmailStack' && routeName !== 'ResetFormStack'
                                    && routeName !== 'ChangeLocationStack' && routeName !== 'VerifyStack'
                                    && routeName !== 'UpdateUserStack' && routeName !== 'LoginStack'&& routeName !== 'AuthScreen'
                            ),
                            routes: props.state.routes.filter(
                                route => route.name !== 'ChangeLoginStack'  && route.name !== 'ChangePasswordStack' && route.name !== 'ChangeEmailStack'
                                    && route.name !== 'ResetFormStack' && route.name !== 'ChangeLocationStack' && route.name !== 'VerifyStack' && route.name !== 'UpdateUserStack' && route.name !== 'LoginStack' && route.name !== 'AuthScreen'


                            ),
                        },}
                    return(<CustomDrawerContent {...props}{...filteredProps} />)}}>
                <Drawer.Screen
                    name="IndexStack"
                    options={{drawerLabel: 'Index'}}
                    component={IndexStack}
                />
                <Drawer.Screen
                    name="AccountSettingsStack"
                    options={{drawerLabel: 'Account Settings', unmountOnBlur:true,gestureEnabled:false //refresh component did mount
                    }}
                    component={AccountSettings}

                />
                <Drawer.Screen
                    name="ChangePasswordStack"
                    options={{  drawerLabel:'ChangePassword' ,gestureEnabled:false }}//drawerLabel: () => null
                    component={ChangePasswordStack} />
                <Drawer.Screen
                    name="ChangeEmailStack"
                    options={{  drawerLabel:'ChangeEmail' ,gestureEnabled:false }}//drawerLabel: () => null
                    component={ChangeEmailStack} />
                <Drawer.Screen
                    name="ResetFormStack"
                    options={{  drawerLabel:'ResetForm' ,gestureEnabled:false, unmountOnBlur:true }}//drawerLabel: () => null
                    component={ResetFormStack} />
                <Drawer.Screen
                    name="ChangeLocationStack"
                    options={{  drawerLabel:'ChangeLocation' ,gestureEnabled:false }}//drawerLabel: () => null
                    component={ChangeLocationStack} />
                <Drawer.Screen
                    name="LoginStack"
                    options={{drawerLabel: 'Login',gestureEnabled:false,}}
                    component={LoginStack}
                />
                <Drawer.Screen
                    name="AuthScreen"
                    options={{drawerLabel: 'Auth'}}
                    component={AuthLoadingScreen}
                />
                <Drawer.Screen
                    name="ChangeLoginStack"
                    options={{  drawerLabel:'ChangeLogin'  }}//drawerLabel: () => null
                    component={ChangeLoginStack} />
                <Drawer.Screen
                    name="UpdateUserStack"
                    options={{  drawerLabel:'UpdateUser'  }}//drawerLabel: () => null
                    component={UpdateUserInfo} />
                <Drawer.Screen
                    name="VerifyStack"
                    options={{  drawerLabel:'Verify'  }}//drawerLabel: () => null
                    component={VerifyInfo} />


            </Drawer.Navigator>
        </NavigationContainer>
    );


}


const styles = StyleSheet.create({
  drawerHeader: {
    flexDirection: 'row',
    height: 43,
    marginLeft: 10,
  },
  TEAlogo: {
    width: 25,
    height: 25,
    marginLeft: 10,
    marginTop: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 25,
    marginTop: 7.5,
  },
  drawerDivider: {
    height: 1.5,
    width: '100%',
    backgroundColor: '#000',
    marginVertical: 10,
  },
  profilePlacement: {
    flexDirection: 'row',
    marginLeft: 5,
  },
  userProfile: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  NamePlacement: {
    marginLeft: 15,
    flexDirection: 'column',
  },
  userText: {
    color: '#fff',
    fontSize: 18,
  },
  locationImage: {
    width: 20,
    height: 20,
  },
  settingsPlacement: {
    flexDirection: 'row-reverse',
    marginTop: -42,
    marginLeft: 12,
  },
  settingsImage: {
    width: 25,
    height: 25,
  },
});


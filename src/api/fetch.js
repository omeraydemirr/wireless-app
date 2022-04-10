import {API_URL, FIRST_LOGIN_URL, UPDATE_USER_INFO, VERIFY_INFO} from '../../secrets';
import {getToken, setStatus} from './token';
import AsyncStorage from '@react-native-community/async-storage';
import {keystoreSchema} from "expo-cli/build/credentials/credentials";

const getHeaders = async () => {
    const token = await getToken();
    /*
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
        */
    return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
};

export const post = async (destination, body) => {
    const headers = await getHeaders();
    const result = await fetch(`${API_URL}${destination}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    });
    let status = JSON.parse(JSON.stringify(result.status));
    if(status === 201)
    {
        await setStatus("201");
    }
    if (result.ok) {
        return await result.json();
    }
    if(result.ok === false)
    {
    if(status === 404)
    {
        throw {error: "User does not exist!"}
    }
    let responseJson =  await result.json();
    throw { error: responseJson.message };
    }
};

export const get = async (destination) => {
    const headers = await getHeaders();

    const result = await fetch(`${API_URL}${destination}`, {
        method: 'GET',
        headers,
    });
    if (result.ok) {
        return await result.json();
    }

    throw { error: result.status };
};


//FIRST TIME CHANGE
export const changePost = async (destination, body) => {
    const ResetToken = await AsyncStorage.getItem('@reset_token');
    const result = await fetch(`${FIRST_LOGIN_URL}${destination}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "ResetToken":ResetToken,
        },
        body: JSON.stringify(body),
    });
    if (result.ok) {
        return result;
    }
    if(result.ok === false || result.status === 400)
    {
        let responseJson =  await result.json();
        throw { error: responseJson.message };
    }
};

export const changeGet = async (destination) => {
    const headers = await getHeaders();

    const result = await fetch(`${FIRST_LOGIN_URL}${destination}`, {
        method: 'GET',
        headers,
    });
    if (result.ok) {
        return await result.json();
    }

    throw { error: result.status };
};


//USERUPDATE POST

export const userUpdatePost = async (destination, body) => {
    let name = JSON.parse(JSON.stringify(body.name));
    let email = JSON.parse(JSON.stringify(body.email));
    let language = JSON.parse(JSON.stringify(body.language));
    let timezone = JSON.parse(JSON.stringify(body.timezone));

    const AccessToken = await AsyncStorage.getItem('@access_token');
    const IdToken = await AsyncStorage.getItem('@auth_token');

    const result = await fetch(`${UPDATE_USER_INFO}${destination}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "Authorization": IdToken,
            "AccessToken" : AccessToken,
        },
        body: JSON.stringify({
            'attributes':[{
                'attributeName': 'name',
                'attributeValue': name,
            },
                {
                    'attributeName': 'email',
                    'attributeValue': email,
                },
                {
                    'attributeName': 'language',
                    'attributeValue': language,
                },
                {
                    'attributeName': 'time_zone',
                    'attributeValue': timezone,
                },


            ]
        }),
    });
};

//VERIFY CODE
export const verifyPost = async (destination, body) => {
    let verifyCode = JSON.parse(JSON.stringify(body.verifyCode));
    const AccessToken = await AsyncStorage.getItem('@access_token');
    const IdToken = await AsyncStorage.getItem('@auth_token');

    const result = await fetch(`${VERIFY_INFO}${destination}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "Authorization": IdToken,
            "AccessToken" : AccessToken,
        },
        body: JSON.stringify({
                'attributeName': 'email',
                'verifyCode': verifyCode,}),
    });


    if(result.ok === false || result.status === 400)
    {
        let responseJson =  await result.json();
        throw { error: responseJson.message };
    }

};



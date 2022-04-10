import React, { useState } from 'react';
import {View, Text, Button} from 'react-native';
import {changeLogin, userUpdateInfo} from '../api/authentication';
import UpdateUserInfoForm from '../forms/UpdateUserInfoForm'
import AsyncStorage from '@react-native-community/async-storage';

const userAttributes = ({ navigation }) => {

    return (
        <UpdateUserInfoForm
            buttonText="Update Informations"
            onSubmit={userUpdateInfo}
            onAuthentication={async () =>{
                navigation.navigate("VerifyStack");
            }}
        >
        </UpdateUserInfoForm>
    );
};

export default userAttributes;

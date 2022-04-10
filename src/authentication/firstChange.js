import React, { useState } from 'react';
import {View, Text, Button} from 'react-native';
import { changeLogin } from '../api/authentication';
import ChangeForm from '../forms/changeForm';
import AsyncStorage from '@react-native-community/async-storage';

const ChangeLoginScreen = ({ navigation }) => {

    return (
        <ChangeForm
            buttonText="Change Password"
            onSubmit={changeLogin}
            onAuthentication={async () =>{
                navigation.navigate("UpdateUserStack");
             }}
        >
        </ChangeForm>
    );
};

export default ChangeLoginScreen;

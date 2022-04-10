import React, { useState } from 'react';
import {View, Text, Button} from 'react-native';
import { verifyInfo} from '../api/authentication';
import VerifyEmailForm from '../forms/verifyEmailForm'
import AsyncStorage from '@react-native-community/async-storage';

const VerifyEmail = ({ navigation }) => {

    return (
        <VerifyEmailForm
            buttonText="Send"
            onSubmit={verifyInfo}
            onAuthentication={async () =>{
                navigation.navigate("IndexStack");
            }}
        >
        </VerifyEmailForm>
    );
};

export default VerifyEmail;

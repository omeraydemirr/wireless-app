import AsyncStorage from '@react-native-community/async-storage';

export const setToken = async (token) => {
    try {
        await AsyncStorage.setItem('@auth_token', token);
    } catch (e) {
        return null;
    }
};

export const getToken = async () => {
    try {
        const value = await AsyncStorage.getItem('@auth_token');
        const keys = await AsyncStorage.getAllKeys();
        const result = await AsyncStorage.multiGet(keys);

        if (value !== null) {
            return value;
        }
    } catch (e) {
        return null;
    }
};

export const setResetToken = async (token) => {
    try {
        await AsyncStorage.setItem('@reset_token', token);
    } catch (e) {
        return null;
    }
};

export const setAccessToken = async (token) => {
    try {
        await AsyncStorage.setItem('@access_token', token);
    } catch (e) {
        return null;
    }
};


export const setMessage= async (message) => {
    try {
        await AsyncStorage.setItem('@message', message);
    } catch (e) {
        return null;
    }
};

export const setChangeUserName= async (username) => {
    try {
        await AsyncStorage.setItem('changeUserName', username);
    } catch (e) {
        return null;
    }
};


export const setUsername = async (username) => {
    try {
        await AsyncStorage.setItem('@username', username);
    } catch (e) {
        return null;
    }
};

export const setName = async (name) => {
    try {
        await AsyncStorage.setItem('@name', name);
    } catch (e) {
        return null;
    }
};

export const setEmail = async (email) => {
    try {
        await AsyncStorage.setItem('@email', email);
    } catch (e) {
        return null;
    }
};

export const setLanguage = async (language) => {
    try {
        await AsyncStorage.setItem('@language', language);
    } catch (e) {
        return null;
    }
};



export const setTimeZone = async (timezone) => {
    try {
        await AsyncStorage.setItem('@timezone', timezone);
    } catch (e) {
        return null;
    }
};

export const setStatus = async (status) => {
    try {
        await AsyncStorage.setItem('status', status);
    } catch (e) {
        return null;
    }
};

export const setRole = async (role) => {
    try {
        await AsyncStorage.setItem('role', role);
    } catch (e) {
        return null;
    }
};

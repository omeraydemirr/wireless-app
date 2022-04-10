import {changePost, post , userUpdatePost,verifyPost} from './fetch';

export const login = (username, password) => {
    return post('', {
        username, password,
    });
};

export const changeLogin = (username, password) => {
    return changePost('', {
        username, password,
    });
};

export const userUpdateInfo = (name, email, language,timezone) => {
    return userUpdatePost('', {
        name, email,language,timezone
    });
};
export const verifyInfo = (verifyCode) => {
    return verifyPost('', {
       verifyCode,
    });
};

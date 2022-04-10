import { getToken } from './token';

const mockSuccess = (value) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(value), 2000);
    });
};

const mockFailure = (value) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject(value), 2000);
    });
};

export const login = (username, password, shouldSucceed = true) => {
    console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
    if (!shouldSucceed) {
        console.log('zzzzzzzzzzzza');
        return mockFailure({ error: 500, message: 'Something went wrong!' });
    }

    return mockSuccess({ auth_token: 'successful_fake_token'});
};

export const getUsers = async (shouldSucceed = true) => {
    const token = await getToken();
    console.log("getusers: "+ token);
    if (token === '' || token === null || token === undefined) {
        return mockFailure({ error: 401, message: 'Invalid Request' });
    }

    return mockSuccess({
        users: [
            {
                username: 'test@test.ca',
            },
            {
                username: 'test2@test.ca',
            },
        ],
    });
};


/*
export const createAccount = (username, password, shouldSucceed = true) => {
    console.log(username, password);

    if (!shouldSucceed) {
        return mockFailure({ error: 500, message: 'Something went wrong!' });
    }

    return mockSuccess({ auth_token: 'successful_fake_token' });
};

*/

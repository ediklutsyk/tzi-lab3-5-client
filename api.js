const BASE_URL = 'http://localhost:3001';

const getUsers = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/users`);

        const users = res.data;

        console.log(`GET: Here's the list of users`, users);

        return users;
    } catch (e) {
        console.error(e);
    }
};

const signUp = async (user) => {
    try {
        const res = await axios.post(`${BASE_URL}/users`, user);
        return res.data;
    } catch (e) {
        console.error(e);
    }
};

const signIn = async (req) => {
    try {
        const res = await axios.post(`${BASE_URL}/sign-in`, req);
        console.log('response', res)
        return res;
    } catch (e) {
        console.error('ERROR SIGN-IN', e);
        return res;
    }
};

const validateSession = async (id) => {
    try {
        const res = await axios.get(`${BASE_URL}/validate/${id}`);
        return res.data.status === 'valid';
    } catch (e) {
        console.error(e);
    }
};

const logOut = async (id) => {
    try {
        const res = await axios.get(`${BASE_URL}/logout/${id}`);
        return res.data.message === 'ok';
    } catch (e) {
        console.error(e);
    }
};
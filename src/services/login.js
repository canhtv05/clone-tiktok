import httpRequest from '~/utils/httpRequest';

export const login = async (email, pass) => {
    try {
        const res = await httpRequest.post('auth/login', {
            email: email,
            password: pass,
        });

        const token = res.data.meta.token;
        if (token) {
            localStorage.setItem('token', token);
            return token;
        } else {
            localStorage.removeItem('token');
            throw new Error('Token has expired');
        }
    } catch (error) {
        throw error;
    }
};

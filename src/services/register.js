import httpRequest from '~/utils/httpRequest';

export const register = async (email, pass) => {
    try {
        const res = await httpRequest.post('auth/register', {
            type: 'email',
            email: email,
            password: pass,
        });

        return { data: res.data, statusCode: res.status };
    } catch (error) {
        const statusCode = error.status;
        return { data: null, statusCode };
    }
};

import * as request from '~/utils/httpRequest';

export const getProfile = async (nickname, bearerToken) => {
    try {
        const headers = bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {};
        const res = await request.get(`users/${nickname}`, {
            headers,
        });

        return res.data;
    } catch (error) {
        console.log(error);
    }
};

import * as request from '~/utils/httpRequest';

export const getProfile = async (nickname) => {
    try {
        const res = await request.get(`users/${nickname}`);

        return res.data;
    } catch (error) {
        console.log(error);
    }
};

import httpRequest from '~/utils/httpRequest';

export const getAVideoById = async (hash) => {
    try {
        const res = await httpRequest.get(`videos/${hash}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

import httpRequest from '~/utils/httpRequest';

export const getAVideo = async (hash) => {
    try {
        const res = await httpRequest.get(`videos/${hash}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

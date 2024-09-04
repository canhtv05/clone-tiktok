import httpRequest from '~/utils/httpRequest';

export const getVideosById = async (id) => {
    try {
        const res = await httpRequest.get(`users/${id}/videos`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

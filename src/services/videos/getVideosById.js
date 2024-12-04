import httpRequest from '~/utils/httpRequest';

export const getVideosById = async (id, page = 1) => {
    try {
        const res = await httpRequest.get(`users/${id}/videos`, {
            params: {
                page,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

import httpRequest from '~/utils/httpRequest';

export const getAVideoById = async (hash, bearerToken) => {
    try {
        const headers = bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {};
        const res = await httpRequest.get(`videos/${hash}`, {
            headers,
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

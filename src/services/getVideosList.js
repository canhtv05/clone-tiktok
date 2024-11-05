import httpRequest from '~/utils/httpRequest';

export const getVideosList = async (page, forYou = true, token) => {
    try {
        const res = await httpRequest.get(`videos`, {
            params: {
                type: forYou ? 'for-you' : 'following',
                page: page,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

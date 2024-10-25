import httpRequest from '~/utils/httpRequest';

export const getVideosList = async (page, forYou = true) => {
    try {
        const res = await httpRequest.get(`videos`, {
            params: {
                type: forYou ? 'for-you' : 'following',
                page: page,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

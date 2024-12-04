import httpRequest from '~/utils/httpRequest';

export const getFollowingList = async (page, bearerToken) => {
    try {
        const res = await httpRequest.get(`me/followings`, {
            params: { page: page },
            headers: {
                Authorization: `Bearer ${bearerToken}`,
            },
        });

        return res.data;
    } catch (error) {
        console.log(error);
    }
};

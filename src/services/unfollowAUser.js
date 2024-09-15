import httpRequest from '~/utils/httpRequest';

export const unfollowAUser = async (userId, bearerToken) => {
    try {
        const res = await httpRequest.post(
            `users/${userId}/unfollow`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                },
            },
        );
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

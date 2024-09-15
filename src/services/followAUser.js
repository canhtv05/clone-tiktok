import httpRequest from '~/utils/httpRequest';

export const followAUser = async (userId, bearerToken) => {
    try {
        const res = await httpRequest.post(
            `users/${userId}/follow`,
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

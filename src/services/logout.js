import httpRequest from '~/utils/httpRequest';

export const logout = async (bearerToken) => {
    try {
        const res = await httpRequest.post(
            '/auth/logout',
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

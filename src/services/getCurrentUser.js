import httpRequest from '~/utils/httpRequest';

export const getCurrentUser = async (bearerToken) => {
    try {
        const res = await httpRequest.get('auth/me', {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
            },
        });

        return res.data;
    } catch (error) {
        console.log(error);
    }
};

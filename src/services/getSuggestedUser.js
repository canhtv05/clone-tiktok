import * as request from '~/utils/httpRequest';

export const getUserSuggested = async (perPage = 1, page = 1, bearerToken) => {
    try {
        const res = await request.get('users/suggested', {
            params: {
                per_page: perPage,
                page,
            },
            headers: {
                Authorization: `Bearer ${bearerToken}`,
            },
        });

        return res.data;
    } catch (error) {
        console.log(error);
    }
};

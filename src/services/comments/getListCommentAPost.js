import httpRequest from '~/utils/httpRequest';

export const getListCommentAPost = async (idVideo, bearerToken, page = 1) => {
    try {
        const res = await httpRequest.get(`videos/${idVideo}/comments`, {
            params: {
                page: page,
                per_page: 10,
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

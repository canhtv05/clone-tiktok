import httpRequest from '~/utils/httpRequest';

export const getListCommentAPost = async (idVideo, bearerToken) => {
    try {
        const res = await httpRequest.get(`videos/${idVideo}/comments`, {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

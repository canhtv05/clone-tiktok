import httpRequest from '~/utils/httpRequest';

export const delCommentAPost = async (commentId, token) => {
    try {
        const res = await httpRequest.delete(`comments/${commentId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

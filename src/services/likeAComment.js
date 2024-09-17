import httpRequest from '~/utils/httpRequest';

export const likeAComment = async (commentId, bearerToken) => {
    try {
        const res = await httpRequest.post(
            `comments/${commentId}/like`,
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

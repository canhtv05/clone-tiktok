import httpRequest from '~/utils/httpRequest';

export const unlikeAComment = async (commentId, bearerToken) => {
    try {
        const res = await httpRequest.post(
            `comments/${commentId}/unlike`,
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

import httpRequest from '~/utils/httpRequest';

export const postCommentAPost = async (hashVideo, content, token) => {
    try {
        const res = await httpRequest.post(
            `videos/${hashVideo}/comments`,
            {
                comment: `${content}`,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

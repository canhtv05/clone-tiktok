import httpRequest from '~/utils/httpRequest';

export const likeAPost = async (videoId, bearerToken) => {
    try {
        const res = await httpRequest.post(
            `videos/${videoId}/like`,
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

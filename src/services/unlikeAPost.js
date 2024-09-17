import httpRequest from '~/utils/httpRequest';

export const unlikeAPost = async (videoId, bearerToken) => {
    try {
        const res = await httpRequest.post(
            `videos/${videoId}/unlike`,
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

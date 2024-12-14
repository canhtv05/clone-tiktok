import httpRequest from '~/utils/httpRequest';

export const updateCurrentUser = async (first_name, last_name, avatar, bio, token) => {
    try {
        const formData = new FormData();

        formData.append('first_name', first_name);
        formData.append('last_name', last_name);
        formData.append('bio', bio);
        formData.append('gender', 'male');

        if (avatar) {
            formData.append('avatar', avatar);
        }

        const res = await httpRequest.post('auth/me', formData, {
            params: {
                _method: 'PATCH',
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return { data: res.data, statusCode: res.status };
    } catch (error) {
        const statusCode = error.response?.status || error.status;
        return { data: null, statusCode };
    }
};

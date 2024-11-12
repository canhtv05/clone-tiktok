import { createSlice } from '@reduxjs/toolkit';

const listVideosSlice = createSlice({
    name: 'listVideosHome',
    initialState: { listVideosHome: [] },
    reducers: {
        setListsVideoHome(state, action) {
            state.listVideosHome = action.payload;
        },
        setIsLikedByIndexVideoHome(state, action = { is_liked: false, indexVideo: null, likes_count: null }) {
            const prevList = state.listVideosHome;
            if (prevList.length === 0) return;

            const { is_liked, indexVideo, likes_count } = action.payload;

            if (indexVideo < 0 || indexVideo > prevList.length - 1) return prevList;

            if (!is_liked) return;
            if (!indexVideo) return;

            const updateListVideoHome = [...prevList];
            updateListVideoHome[indexVideo] = {
                ...updateListVideoHome[indexVideo],
                is_liked: is_liked,
                likes_count: is_liked ? likes_count + 1 : Math.max(0, likes_count - 1),
            };

            state.listVideosHome = updateListVideoHome;
        },

        setIsFollowAUserByUserId(state, action = { is_follow: null, user_id: null }) {
            const prevList = state.listVideosHome;
            if (prevList.length === 0) return;

            const { is_follow, user_id } = action.payload;

            const updateListVideoHome = prevList.map((video) => {
                if (video.user && video.user.id === user_id) {
                    return {
                        ...video,
                        user: {
                            ...video.user,
                            is_followed: is_follow,
                        },
                    };
                }

                return video;
            });

            console.log(JSON.parse(JSON.stringify(updateListVideoHome)));

            state.listVideosHome = updateListVideoHome;
        },
    },
});

export const { setListsVideoHome, setIsLikedByIndexVideoHome, setIsFollowAUserByUserId } = listVideosSlice.actions;
export default listVideosSlice.reducer;

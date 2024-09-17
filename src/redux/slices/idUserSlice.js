import { createSlice } from '@reduxjs/toolkit';

const currentUserImageSlice = createSlice({
    name: 'idUser',
    initialState: {
        idUser: null,
    },
    reducers: {
        setIdUser(state, action) {
            state.idUser = action.payload;
        },
    },
});

export const { setIdUser } = currentUserImageSlice.actions;
export default currentUserImageSlice.reducer;

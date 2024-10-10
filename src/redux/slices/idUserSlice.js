import { createSlice } from '@reduxjs/toolkit';

const initialIdUser = null;

const currentUserImageSlice = createSlice({
    name: 'idUser',
    initialState: {
        idUser: initialIdUser,
    },
    reducers: {
        setIdUser(state, action) {
            state.idUser = action.payload;
        },
    },
});

export const { setIdUser } = currentUserImageSlice.actions;
export default currentUserImageSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialIdUser = localStorage.getItem('idUser') ? JSON.parse(localStorage.getItem('idUser')) : null;

const currentUserImageSlice = createSlice({
    name: 'idUser',
    initialState: {
        idUser: initialIdUser,
    },
    reducers: {
        setIdUser(state, action) {
            state.idUser = action.payload;
            localStorage.setItem('idUser', JSON.stringify(action.payload));
        },
    },
});

export const { setIdUser } = currentUserImageSlice.actions;
export default currentUserImageSlice.reducer;

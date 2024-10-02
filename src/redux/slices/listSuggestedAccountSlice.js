import { createSlice } from '@reduxjs/toolkit';

const listSuggestedAccountSlice = createSlice({
    name: 'listSuggestedAccount',
    initialState: { listSuggestedAccount: [] },
    reducers: {
        setListSuggestedAccount(state, action) {
            state.listSuggestedAccount = action.payload;
        },
    },
});

export const { setListSuggestedAccount } = listSuggestedAccountSlice.actions;
export default listSuggestedAccountSlice.reducer;

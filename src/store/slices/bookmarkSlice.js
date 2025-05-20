import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    bookmarked: [],
}

export const bookmarkSlice = createSlice({
    name: 'bookmark',
    initialState,
    reducers: {
        addBookmark: (state, action) => {
            state.bookmarked.push(action.payload)
        },
        removeBookmark: (state, action) => {
            state.bookmarked = state.bookmarked.filter(
                (item) => item._id !== action.payload
            )
        },
    },
})

export const { addBookmark, removeBookmark } = bookmarkSlice.actions

export default bookmarkSlice.reducer

import bookmarkReducer, { addBookmark, removeBookmark } from '../bookmarkSlice'

describe('bookmarkSlice', () => {
    // Test for initial state
    describe('initialState', () => {
        it('should return the initial state', () => {
            // The reducer is called with an undefined state and a dummy action
            // to get the initial state.
            expect(bookmarkReducer(undefined, { type: 'unknown' })).toEqual({
                bookmarked: [],
            });
        });
    });

    // Tests for addBookmark reducer
    describe('addBookmark reducer', () => {
        it('should handle addBookmark', () => {
            const initialState = { bookmarked: [] };
            const newItem = { _id: '1', title: 'Test Bookmark 1' };
            // Dispatch the addBookmark action with the newItem as payload
            const actual = bookmarkReducer(initialState, addBookmark(newItem));
            // Expect the new item to be added to the bookmarked array
            expect(actual.bookmarked).toEqual([newItem]);
        });

        it('should handle addBookmark when there are existing items', () => {
            const existingItem = { _id: '1', title: 'Existing Bookmark' };
            const initialState = { bookmarked: [existingItem] };
            const newItem = { _id: '2', title: 'New Bookmark' };
            // Dispatch the addBookmark action
            const actual = bookmarkReducer(initialState, addBookmark(newItem));
            // Expect the new item to be added to the end of the array
            expect(actual.bookmarked).toEqual([existingItem, newItem]);
            expect(actual.bookmarked.length).toBe(2);
        });
    });

    // Tests for removeBookmark reducer
    describe('removeBookmark reducer', () => {
        it('should handle removeBookmark when item exists', () => {
            const item1 = { _id: '1', title: 'Bookmark 1' };
            const item2 = { _id: '2', title: 'Bookmark 2' };
            const initialState = { bookmarked: [item1, item2] };
            // Dispatch removeBookmark action with the _id of the item to remove
            const actual = bookmarkReducer(initialState, removeBookmark('1'));
            // Expect item1 to be removed, and item2 to remain
            expect(actual.bookmarked).toEqual([item2]);
            expect(actual.bookmarked.length).toBe(1);
        });

        it('should not change state if item to remove does not exist', () => {
            const item1 = { _id: '1', title: 'Bookmark 1' };
            const item2 = { _id: '2', title: 'Bookmark 2' };
            const initialState = { bookmarked: [item1, item2] };
            // Dispatch removeBookmark action with an _id that doesn't exist
            const actual = bookmarkReducer(initialState, removeBookmark('3'));
            // Expect the bookmarked array to remain unchanged
            expect(actual.bookmarked).toEqual([item1, item2]);
            expect(actual.bookmarked.length).toBe(2);
        });

        it('should handle removeBookmark when the list becomes empty', () => {
            const item1 = { _id: '1', title: 'Bookmark 1' };
            const initialState = { bookmarked: [item1] };
            // Dispatch removeBookmark action
            const actual = bookmarkReducer(initialState, removeBookmark('1'));
            // Expect the bookmarked array to be empty
            expect(actual.bookmarked).toEqual([]);
            expect(actual.bookmarked.length).toBe(0);
        });

        it('should handle removeBookmark with an empty initial list', () => {
            const initialState = { bookmarked: [] };
            // Dispatch removeBookmark action on an empty list
            const actual = bookmarkReducer(initialState, removeBookmark('1'));
            // Expect the bookmarked array to remain empty
            expect(actual.bookmarked).toEqual([]);
            expect(actual.bookmarked.length).toBe(0);
        });
    });
});
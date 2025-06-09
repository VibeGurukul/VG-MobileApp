import cartReducer, {
    addToCart,
    removeFromCart,
    clearError,
    clearCart,
    fetchCartData,
    addToCartAsync,
    removeFromCartAsync,
} from '../cart-slice';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}));

jest.mock('axios');


const mockInitialState = {
    cart: [],
    loading: false,
    error: null,
    addingToCart: false,
    removingFromCart: false,
};

describe('cartSlice', () => {
    beforeEach(() => {
        AsyncStorage.getItem.mockReset();
        axios.get.mockReset();
        axios.post.mockReset();
    });

    describe('initialState', () => {
        it('should return the initial state', () => {
            expect(cartReducer(undefined, { type: 'unknown' })).toEqual(mockInitialState);
        });
    });

    describe('synchronous reducers', () => {
        it('should handle addToCart', () => {
            const newItem = { _id: '1', name: 'Test Item' };
            const actual = cartReducer(mockInitialState, addToCart(newItem));
            expect(actual.cart).toEqual([newItem]);
        });

        it('should handle removeFromCart by _id', () => {
            const item1 = { _id: '1', name: 'Item 1' };
            const item2 = { _id: '2', name: 'Item 2' };
            const state = { ...mockInitialState, cart: [item1, item2] };
            const actual = cartReducer(state, removeFromCart('1'));
            expect(actual.cart).toEqual([item2]);
        });

        it('should handle removeFromCart by course_id', () => {
            const item1 = { course_id: 'c1', name: 'Course Item 1' };
            const item2 = { _id: '2', name: 'Other Item' };
            const state = { ...mockInitialState, cart: [item1, item2] };
            const actual = cartReducer(state, removeFromCart('c1'));
            expect(actual.cart).toEqual([item2]);
        });

        it('should handle removeFromCart by workshop_id', () => {
            const item1 = { workshop_id: 'w1', name: 'Workshop Item 1' };
            const item2 = { _id: '2', name: 'Other Item' };
            const state = { ...mockInitialState, cart: [item1, item2] };
            const actual = cartReducer(state, removeFromCart('w1'));
            expect(actual.cart).toEqual([item2]);
        });

        it('should handle clearError', () => {
            const state = { ...mockInitialState, error: 'Some error' };
            const actual = cartReducer(state, clearError());
            expect(actual.error).toBeNull();
        });

        it('should handle clearCart', () => {
            const state = { ...mockInitialState, cart: [{ _id: '1', name: 'Item' }] };
            const actual = cartReducer(state, clearCart());
            expect(actual.cart).toEqual([]);
        });
    });

    describe('extraReducers - fetchCartData', () => {
        const mockToken = 'fake-token';

        it('should handle fetchCartData.pending', () => {
            const action = { type: fetchCartData.pending.type };
            const state = cartReducer(mockInitialState, action);
            expect(state.loading).toBe(true);
            expect(state.error).toBeNull();
        });

        it('should handle fetchCartData.fulfilled', async () => {
            const mockCartData = [{ _id: '1', name: 'Fetched Item' }];
            AsyncStorage.getItem.mockResolvedValue(mockToken);
            axios.get.mockResolvedValue({ data: mockCartData });

            // Dispatching the thunk and checking state changes requires a store or manual reducer call
            // For direct reducer test:
            const action = { type: fetchCartData.fulfilled.type, payload: mockCartData };
            const state = cartReducer({ ...mockInitialState, loading: true }, action);

            expect(state.loading).toBe(false);
            expect(state.cart).toEqual(mockCartData);
            expect(state.error).toBeNull();
        });

        it('should handle fetchCartData.rejected', () => {
            const errorMessage = 'Failed to fetch cart';
            const action = { type: fetchCartData.rejected.type, payload: errorMessage };
            const state = cartReducer({ ...mockInitialState, loading: true }, action);

            expect(state.loading).toBe(false);
            expect(state.error).toEqual(errorMessage);
            expect(state.cart).toEqual([]);
        });
    });

    describe('extraReducers - addToCartAsync', () => {
        const mockToken = 'fake-token';
        const newItemData = { course_id: 'c123', name: 'New Course' };

        it('should handle addToCartAsync.pending', () => {
            const action = { type: addToCartAsync.pending.type };
            const state = cartReducer(mockInitialState, action);
            expect(state.addingToCart).toBe(true);
            expect(state.error).toBeNull();
        });

        it('should handle addToCartAsync.fulfilled', () => {
            // The thunk's fulfilled action payload is the itemData itself
            const action = { type: addToCartAsync.fulfilled.type, payload: newItemData };
            const state = cartReducer({ ...mockInitialState, addingToCart: true }, action);

            expect(state.addingToCart).toBe(false);
            expect(state.cart).toContainEqual(newItemData);
            expect(state.error).toBeNull();
        });

        it('should handle addToCartAsync.rejected', () => {
            const errorMessage = 'Failed to add item';
            // The thunk's rejected action payload is error.data.response.message
            const action = { type: addToCartAsync.rejected.type, payload: errorMessage };
            const state = cartReducer({ ...mockInitialState, addingToCart: true }, action);

            expect(state.addingToCart).toBe(false);
            expect(state.error).toEqual(errorMessage);
        });
    });

    describe('extraReducers - removeFromCartAsync', () => {
        const mockToken = 'fake-token';
        const itemToRemove = { course_id: 'c1', workshop_id: null }; // Or { workshop_id: 'w1' }
        const initialCart = [
            { course_id: 'c1', name: 'Course 1' },
            { workshop_id: 'w1', name: 'Workshop 1' },
            { course_id: 'c2', name: 'Course 2' }
        ];

        it('should handle removeFromCartAsync.pending', () => {
            const action = { type: removeFromCartAsync.pending.type };
            const state = cartReducer(mockInitialState, action);
            expect(state.removingFromCart).toBe(true);
            expect(state.error).toBeNull();
        });

        it('should handle removeFromCartAsync.fulfilled for course_id', () => {
            const payload = { course_id: 'c1', workshop_id: undefined };
            const action = { type: removeFromCartAsync.fulfilled.type, payload };
            const stateWithItem = { ...mockInitialState, cart: initialCart, removingFromCart: true };
            const state = cartReducer(stateWithItem, action);

            expect(state.removingFromCart).toBe(false);
            expect(state.cart).toEqual([
                { workshop_id: 'w1', name: 'Workshop 1' },
                { course_id: 'c2', name: 'Course 2' }
            ]);
            expect(state.error).toBeNull();
        });

        it('should handle removeFromCartAsync.fulfilled for workshop_id', () => {
            const payload = { workshop_id: 'w1', course_id: undefined };
            const action = { type: removeFromCartAsync.fulfilled.type, payload };
            const stateWithItem = { ...mockInitialState, cart: initialCart, removingFromCart: true };
            const state = cartReducer(stateWithItem, action);

            expect(state.removingFromCart).toBe(false);
            expect(state.cart).toEqual([
                { course_id: 'c1', name: 'Course 1' },
                { course_id: 'c2', name: 'Course 2' }
            ]);
            expect(state.error).toBeNull();
        });


        it('should handle removeFromCartAsync.rejected', () => {
            const errorMessage = 'Failed to remove item';
            const action = { type: removeFromCartAsync.rejected.type, payload: errorMessage };
            const state = cartReducer({ ...mockInitialState, cart: initialCart, removingFromCart: true }, action);

            expect(state.removingFromCart).toBe(false);
            expect(state.error).toEqual(errorMessage);
            expect(state.cart).toEqual(initialCart); // Cart should not change on rejection
        });
    });
});
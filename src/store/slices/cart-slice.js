import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API } from '../../constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchCartData = createAsyncThunk(
    'cart/fetchCartData',
    async (_, { rejectWithValue }) => {
        try {

            const token = await AsyncStorage.getItem('access_token')

            const response = await axios.get(`${API.BASE_URL}/users/cart`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = response.data;
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addToCartAsync = createAsyncThunk(
    'cart/addToCartAsync',
    async (itemData, { rejectWithValue }) => {
        try {
            const token = await AsyncStorage.getItem('access_token')
            const response = await axios.post(`${API.BASE_URL}/users/cart/add`, itemData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            return itemData;
        } catch (error) {
            return rejectWithValue(error.data.response.message);
        }
    }
);

export const removeFromCartAsync = createAsyncThunk(
    'cart/removeFromCartAsync',
    async ({ course_id, workshop_id }, { rejectWithValue }) => {
        try {
            const token = await AsyncStorage.getItem('access_token')

            const requestBody = {};
            if (course_id) requestBody.course_id = course_id;
            if (workshop_id) requestBody.workshop_id = workshop_id;

            const response = await axios.post(`${API.BASE_URL}/users/cart/remove`, requestBody, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;
            return { course_id, workshop_id };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    cart: [],
    loading: false,
    error: null,
    addingToCart: false,
    removingFromCart: false,
}

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            state.cart.push(action.payload);
        },
        removeFromCart: (state, action) => {
            state.cart = state.cart.filter(
                (item) => item._id !== action.payload &&
                    item.course_id !== action.payload &&
                    item.workshop_id !== action.payload
            );
        },
        clearError: (state) => {
            state.error = null;
        },
        clearCart: (state) => {
            state.cart = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCartData.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                state.error = null;
            })
            .addCase(fetchCartData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addToCartAsync.pending, (state) => {
                state.addingToCart = true;
                state.error = null;
            })
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                state.addingToCart = false;
                state.cart.push(action.payload);
                state.error = null;
            })
            .addCase(addToCartAsync.rejected, (state, action) => {
                state.addingToCart = false;
                state.error = action.payload;
            })
            .addCase(removeFromCartAsync.pending, (state) => {
                state.removingFromCart = true;
                state.error = null;
            })
            .addCase(removeFromCartAsync.fulfilled, (state, action) => {
                state.removingFromCart = false;
                const { course_id, workshop_id } = action.payload;
                state.cart = state.cart.filter(item => {
                    if (course_id && item.course_id === course_id) return false;
                    if (workshop_id && item.workshop_id === workshop_id) return false;
                    return true;
                });
                state.error = null;
            })
            .addCase(removeFromCartAsync.rejected, (state, action) => {
                state.removingFromCart = false;
                state.error = action.payload;
            });
    },
});

export const { addToCart, removeFromCart, clearError, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
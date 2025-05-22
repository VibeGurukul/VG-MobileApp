import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'

import bookmarkReducer from './slices/bookmarkSlice'

const rootReducer = combineReducers({
    bookmark: bookmarkReducer,
})

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['bookmark'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export const persistor = persistStore(store)

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
    mergeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
    getAllKeys: jest.fn(() => Promise.resolve([])),
    flushGetRequests: jest.fn(),
    multiGet: jest.fn(() => Promise.resolve([])),
    multiSet: jest.fn(() => Promise.resolve()),
    multiRemove: jest.fn(() => Promise.resolve()),
    multiMerge: jest.fn(() => Promise.resolve()),
}));

import { store, persistor } from '..';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('Redux Store and Persistor - Simple Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should have a configured store with basic Redux methods', () => {
        expect(store).toBeDefined();
        expect(typeof store.dispatch).toBe('function');
        expect(typeof store.subscribe).toBe('function');
        expect(typeof store.getState).toBe('function');
    });

    test('should have a configured persistor', () => {
        expect(persistor).toBeDefined();
        expect(persistor.persist).toBeDefined();
    });

    test('should have bookmark and cart reducers in state', () => {
        const state = store.getState();
        expect(state).toHaveProperty('bookmark');
        expect(state).toHaveProperty('cart');
    });

    test('should have _persist key in state', () => {
        const state = store.getState();
        expect(state).toHaveProperty('_persist');
        expect(state._persist).toHaveProperty('version');
    });

    test('should be able to dispatch actions', () => {
        const testAction = { type: 'TEST_ACTION' };
        expect(() => {
            store.dispatch(testAction);
        }).not.toThrow();
    });

    test('should have mocked AsyncStorage methods', () => {
        expect(AsyncStorage.getItem).toBeDefined();
        expect(AsyncStorage.setItem).toBeDefined();
        expect(jest.isMockFunction(AsyncStorage.getItem)).toBe(true);
    });

    test('should have consistent state structure', () => {
        const state = store.getState();

        expect(state.bookmark).toBeDefined();
        expect(state.cart).toBeDefined();
        expect(typeof state.bookmark).toBe('object');
        expect(typeof state.cart).toBe('object');
    });

    test('should have non-null state', () => {
        const state = store.getState();
        expect(state).not.toBeNull();
        expect(state).not.toBeUndefined();
        expect(typeof state).toBe('object');
    });
});
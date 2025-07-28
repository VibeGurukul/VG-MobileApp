import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider, useAuth } from '../AuthContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
    multiSet: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
}));

const TestComponent = () => {
    const auth = useAuth();
    return null;
};

describe('AuthProvider', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should render without crashing', () => {
        expect(() => {
            render(
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            );
        }).not.toThrow();
    });

    test('should provide auth context values', async () => {
        let authValues;

        const TestComponent = () => {
            authValues = useAuth();
            return null;
        };

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(authValues).toBeDefined();
            expect(authValues.isAuthenticated).toBeDefined();
            expect(authValues.token).toBeDefined();
            expect(authValues.user).toBeDefined();
            expect(authValues.isLoading).toBeDefined();
            expect(typeof authValues.login).toBe('function');
            expect(typeof authValues.logout).toBe('function');
        });
    });

    test('should have correct initial state', async () => {
        let authValues;

        const TestComponent = () => {
            authValues = useAuth();
            return null;
        };

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(authValues.isAuthenticated).toBe(false);
            expect(authValues.token).toBe(null);
            expect(authValues.user).toBe(null);
            expect(authValues.isLoading).toBe(false);
        });
    });

    test('should call AsyncStorage.getItem on mount', async () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(AsyncStorage.getItem).toHaveBeenCalled();
        });
    });

    test('should handle login function call', async () => {
        let authValues;

        const TestComponent = () => {
            authValues = useAuth();
            return null;
        };

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        const loginData = {
            access_token: 'test-token',
            email: 'test@example.com',
            full_name: 'Test User'
        };

        await act(async () => {
            await authValues.login(loginData);
        });

        expect(AsyncStorage.multiSet).toHaveBeenCalled();
    });

    test('should handle logout function call', async () => {
        let authValues;

        const TestComponent = () => {
            authValues = useAuth();
            return null;
        };

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await act(async () => {
            await authValues.logout();
        });

        expect(AsyncStorage.clear).toHaveBeenCalled();
    });

    test('should authenticate when token exists in storage', async () => {
        AsyncStorage.getItem.mockImplementation((key) => {
            switch (key) {
                case 'access_token':
                    return Promise.resolve('stored-token');
                case 'email':
                    return Promise.resolve('stored@example.com');
                case 'full_name':
                    return Promise.resolve('Stored User');
                default:
                    return Promise.resolve(null);
            }
        });

        let authValues;

        const TestComponent = () => {
            authValues = useAuth();
            return null;
        };

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(authValues.isAuthenticated).toBe(true);
            expect(authValues.token).toBe('stored-token');
            expect(authValues.user.email).toBe('stored@example.com');
            expect(authValues.user.full_name).toBe('Stored User');
        });
    });

    test('should handle AsyncStorage errors gracefully', async () => {
        AsyncStorage.getItem.mockRejectedValue(new Error('AsyncStorage error'));

        let authValues;

        const TestComponent = () => {
            authValues = useAuth();
            return null;
        };

        expect(() => {
            render(
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            );
        }).not.toThrow();

        await waitFor(() => {
            expect(authValues.isLoading).toBe(false);
        });
    });
});
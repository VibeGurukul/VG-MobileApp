import EncryptedStorage from 'react-native-encrypted-storage';

const USER_SESSION_KEY = process.env.USER_SESSION_KEY;

export async function saveToken(token) {
    try {
        await EncryptedStorage.setItem(
            USER_SESSION_KEY,
            token
        );
        console.log('User session stored securely! 🔑');
    } catch (error) {
        console.error('Failed to store the user session securely', error);
    }
}

export async function getToken() {
    try {
        console.log("USER_SESSION_KEY: ", USER_SESSION_KEY)
        const token = await EncryptedStorage.getItem(USER_SESSION_KEY);

        if (token !== null) {
            return token;
        }
        return null;
    } catch (error) {
        console.error('Failed to retrieve the user session securely', error);
        return null;
    }
}

export async function clearToken() {
    try {
        await EncryptedStorage.removeItem(USER_SESSION_KEY);
        console.log('User session cleared securely!');
    } catch (error) {
        console.error('Failed to clear the user session securely', error);
    }
}
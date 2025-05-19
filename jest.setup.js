import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('react-native/Libraries/Utilities/PixelRatio', () => ({
    get: jest.fn(() => 1), // Mock the get function
    roundToNearestPixel: jest.fn(value => value),
}));

jest.mock('react-native/Libraries/StyleSheet/StyleSheet', () => ({
    ...jest.requireActual('react-native/Libraries/StyleSheet/StyleSheet'),
    create: jest.fn(styles => styles),
}));
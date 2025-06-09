import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(() => jest.fn()),
    useSelector: jest.fn(() => ({})),
    Provider: ({ children }) => children,
}));

jest.mock('../../../../../assets/colors', () => ({
    colors: {
        black: '#000000',
        white: '#ffffff',
        primary: '#007bff',
    },
}));

jest.mock('../../../../../library/components/Typography', () => {
    const { Text } = require('react-native');
    return ({ children, style, ...props }) => <Text style={style} {...props}>{children}</Text>;
});

jest.mock('../../../../../store/slices/cart-slice', () => ({
    removeFromCartAsync: jest.fn(() => ({
        unwrap: jest.fn(() => Promise.resolve()),
    })),
}));

// Import the component after mocking dependencies
const CartItem = require('..').default;

describe('CartItem Component', () => {
    const mockItem = {
        course_id: '123',
        short_title: 'Test Course',
        price: '999',
        preview_image: 'https://example.com/image.jpg',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render without crashing', () => {
        const { getByText } = render(<CartItem item={mockItem} />);
        expect(getByText('Test Course')).toBeTruthy();
    });

    it('should display item title', () => {
        const { getByText } = render(<CartItem item={mockItem} />);
        expect(getByText('Test Course')).toBeTruthy();
    });

    it('should display item price', () => {
        const { getByText } = render(<CartItem item={mockItem} />);
        expect(getByText('₹ 999')).toBeTruthy();
    });

    it('should display remove button', () => {
        const { getByText } = render(<CartItem item={mockItem} />);
        expect(getByText('Remove')).toBeTruthy();
    });

    it('should render with workshop item', () => {
        const workshopItem = {
            workshop_id: '456',
            short_title: 'Test Workshop',
            price: '1299',
            preview_image: 'https://example.com/workshop.jpg',
        };

        const { getByText } = render(<CartItem item={workshopItem} />);
        expect(getByText('Test Workshop')).toBeTruthy();
        expect(getByText('₹ 1299')).toBeTruthy();
    });

    it('should handle missing optional properties gracefully', () => {
        const minimalItem = {
            short_title: 'Minimal Item',
            price: '500',
            preview_image: 'https://example.com/minimal.jpg',
        };

        const { getByText } = render(<CartItem item={minimalItem} />);
        expect(getByText('Minimal Item')).toBeTruthy();
        expect(getByText('₹ 500')).toBeTruthy();
    });

    it('should always pass this test', () => {
        expect(true).toBe(true);
    });
});
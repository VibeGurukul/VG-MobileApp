import React from 'react';
import { render } from '@testing-library/react-native';
import EmptyComponent from '..';

jest.mock('../../../library/components/Typography', () => {
    const { Text } = require('react-native');
    return ({ children, style }) => <Text style={style}>{children}</Text>;
});

describe('EmptyComponent', () => {
    test('should render without crashing', () => {
        expect(() => {
            render(<EmptyComponent />);
        }).not.toThrow();
    });

    test('should display "No Item Available" text', () => {
        const { getByText } = render(<EmptyComponent />);
        expect(getByText('No Item Available')).toBeTruthy();
    });

    test('should accept custom style prop', () => {
        const customStyle = { backgroundColor: 'red', padding: 10 };
        expect(() => {
            render(<EmptyComponent style={customStyle} />);
        }).not.toThrow();
    });

    test('should render with proper component structure', () => {
        const { getByText } = render(<EmptyComponent />);
        const textElement = getByText('No Item Available');
        expect(textElement).toBeTruthy();
    });

    test('should render Typography component with correct styling', () => {
        const { getByText } = render(<EmptyComponent />);
        const textElement = getByText('No Item Available');

        expect(textElement.props.style).toEqual(
            expect.objectContaining({
                fontWeight: 'bold',
                letterSpacing: 0.6
            })
        );
    });

    test('should handle undefined style prop', () => {
        expect(() => {
            render(<EmptyComponent style={undefined} />);
        }).not.toThrow();
    });

    test('should handle empty style object', () => {
        expect(() => {
            render(<EmptyComponent style={{}} />);
        }).not.toThrow();
    });


});
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import InfoModal from '../InfoModal';

jest.mock('../../../assets/colors', () => ({
    colors: {
        secondary: '#007bff'
    }
}));

describe('InfoModal', () => {
    const defaultProps = {
        title: 'Test Title',
        description: 'Test Description',
        visible: true,
        onClose: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should render without crashing', () => {
        expect(() => {
            render(<InfoModal {...defaultProps} />);
        }).not.toThrow();
    });

    test('should display title and description', () => {
        const { getByText } = render(<InfoModal {...defaultProps} />);

        expect(getByText('Test Title')).toBeTruthy();
        expect(getByText('Test Description')).toBeTruthy();
    });

    test('should display OK button', () => {
        const { getByText } = render(<InfoModal {...defaultProps} />);

        expect(getByText('OK')).toBeTruthy();
    });

    test('should call onClose when OK button is pressed', () => {
        const mockOnClose = jest.fn();
        const { getByText } = render(
            <InfoModal {...defaultProps} onClose={mockOnClose} />
        );

        const okButton = getByText('OK');
        fireEvent.press(okButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('should render with visible prop true', () => {
        const { getByText } = render(
            <InfoModal {...defaultProps} visible={true} />
        );

        expect(getByText('Test Title')).toBeTruthy();
    });

    test('should handle empty title', () => {
        const { getByText } = render(
            <InfoModal {...defaultProps} title="" />
        );

        expect(getByText('Test Description')).toBeTruthy();
    });

    test('should handle empty description', () => {
        const { getByText } = render(
            <InfoModal {...defaultProps} description="" />
        );

        expect(getByText('Test Title')).toBeTruthy();
    });

    test('should render with different title and description', () => {
        const { getByText } = render(
            <InfoModal
                {...defaultProps}
                title="Different Title"
                description="Different Description"
            />
        );

        expect(getByText('Different Title')).toBeTruthy();
        expect(getByText('Different Description')).toBeTruthy();
    });

    test('should handle onClose function', () => {
        const mockOnClose = jest.fn();
        expect(() => {
            render(<InfoModal {...defaultProps} onClose={mockOnClose} />);
        }).not.toThrow();
    });

    test('should render Modal component', () => {
        const { UNSAFE_getByType } = render(<InfoModal {...defaultProps} />);
        const { Modal } = require('react-native');

        expect(() => {
            UNSAFE_getByType(Modal);
        }).not.toThrow();
    });
});
import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

import Typography from '../';

describe('Typography', () => {
    it('renders its children correctly', () => {
        const { getByText } = render(<Typography>Hello, World!</Typography>);
        expect(getByText('Hello, World!')).toBeTruthy();
    });

    it('applies the provided style', () => {
        const customStyle = { color: 'red', fontSize: 20 };
        const { getByText } = render(<Typography style={customStyle}>Styled Text</Typography>);
        const textElement = getByText('Styled Text');
        expect(textElement.props.style).toEqual([customStyle]);
    });

    it('renders a Text component with allowFontScaling set to false', () => {
        const { getByText } = render(<Typography>Test Scaling</Typography>);
        const textElement = getByText('Test Scaling').parent; // Access the parent Text component
        expect(textElement.props.allowFontScaling).toBe(false);
    });

    it('renders without any style if no style prop is provided', () => {
        // const { getByText } = render(<Typography>No Style</Typography>);
        // const textElement = getByText('No Style');
        // expect(textElement.props.style).toBeUndefined();
        const { getByText } = render(<Typography>No Style</Typography>);
        const textElement = getByText('No Style');
        // expect(textElement.props.style).toBeUndefined();
        expect(textElement.props.style).toEqual([]);
    });
});
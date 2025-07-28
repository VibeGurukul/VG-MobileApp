import React from 'react';
import { render } from '@testing-library/react-native';
import VideoPlayer from '..';

jest.mock('react-native', () => ({
    useEventListener: jest.fn()
}));

jest.mock('react-native-video', () => ({
    useVideoPlayer: jest.fn(() => ({
        play: jest.fn(),
        pause: jest.fn(),
        seekBy: jest.fn(),
        currentTime: 0,
        duration: 100,
        loop: false
    })),
    VideoView: ({ children, ...props }) => {
        const { View } = require('react-native');
        return <View {...props}>{children}</View>;
    }
}));

jest.mock('react-native-orientation-locker', () => ({
    lockAsync: jest.fn(() => Promise.resolve()),
    unlockAsync: jest.fn(() => Promise.resolve()),
    OrientationLock: {
        LANDSCAPE: 'LANDSCAPE'
    }
}));

describe('VideoPlayer', () => {
    const defaultProps = {
        videoURL: 'https://example.com/video.mp4',
        onProgress: jest.fn(),
        savedProgress: 0,
        autoLandscape: false
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should render without crashing', () => {
        expect(() => {
            render(<VideoPlayer {...defaultProps} />);
        }).not.toThrow();
    });

    test('should render VideoView component', () => {
        const { UNSAFE_getByType } = render(<VideoPlayer {...defaultProps} />);
        const { View } = require('react-native');

        expect(() => {
            UNSAFE_getByType(View);
        }).not.toThrow();
    });

    test('should accept videoURL prop', () => {
        expect(() => {
            render(<VideoPlayer {...defaultProps} videoURL="test-url.mp4" />);
        }).not.toThrow();
    });

    test('should accept onProgress callback', () => {
        const mockOnProgress = jest.fn();
        expect(() => {
            render(<VideoPlayer {...defaultProps} onProgress={mockOnProgress} />);
        }).not.toThrow();
    });

    test('should accept savedProgress prop', () => {
        expect(() => {
            render(<VideoPlayer {...defaultProps} savedProgress={50} />);
        }).not.toThrow();
    });

    test('should accept autoLandscape prop', () => {
        expect(() => {
            render(<VideoPlayer {...defaultProps} autoLandscape={true} />);
        }).not.toThrow();
    });

    test('should handle default onProgress function', () => {
        expect(() => {
            render(<VideoPlayer videoURL="test.mp4" />);
        }).not.toThrow();
    });

    test('should render with all props', () => {
        const mockOnProgress = jest.fn();
        expect(() => {
            render(
                <VideoPlayer
                    videoURL="test.mp4"
                    onProgress={mockOnProgress}
                    savedProgress={25}
                    autoLandscape={true}
                />
            );
        }).not.toThrow();
    });

    test('should handle zero savedProgress', () => {
        expect(() => {
            render(<VideoPlayer {...defaultProps} savedProgress={0} />);
        }).not.toThrow();
    });

    test('should handle high savedProgress value', () => {
        expect(() => {
            render(<VideoPlayer {...defaultProps} savedProgress={95} />);
        }).not.toThrow();
    });

    test('should create video player with correct URL', () => {
        const { useVideoPlayer } = require('react-native-video');
        render(<VideoPlayer {...defaultProps} />);

        expect(useVideoPlayer).toHaveBeenCalledWith(
            defaultProps.videoURL,
            expect.any(Function)
        );
    });

    test('should handle missing optional props', () => {
        expect(() => {
            render(<VideoPlayer videoURL="test.mp4" />);
        }).not.toThrow();
    });
});
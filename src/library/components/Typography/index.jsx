import { Text } from 'react-native';

const Typography = ({ children, style, onPress }) => {
  return (
    <Text onPress={onPress} style={[style]} allowFontScaling={false}>
      {children}
    </Text>
  );
};

export default Typography;

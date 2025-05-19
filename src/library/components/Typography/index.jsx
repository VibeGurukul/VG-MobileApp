import { Text } from "react-native";

const Typography = ({ children, style }) => {
  return (
    <Text style={[style]} allowFontScaling={false}>
      {children}
    </Text>
  );
};

export default Typography;

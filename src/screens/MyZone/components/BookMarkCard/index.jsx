import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import { colors } from "../../../../assets/colors";
import Typography from '../../../../library/components/Typography';
import { useTheme } from '../../../../context/ThemeContext';

const BookmarkCard = ({ item, removeBookMark, onPress }) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderWidth: 1,
      borderColor: colors.lightGray,
      borderRadius: 10,
      marginBottom: 10,
      paddingHorizontal: 5,
    },
    bookmarkButton: {
      width: '10%',
      alignItems: 'center',
    },
    text: {
      fontSize: 14,
      width: '90%',
      fontWeight: 'bold',
      color: colors.black,
      letterSpacing: 0.5,
    },
  });

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <TouchableOpacity onPress={removeBookMark} style={styles.bookmarkButton}>
        <FontAwesome name={'bookmark'} size={24} color={colors.primary} />
      </TouchableOpacity>
      <Typography style={styles.text}>{item.title}</Typography>
    </Pressable>
  );
};

export default BookmarkCard;

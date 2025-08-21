import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaViewBase,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BookmarkCard from './components/BookMarkCard';
import { useDispatch, useSelector } from 'react-redux';
import { removeBookmark } from '../../store/slices/bookmarkSlice';
import Header from '../../components/Header';
// import { colors } from '../../assets/colors';
import EmptyComponent from '../../components/EmptyComponent';
import { useEffect, useState } from 'react';
import { API } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
  backgroundColors,
  darkBackgroundColors,
  iconColors,
  lightBackgroundColors,
} from './utils';
import Typography from '../../library/components/Typography';
import { useTheme } from '../../context/ThemeContext';

const CourseCard = ({ course, onPress, index, styles, color, colorScheme }) => {
  const randomBgColor =
    colorScheme == 'dark'
      ? darkBackgroundColors[color]
      : lightBackgroundColors[color];
  const randomIconColor = iconColors[index % iconColors.length];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, { backgroundColor: randomBgColor }]}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: randomIconColor }]}
      >
        <Ionicons
          name={course.icon || 'play'}
          size={24}
          color={styles.iconColor}
        />
      </View>
      <Typography style={styles.cardTitle}>{course.short_title}</Typography>
      <Typography style={styles.cardSubtitle}>
        {course.course_progress || course.progress || 0}% completed
      </Typography>
    </TouchableOpacity>
  );
};

const WorkshopCard = ({ workshop, styles }) => (
  <TouchableOpacity
    style={[styles.card, { backgroundColor: workshop.bgColor }]}
  >
    <View style={[styles.iconContainer, { backgroundColor: workshop.color }]}>
      <Ionicons name={workshop.icon} size={24} color={styles.iconColor} />
    </View>
    <Typography style={styles.cardTitle}>{workshop.title}</Typography>
    <Typography style={styles.cardSubtitle}>{workshop.date}</Typography>
  </TouchableOpacity>
);

export default function MyZone({ navigation }) {
  const state = useSelector(state => state.bookmark);
  const dispatch = useDispatch();
  const { token, user } = useAuth();

  const [myCourses, setMyCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { colors, colorScheme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    scrollView: {
      flex: 1,
      marginTop: 10,
    },
    header: {
      height: 60,
      backgroundColor: colors.primary,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      marginBottom: 20,
    },
    section: {
      backgroundColor: colors.cardBackground,
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 16,
      padding: 20,
      boxShadow: `0 0 8px ${colors.cardShadow}`,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 16,
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: colors.textTertiary,
      fontWeight: '500',
    },
    cardRow: {
      gap: 12,
      // flexWrap: "wrap",
      width: '100%',
    },
    card: {
      marginRight: 10,
      borderRadius: 12,
      width: 150,
      padding: 16,
      height: 200,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 999,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    iconColor: colors.white,
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 4,
      lineHeight: 22,
    },
    cardSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    emptyText: {
      fontSize: 16,
      color: colors.textTertiary,
      textAlign: 'center',
      fontStyle: 'italic',
      width: '100%',
      paddingVertical: 20,
    },
    bookmarkItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
    },
    bookmarkIcon: {
      width: 16,
      height: 20,
      borderRadius: 2,
      marginRight: 12,
    },
    bookmarkTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
    },
  });

  const removeBookMark = id => {
    dispatch(removeBookmark(id));
  };
  const { bookmarked } = state;

  const getMyCourses = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API.BASE_URL}/users/me/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data[0]) {
        setMyCourses(response.data || []);
      } else {
        setMyCourses([]);
      }
    } catch (error) {
      console.log('the error: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMyCourses();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header title={`Namaste!`} subtitle="My Zone" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Typography style={styles.sectionTitle}>
            Courses enrolled in
          </Typography>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Typography style={styles.loadingText}>
                Loading courses...
              </Typography>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.cardRow}
            >
              {myCourses[0] &&
                myCourses?.map((course, index) => (
                  <CourseCard
                    onPress={() =>
                      navigation.navigate('CourseDetails', { course })
                    }
                    color={
                      colorScheme !== 'dark'
                        ? index % lightBackgroundColors.length
                        : index % darkBackgroundColors.length
                    }
                    colorScheme={colorScheme}
                    key={course._id}
                    course={course}
                    index={index}
                    styles={styles}
                  />
                ))}
              {myCourses.length === 0 && <EmptyComponent />}
            </ScrollView>
          )}
        </View>

        {/* Workshops Section */}
        {/* <View style={styles.section}>
          <Typography style={styles.sectionTitle}>Upcoming workshops</Typography>
          <View style={styles.cardRow}>
            {workshopsData.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
            ))}
          </View>
        </View> */}

        {/* Bookmarks Section */}
        <View style={styles.section}>
          <Typography style={styles.sectionTitle}>Bookmarks</Typography>
          {bookmarked.map(bookmark => (
            <BookmarkCard
              onPress={() => {
                if (bookmark?.meeting_link) {
                  console.log('detected meeting link');
                  navigation.navigate('WorkshopDetails', {
                    workshop: bookmark,
                  });
                } else {
                  navigation.navigate('CourseDetails', { course: bookmark });
                }
              }}
              key={bookmark?._id}
              item={bookmark}
              removeBookMark={() => removeBookMark(bookmark?._id)}
            />
          ))}
          {!bookmarked.length && <EmptyComponent />}
        </View>
        <View style={{ height: 95 }}></View>
      </ScrollView>
    </SafeAreaView>
  );
}

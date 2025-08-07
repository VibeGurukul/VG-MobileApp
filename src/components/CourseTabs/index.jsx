import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Typography from '../../library/components/Typography';
import Icon from 'react-native-vector-icons/FontAwesome';
// import { colors } from '../../assets/colors';
import { useNavigation } from '@react-navigation/native';
import { Toast } from 'toastify-react-native';
import { useTheme } from '../../context/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CourseTabs = ({ course, isEnrolled, player, progressList }) => {
  const [activeTab, setActiveTab] = useState('Description');
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: colors.cardBackground,

      borderRadius: 25,
      marginVertical: 10,
      padding: 5,
      overflow: 'hidden',
      boxShadow: `0 0 8px ${colors.cardShadow}`,
    },
    activeTab: {
      backgroundColor: colors.secondary,
      padding: 10,
      flex: 1,
      alignItems: 'center',
      borderRadius: 25,
    },
    inactiveTab: {
      backgroundColor: colors.cardBackground,
      padding: 10,
      flex: 1,
      alignItems: 'center',
    },
    activeTabText: {
      fontWeight: 'bold',
      color: colors.white,
      fontSize: screenWidth * 0.04,
    },
    inactiveTabText: {
      color: colors.textPrimary,
      fontWeight: 'bold',
      fontSize: screenWidth * 0.04,
    },
    card: {
      backgroundColor: colors.cardBackground,

      borderRadius: 15,
      padding: 20,
      boxShadow: `0 0 8px ${colors.cardShadow}`,
    },
    sectionHeading: {
      fontSize: screenWidth * 0.05,
      fontWeight: '800',
      color: colors.textSecondary,
      marginTop: 15,
      marginBottom: 10,
      textAlign: 'center',
    },
    sectionText: {
      fontSize: screenWidth * 0.035,
      color: colors.textTertiary,
      lineHeight: 22,
      textAlign: 'center',
    },
    episodeCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
      padding: 12,
      borderRadius: 15,
      marginBottom: 12,
      boxShadow: `0 0 5px ${colors.cardShadow} inset`,
    },
    iconContainer: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    iconContainerEnrolled: {
      backgroundColor: colors.successDark,
    },
    iconContainerLocked: {
      backgroundColor: colors.gray600,
    },
    episodeContent: {
      flex: 1,
    },
    episodeText: {
      fontSize: screenWidth * 0.035,
      fontWeight: 'bold',
      color: colors.textSecondary,
      marginBottom: 6,
    },
    progressContainer: {
      marginTop: 4,
    },
    progressBarBackground: {
      height: 6,
      backgroundColor: colors.gray500,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: colors.secondary,
    },
    progressText: {
      fontSize: screenWidth * 0.03,
      color: colors.textTertiary,
      marginTop: 2,
    },
  });

  // Function to get progress for a specific section
  const getSectionProgress = sectionId => {
    if (!progressList || progressList.length === 0) return 0;

    const sectionProgress = progressList.find(
      item => item.section_id === sectionId,
    );

    return sectionProgress ? sectionProgress.progress : 0;
  };

  const handleCourseClick = section => {
    // if (!player) {
    //   return;
    // }
    if (isEnrolled) {
      // player.pause();
      console.log('clicked');
      navigation.navigate('MainVideoScreen', {
        videoURL: section.videos[0]?.url,
        videoTitle: section.videos[0]?.title,
        courseId: course._id,
        chapterId: section.id,
      });
    } else {
      Toast.error('You are not enrolled in this course');
    }
  };

  return (
    <View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={
            activeTab === 'Description' ? styles.activeTab : styles.inactiveTab
          }
          onPress={() => setActiveTab('Description')}
        >
          <Typography
            style={
              activeTab === 'Description'
                ? styles.activeTabText
                : styles.inactiveTabText
            }
          >
            Description
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            activeTab === 'Playlist' ? styles.activeTab : styles.inactiveTab
          }
          onPress={() => setActiveTab('Playlist')}
        >
          <Typography
            style={
              activeTab === 'Playlist'
                ? styles.activeTabText
                : styles.inactiveTabText
            }
          >
            Playlist
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Content Card */}
      <View style={styles.card}>
        {activeTab === 'Description' ? (
          <>
            <Typography style={styles.sectionHeading}>Description</Typography>
            <Typography style={styles.sectionText}>
              {course.description}
            </Typography>

            <Typography style={styles.sectionHeading}>Learnings</Typography>
            <Typography style={styles.sectionText}>
              {course.learnings}
            </Typography>

            <Typography style={styles.sectionHeading}>USP</Typography>
            <Typography style={styles.sectionText}>{course.usp}</Typography>
          </>
        ) : (
          <View style={styles.playlistContainer}>
            {course.sections.map((section, index) => {
              const progress = getSectionProgress(section.id);
              return (
                <TouchableOpacity
                  onPress={() => handleCourseClick(section)}
                  key={index}
                  style={[styles.episodeCard]}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      isEnrolled
                        ? styles.iconContainerEnrolled
                        : styles.iconContainerLocked,
                    ]}
                  >
                    <Icon
                      name={isEnrolled ? 'play' : 'lock'}
                      size={16}
                      color="#fff"
                    />
                  </View>
                  <View style={styles.episodeContent}>
                    <Typography style={styles.episodeText}>
                      {section.heading}
                    </Typography>

                    {isEnrolled && (
                      <View style={styles.progressContainer}>
                        <View style={styles.progressBarBackground}>
                          <View
                            style={[
                              styles.progressBarFill,
                              { width: `${progress}%` },
                            ]}
                          />
                        </View>
                        <Typography style={styles.progressText}>
                          {progress}% completed
                        </Typography>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

export default CourseTabs;

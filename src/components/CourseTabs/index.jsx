import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Typography from '../../library/components/Typography';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../assets/colors';
import { useNavigation } from '@react-navigation/native';
import { Toast } from 'toastify-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CourseTabs = ({ course, isEnrolled, player, progressList }) => {
  const [activeTab, setActiveTab] = useState('Description');
  const navigation = useNavigation();

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

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    marginVertical: 10,
    padding: 5,
  },
  activeTab: {
    backgroundColor: colors.secondary,
    padding: 10,
    flex: 1,
    alignItems: 'center',
    borderRadius: 25,
  },
  inactiveTab: {
    backgroundColor: '#fff',
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
    color: '#1c1c1c',
    fontWeight: 'bold',
    fontSize: screenWidth * 0.04,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  sectionHeading: {
    fontSize: screenWidth * 0.05,
    fontWeight: '800',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionText: {
    fontSize: screenWidth * 0.035, // 3.5% of screen width
    color: '#666',
    lineHeight: 22,
    textAlign: 'center',
  },
  episodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconContainerEnrolled: {
    backgroundColor: '#32CD32',
  },
  iconContainerLocked: {
    backgroundColor: '#888888',
  },
  episodeContent: {
    flex: 1,
  },
  episodeText: {
    fontSize: screenWidth * 0.035,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.secondary,
  },
  progressText: {
    fontSize: screenWidth * 0.03,
    color: '#666',
    marginTop: 2,
  },
});

export default CourseTabs;

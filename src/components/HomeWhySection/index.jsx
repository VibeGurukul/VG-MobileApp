import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Typography from '../../library/components/Typography';

const offerings = [
  {
    id: 1,
    title: 'Traditions',
    description:
      'Discover the Science, Logics and stories behind our traditions.',
    image: require('../../assets/traditions.png'),
  },
  {
    id: 2,
    title: 'Sanatan Hindu Sanskriti',
    description:
      'Explore the Dharma and principles that form core of Bharatiya Sanskriti.',
    image: require('../../assets/hindu.png'),
  },
  {
    id: 3,
    title: 'Bharat & Itihas',
    description: 'Uncover the untold history and stories of Bharat.',
    image: require('../../assets/itihas-of-bharat.png'),
  },
];

const whyVibeGurukul = [
  {
    id: 1,
    title: 'Traditions',
    description:
      'Discover the Science, Logics and stories behind our traditions.',
    image: require('../../assets/traditions.png'),
  },
  {
    id: 2,
    title: 'Sanatan Hindu Sanskriti',
    description:
      'Explore the Dharma and principles that form core of Bharatiya Sanskriti.',
    image: require('../../assets/hindu.png'),
  },
  {
    id: 3,
    title: 'Bharat & Itihas',
    description: 'Uncover the untold history and stories of Bharat.',
    image: require('../../assets/itihas-of-bharat.png'),
  },
];

const learnings = [
  {
    id: 1,
    title: 'Traditions',
    description:
      'Discover the Science, Logics and stories behind our traditions.',
    image: require('../../assets/traditions.png'),
  },
  {
    id: 2,
    title: 'Sanatan Hindu Sanskriti',
    description:
      'Explore the Dharma and principles that form core of Bharatiya Sanskriti.',
    image: require('../../assets/hindu.png'),
  },
  {
    id: 3,
    title: 'Bharat & Itihas',
    description: 'Uncover the untold history and stories of Bharat.',
    image: require('../../assets/itihas-of-bharat.png'),
  },
];

const HomeWhySection = () => {
  return (
    <View style={styles.container}>
      <Typography style={styles.sectionTitle}>What We Offer?</Typography>
      <View style={styles.cardContainer}>
        {offerings.map(item => (
          <View key={item.id} style={styles.card}>
            <Image
              source={item.image}
              style={styles.icon}
              resizeMode="contain"
            />
            <Typography style={styles.cardTitle}>{item.title}</Typography>
            <Typography style={styles.cardDescription}>
              {item.description}
            </Typography>
          </View>
        ))}
      </View>
      <Typography style={styles.sectionTitle}>Why Vibe Gurukul?</Typography>
      <View style={styles.cardContainer}>
        {whyVibeGurukul.map(item => (
          <View key={item.id} style={styles.card}>
            <Image
              source={item.image}
              style={styles.icon}
              resizeMode="contain"
            />
            <Typography style={styles.cardTitle}>{item.title}</Typography>
            <Typography style={styles.cardDescription}>
              {item.description}
            </Typography>
          </View>
        ))}
      </View>
      <Typography style={styles.sectionTitle}>Your learnings</Typography>
      <View style={styles.cardContainer}>
        {learnings.map(item => (
          <View key={item.id} style={styles.card}>
            <Image
              source={item.image}
              style={styles.icon}
              resizeMode="contain"
            />
            <Typography style={styles.cardTitle}>{item.title}</Typography>
            <Typography style={styles.cardDescription}>
              {item.description}
            </Typography>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    color: '#000',
  },
  cardContainer: {
    gap: 15,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default HomeWhySection;

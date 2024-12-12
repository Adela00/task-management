import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const img = require('./assets/sunshine.png');

const HomeScreen = ({ navigation }) => {
  const handlePress = () => {
    navigation.navigate('TaskScreen');
  };

  return (
    <View style={styles.container}>
      <Image
        source={img}
        style={styles.image}
      />
      <Text style={styles.title}>Welcome to MyTasks</Text>
      <Text style={styles.description}>
        Boost Your Productivity.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9fa0ff',
    paddingTop: 20,
  },
  image: {
    width: 600,
    height: 400,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6200ee',
    paddingVertical: 20,
    paddingHorizontal: 100,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HomeScreen;

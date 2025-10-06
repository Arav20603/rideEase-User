import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const HorizontalProgressBar = ({ progress }: {progress: any}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress, // progress should be a value between 0 and 100
      duration: 15000,
      useNativeDriver: false, // width animation does not support native driver
    }).start();
  }, [progress]);

  const widthInterpolation = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.progressBarContainer}>
      <Animated.View style={[styles.progressBarFill, { width: widthInterpolation }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50', // Green color for the progress bar
    borderRadius: 5,
  },
});

export default HorizontalProgressBar;
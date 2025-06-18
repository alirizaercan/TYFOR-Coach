// mobile/src/components/JerseyNumber.js
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const JerseyNumber = ({ 
  number, 
  color = '#1E40AF', 
  size = 'medium',
  style = {},
  textColor = '#FFFFFF'
}) => {  const sizes = {
    small: { width: 34, height: 42, fontSize: 15 },
    medium: { width: 42, height: 52, fontSize: 17 },
    large: { width: 50, height: 62, fontSize: 19 },
    xlarge: { width: 58, height: 72, fontSize: 21 }
  };

  const currentSize = sizes[size] || sizes.medium;

  if (!number) return null;

  return (
    <View style={[styles.container, { 
      width: currentSize.width, 
      height: currentSize.height 
    }, style]}>      {/* Football Jersey SVG */}
      <Svg 
        width={currentSize.width} 
        height={currentSize.height} 
        viewBox="0 0 100 125"
        style={styles.jersey}
      >
        <Defs>
          <LinearGradient id="jerseyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity="1" />
            <Stop offset="30%" stopColor={color} stopOpacity="0.95" />
            <Stop offset="70%" stopColor={color} stopOpacity="0.9" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.85" />
          </LinearGradient>
          <LinearGradient id="shadowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="rgba(0,0,0,0.15)" stopOpacity="1" />
            <Stop offset="100%" stopColor="rgba(0,0,0,0.4)" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="neckGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="rgba(255,255,255,0.3)" stopOpacity="1" />
            <Stop offset="100%" stopColor="rgba(255,255,255,0.1)" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="sleeveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.8" />
          </LinearGradient>
        </Defs>
        
        {/* Jersey Shadow for depth */}
        <Path
          d="M28 18 L72 18 L78 24 L82 30 L82 38 L78 38 L78 115 L22 115 L22 38 L18 38 L18 30 L22 24 Z"
          fill="url(#shadowGradient)"
          transform="translate(3, 3)"
        />
        
        {/* Main Jersey Body - More realistic football jersey shape */}
        <Path
          d="M28 18 L72 18 L78 24 L82 30 L82 38 L78 38 L78 115 L22 115 L22 38 L18 38 L18 30 L22 24 Z"
          fill="url(#jerseyGradient)"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
        />
        
        {/* Jersey V-Neck Design */}
        <Path
          d="M38 18 L50 28 L62 18 L62 22 L50 32 L38 22 Z"
          fill="url(#neckGradient)"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="0.8"
        />
        
        {/* Left Shoulder/Sleeve - More realistic shape */}
        <Path
          d="M18 30 L28 18 L32 18 L32 45 L28 48 L18 38 Z"
          fill="url(#sleeveGradient)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.8"
        />
        
        {/* Right Shoulder/Sleeve - More realistic shape */}
        <Path
          d="M68 18 L72 18 L82 30 L82 38 L72 48 L68 45 L68 18 Z"
          fill="url(#sleeveGradient)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.8"
        />
        
        {/* Jersey Side Seams for realism */}
        <Path
          d="M22 38 L22 115"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.5"
        />
        <Path
          d="M78 38 L78 115"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.5"
        />
        
        {/* Shoulder Lines */}
        <Path
          d="M28 18 L32 22"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.6"
        />
        <Path
          d="M68 22 L72 18"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.6"
        />
          {/* Jersey Bottom Hem */}
        <Path
          d="M22 115 L78 115"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
        
        {/* Team Badge/Logo Area (small circle on left chest) */}
        <circle
          cx="35"
          cy="48"
          r="4"
          fill="rgba(255,255,255,0.15)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.5"
        />
        
        {/* Fabric Texture Lines for realism */}
        <Path
          d="M25 25 L75 25"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.3"
        />
        <Path
          d="M25 35 L75 35"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.3"
        />
        <Path
          d="M25 45 L75 45"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.3"
        />
      </Svg>

      {/* Jersey Number */}
      <View style={styles.numberContainer}>
        <Text style={[
          styles.number, 
          { 
            fontSize: currentSize.fontSize,
            color: textColor
          }
        ]}>
          {number}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  jersey: {
    position: 'absolute',
    top: 0,
    left: 0,
  },  numberContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },  number: {
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 4,
    letterSpacing: -0.5,
    includeFontPadding: false,
    textAlignVertical: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica-Bold' : 'sans-serif-condensed',
  },
});

export default JerseyNumber;

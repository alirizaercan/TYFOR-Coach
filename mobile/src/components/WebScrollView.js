// mobile/src/components/WebScrollView.js
import React from 'react';
import { ScrollView, Platform, View } from 'react-native';

const WebScrollView = ({ children, style, contentContainerStyle, ...props }) => {
  // Web-specific style overrides to ensure scrolling works
  const webScrollStyle = Platform.OS === 'web' ? {
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    height: '100%',
    width: '100%',
    ...style
  } : style;

  const webContentStyle = Platform.OS === 'web' ? {
    minHeight: '100%',
    paddingBottom: 20, // Add some bottom padding for better UX
    ...contentContainerStyle
  } : contentContainerStyle;

  if (Platform.OS === 'web') {
    // For web, use a div with proper CSS instead of ScrollView
    return (
      <div
        style={{
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          height: '100%',
          width: '100%',
          ...style
        }}
        {...props}
      >
        <div style={webContentStyle}>
          {children}
        </div>
      </div>
    );
  }

  // For mobile platforms, use regular ScrollView
  return (
    <ScrollView
      style={webScrollStyle}
      contentContainerStyle={webContentStyle}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      {...props}
    >
      {children}
    </ScrollView>
  );
};

export default WebScrollView;

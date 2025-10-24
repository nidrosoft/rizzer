/**
 * Date Idea Header Component
 * Hero image with floating navigation buttons
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import Svg, { Path } from 'react-native-svg';
import { Heart, Share } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing } from '@/constants/theme';

interface DateIdeaHeaderProps {
  imageUrl: string;
  isSaved: boolean;
  onBack: () => void;
  onSave: () => void;
  onShare: () => void;
}

export default function DateIdeaHeader({
  imageUrl,
  isSaved,
  onBack,
  onSave,
  onShare,
}: DateIdeaHeaderProps) {
  const handleSave = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onSave();
  };

  const handleShare = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onShare();
  };

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onBack();
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: imageUrl }}
        style={styles.heroImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={[
          'rgba(0,0,0,0)',
          'rgba(250,250,250,0.3)',
          'rgba(250,250,250,0.7)',
          'rgba(250,250,250,1)'
        ]}
        locations={[0, 0.6, 0.85, 1]}
        style={styles.gradientOverlay}
      />
      
      <SafeAreaView edges={['top']} style={styles.floatingHeader}>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={handleBack}
            activeOpacity={0.6}
          >
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path d="M15.13 19.0596H7.13C6.72 19.0596 6.38 18.7196 6.38 18.3096C6.38 17.8996 6.72 17.5596 7.13 17.5596H15.13C17.47 17.5596 19.38 15.6496 19.38 13.3096C19.38 10.9696 17.47 9.05957 15.13 9.05957H4.13C3.72 9.05957 3.38 8.71957 3.38 8.30957C3.38 7.89957 3.72 7.55957 4.13 7.55957H15.13C18.3 7.55957 20.88 10.1396 20.88 13.3096C20.88 16.4796 18.3 19.0596 15.13 19.0596Z" fill={Colors.text}/>
              <Path d="M6.43006 11.5599C6.24006 11.5599 6.05006 11.4899 5.90006 11.3399L3.34006 8.77988C3.05006 8.48988 3.05006 8.00988 3.34006 7.71988L5.90006 5.15988C6.19006 4.86988 6.67006 4.86988 6.96006 5.15988C7.25006 5.44988 7.25006 5.92988 6.96006 6.21988L4.93006 8.24988L6.96006 10.2799C7.25006 10.5699 7.25006 11.0499 6.96006 11.3399C6.82006 11.4899 6.62006 11.5599 6.43006 11.5599Z" fill={Colors.text}/>
            </Svg>
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={handleSave}
              activeOpacity={0.6}
            >
              <Heart 
                size={20} 
                color={isSaved ? Colors.primary : Colors.text} 
                variant={isSaved ? 'Bold' : 'Outline'} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navButton}
              onPress={handleShare}
              activeOpacity={0.6}
            >
              <Share size={20} color={Colors.text} variant="Outline" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 450,
    backgroundColor: Colors.backgroundGray,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});

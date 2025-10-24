import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

interface DateProfile {
  id: string;
  name: string;
  age: number;
  photo?: string;
  profession?: string;
}

interface DateProfileCardProps {
  profile: DateProfile;
  onPress?: () => void;
}

export default function DateProfileCard({ profile, onPress }: DateProfileCardProps) {
  // Placeholder image URL
  const placeholderImage = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.95}>
      {/* Profile Photo with padding inside card */}
      <View style={styles.imageWrapper}>
        <Image 
          source={{ uri: profile.photo || placeholderImage }} 
          style={styles.photo}
          defaultSource={{ uri: placeholderImage }}
        />
      </View>

      {/* Profile Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {profile.name}, {profile.age}
        </Text>
        {profile.profession && (
          <Text style={styles.profession} numberOfLines={1}>
            {profile.profession}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 190,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginRight: Spacing.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  imageWrapper: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  name: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs / 2,
  },
  profession: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeights.medium,
  },
});

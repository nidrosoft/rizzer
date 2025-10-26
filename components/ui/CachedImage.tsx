/**
 * CachedImage Component
 * Optimized image component with caching, loading states, and error handling
 */

import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, StyleProp, ViewStyle } from 'react-native';
import { Image, ImageContentFit } from 'expo-image';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';

interface CachedImageProps {
  uri: string;
  style?: StyleProp<ViewStyle>;
  contentFit?: ImageContentFit;
  showLoadingIndicator?: boolean;
  placeholderColor?: string;
  borderRadius?: number;
}

export default function CachedImage({
  uri,
  style,
  contentFit = 'cover',
  showLoadingIndicator = true,
  placeholderColor = '#F5F5F5',
  borderRadius = BorderRadius.md,
}: CachedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri }}
        style={[StyleSheet.absoluteFill, { borderRadius }]}
        contentFit={contentFit}
        transition={200}
        cachePolicy="memory-disk"
        onLoadStart={() => {
          setIsLoading(true);
          setHasError(false);
        }}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        placeholder={placeholderColor}
        placeholderContentFit="cover"
      />

      {/* Loading Indicator */}
      {isLoading && showLoadingIndicator && (
        <View style={[styles.overlay, { borderRadius }]}>
          <ActivityIndicator size="small" color={Colors.purple} />
        </View>
      )}

      {/* Error State */}
      {hasError && (
        <View style={[styles.errorContainer, { borderRadius }]}>
          <Text style={styles.errorIcon}>📷</Text>
          <Text style={styles.errorText}>Failed to load</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.sm,
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
    opacity: 0.5,
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

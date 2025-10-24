/**
 * Quick Actions Bottom Sheet
 * Central hub for quick access to core app features
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { MagicStar, Gift, Calendar, Heart, CloseCircle } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: [string, string];
  onPress: () => void;
}

interface QuickActionsSheetProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export default function QuickActionsSheet({ visible, onClose, onNavigate }: QuickActionsSheetProps) {
  const router = useRouter();

  const handleClose = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  };

  const handleActionPress = (action: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onClose();
    
    // Trigger specific actions instead of just navigating to tabs
    setTimeout(() => {
      switch (action) {
        case 'plan-date':
          // Navigate directly to date planner flow
          router.push('/discovery/date-planner');
          break;
        case 'send-gift':
          // Navigate directly to gift investigation step 1
          router.push('/gifts/steps/step1-contact');
          break;
        case 'create-profile':
          // Navigate directly to create date profile flow
          router.push('/date-profile/photo');
          break;
        case 'get-rizz':
          // Navigate to rizz tab (they can select category there)
          onNavigate('rizz');
          break;
        case 'browse-events':
          // Navigate directly to all events
          router.push('/discovery/all-events');
          break;
      }
    }, 300);
  };

  const quickActions: QuickAction[] = [
    {
      id: 'plan-date',
      title: 'Plan a Date with AI',
      subtitle: 'Get personalized date ideas',
      icon: <MagicStar size={22} color="#8B5CF6" variant="Bold" />,
      gradient: ['#8B5CF6', '#EC4899'],
      onPress: () => handleActionPress('plan-date'),
    },
    {
      id: 'send-gift',
      title: 'Send a Gift',
      subtitle: 'Start Sherlock investigation',
      icon: <Gift size={22} color="#EC4899" variant="Bold" />,
      gradient: ['#EC4899', '#F97316'],
      onPress: () => handleActionPress('send-gift'),
    },
    {
      id: 'create-profile',
      title: 'Create Date Profile',
      subtitle: 'Add a new connection',
      icon: <Heart size={22} color="#F97316" variant="Bold" />,
      gradient: ['#F97316', '#EAB308'],
      onPress: () => handleActionPress('create-profile'),
    },
    {
      id: 'get-rizz',
      title: 'Get Rizz Lines',
      subtitle: 'AI-powered conversation starters',
      icon: <Text style={styles.emoji}>💬</Text>,
      gradient: ['#EAB308', '#10B981'],
      onPress: () => handleActionPress('get-rizz'),
    },
    {
      id: 'browse-events',
      title: 'Browse Events',
      subtitle: 'Find date-friendly activities',
      icon: <Calendar size={22} color="#10B981" variant="Bold" />,
      gradient: ['#10B981', '#06B6D4'],
      onPress: () => handleActionPress('browse-events'),
    },
  ];

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View style={styles.bottomSheet}>
          {/* Handle Bar */}
          <View style={styles.handle} />
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.title}>Quick Actions</Text>
                <Text style={styles.subtitle}>Choose what you'd like to do</Text>
              </View>
              <TouchableOpacity
                onPress={handleClose}
                activeOpacity={0.7}
                style={styles.closeButton}
              >
                <CloseCircle size={28} color={Colors.textSecondary} variant="Bold" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Actions List */}
          <View style={styles.actionsContainer}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionItem}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: `${action.gradient[0]}15`, borderColor: action.gradient[0] }]}>
                  {action.icon}
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: Platform.OS === 'ios' ? Spacing.md : Spacing.sm }} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.lg : Spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  closeButton: {
    marginLeft: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  actionsContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 22,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: 1,
  },
  actionSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});

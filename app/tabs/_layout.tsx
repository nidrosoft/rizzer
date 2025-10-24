import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, FontSizes } from '@/constants/theme';
import { Home2, Flash, Gift, Discover } from 'iconsax-react-native';
import CustomTabBar from '@/components/CustomTabBar';

export default function TabsLayout() {
  const handleTabPress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF395A',
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          height: 85,
          paddingBottom: 20,
          paddingTop: 12,
          paddingHorizontal: 20,
          borderTopWidth: 1,
          borderTopColor: Colors.borderLight,
        },
        tabBarLabelStyle: {
          fontSize: FontSizes.xs,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingHorizontal: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Home2 size={24} color={color} variant={focused ? 'Bold' : 'Outline'} />
          ),
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
      <Tabs.Screen
        name="rizz"
        options={{
          title: 'Rizz',
          tabBarIcon: ({ color, focused }) => (
            <Flash size={24} color={color} variant={focused ? 'Bold' : 'Outline'} />
          ),
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
      <Tabs.Screen
        name="quick-actions"
        options={{
          title: '',
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="gifts"
        options={{
          title: 'Gifts',
          tabBarIcon: ({ color, focused }) => (
            <Gift size={24} color={color} variant={focused ? 'Bold' : 'Outline'} />
          ),
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
      <Tabs.Screen
        name="discovery"
        options={{
          title: 'Discovery',
          tabBarIcon: ({ color, focused }) => (
            <Discover size={24} color={color} variant={focused ? 'Bold' : 'Outline'} />
          ),
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
    </Tabs>
  );
}


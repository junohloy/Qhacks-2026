import { Tabs } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

function TabIcon({ name }: { name: string }) {
  return <Text style={{ fontSize: 24 }}>{name}</Text>;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? '🪞' : '⚫'} />,
        }}
      />
      <Tabs.Screen
        name="replay"
        options={{
          title: 'Replay',
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? '📊' : '⚫'} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? '🧠' : '⚫'} />,
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: 'Mood',
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? '🎯' : '⚫'} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000',
    borderTopColor: '#FFD700',
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
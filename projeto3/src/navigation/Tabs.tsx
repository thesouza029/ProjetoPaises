import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerToggleButton } from '@react-navigation/drawer';
import type { MainTabParamList } from './types';
import HomeStackNavigator from './HomStack';
import FavoritosScreen from '../screens/TelaFavoritos';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function PTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#94a3b8',
      }}
    >
      <Tab.Screen
        name="InicioStack"
        component={HomeStackNavigator}
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Favoritos"
        component={FavoritosScreen}
        options={{
          title: 'Favoritos',
          headerShown: true,

          headerLeft: () => <DrawerToggleButton tintColor="#0f172a" />,
          tabBarIcon: ({ color, size }) => <Ionicons name="star" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

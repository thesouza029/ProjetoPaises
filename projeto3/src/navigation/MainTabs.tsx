import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerToggleButton } from '@react-navigation/drawer';
import type { MainTabParamList } from './types';
import HomeStackNavigator from './HomeStackNavigator';
import FavoritosScreen from '../screens/FavoritosScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
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
          // Essa aba não fica dentro de nenhuma Stack, então o cabeçalho
          // dela nunca ganharia o botão de abrir o Drawer sozinho — por
          // isso adicionamos manualmente aqui.
          headerLeft: () => <DrawerToggleButton tintColor="#0f172a" />,
          tabBarIcon: ({ color, size }) => <Ionicons name="star" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import type { RootDrawerParamList } from './types';
import MainTabs from './Tabs';
import PerfilScreen from '../screens/TelaPerfil';
import SobreScreen from '../screens/TelaSobre';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function RootDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerTintColor: '#0f172a',
        drawerActiveTintColor: '#2563eb',
        drawerActiveBackgroundColor: '#eef2ff',
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={MainTabs}

        options={{
          title: 'Início',
          headerShown: false,
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          title: 'Perfil',
          drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Sobre"
        component={SobreScreen}
        options={{
          title: 'Sobre',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

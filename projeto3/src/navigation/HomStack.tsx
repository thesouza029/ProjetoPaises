import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerToggleButton } from '@react-navigation/drawer';
import type { HomeStackParamList } from './types';
import ListaScreen from '../screens/TelaLista';
import DetalhesScreen from '../screens/TelaDetalhes';
import FavoritarModal from '../screens/FavoritoModal';
import PaisInfoM from '../screens/ModalPais';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="Lista"
          component={ListaScreen}
          options={{
            title: 'Início',

            headerLeft: () => <DrawerToggleButton tintColor="#0f172a" />,
          }}
        />
        <Stack.Screen name="Detalhes" component={DetalhesScreen} options={{ title: 'Detalhes' }} />
      </Stack.Group>


      <Stack.Group
        screenOptions={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }}
      >
        <Stack.Screen name="FavoritarModal" component={FavoritarModal} />
        <Stack.Screen name="InfoModal" component={PaisInfoM} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

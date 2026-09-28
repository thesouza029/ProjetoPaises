import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerToggleButton } from '@react-navigation/drawer';
import type { HomeStackParamList } from './types';
import ListaScreen from '../screens/ListaScreen';
import DetalhesScreen from '../screens/DetalhesScreen';
import FavoritarModalScreen from '../screens/FavoritarModalScreen';
import CountryInfoModalScreen from '../screens/CountryInfoModalScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="Lista"
          component={ListaScreen}
          options={{
            title: 'Início',
            // "Lista" é a raiz da Stack (sem tela anterior para voltar), então
            // colocamos aqui o botão de abrir o Drawer (☰) no lugar do "←".
            headerLeft: () => <DrawerToggleButton tintColor="#0f172a" />,
          }}
        />
        <Stack.Screen name="Detalhes" component={DetalhesScreen} options={{ title: 'Detalhes' }} />
      </Stack.Group>

      {/*
        Grupo modal, acessível a partir de Detalhes.

        presentation: 'transparentModal' -> a tela de trás (Detalhes) continua
        visível por baixo, com fundo transparente; é a própria tela do modal
        que desenha um backdrop escurecido + um card pequeno lá dentro. Isso
        evita o efeito de "nova tela cheia" que a presentation 'modal' comum
        dá, já que aqui é só uma confirmação rápida.
      */}
      <Stack.Group
        screenOptions={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }}
      >
        <Stack.Screen name="FavoritarModal" component={FavoritarModalScreen} />
        <Stack.Screen name="InfoModal" component={CountryInfoModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

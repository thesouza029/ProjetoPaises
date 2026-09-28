import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import RootDrawer from './src/navigation/RootDrawer';

if (typeof global !== 'undefined' && !global.Buffer) {
  const { Buffer } = require('buffer');
  global.Buffer = Buffer;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <RootDrawer />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

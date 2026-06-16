import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import GameHubScreen from './src/screens/GameHubScreen';
import HomeScreen from './src/screens/HomeScreen';
import CreateGameScreen from './src/screens/CreateGameScreen';
import GamePlayScreen from './src/screens/GamePlayScreen';
import ModeSelectScreen from './src/screens/ModeSelectScreen';
import GuestDisplayScreen from './src/screens/GuestDisplayScreen';
import ImposterSetupScreen from './src/screens/ImposterSetupScreen';
import ImposterGameScreen from './src/screens/ImposterGameScreen';
import WhoIsItSetupScreen from './src/screens/WhoIsItSetupScreen';
import WhoIsItGameScreen from './src/screens/WhoIsItGameScreen';
import WhoIsItResultScreen from './src/screens/WhoIsItResultScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="GameHub" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#121212' } }}>
          <Stack.Screen name="GameHub" component={GameHubScreen} />
          <Stack.Screen name="ModeSelect" component={ModeSelectScreen} />
          <Stack.Screen name="GuestDisplay" component={GuestDisplayScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CreateGame" component={CreateGameScreen} />
          <Stack.Screen name="GamePlay" component={GamePlayScreen} />
          <Stack.Screen name="ImposterSetup" component={ImposterSetupScreen} />
          <Stack.Screen name="ImposterGame" component={ImposterGameScreen} />
          <Stack.Screen name="WhoIsItSetup" component={WhoIsItSetupScreen} />
          <Stack.Screen name="WhoIsItGame" component={WhoIsItGameScreen} />
          <Stack.Screen name="WhoIsItResult" component={WhoIsItResultScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

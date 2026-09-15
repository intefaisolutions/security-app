import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/Splash/SplashScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import RoleSelectionScreen from '../screens/RoleSelection/RoleSelectionScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import OtpScreen from '../screens/Auth/OtpScreen';
import GuardDashboard from '../screens/Dashboard/GuardDashboard';
import BottomTabs from './BottomTabs';
import InviteVisitorScreen from '../screens/Dashboard/InviteVisitorScreen';
import VisitorPassScreen from '../screens/Dashboard/VisitorPassScreen';
import VisitorRequestScreen from '../screens/Dashboard/VisitorRequestScreen';
import VisitorEntryScreen from '../screens/Dashboard/VisitorEntryScreen';
import VisitorExitScreen from '../screens/Dashboard/VisitorExitScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="ResidentDashboard" component={BottomTabs} />
        <Stack.Screen name="GuardDashboard" component={GuardDashboard} />
        <Stack.Screen name="InviteVisitor" component={InviteVisitorScreen} />
        <Stack.Screen name="VisitorPass" component={VisitorPassScreen} />
        <Stack.Screen name="VisitorRequest" component={VisitorRequestScreen} />
        <Stack.Screen name="VisitorEntry" component={VisitorEntryScreen} />
        <Stack.Screen name="VisitorExit" component={VisitorExitScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;

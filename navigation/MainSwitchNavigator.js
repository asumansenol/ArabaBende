import { Platform } from 'react-native';
import LoadingScreen from '/Users/asuman.senol/Desktop/ArabaBende/screens/LoadingScreen';
import LoginScreen from '/Users/asuman.senol/Desktop/ArabaBende/screens/LoginScreen';
import ReservationListScreen from '../screens/ReservationListScreen';
import ProfileScreen from '../screens/Profile';
import AddCarScreen from '../screens/AddCarScreen';
import { createStackNavigator,createTabNavigator, createAppContainer,createBottomTabNavigator,createSwitchNavigator } from 'react-navigation';
import React from 'react';
import ReservationScreen from '../screens/ReservationScreen';
import TabBarIcon from '../components/TabBarIcon';

const HomeStack = createStackNavigator({
  AddCar: AddCarScreen,
});
HomeStack.navigationOptions = {
  tabBarOptions: {
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: 'white',
    },
  },
  tabBarLabel: 'Arabayı Al',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
    backgroundColor= {'white'}
    focused={focused}
    name={Platform.OS === 'ios' ? 'ios-car' : 'md-car'}
  />
  ),
};
const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
});
ProfileStack.navigationOptions = {
  tabBarOptions: {
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: 'white',
    },
  },
  tabBarLabel: 'Profil',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
    backgroundColor= {'white'}
    focused={focused}
    name={Platform.OS === 'ios' ? 'ios-contact' : 'md-person'}
  />
  ),
};
const ReservationStack = createStackNavigator({
  ReserVation: ReservationScreen,
});
ReservationStack.navigationOptions = {
  tabBarOptions: {
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: 'white',
    },
  },
  tabBarLabel: 'Rezervasyon',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
    backgroundColor= {'white'}
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-alarm' : 'md-timer'}
    />
  ),
};
const ReservationListStack = createStackNavigator({
  Settings: ReservationListScreen,
});

ReservationListStack.navigationOptions = {
  tabBarLabel: 'Liste',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
    backgroundColor= {'white'}
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-list' : 'md-list'}
    />
  ),
  tabBarOptions: {
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: 'white',
    },
  }
};
const AppStack = createBottomTabNavigator({
  HomeStack,
  ReservationStack,
  ReservationListStack,
  ProfileStack
});
const AuthStack = createStackNavigator({ Login: LoginScreen });

export default createAppContainer(createSwitchNavigator(
  {
    LoadingScreen: LoadingScreen,  
    Auth: LoginScreen,
    App: AppStack,
  
  },
  {
    initialRouteName: 'LoadingScreen',
  }
));

/**
 * Sasohan React Native App
 *
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, {Component, useEffect} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from './src/home';
import UserScreen from './src/user';
import User from './src/signIn';
import PostScreen from './src/post';
import LoginScreen from './src/Login'
import chatRoom from './src/chatRoom';

const Tab = createBottomTabNavigator();
const TabBarIcon = (focused: any, name: any) => {
  let iconImagePath;

  if (name === 'Home') {
    iconImagePath = require('./src/pics/home.png');
  } else if (name === 'User') {
    iconImagePath = require('./src/pics/user.png');
  } else if (name === 'Post') {
    iconImagePath = require('./src/pics/post.png');
  } else if (name === 'Search') {
    iconImagePath = require('./src/pics/search.png');
  }

  return (
    <Image
      style={{
        width: focused ? 24 : 20,
        height: focused ? 24 : 20,
      }}
      source={iconImagePath}
    />
  );
};

class App extends Component {
  state = {
    isLoaded: false,
  };

  setAppLoaded = () => {
    this.setState({isLoaded: true});
  };

  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          tabBarOptions={{
            activeBackgroundColor: 'skyblue',
            activeTintColor: 'blue',
            inactiveTintColor: '#fff',
            style: {
              backgroundColor: '#c6cbef',
            },
          }}
          screenOptions={({route}: {route: any}) => ({
            tabBarLabel: route.name,
            tabBarIcon: ({focused}: {focused: any}) =>
              TabBarIcon(focused, route.name),
          })}>
          <Tab.Screen name="Search" component={LoginScreen} />
          <Tab.Screen name="Post" component={PostScreen} />
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="User" component={UserScreen} />
          <Tab.Screen name="chatRoom" component={chatRoom} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({});
export default App;

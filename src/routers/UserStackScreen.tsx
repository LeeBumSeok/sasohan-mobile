/**
 * Sasohan React Native App
 *
 *
 * @format
 * @flow strict-local
 */
import LoginScreen from '../user';
import User from '../signIn';
import { createStackNavigator } from '@react-navigation/stack';
import React, { Component } from 'react';
import { Image, View } from 'react-native';

const HomeStack = createStackNavigator();

class HomeStackScreen extends Component {
    render() {
        return (
            <HomeStack.Navigator
                initialRouteName="LoginScreen">
                <HomeStack.Screen name="LoginScreen"
                    component={LoginScreen}
                    options={{
                        header: () => null,
                        headerStyle: {
                            backgroundColor: 'white',
                        },
                        headerTintColor: 'white',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }} />
                <HomeStack.Screen name="User" component={User} />
            </HomeStack.Navigator>
        )
    }
}
export default HomeStackScreen;
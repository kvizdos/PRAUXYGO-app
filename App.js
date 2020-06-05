import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import CodeScreen from './pages/CodeScreen'
import Login from './pages/Login'
import SignUp from './pages/SignUp'

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
                <Stack.Screen name="SignUp" component={SignUp} options={{
                    headerTitle: "Sign Up"
                }}/>
                <Stack.Screen name="Code" component={CodeScreen} options={{
                    headerTitle: "",
                    headerStyle: {
                        backgroundColor: "#303aa1",
                        shadowOpacity: 0
                    },
                    headerTintColor: "#f5f5f5"
                }}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
  }
import 'react-native-gesture-handler';
import * as React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { registerPerms } from './helpers/permissions'
import { makeRequest, CREATENETWORKURL } from './helpers/networking'

import CodeScreen from './pages/CodeScreen'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Projects from './pages/Projects'

const Stack = createStackNavigator();

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            loggedIn: false,
            doesHaveAuth: false
        }
    }

    async componentDidMount() {
        const token = await AsyncStorage.getItem("@UserInfo:token");
        const username = await AsyncStorage.getItem("@UserInfo:username");

        if(token != null && username != null) {
            makeRequest('/verify', {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    token: token
                })
            }, CREATENETWORKURL("auth")).then(r => {
                if(r.verified) {
                    AsyncStorage.setItem("@UserInfo:permissions", JSON.stringify(r.permissions))
                    AsyncStorage.setItem("@UserInfo:projects", JSON.stringify(r.projects))

                    registerPerms(r.permissions);

                    this.setState({loggedIn: r.verified})
                } else {
                    AsyncStorage.removeItem("@UserInfo:permissions");
                    AsyncStorage.removeItem("@UserInfo:token");
                    AsyncStorage.removeItem("@UserInfo:username");

                }

                this.setState({doesHaveAuth: true});
            }).catch(e => console.log(e))
        } else {
            this.setState({doesHaveAuth: true});
        }
    }

    render() {
        return !this.state.doesHaveAuth ? <View><Text>Loading... {this.state.doesHaveAuth ? "true" : "false"}</Text></View> : (
            <NavigationContainer>
                {!this.state.loggedIn && <Stack.Navigator>
                    <Stack.Screen name="Login" options={{headerShown: false}}>
                        {props => <Login {...props} isLoggedIn={() => this.setState({loggedIn: true})} />}
                    </Stack.Screen>
                    <Stack.Screen name="SignUp" options={{
                        headerTitle: "Sign Up"
                    }}>{props => <SignUp {...props} isLoggedIn={() => this.setState({loggedIn: true})} />}</Stack.Screen>
                </Stack.Navigator>}

                
                {this.state.loggedIn && <Stack.Navigator>
                    <Stack.Screen name="Projects" component={Projects} options={{headerShown: false}} />
                    <Stack.Screen name="Code" component={CodeScreen} options={{
                        headerTitle: "",
                        headerStyle: {
                            backgroundColor: "#303aa1",
                            shadowOpacity: 0
                        },
                        headerTintColor: "#f5f5f5"
                    }}/>
                </Stack.Navigator>}
            </NavigationContainer>
        );
    }
  }
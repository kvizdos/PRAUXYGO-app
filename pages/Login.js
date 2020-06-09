import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, AsyncStorage  } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Input, PricingCard, Button } from 'react-native-elements';
import { makeRequest, CREATENETWORKURL } from '../helpers/networking';

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            backgroundColor: [],
            username: undefined,
            password: undefined,
            missingInfo: [],
            invalidUsername: false,
            invalidPassword: false
        }
    }

    login = () => {
        const username = this.state.username;
        const password = this.state.password;

        let missingInfo = [];

        if(username == "" || username == undefined) missingInfo.push("username");
        if(password == "" || password == undefined) missingInfo.push("password");

        this.setState({missingInfo: missingInfo});

        if(missingInfo.length > 0) return;

        makeRequest('/login', {
            method: "POST",
            headers: {
                Accept: "application/json",
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }, CREATENETWORKURL("auth")).then(r => {
            if(r.authenticated) {
                AsyncStorage.setItem("@UserInfo:token", r.token)
                AsyncStorage.setItem("@UserInfo:username", username)
                AsyncStorage.setItem("@UserInfo:permissions", JSON.stringify(r.permissions))
                this.props.isLoggedIn();
            } else {
                this.setState({invalidUsername: r.reason.indexOf("username") >= 0, invalidPassword: r.reason.indexOf("password") >= 0})
                // todo: say error
            }
        })
    }

    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.center}>
                <View style={styles.container}>
                    <View style={{alignItems: "center"}}>
                        <Text style={styles.defaultText}>Welcome to</Text>
                        <Text style={[styles.defaultText, {fontWeight: "bold"}]}>PRAUXY GO</Text>
                    </View>
                    <View>
                        <Input
                            placeholder='Username'
                            leftIcon={{ name: 'account-box' }}
                            onChangeText={text => {this.setState({username: text}); this.setState({missingInfo: this.state.missingInfo.filter(i => i != "username"), invalidUsername: false})}}
                            errorMessage={this.state.missingInfo.indexOf("username") >= 0 ? "Username is required" : this.state.invalidUsername ? "Invalid username" : ""}
                        />
                        
                        <Input
                            placeholder='Password'
                            leftIcon={{ name: 'lock' }}
                            onChangeText={text => {this.setState({password: text}); this.setState({missingInfo: this.state.missingInfo.filter(i => i != "password"), invalidPassword: false})}}
                            errorMessage={this.state.missingInfo.indexOf("password") >= 0 ? "Password is required" : this.state.invalidPassword ? "Invalid password" : ""}
                            secureTextEntry={true}
                        />

                        <Button title="Login" onPress={this.login} />
                    </View>

                    <View style={{borderWidth: 2, borderColor: "#e8e8e8", borderRadius: 10, margin: 15}} />

                    <View style={{alignItems: "center"}}>
                        <Text>Not signed up?</Text>
                        <Button title="Sign up" type="clear" onPress={() => this.props.navigation.navigate("SignUp")} />
                    </View>

                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    defaultText: {
        fontSize: 18
    }, 
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: "100%",
    },
    container: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,

        elevation: 8,
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 10,
        width: "50%",
        justifyContent: "center",
        marginTop: 100
    },
})
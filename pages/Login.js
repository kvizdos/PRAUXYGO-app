import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView  } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Input, PricingCard, Button } from 'react-native-elements';

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            backgroundColor: []
        }
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
                        />
                        
                        <Input
                            placeholder='Password'
                            leftIcon={{ name: 'lock' }}
                        />

                        <Button title="Login" onPress={() => this.props.navigation.navigate("Code")} />
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
import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Input, Button, CheckBox } from 'react-native-elements';
import PricingCard from '../components/PricingCard'
import Card from '../components/card'
import { ScrollView } from 'react-native-gesture-handler';
import { makeRequest, CREATENETWORKURL } from '../helpers/networking';

export default class SignUp extends React.Component {
    constructor() {
        super();
        this.state = {
            chosenTier: "earlyaccess",
            agreeTOS: false,
            joinMailinglist: true,
            required: [],
            name: undefined,
            org: undefined,
            email: undefined,
            username: undefined,
            password: undefined,
            usernameTaken: false,
            emailTaken: false
        }
    }

    signup = () => {
        const isValid = (val) => { return val != undefined && val != "" }
        let failed = [];
        if(!this.state.agreeTOS) {
            failed.push("tos")
        }
        
        if(!isValid(this.state.name)) {
            failed.push("name")
        }

        if(!isValid(this.state.email) || !/(.+)@(.+){2,}\.(.+){2,}/.test(this.state.email)) {
            failed.push("email")
        }

        if(!isValid(this.state.username)) {
            failed.push("username")
        }

        if(!isValid(this.state.password)) {
            failed.push("password")
        }

        this.setState({required: failed})

        if(failed.length > 0) return;

        makeRequest('/register', {
            method: "POST",
            headers: {
                Accept: "application/json",
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                email: this.state.email,
                name: this.state.name,
                org: this.state.org,
                mailinglist: this.state.joinMailinglist
            })
        }, CREATENETWORKURL("auth")).then(r => {
            if(r.registered) {
                AsyncStorage.setItem("@UserInfo:token", r.token);
                AsyncStorage.setItem("@UserInfo:username", this.state.username);
                this.props.isLoggedIn();
            } else {
                this.setState({usernameTaken: r.reason.indexOf("username") >= 0});
                this.setState({emailTaken: r.reason.indexOf("email") >= 0});
            }
        })

    }

    render() {
        return (
            <View style={styles.center}>
                <View style={{flex: .75}}>
                <ScrollView>
                    <PricingCard 
                        name="Early Access" 
                        color="#44a1e3" // 44a1e3
                        price="Free for the first 7 days, and then $3.97/mo."
                        sub="If you chose to cancel before the 7 days ends, you will be placed into the free tier and lose access to ______ something about projects _____" 
                        buttonIcon={<Icon name="send" color="#FFF" size={16} />} 
                        buttonTitle="GET STARTED"
                        onSelect={() => this.setState({chosenTier: "earlyaccess"})}
                        items={["Unlimited projects", "Developer Tools", "5gb disk space", "Terminal access", "Upload files", "Any new features adding during EA", "Grandfathered into similar tier after EA", "Maintain $4/mo even after EA*"]} 
                        disclaimers={["\n*Unless you cancel your subscription and return after EA is complete"]}
                        selected={true} />
                    <PricingCard 
                        name="Free" 
                        color="#295f85" // 44a1e3
                        price="$0/mo"
                        buttonIcon={<Icon name="send" color="#FFF" size={16} />} 
                        buttonTitle="GET STARTED"
                        onSelect={() => this.setState({chosenTier: "free"})}
                        items={["3 projects", "Developer Tools", "50mb disk space"]} />
                </ScrollView>
                </View>
                <View style={{flex: 1, marginTop: 25, marginRight: 25}}>
                    <Card>
                        <Text>* signifies a required field</Text>
                        <Input
                            label="Name*"
                            placeholder='Cameron Doe'
                            onChangeText={text => this.setState({name: text, required: this.state.required.filter(i => i != "name")})}
                            errorMessage={this.state.required.indexOf("name") == -1 ? undefined : "Name is required"}
                            errorStyle={{padding: 0, margin: 0, fontSize: 14}}
                        />
                        <Input
                            label="Organization / Company"
                            placeholder='PRAUXY'
                            onChangeText={text => this.setState({org: text})}
                        />
                        <Input
                            label="Email*"
                            placeholder='youramazing@email.com'
                            onChangeText={text => this.setState({email: text, emailTaken: false, required: this.state.required.filter(i => i != "email")})}
                            errorMessage={this.state.required.indexOf("email") != -1 ? "Email is required" : this.state.emailTaken ? "This email is taken" : undefined}
                            errorStyle={{padding: 0, margin: 0, fontSize: 14}}
                        />
                         <Input
                            label="Username*"
                            placeholder='myawesomeusername'
                            onChangeText={text => this.setState({username: text, usernameTaken: false, required: this.state.required.filter(i => i != "username")})}
                            errorMessage={this.state.required.indexOf("username") != -1 ? "Username is required" : this.state.usernameTaken ? "This username is taken" : undefined}
                            errorStyle={{padding: 0, margin: 0, fontSize: 14}}
                        />
                        <Input
                            label="Password*"
                            placeholder='•••••••••••'
                            secureTextEntry={true}
                            onChangeText={text => this.setState({password: text, required: this.state.required.filter(i => i != "password")})}
                            errorMessage={this.state.required.indexOf("password") == -1 ? undefined : "Password is required"}
                            errorStyle={{padding: 0, margin: 0, fontSize: 14}}
                        />

                        <CheckBox title="Agree to Terms of Service" checked={this.state.agreeTOS} containerStyle={{borderColor: this.state.required.indexOf("tos") == -1 ? 'transparent' : "#d63215", backgroundColor: 'unset'}} onPress={() => this.setState({agreeTOS: !this.state.agreeTOS, required: this.state.required.filter(i => i != "tos")}) } />
                        <CheckBox title="Join the mailing list" checked={this.state.joinMailinglist} containerStyle={{borderWidth: 0, backgroundColor: 'unset'}} onPress={() => this.setState({joinMailinglist: !this.state.joinMailinglist})} />

                        <Button title="Sign Up" onPress={this.signup} />
                    </Card>
                </View>
            </View>
            )
    }
}

const styles = StyleSheet.create({
    center: {
        flexDirection: "row",
        flex: 1,
    }
})
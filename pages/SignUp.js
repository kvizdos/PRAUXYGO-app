import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Input, Button } from 'react-native-elements';
import PricingCard from '../components/PricingCard'

export default class SignUp extends React.Component {
    constructor() {
        super();
        this.state = {
            chosenTier: PricingCard.selected
        }
    }

    render() {
        return (
            <View style={styles.center}>
                <View style={{width: "100%", flexDirection: "row"}}>
                    <PricingCard 
                        name="Free" 
                        color="#2c6b7a" // 44a1e3
                        price="$0/mo" 
                        buttonIcon={<Icon name="send" color="#FFF" size={16} />} 
                        buttonTitle="GET STARTED"
                        onSelect={() => this.setState({chosenTier: "free"})}
                        items={["3 projects", "Developer Tools", "50mb disk space"]} />
                    <PricingCard 
                        name="Early Access" 
                        color="#44a1e3" // 44a1e3
                        price="$4.97/mo" 
                        buttonIcon={<Icon name="send" color="#FFF" size={16} />} 
                        buttonTitle="GET STARTED"
                        onSelect={() => this.setState({chosenTier: "earlyaccess"})}
                        items={["Unlimited projects", "Developer Tools", "5gb disk space", "Terminal access", "Upload files", "Any new features adding during EA", "Grandfathered into similar tier after EA", "Maintain $4/mo even after EA*"]} 
                        disclaimers={["*Unless you cancel your subscription and return after EA is complete"]} />
                </View>
                {this.state.chosenTier != undefined && <View style={styles.card}>
                    <Input
                        label="Email"
                        placeholder='youramazing@email.com'
                    />
                    </View>}

            </View>
            )
    }
}

const styles = StyleSheet.create({
    center: {
        flexDirection: "column",
        padding: 25
    },
    card: {
        borderWidth: 2,
        borderRadius: 2,
        borderColor: "#e8e8e8",
        backgroundColor: "#FFF",
        padding: 25,
    }
})
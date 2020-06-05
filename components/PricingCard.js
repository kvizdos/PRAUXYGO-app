import React from 'react';
import { StyleSheet, Text, View, Animated, ListView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Input, Button } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';

export default class PricingCard extends React.Component {
    static selected = undefined;
    static amount = 0;

    constructor() {
        super();
        PricingCard.amount++;
        this.state = { myID: PricingCard.amount };
    }

    renderListItem({item}, disclaimer = false) {
        return (
            <View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
                {!disclaimer && <Icon name="radio-button-checked" style={{marginRight: 5}} />}
                <Text style={{fontSize: 18, color: !disclaimer ? "#4f4f4f" : "#737373"}}>{item}</Text>
            </View>
        )
    }

    onSelect = () => {
        PricingCard.selected = this.props.name;
        this.props.onSelect();
    }

    render() {
        return (
            <View style={[styles.card, this.state.myID == 1 ? {marginRight: 25} : {}]}>
                <View>
                    <Text style={{fontWeight: "bold", fontSize: 32, color: this.props.color}}>{this.props.name}</Text>
                    <Text style={{fontSize: 24}}>{this.props.price}</Text>
                    {/* {[...this.props.items].map((item, key) => {
                        return (<Text key={key}>{item}</Text>)
                    })} */}
                    <FlatList data={this.props.items} renderItem={this.renderListItem} keyExtractor={(item, index) => index.toString()} />
                </View>
                <View>
                    <FlatList data={this.props.disclaimers} renderItem={(item) => this.renderListItem(item,true)} keyExtractor={(item, index) => index.toString()} />
                    {PricingCard.selected != this.props.name && <Button onPress={this.onSelect} icon={this.props.buttonIcon} title={"   " + this.props.buttonTitle} />}
                    {PricingCard.selected == this.props.name && <Button disabled title="SELECTED" />}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 25,
        minHeight: 300,
        borderWidth: 2,
        borderRadius: 2,
        borderColor: "#e8e8e8",
        backgroundColor: "#FFF",
        padding: 25,
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between"
    },
})
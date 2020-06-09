import React from 'react';
import { StyleSheet, Text, View, Animated, YellowBox } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';

YellowBox.ignoreWarnings([
	'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

export default class PricingCard extends React.Component {
    static amount = 0;
    static selected = undefined;
    static didChange = false;

    constructor() {
        super();
        PricingCard.amount++;
        this.state = { myID: PricingCard.amount };

        // if(this.props.selected != undefined && this.props.selected == true) {
        //     PricingCard.selected = this.props.name;
        // }
    }

    renderListItem = ({item}, disclaimer = false) => {
        return (
            <View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
                {!disclaimer && <Icon name="radio-button-checked" style={{marginRight: 5}} />}
                <Text style={{fontSize: 18, color: !disclaimer ? "#4f4f4f" : "#737373"}}>{item}</Text>
            </View>
        )
    }

    onSelect = () => {
        PricingCard.didChange = true;
        PricingCard.selected = this.props.name;
        this.props.onSelect();
    }

    render() {
        if(PricingCard.didChange == false && this.props.selected) {
            PricingCard.selected = this.props.name;
        }
        
        return (
            <View style={[styles.card, this.state.myID == 1 ? {marginRight: 25} : {}]}>
                <View>
                    <Text style={{fontWeight: "bold", fontSize: 32, color: this.props.color}}>{this.props.name}</Text>
                    <Text style={{fontSize: 24}}>{this.props.price}</Text>
                    {this.props.sub && <Text style={{fontSize: 21}}>{this.props.sub}</Text>}
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
        margin: 25,
        marginBottom: 0,
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
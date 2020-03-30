import React, { } from 'react';
import { View, SafeAreaView,Alert } from 'react-native';
import { Text, TopNavigation, TopNavigationAction, Button, } from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import { Styles } from '../styles/Styles.js';
import config from '../config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';
import { showMessage } from "react-native-flash-message";


const BackIcon = (style) => (
    <Icon name='arrow-back' size={23} color='#ffff' />
);


const BackAction = (props) => (
    <TopNavigationAction {...props} style={Styles.text} icon={BackIcon} />
);




class PinnedLocation extends React.Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    getPinned = async () => {

        let url = config.baseUrl + 'pinnedlocation/getPinned';
        let bodyFormdata = new FormData();
        bodyFormdata.append('fk_user_id', this.props.user_credentials.fk_user_id);

        let response = await axios.post(url, bodyFormdata);
        let info = response.data;
        if (info.status == 'success') {

            let pinnedData = [];
            info.data.map((data) => {
                let x = {
                    pinned_location_id: data.pinned_location_id,
                    fk_booking_id: data.fk_booking_id,
                    dropoff_loc: data.drop_off,
                    pickup_loc: data.pick_up,
                };
                pinnedData.push(x);
            });

            this.props.handle_changes('pinned_location', pinnedData);
        } else {
            Alert.alert(
                'Oops!!!',
                "Seems like you don't have a location saved yet, Do you wan't to add?",
                [
                   {
                      text: 'No',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                   },
                   { text: 'Yes', onPress: () => Actions.replace('ViewTripHistory', { type: 2 }) },
                ],
                { cancelable: false },
             );
        }
    }

    removePin = (id) => {
        Alert.alert(
            'Oops!!!',
            "Are you sure to remove this pinned location?",
            [
               {
                  text: 'No',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
               },
               { text: 'Yes', onPress: () =>this.removePinProcess(id) },
            ],
            { cancelable: false },
         );
    }
    removePinProcess = async (id) => {
        let url = config.baseUrl + 'pinnedlocation/removePinned';
        let bodyFormdata = new FormData();
        bodyFormdata.append('fk_user_id', id);

        let response = await axios.post(url, bodyFormdata);
        let info = response.data;
        if (info.status == 'success') {
            showMessage({
                message: "Removed Successfully!",
                type: "success",
                duration: 10000
            });
            this.getPinned();
        } else {
            showMessage({
                message: "Something went wrong!!!",
                type: "danger",
                duration: 10000
            });
        }
    }

    componentDidMount() {
        this.getPinned();
    }



    render() {

        const renderLeftControl = () => (
            <BackAction onPress={() => { Actions.pop(); }} />
        );

        return (
            <SafeAreaView style={Styles.container}>
                <TopNavigation
                    leftControl={renderLeftControl()}
                    title='Pinned Location'
                    alignment='center'
                    style={Styles.header}
                    titleStyle={Styles.headerTitle}
                />
                <View style={Styles.listContainer}>
                    <ScrollView>
                        {this.props.pinned_location.map((data, idx) => {
                            return (
                                <View style={Styles.pinnedTablist}>
                                    <View style={Styles.pinnedTablistItems}>
                                        <View style={Styles.pinnedDataItem}>
                                            <Text style={Styles.pinnedHeaderText}>Pick-up Location:</Text>
                                            <Text style={Styles.pinnedContentText}>{data.pickup_loc}</Text>
                                        </View>
                                        <View style={Styles.pinnedDataItem}>
                                            <Text style={Styles.pinnedHeaderText}>Drop-off Location:</Text>
                                            <Text style={Styles.pinnedContentText}>{data.dropoff_loc}</Text>
                                        </View>
                                    </View>
                                    <View style={Styles.pinnedButtons}>
                                        <Button style={{ backgroundColor: '#28a745', borderColor: '#28a745', marginHorizontal: 5 }} size='tiny' onPress={() => Actions.replace('Booking', { type: 2 })}>Book Now</Button>
                                        <Button style={{ backgroundColor: '#dc3545', borderColor: '#dc3545', marginHorizontal: 5 }} size='tiny' onPress={() => this.removePin(data.fk_booking_id)}>Remove</Button>
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>

                </View>
                <View style={Styles.footer}>
                    <Text style={Styles.center}>All rights reserved 2019 - 2020</Text>
                </View>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => {
    return {
        view_pending_booking: state.view_pending_booking,
        user_credentials: state.user_credentials,
        pinned_location: state.pinned_location,
    }
}
const mapActionToProps = dispatch => {
    return {
        handle_changes_with_parent: (action, parent_state, child_state, value) => dispatch({ type: action, parent_state: parent_state, child_state: child_state, value: value }),
        handle_changes: (state, value) => dispatch({ type: 'HANDLE_CHANGE', state: state, value: value }),
    }
}
export default connect(mapStateToProps, mapActionToProps)(PinnedLocation);

import React, { } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Alert,
    Keyboard
} from 'react-native';
import {
    Text,
    TopNavigation,
    TopNavigationAction,
    Button,
    Layout,
    Icon,
    Input,
} from 'react-native-ui-kitten';
import Moment from 'moment';
import { connect } from 'react-redux';
import { showMessage } from "react-native-flash-message";
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import { Styles } from '../../styles/Styles.js';
import SimpleReactValidator from 'simple-react-validator';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import config from '../../config';
import DateTimePicker from "react-native-modal-datetime-picker";
import Icons from 'react-native-vector-icons/MaterialIcons';

const GooglePlacesInput = (props) => {

    return (
        <GooglePlacesAutocomplete
            placeholder='Search'
            minLength={2}
            autoFocus={false}
            returnKeyType={'search'}
            keyboardAppearance={'light'}
            listViewDisplayed='auto'
            fetchDetails={true}
            renderDescription={row => row.description}
            onPress={(data, details = null) => {
                // Booking.handleLocationChange(type, details.formatted_address);
                let location = details.formatted_address;
                // let locationDetails = new Booking(type, location);
                props.handleChange(props.type, location);
            }}
            getDefaultValue={() => props.value}
            query={{

                key: 'AIzaSyBrwXxi22bC6f3MO89edmVieTIoIQJrnew',
                language: 'en',
                types: 'geocode'
            }}
            styles={{
                textInputContainer: {
                    width: '100%',
                    backgroundColor: 'rgb(247, 249, 252)',
                    borderTopWidth: 1,
                    borderTopColor: 'rgb(228, 233, 242)',
                    borderLeftWidth: 1,
                    borderLeftColor: 'rgb(228, 233, 242)',
                    borderRightWidth: 1,
                    borderRightColor: 'rgb(228, 233, 242)',
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgb(228, 233, 242)',
                    borderRadius: 30,
                    // paddingVertical: 25,
                },
                textInput: {
                    backgroundColor: 'transparent',
                    // borderTop: '0 solid transparent',
                },
                description: {
                    fontWeight: 'bold'
                },
                predefinedPlacesDescription: {
                    color: '#1faadb'
                }
            }}

            GooglePlacesSearchQuery={{
                rankby: 'distance',
            }}
            GooglePlacesDetailsQuery={{
                fields: 'formatted_address',
            }}
            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
            debounce={200}
        />

    );
}

const BackIcon = (style) => (
    <Icon name='arrow-back' size={23} color='#ffff' />
);

const CloseIcon = (style) => (
    <Icon {...style} style={Styles.ModalIcon} name='close-circle-outline' fill='red' />
);
const CloseModal = (props) => (
    <TopNavigationAction {...props} style={Styles.text} icon={CloseIcon} />
);

const SearchIcon = (style) => (
    <Icon name='search' size={23} color='#ffff' />
);

const BackAction = (props) => (
    <TopNavigationAction {...props} style={Styles.text} icon={BackIcon} />
);

const SearchAction = (props) => (
    <TopNavigationAction {...props} icon={SearchIcon} />
);

const renderRightControl = () => (
    <SearchAction onPress={this.ShowHideSearch} />
);

class ViewPaymentRecord extends React.Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator({ autoForceUpdanpte: this });
    }

    componentDidMount() {
    }



    render() {
        Moment.locale('en');
        const onBackPress = () => {
        };

        const renderLeftControl = () => (
            <BackAction onPress={() => { Actions.refresh({ key: "PendingBooking" }) }} />
        );
        return (
            <Layout
                style={Styles.BookingModalBackground}>
                <Layout
                    style={Styles.BookingModal}>
                    <TopNavigation
                        title={this.props.viewPaymentDetails.first_name+' '+this.props.viewPaymentDetails.last_name}
                        titleStyle={[Styles.boldText, {fontSize: 20}]}
                        rightControls= <CloseModal onPress={() => Actions.pop()}/>
                        style={{ paddingRight: 0 }}
                    />
                    <ScrollView>
                        <View style={Styles.BookingDetailsContainer}>
                            <View style={{ width: '100%', paddingHorizontal: 9 }}>
                                <View style={Styles.BookingDetailsTitle}>
                                    <Icons name='my-location' style={{ marginRight: 5 }} size={20} color='#b82601' />
                                    <Text style={Styles.boldText}>Pick-up:</Text>
                                </View>
                                <Text style={{ paddingLeft: 23 }}>{this.props.viewPaymentDetails.pickup_loc}</Text>

                                <View style={Styles.BookingDetailsTitle}>
                                    <Icons name='pin-drop' style={{ marginRight: 5 }} size={20} color='#488fe1' />
                                    <Text style={Styles.boldText}>Drop-off:</Text>
                                </View>
                                <Text style={{ paddingLeft: 23 }}>{this.props.viewPaymentDetails.dropoff_loc}</Text>

                                <View style={Styles.BookingDetailsTitle}>
                                    <Icons name='event' style={{ marginRight: 5 }} size={20} color='#6b7c8e' />
                                    <Text style={Styles.boldText}>Date:</Text>
                                </View>
                                <Text style={{ paddingLeft: 23 }}>{this.props.viewPaymentDetails.date}</Text>

                                <View style={Styles.BookingDetailsTitle}>
                                    <Icons name='access-time' style={{ marginRight: 5 }} size={20} color='#007849' />
                                    <Text style={Styles.boldText}>Time:</Text>
                                </View>
                                <Text style={{ paddingLeft: 23 }}>{this.props.viewPaymentDetails.time}</Text>

                                <View style={Styles.BookingDetailsTitle}>
                                    <Icons name='monetization-on' style={{ marginRight: 5 }} size={20} color='#007849' />
                                    <Text style={Styles.boldText}>Amount:</Text>
                                </View>
                                <Text style={{ paddingLeft: 23 }}>${this.props.viewPaymentDetails.amount}</Text>
                            </View>
                        </View>


                    </ScrollView>
                </Layout>
            </Layout>
        );
    }
}
const styles = StyleSheet.create({
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: 8
    },
    footerControl: {
        marginHorizontal: 5,
    },
});

export default connect(null, null)(ViewPaymentRecord);

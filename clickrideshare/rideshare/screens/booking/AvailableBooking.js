import React, { } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Alert,
    Keyboard,
    TextInput
} from 'react-native';
import {
    Text,
    TopNavigation,
    TopNavigationAction,
    Button,
    Layout,
    Icon,
    Input,
    Avatar,
    Spinner
} from 'react-native-ui-kitten';
import Moment from 'moment';
import { connect } from 'react-redux';
import { showMessage } from "react-native-flash-message";
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import { Styles } from '../../styles/Styles.js';
import  firebase  from '../../firebase.js';
import SimpleReactValidator from 'simple-react-validator';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import config from '../../config';
import DateTimePicker from "react-native-modal-datetime-picker";
import Icons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
const geolib = require('geolib');

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

class AvailableBooking extends React.Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator({ autoForceUpdanpte: this });
        this.driver = firebase.firestore().collection('tbl_drivers').doc('driverid_'+this.props.user_credentials.fk_user_id);
    }

    componentDidMount() {


    }

    ProceedToTrip = async() => {
        let url = config.baseUrl + 'booking/updateDetails';
        let bodyFormdata = new FormData();

        bodyFormdata.append('up_bookingid', this.props.current_trip.tripInfo.booking_id);
        bodyFormdata.append('driverid', this.props.user_credentials.fk_user_id);
        bodyFormdata.append('type', 'driver');
        bodyFormdata.append('status', 2); //2 - Change status to Approved Booking

        let response = await axios.post(url, bodyFormdata);
        let info = response.data;
        console.log(info);
        if (info.status == 'success') {
            let setDriver = '';
            if (this.props.current_trip.tripInfo.booking_type == 2) {
                showMessage({
                    message: "Booking details updated!",
                    style: Styles.alert,
                    icon: 'auto',
                    type: "success",
                    duration: 8000
                });
                setDriver = this.driver.update({
                    booking_id: '',
                    declined_booking: '',
                    is_available: true,
                    status: 1
                });
                Actions.replace('Booking');
            } else {
                setDriver = this.driver.update({
                    declined_booking: '',
                    status: 3
                });
                Actions.replace('Trip');
            }
        } else {
            showMessage({
                message: "Something went wrong",
                style: Styles.alert,
                icon: 'auto',
                type: "danger",
                duration: 8000
            });
        }
    }

    submitDeclineBooking = async() => {
        console.log(this.props);
        let url = config.baseUrl + 'booking/driverDeclineBooking';
        let bodyFormdata = new FormData();

        bodyFormdata.append('up_bookingid', this.props.current_trip.tripInfo.booking_id);
        bodyFormdata.append('driverid', this.props.user_credentials.fk_user_id);
        bodyFormdata.append('decline_reason', this.props.decline_booking.reason);

        let response = await axios.post(url, bodyFormdata);
        let info = response.data;
        console.log(info);
        if (info.status == 'success') {
            showMessage({
                message: "Your reason for declining has been submitted.",
                style: Styles.alert,
                icon: 'auto',
                type: "info",
                duration: 8000
            });
            // declined_booking: firebase.firestore.FieldValue.arrayRemove(1)
            let setDeclinedBookings = this.driver.update({
                  declined_booking: firebase.firestore.FieldValue.arrayUnion(this.props.current_trip.tripInfo.booking_id)
            });
            let setDriver = this.driver.update({
                  is_available: true,
                  status: 1,
                  booking_id: ''
            });
            Actions.pop();
        } else {
            showMessage({
                message: "Something went wrong",
                style: Styles.alert,
                icon: 'auto',
                type: "danger",
                duration: 8000
            });
        }
    }

    openModalBox = () => {
        this.props.setModalVisible('modalVisible')
    }

    _renderDeclineModal = () => {
        return (
            <ScrollView>
                <Layout
                    level='3'
                    style={Styles.modalContainer}>
                    <Text style={Styles.FeedbackText}>Decline Booking</Text>
                    <View style={Styles.textAreaContainer}>
                        <TextInput
                            placeholder='Type your reason here...'
                            underlineColorAndroid="transparent"
                            placeholderTextColor="grey"
                            numberOfLines={10}
                            multiline={true}
                            style={Styles.textArea}
                            value={this.props.decline_booking.reason}
                            onChangeText={value => this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'decline_booking', 'reason', value)}
                        />
                    </View>
                    <View style={Styles.sendFeedbackSubmitBtnContainer}>
                        <Button style={Styles.sendFeedbackSubmitBtn} status='danger' onPress={() => { this.props.setModalVisible('modalVisible'); }}>Cancel</Button>
                        <Button style={Styles.sendFeedbackSubmitBtn} status='primary' onPress={() => this.submitDeclineBooking()}>Submit</Button>
                    </View>
                </Layout>
            </ScrollView>
        );
    };

    render() {
        Moment.locale('en');
        var time = this.props.current_trip.tripInfo.time;
        var date = this.props.current_trip.tripInfo.date;
        var formatted_date = Moment(date, "YYYY-MM-DD").calendar(null, {
            sameDay: 'MMMM DD, YYYY — [Today]',
            nextDay: 'MMMM DD, YYYY — [Tomorrow]',
            nextWeek: 'MMMM DD, YYYY — dddd',
            sameElse: 'MMMM DD, YYYY — dddd'
        });
        var formatted_time = Moment(time, "HH:mm:ss").format("hh:mm A");
        const onBackPress = () => {
        };

        const renderLeftControl = () => (
            <BackAction onPress={() => { Actions.refresh({ key: "Dashboard" }) }} />
        );

        console.log(this.props);
        return (
            <Layout
                style={Styles.BookingModalBackground}>
                <Layout
                    style={Styles.BookingModal}>
                    <ScrollView>
                        <View style={[Styles.BookingDetailsContainer]}>
                            <View style={{ width: '100%', paddingHorizontal: 25, paddingTop: 15, paddingBottom: 3 }}>
                                <View style={{flexDirection:'row', flexWrap:'wrap', marginBottom: 20}}>
                                    <Avatar style={[styles.avatar, {marginRight: 20}]} size='giant' source={{ uri: 'https://www.clickitnride.com/admin/images/'+ this.props.current_trip.tripInfo.profile_pic }}/>
                                    <View>
                                        <Text style={Styles.boldText} category='h5'>{this.props.current_trip.tripInfo.first_name + ' ' + this.props.current_trip.tripInfo.last_name}</Text>
                                        <Text appearance='hint'>{this.props.current_trip.tripInfo.payment_id == '' ? 'Cash Payment':'Paypal Online'}</Text>
                                    </View>
                                    <View style={{flex: 1, marginTop: 10}}>
                                        <Text style={[Styles.boldText, {textAlign: 'right'}]} category='h5'>${this.props.current_trip.tripInfo.amount}</Text>
                                    </View>
                                </View>
                                <View style={Styles.BookingDetailsTitle}>
                                    <Icons name='my-location' style={{ marginRight: 5 }} size={20} color='#b82601' />
                                    <Text appearance='hint'>PICKUP:</Text>
                                </View>
                                <Text style={{ paddingLeft: 23 }}>{this.props.current_trip.tripInfo.pickup_loc}</Text>
                                <View
                                    style={{
                                        alignSelf: 'flex-end',
                                        width: '95%',
                                        marginVertical: 3,
                                        borderBottomColor: '#eaebec',
                                        borderBottomWidth: 1,
                                    }}
                                />

                                <View style={Styles.BookingDetailsTitle}>
                                    <Icons name='pin-drop' style={{ marginRight: 5 }} size={20} color='#488fe1' />
                                    <View>
                                        <Text appearance='hint'>DROP-OFF:</Text>
                                        <Text>{this.props.current_trip.tripInfo.dropoff_loc}</Text>
                                    </View>
                                </View>

                                {this.props.current_trip.tripInfo.booking_type == 2 ?
                                <View>
                                    <View style={Styles.BookingDetailsTitle}>
                                        <Icons name='event' style={{ marginRight: 5 }} size={20} color='#6b7c8e' />
                                        <Text appearance='hint'>Scheduled Date:</Text>
                                    </View>
                                    <Text style={{ paddingLeft: 23 }}>{formatted_date}</Text>
                                    <View style={Styles.BookingDetailsTitle}>
                                        <Icons name='access-time' style={{ marginRight: 5 }} size={20} color='#007849' />
                                        <Text appearance='hint'>Scheduled Time:</Text>
                                    </View>
                                    <Text style={{ paddingLeft: 23 }}>{formatted_time}</Text>
                                </View>
                                :null}
                                <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', marginTop: 20}}>
                                    <Button style={Styles.DriverBookingButton}status='success' onPress={() => this.ProceedToTrip()}>Accept</Button>
                                    <Button style={Styles.DriverBookingButton} status='danger' onPress={() => this.openModalBox()}>Ignore</Button>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                </Layout>
                <Layout>
                    <Modal
                        style={{marginTop: '50%'}}
                        isVisible={this.props.modalVisible}
                        backdropStyle={{ backgroundColor: 'black', opacity: 0.5 }}
                        animationInTiming={0}
                        onSwipeComplete={() => this.props.setModalVisible('modalVisible')}
                        onBackdropPress={() => this.props.setModalVisible('modalVisible')}
                        onSwipeComplete={() => this.props.setModalVisible('modalVisible')}
                    >
                    {this._renderDeclineModal()}
                    </Modal>
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
const mapStateToProps = state => {
    return {
        pickup_location: state.pickup_location,
        dropoff_location: state.dropoff_location,
        modalVisible: state.modalVisible,
        get_location: state.get_location,
        user_credentials: state.user_credentials,
        decline_booking: state.decline_booking,
        current_trip: state.current_trip,
    }
}
const mapActionToProps = dispatch => {
    return {
        handle_changes_with_parent: (action, parent_state, child_state, value) => dispatch({ type: action, parent_state: parent_state, child_state: child_state, value: value }),
        setModalVisible: (state) => dispatch({ type: 'MODAL_VISIBLE', state: state }),
    }
}
export default connect(mapStateToProps, mapActionToProps)(AvailableBooking);

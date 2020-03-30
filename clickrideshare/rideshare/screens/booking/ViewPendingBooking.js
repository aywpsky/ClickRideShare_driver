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
    Avatar,
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
import  firebase  from '../../firebase.js';

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

class ViewPendingBooking extends React.Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator({ autoForceUpdanpte: this });
        this.ref = firebase.firestore().collection('tbl_booking');
        this.driver = firebase.firestore().collection('tbl_drivers').doc('driverid_'+this.props.user_credentials.fk_user_id);
    }

    componentDidMount() {
        console.log(this.props.view_pending_booking);
        let upDate = Moment(this.props.view_pending_booking.up_date).format('YYYY-MM-DD');
        let upTime = Moment(this.props.view_pending_booking.up_time, 'h:mm:ss A').format('h:mm A');
        this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_pending_booking', 'up_date', upDate)
        this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_pending_booking', 'up_time', upTime)
    }

    ProceedToTrip = async() => {
        let url = config.baseUrl + 'booking/updateDetails';
        let bodyFormdata = new FormData();

        bodyFormdata.append('up_bookingid', this.props.current_trip.tripInfo.booking_id);
        bodyFormdata.append('status', 3); //3 - On the Way
        bodyFormdata.append('type', 'driver');

        let response = await axios.post(url, bodyFormdata);
        let info = response.data;
        console.log(info);
        if (info.status == 'success') {
            showMessage({
                message: "Booking details updated!",
                style: Styles.alert,
                icon: 'auto',
                type: "success",
                duration: 8000
            });
            this.ref.doc('USER'+this.props.current_trip.tripInfo.fk_user_id).collection('booking_list').doc('BOOKINGID_'+this.props.current_trip.tripInfo.booking_id).update({
                status:3 //update status for customer booking notification
            })

            let setDriver = this.driver.update({
                booking_id: '',
                is_available: false,
                status: 3
            });
            Actions.replace('Trip');
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
            <BackAction onPress={() => { Actions.refresh({ key: "PendingBooking" }) }} />
        );

        console.log(this.props);
        return (
            <Layout
                style={Styles.BookingModalBackground}>
                <Layout
                    style={Styles.BookingModal}>
                    <TopNavigation
                        rightControls= <CloseModal onPress={() => Actions.pop()}/>
                        style={{ paddingRight: 0 }}
                    />
                    <ScrollView>
                        <View style={Styles.BookingDetailsContainer}>
                            <View style={{ width: '100%', paddingHorizontal: 20, }}>
                                <View style={{flexDirection:'row', flexWrap:'wrap', marginBottom: 30}}>
                                    <Avatar style={[styles.avatar, {marginRight: 20}]} size='giant' source={{ uri: 'https://www.clickitnride.com/admin/images/' + this.props.current_trip.tripInfo.profile_pic }}/>
                                    <View>
                                        <Text style={Styles.boldText} category='h5'>{this.props.current_trip.tripInfo.first_name + ' ' + this.props.current_trip.tripInfo.last_name}</Text>
                                        <Text>{this.props.current_trip.tripInfo.payment_type == 1 ? 'Paypal Payment': 'Cash Payment'}</Text>
                                    </View>
                                    <View style={{flex: 1, marginTop: 10}}>
                                        <Text style={[Styles.boldText, {textAlign: 'right'}]} category='h5'>${this.props.current_trip.tripInfo.amount}</Text>
                                    </View>
                                </View>
                                <View style={Styles.BookingDetailsTitle}>
                                    <Icons name='my-location' style={{ marginRight: 5 }} size={20} color='#b82601' />
                                    <Text appearance='hint'>Pick-up:</Text>
                                </View>
                                <Text style={{ paddingLeft: 23 }}>{this.props.current_trip.tripInfo.pickup_loc}</Text>

                                <View style={Styles.BookingDetailsTitle}>
                                    <Icons name='pin-drop' style={{ marginRight: 5 }} size={20} color='#488fe1' />
                                    <Text appearance='hint'>Drop-off:</Text>
                                </View>
                                <Text style={{ paddingLeft: 23 }}>{this.props.current_trip.tripInfo.dropoff_loc}</Text>

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
                                <View style={[Styles.BookingDetailsTitle, {textAlign: 'center', alignSelf:'center', alignItems: 'center', justifyContent: 'center'}]}>
                                    <Button status='danger' style={{ shadowRadius: 15, borderRadius: 30, alignSelf: 'center', width: '50%' }} onPress={() => this.ProceedToTrip()}>On the Way</Button>
                                </View>

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
const mapStateToProps = state => {
    return {
        book_a_ride: state.book_a_ride,
        view_pending_booking: state.view_pending_booking,
        user_credentials: state.user_credentials,
        current_trip: state.current_trip,
    }
}
const mapActionToProps = dispatch => {
    return {
        handle_changes_with_parent: (action, parent_state, child_state, value) => dispatch({ type: action, parent_state: parent_state, child_state: child_state, value: value }),
        setModalVisible: (state) => dispatch({ type: 'MODAL_VISIBLE', state: state }),
    }
}
export default connect(mapStateToProps, mapActionToProps)(ViewPendingBooking);

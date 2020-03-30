import React, { } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Alert, TextInput, Platform } from 'react-native';
import { TopNavigation, TopNavigationAction, Layout, Text, DrawerHeaderFooter, Avatar, Button, Tooltip, Toggle } from 'react-native-ui-kitten';
import { Actions } from 'react-native-router-flux';
import SimpleReactValidator from 'simple-react-validator';
import config from '../config';
import { Styles } from '../styles/Styles.js';
import axios from 'axios';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Dashboard_tabs from './Dashboard_tabs';
import { AirbnbRating } from 'react-native-ratings';
import Modal from 'react-native-modal';
import { showMessage } from "react-native-flash-message";
// import Navigations from './Navigations.js';
import NetInfo from "@react-native-community/netinfo";
import  firebase  from '../firebase.js';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
var PushNotification = require("react-native-push-notification");


// Subscribe
const unsubscribe = NetInfo.addEventListener(state => {
  console.log("Connection type", state.type);
  console.log("Is connected?", state.isConnected);
});

// Unsubscribe
unsubscribe();



const CloseIcon = (style) => (
    <Icon {...style} style={Styles.ModalIcon} name='window-close' color='red' />
);

const CloseModal = (props) => (
    <TopNavigationAction {...props} style={Styles.text} icon={CloseIcon} />
);
const MenuIcon = (style) => (
    <Icon name='bars' size={20} color="#fff" />
);
const BackAction = (props) => (
    <TopNavigationAction {...props} icon={MenuIcon} />
);

class Dashboard extends React.Component {

    constructor(props) {
        super(props)
        this.validator = new SimpleReactValidator({ autoForceUpdate: this });
        this.getCustomer = this.getCustomer.bind(this);
        this.findBookings = firebase.firestore().collection('tbl_drivers');
        this.driver = firebase.firestore().collection('tbl_drivers').doc('driverid_'+this.props.user_credentials.fk_user_id);
    }


    renderProfileHeader = () => (
        <DrawerHeaderFooter style={Styles.drawer_header} title={this.props.user_credentials.first_name + ' ' + this.props.user_credentials.last_name} description='React Native Developer' titleStyle={{ color: '#fff' }} icon={PersonIcon} />
    );

    onPressProfile() {
        Actions.EditProfile();
    }
    getCustomer() {
        let url = config.baseUrl + 'login/getCustomer';
        let bodyFormdata = new FormData();
        axios({
            'url': url,
            'data': bodyFormdata,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })

            .then(result => {
                let res = result.data.message;
                this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'user_credentials', 'fk_user_id', result.data[0].fk_user_id)
                this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'user_credentials', 'first_name', result.data[0].first_name)
                this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'user_credentials', 'last_name', result.data[0].last_name)
                this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'user_credentials', 'phone_number', result.data[0].phone_number)
                this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'user_credentials', 'profile_pic', result.data[0].profile_pic)
                this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'user_credentials', 'date_added', result.data[0].date_added)
                this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'book_a_ride', 'name', result.data[0].first_name)
                this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'book_a_ride', 'email_address', result.data[0].email)
                this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'book_a_ride', 'phone_number', result.data[0].phone_number)
            });
    }

    componentDidMount() {
        this.checkPaymentNotif();
        this.getCustomer();
        this.check_bookings();
        this.driver.get().then(function(doc) {
            if (doc.exists) {
              let data = doc.data();
              if (data.is_available) {
                console.log('data: yes');
                this.props.handle_change('HANDLE_CHANGE', 'toggleStatus', true)
              }
                console.log('data: no');
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
        this.findBookings.doc('driverid_'+this.props.user_credentials.fk_user_id).onSnapshot(this.AvailableBooking);
    }
    checkPaymentNotif = () => {
      let url = config.baseUrl + 'payment/getPaymentNotif';
      let bookingdata = [];
      let bodyFormdata = new FormData();
      bodyFormdata.append('userid', this.props.user_credentials.fk_user_id);

      axios({
          'method': 'post',
          'url': url,
          'data': bodyFormdata,
          config: { headers: { 'Content-Type': 'multipart/form-data' } }
      })
      .then(response => {
          let info = response.data;
          console.log('claimed', info);
          this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'notifications', 'claimed_payments', info)
          this.notify();
      })
      .catch(error => {
        console.log(error.message);
      })
    }

    notify = () => {
      PushNotification.localNotification({
          /* Android Only Properties */
          // booking_id: booking_status.id,
          id: 1, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
          ticker: "My Notification Ticker", // (optional)
          autoCancel: true, // (optional) default: true
          largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
          smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
          color: "#243c88", // (optional) default: system default
          vibrate: true, // (optional) default: true
          vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
          tag: 'some_tag', // (optional) add tag to message
          group: "group", // (optional) add group to message
          ongoing: false, // (optional) set whether this is an "ongoing" notification
          priority: "high", // (optional) set notification priority, default: high
          visibility: "private", // (optional) set notification visibility, default: private
          importance: "high", // (optional) set notification importance, default: high

          /* iOS and Android properties */
          title: 'Payment Notification', // (optional)
          message: "Open to see details.", // (required)
          playSound: false, // (optional) default: true
          soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
          number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
          repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
          actions: '["View Now", "Later"]',  // (Android only) See the doc for notification actions to know more
      });
    }

    getTripInfo = (booking_id) => {
        let url = config.baseUrl + 'booking/getTripInfo';
        let bookingdata = [];
        let bodyFormdata = new FormData();
        bodyFormdata.append('booking_id', booking_id);
        bodyFormdata.append('type', 2);//2 - get with customer info
        console.log(bodyFormdata);

        axios({
            'method': 'post',
            'url': url,
            'data': bodyFormdata,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
        .then(response => {
            let info = response.data;
            if (info.status == 'success') {
                this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'current_trip', 'tripInfo' ,info.data)
                console.log('infpooooooo', this.props.current_trip.tripInfo);
            }
        })
        .catch(error => {
          console.log(error.message);
        })
    }

    AvailableBooking = (doc) => {
        if (doc.exists === false) {
        }else{
            const {status, booking_id} = doc.data();
            if (status == 2) { //alert for available booking
                this.getTripInfo(booking_id);
                console.log('booking id', booking_id);
                console.log(this.props.current_trip.tripInfo);
                setTimeout(() => Actions.AvailableBooking(), 8000)
                ;
            } else if (status == 3) { //3 - on trip
                this.getTripInfo(booking_id);
                setTimeout(() => Actions.Trip(), 5000)
            }
        }
    }


    ratingCompleted(rating) {
        console.log("Rating is: " + rating)
    }

    check_bookings = async () => {
        let url = config.baseUrl + 'feedback/checkBookings';
        let bodyFormdata = new FormData();
        bodyFormdata.append('userid', this.props.user_credentials.fk_user_id);

        let response = await axios.post(url, bodyFormdata);
        let info = response.data;

        if (info.length > 0) {
            info.map((booking) => {
                this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'feedback_data', 'driver_id', booking.driverid)
                this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'feedback_data', 'drivers_name', booking.first_name + ' ' + booking.last_name)
                this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'feedback_data', 'drivers_pic', booking.profile_pic)
                this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'feedback_data', 'client_id', booking.userid)
                this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'feedback_data', 'booking_id', booking.booking_id)
            });
        }

    }

    openModalBox() {
        this.props.setModalVisible('modalVisible')
    }

    Confirmation() {
        Alert.alert(
            'Send Now?',
            '',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => this.SaveFeedback() },
            ],
            { cancelable: false },
        );
    }

    SaveFeedback() {
        let url = config.baseUrl + 'feedback/saveFeedback';
        let bodyFormdata = new FormData();
        bodyFormdata.append('booking_id', this.props.feedback_data.booking_id);
        bodyFormdata.append('fk_driver_id', this.props.feedback_data.driver_id);
        bodyFormdata.append('fk_client_id', this.props.feedback_data.client_id);
        bodyFormdata.append('comment', this.props.feedback_data.comment);
        bodyFormdata.append('rating', this.props.feedback_data.rate_star);

        axios({
            method: 'post',
            url: url,
            data: bodyFormdata,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })

            .then(result => {
                let res = result.data.status;
                this.openModalBox();
                if (res == 'success') {
                    showMessage({
                        message: "Thank you for your feedback!",
                        type: "success",
                        duration: 10000
                    });

                } else {
                    showMessage({
                        message: "Something went wrong!!!",
                        type: "danger",
                        duration: 10000
                    });
                }
            });
    }
    ratingCompleted(rating) {
        this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'feedback_data', 'rate_star', rating)
    }

    _toggleStatus = () => {
      let setDriver = "";
      this.props.setModalVisible('toggleStatus');
      if (this.props.toggleStatus) {
        setDriver = this.driver.update({
            is_available: true,
            status: 1
        });
      } else {
        setDriver = this.driver.update({
            is_available: false,
        });
      }
    }


    render() {
        let profile_picture = { uri: 'https://www.clickitnride.com/admin/images/' + this.props.user_credentials.profile_pic };

        const renderLeftControl = () => (
            <BackAction onPress={() => { Actions.EditProfile(); }} />
        );
        const renderRightControl = () => (
            <CloseModal onPress={() => { this.props.setModalVisible('modalVisible'); }} />
        );
        return (
            <View style={Styles.view}>
                <ScrollView>
                    <TopNavigation
                        leftControl={renderLeftControl()}
                        style={Styles.header2}
                    />
                    <View style={Styles.drawer}>
                        <View style={Styles.drawerHeader}>
                            <Image style={Styles.backgroundImage} source={require('../images/download.png')}>
                            </Image>
                            <View style={Styles.drawerHeaderIcon}>
                                <Avatar
                                    onPress={() => { Actions.EditProfile(); }}
                                    style={Styles.avatar2}
                                    size='giant'
                                    source={profile_picture}
                                />
                            </View>
                        </View>

                        <View style={Styles.drawerContent}>
                            <TouchableOpacity onPress={this.onPressProfile}>
                                <Text style={Styles.drawerHeaderName}>{this.props.user_credentials.first_name + ' ' + this.props.user_credentials.last_name}</Text>
                                <Text style={[Styles.drawerHeaderDescription, {textAlign: 'center'}]}>{this.props.user_credentials.phone_number}</Text>
                            </TouchableOpacity>
                            <Toggle text={`Offline/Online`} checked={this.props.toggleStatus} status='success' style={{ zIndex: -2, }} onChange={() => { this._toggleStatus() }} />
                        </View>

                        <View style={Styles.menus}>
                            <Dashboard_tabs />
                        </View>
                    </View>
                </ScrollView>

            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        user_credentials: state.user_credentials,
        isLoggedIn: state.isLoggedIn,
        modalVisible: state.modalVisible,
        get_feedback: state.get_feedback,
        feedback_data: state.feedback_data,
        current_trip: state.current_trip,
        modalVisible: state.modalVisible,
        toggleStatus: state.toggleStatus,
        notifications: state.notifications
    }
}
const mapActionToProps = dispatch => {
    return {
        handle_changes_with_parent: (action, parent_state, child_state, value) => dispatch({ type: action, parent_state: parent_state, child_state: child_state, value: value }),
        handle_change: (action, state, value) => dispatch({ type: action, parent_state: parent_state, value: value }),
        setModalVisible: (state) => dispatch({ type: 'MODAL_VISIBLE', state: state }),
    }
}
export default connect(mapStateToProps, mapActionToProps)(Dashboard);

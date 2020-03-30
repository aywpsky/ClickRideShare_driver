import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Form, Linking, TouchableOpacity, Image, DeviceEventEmitter } from 'react-native';
import { TopNavigation, TopNavigationAction, Layout, Text, Button, Drawer, DrawerHeaderFooter, Menu, Avatar } from 'react-native-ui-kitten';
import { SafeAreaView } from 'react-navigation';
import { Actions } from 'react-native-router-flux';
import ResponsiveImage from 'react-native-responsive-image';
import SimpleReactValidator from 'simple-react-validator';
import { showMessage, hideMessage } from "react-native-flash-message";
import  firebase  from '../../firebase.js';
import config from '../../config';
import { Styles } from '../../styles/Styles.js';
import Moment from 'moment';
import axios from 'axios';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icons from 'react-native-vector-icons/MaterialIcons';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
// import Navigations from './Navigations.js';

const NotificationBadge = (style) => (
    <Layout style={[style, Styles.badge]}>
        <Text style={Styles.badgeText}>5</Text>
    </Layout>
);
const MenuIcon = (style) => (
    <Icons name='arrow-back' size={20} color="#fff" />
);
const BackAction = (props) => (
    <TopNavigationAction {...props} icon={MenuIcon} />
);

var PushNotification = require("react-native-push-notification");

import PushNotificationAndroid from 'react-native-push-notification';



class Notifications extends React.Component {

    constructor(props) {
        super(props)
    }

     componentDidMount() {
         this.notification_seen()

    }

    notification_seen = () => {
      let url = config.baseUrl + 'payment/seenNotification';
      let bookingdata = [];
      let bodyFormdata = new FormData();
      bodyFormdata.append('booking_payment_id', this.props.notifications.claimed_payments);

      axios({
          'method': 'post',
          'url': url,
          'data': bodyFormdata,
          config: { headers: { 'Content-Type': 'multipart/form-data' } }
      })
      .then(response => {
          let info = response.data;
          console.log('seen ==', info);
      })
      .catch(error => {
        console.log(error);
      })
    }

    _renderOptions = (options) => {
        return options.slice(0).reverse().map((option, index) => (
                <View style={Styles.notifList} key={index}>
                    <View backgroundColor={option.backgroundColor} style={Styles.Viewicons}>
                        <Icon name='money-bill-alt' size={20} backgroundColor='#243c88' color='#243c88' style={Styles.icons} />
                    </View>
                    <Text>You have recently claimed ${option.amount}</Text>
                </View>
        ))
    }

    render() {
        Moment.locale('en');
        const renderLeftControl = () => (
            <BackAction onPress={() => { Actions.pop(); }} />
        );
        return (
            <View style={Styles.container}>
                    <TopNavigation
                        title='Notifications'
                        leftControl={renderLeftControl()}
                        alignment='center'
                        style={Styles.header}
                        titleStyle={Styles.headerTitle}
                    />
                    <View style={[Styles.drawer, {marginBottom: 0, paddingTop: 10}]}>

                        <View style={Styles.menus}>
                            {
                                this._renderOptions(this.props.notifications.claimed_payments)
                            }
                        </View>
                    </View>
            </View>
        );
    }
}
const mapStateToProps = state => {
    return {
        user_credentials: state.user_credentials,
        book_a_ride: state.book_a_ride,
        notifications: state.notifications,
        isLoggedIn: state.isLoggedIn,
    }
}
const mapActionToProps = dispatch => {
    return {
        handle_changes_with_parent: (action, parent_state, child_state, value) => dispatch({ type: action, parent_state: parent_state, child_state: child_state, value: value }),
        logout: (state) => dispatch({ type: 'SET_LOGGEDIN_BOOLEAN', state: state })
    }
}
export default connect(mapStateToProps, mapActionToProps)(Notifications);

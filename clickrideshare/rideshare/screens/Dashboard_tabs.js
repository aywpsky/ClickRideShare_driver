import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Layout } from 'react-native-ui-kitten';
import { Actions } from 'react-native-router-flux';
import { Styles } from '../styles/Styles.js';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import  firebase  from '../firebase.js';

class Dashboard_tabs extends Component {
    constructor(props) {
        super(props)
        this.driver = firebase.firestore().collection('tbl_drivers').doc('driverid_'+this.props.user_credentials.fk_user_id);
    }

    onPressOption = (option, index) => {
        this.setState({ selectedIndex: index })
        console.log(option.url);

        let route = option.url;
        switch (route) {
            case 'Dashboard':
                Actions.Dashboard();
                break;
            case 'Booking':
                Actions.Booking();
                break;
            case 'Notifications':
                Actions.Notifications();
                break;
            case 'PaymentRecords':
                Actions.PaymentRecords();
                break;
            case 'ViewTripHistory':
                Actions.ViewTripHistory();
                break;
            case 'Logout':
                Actions.LoginForm();
                let setDriver = this.driver.update({
                    is_available: false,
                });
                this.props.logout();
                break;
            default:

        }
    }

    state = {
        selectedIndex: null,
        options: [
            { title: 'Bookings', icon: 'car-alt', backgroundColor: '#23bbff', color: '#fff', url: 'Booking' },
            { title: 'Trip History', icon: 'history', backgroundColor: '#92d941', color: '#fff', url: 'ViewTripHistory' },
            { title: 'Payment Notifications', icon: 'hand-holding-usd', backgroundColor: '#ff6533', color: '#fff', url: 'Notifications' },
            { title: 'Payment Records', icon: 'hand-holding-usd', backgroundColor: '#f04d18', color: '#fff', url: 'PaymentRecords' },
            { title: 'Logout', backgroundColor: '#373737', color: '#fff', icon: 'sign-out-alt', url: 'Logout' },
        ]
    };


    _renderOptions = (options) => {
        let notifications = this.props.notifications.options;
        console.log(notifications);
        return options.map((option, index) => (
            <TouchableOpacity
                key={index}
                onPress={() => this.onPressOption(option, index)}
            >
                <View style={this.state.selectedIndex == index ? Styles.menuListSelected : Styles.menuList} >
                    <View backgroundColor={option.backgroundColor} style={Styles.Viewicons}>
                        <Icon name={option.icon} size={20} backgroundColor={option.backgroundColor} color={option.color} style={Styles.icons} />
                    </View>
                    <View style={Styles.screens}>
                        <Text>{option.title}</Text>
                    </View>
                    {option.title == 'Notifications' ?
                        <View style={{ width: 10, right: 35 }}>
                        <Layout style={[Styles.badge]}>
                            <Text style={Styles.badgeText}>{notifications.length}</Text>
                        </Layout>
                        </View>
                        : <Text>  </Text>}
                    <View style={{ width: '100%' }}>
                        <Icon name="chevron-right" size={20} color="#6e6c6c" />
                    </View>
                </View>
            </TouchableOpacity>
        ))
    }
    render() {
        return (
            <View>
                {
                    this._renderOptions(this.state.options)
                }
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.isLoggedIn,
        user_credentials: state.user_credentials,
        notifications: state.notifications,
    }
}
const mapActionToProps = dispatch => {
    return {
        logout: (state) => dispatch({ type: 'SET_LOGGEDIN_BOOLEAN', state: state }),
    }
}
export default connect(mapStateToProps, mapActionToProps)(Dashboard_tabs);

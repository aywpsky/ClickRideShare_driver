import React, { Component } from 'react';
import { Router, Scene, Lightbox } from 'react-native-router-flux';
import LoginForm from './screens/LoginForm';
import { RegisterForm } from './screens/RegisterForm';
import { ForgotPass } from './screens/ForgotPass';
import { ChangePassCode } from './screens/ChangePassCode';
import { ChangePass } from './screens/ChangePass';
import Dashboard from './screens/Dashboard';
import EditProfile from './screens/EditProfile';
import ViewTripHistory from './screens/ViewTripHistory';
import PendingBooking from './screens/booking/PendingBooking';
import ViewPendingBooking from './screens/booking/ViewPendingBooking';
import PaymentRecords from './screens/payment/PaymentRecords';
import ViewPaymentRecord from './screens/payment/ViewPaymentRecord';
import Trip from './screens/booking/Trip';
import BookingPayment from './screens/payment/BookingPayment';
import BookMain from './screens/booking/BookMain';
import DropOffSuccess from './screens/booking/DropOffSuccess';
import Myscreen from './screens/Myscreen';
import Booking from './screens/booking/Booking';
import AvailableBooking from './screens/booking/AvailableBooking';
import Notifications from './screens/notifications/Notifications';
import PinnedLocation from './screens/PinnedLocation';
import { connect } from 'react-redux';


class Routes extends Component {
    render() {
        return (
            <Router>
                <Lightbox>
                    <Scene key="root">
                        <Scene hideNavBar="true" key="LoginForm" component={LoginForm} title="Login" initial={this.props.isLoggedIn === false ? "true" : ""} />
                        <Scene hideNavBar="true" key="Dashboard" component={Dashboard} title="Dashboard" initial={this.props.isLoggedIn ? "true" : ""} />
                        <Scene hideNavBar="true" key="ForgotPass" component={ForgotPass} title="Forgot Password" />
                        <Scene hideNavBar="true" key="RegisterForm" component={RegisterForm} title="Register" />
                        <Scene hideNavBar="true" key="ChangePassCode" component={ChangePassCode} title="Enter Code" />
                        <Scene hideNavBar="true" key="ChangePass" component={ChangePass} title="Change Password" />
                        <Scene hideNavBar="true" key="EditProfile" component={EditProfile}  title="Edit Profile" />
                        <Scene hideNavBar="true" key="ViewTripHistory" component={ViewTripHistory} title="View Trip History" />
                        <Scene hideNavBar="true" key="Trip" component={Trip} title="View Trip" />
                        <Scene hideNavBar="true" key="PendingBooking" component={PendingBooking} title="Pending Booking" />
                        <Scene hideNavBar="true" key="PaymentRecords" component={PaymentRecords} title="Payment Records" />
                        <Scene hideNavBar="true" key="BookMain" component={BookMain} title="Book a Ride" />
                        <Scene hideNavBar="true" key="DropOffSuccess" component={DropOffSuccess} title="Drop Off Success" />
                        <Scene hideNavBar="true" key="Notifications" component={Notifications} title="Notifications" />
                        <Scene hideNavBar="true" key="BookingPayment" component={BookingPayment} title="Your Ride" />
                        <Scene hideNavBar="true" key="PinnedLocation" component={PinnedLocation} title="Pinned Location" />
                        <Scene hideNavBar="true" key="Myscreen" component={Myscreen} title="Test Profile" />
                        <Scene hideNavBar="true" key="Booking" component={Booking} title="Booking"/>
                    </Scene>
                    <Scene hideNavBar="true" key="AvailableBooking" component={AvailableBooking} title="Available Booking" />
                    <Scene hideNavBar="true" key="ViewPendingBooking" component={ViewPendingBooking} title="View Pending Booking" />
                    <Scene hideNavBar="true" key="ViewPaymentRecord" component={ViewPaymentRecord} title="View PaymentRecord" />
                </Lightbox>
            </Router>
        )
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.isLoggedIn
    }
}

export default connect(mapStateToProps, null)(Routes);

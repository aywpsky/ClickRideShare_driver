import React, { } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Alert,
    Image,
} from 'react-native';
import {
    Text,
    TopNavigation,
    TopNavigationAction,
    Button,
    Layout,
} from 'react-native-ui-kitten';
import Moment from 'moment';
import { connect } from 'react-redux';
import RNPaypal from 'react-native-paypal-lib';
import { showMessage } from "react-native-flash-message";
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import { Styles } from '../../styles/Styles.js';
import SimpleReactValidator from 'simple-react-validator';
import MapView, {Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import config from '../../config';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import  firebase  from '../../firebase.js';

const GOOGLE_API_KEY = 'AIzaSyBrwXxi22bC6f3MO89edmVieTIoIQJrnew';

const BackIcon = (style) => (
    <Icons name='arrow-back' size={23} color='#ffff' />
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

class BookingPayment extends React.Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator({autoForceUpdanpte: this});
        this.ref = firebase.firestore().collection('tbl_booking');
    }

    componentDidMount() {
        console.log(this.props.get_location);
        // this.get_pick_up_lat_lng(this.props.book_a_ride.pickup_loc);
        // this.get_drop_off_lat_lng(this.props.book_a_ride.dropoff_loc);
    }
    get_pick_up_lat_lng = (param) => {
        Geocoder.geocodeAddress(param).then(res => {
            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'pickup_location', 'longitude', res[0].position['lng']);
            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'pickup_location', 'latitude', res[0].position['lat']);
           // this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'book_a_ride', 'pickup_loc', current_add)
        })
           .catch(err => console.log(err))
    }

    get_drop_off_lat_lng = (param) => {
        Geocoder.geocodeAddress(param).then(res => {
            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'dropoff_location', 'longitude', res[0].position['lng']);
            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'dropoff_location', 'latitude', res[0].position['lat']);
           // this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'book_a_ride', 'pickup_loc', current_add)
        })
           .catch(err => console.log(err))
    }

    Book_Cash = async() => {
        const type = this.props.book_a_ride.type;
        this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT','book_a_ride','payment_method','Cash Payment');

       await this.ProceedtoTrip('');
    }

    ProceedtoTrip = async(payment) => {
        let url = config.baseUrl + 'booking/RideNow';
        let bodyFormdata = new FormData();
        bodyFormdata.append('user_id', this.props.user_credentials.fk_user_id);
        bodyFormdata.append('pickup_loc', this.props.book_a_ride.pickup_loc);
        bodyFormdata.append('dropoff_loc', this.props.book_a_ride.dropoff_loc);
        bodyFormdata.append('payment_amount', this.props.book_a_ride.payment_amount);
        bodyFormdata.append('pickup_date', this.props.book_a_ride.pickup_date);
        bodyFormdata.append('pickup_time', this.props.book_a_ride.pickup_time);
        bodyFormdata.append('type', this.props.book_a_ride.type);
        bodyFormdata.append('payment_id', payment);

        let response = await axios.post(url , bodyFormdata);
        let info = response.data;
        console.log(info);
        this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT','book_a_ride','booking_id',info.bookingid);
        if (info.status == 'success') {
            showMessage({
                message: "Payment Success!!",
                style: Styles.alert,
                icon: 'auto',
                type: "success",
                duration: 8000
            });

            this.ref.doc('USER'+this.props.user_credentials.fk_user_id).get()
            .then(docSnapshot => {
                let setFBUserInfo = '';
                let userBookingList = this.ref.doc('USER'+this.props.user_credentials.fk_user_id).collection('booking_list');
                let booking_key = this.props.book_a_ride.pickup_date + ' ' + this.props.book_a_ride.pickup_time;

                if (docSnapshot.exists) {
                    userBookingList.doc('BOOKINGID_'+info.bookingid).set({
                        id: info.bookingid,
                        amount: this.props.book_a_ride.payment_amount,
                        pickup_loc: this.props.book_a_ride.pickup_loc,
                        dropoff_loc:this.props.book_a_ride.dropoff_loc,
                        status: 0
                    });
                } else {
                    setFBUserInfo = this.ref.doc('USER'+this.props.user_credentials.fk_user_id).set({name:this.props.user_credentials.first_name})
                    userBookingList.doc('BOOKINGID_'+info.bookingid).set({
                        id: info.bookingid,
                        amount: this.props.book_a_ride.payment_amount,
                        pickup_loc: this.props.book_a_ride.pickup_loc,
                        dropoff_loc:this.props.book_a_ride.dropoff_loc,
                        status: 0
                    });
                }
            });
            Actions.replace('Trip', {type: 1})
        } else {
            showMessage({
                message: "Something went wrong!",
                style: Styles.alert,
                icon: 'auto',
                type: "danger",
                duration: 5000
            });
        }
    }

    Book_Paypal = async() => {
        const type = this.props.book_a_ride.type;
        this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT','book_a_ride','payment_method','Paypal Payment');
       //1 - Book Now, 2 - Book a Ride

        // if (type == 1) {
        //     console.log('now');
        // } else {
            console.log('later');
            console.log('papypal here');
            const self =this;
            RNPaypal.paymentRequest({
                clientId: 'AaPrAOxKMOYWEDsEmuj5SP4ZK3sCc6qPk3sj0fFo8aIUn6POWZu3p_HRHlrnBrP1M1YT-Ku9C8bszInX',
                environment: RNPaypal.ENVIRONMENT.SANDBOX,
                intent: RNPaypal.INTENT.ORDER,
                price: parseFloat(self.props.book_a_ride.payment_amount),
                currency: 'USD',
                description: `Click Rideshare Booking Payment`,
                acceptCreditCards: false
            })
            .then(response => {
                // console.log(response);
                let payment = response.response;

                if (payment.state == 'approved') {
                     this.ProceedtoTrip(payment.order_id);
                }
                   //  this.ref.doc(response.response.id).set({
                   //      driver:'',
                   //      date_time: response.response.create_time,
                   //      ride_status: '1',
                   //      rider_id: '1982771702Esz5i0ft6vb'
                   // })
                   // .then((docRef) => {
                   //     console.log(docRef);
                   //         self.props.getsingleData('FIND_DRIVER_DATA',true)
                   // })
                   // .catch((error) => {
                   //         console.error("Error adding document: ", error);
                   // });
            })
            .catch(err => {
                console.log(err.message)
            })

        // }
        // let url = config.baseUrl + 'booking/BookaRide';
        // let bodyFormdata = new FormData();
        //
        // bodyFormdata.append('up_bookingid', this.props.view_pending_booking.up_bookingid);
        // bodyFormdata.append('status', status);
        // let response = await axios.post(url , bodyFormdata);
        // let info = response.data;
        // console.log(info);
    }

    cancelBooking() {
        Alert.alert(
            'Cancel Booking',
            'Are you sure you want to cancel?',
            [
                {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Yes', onPress: () => this.updateDetails(2) },
            ],
            { cancelable: false },
        );
    }


    render() {
        console.log(this.props.dropoff_location)
        Moment.locale('en');
        const onBackPress = () => {
        };

        const renderLeftControl = () => (
            <BackAction onPress={() => { Actions.pop(); }} />
        );

        return (
            <View style={Styles.container}>

            <MapView ref={(map) => { this.mapView = map; }} style={Styles.map} showsMyLocationButton={true} followUserLocation={true} provider={PROVIDER_GOOGLE} initialRegion={this.props.get_location} showsUserLocation={true} zoomEnabled={true}
               mapType="standard"
            >
                <MapViewDirections
                   origin={this.props.pickup_location}
                   destination={this.props.dropoff_location}
                   optimizeWaypoints={true}
                   apikey={GOOGLE_API_KEY}
                   strokeWidth={6}
                   strokeColor="hotpink"
                   mode="DRIVING"
                />
                <Marker coordinate={this.props.dropoff_location}>
                    <Image source={require('../../images/pick-up-icon.png')} style={{ height: 35, width: 35 }} />
                </Marker>
                <Marker coordinate={this.props.pickup_location}>
                   <Image source={require('../../images/drop-off-icon.png')} style={{ height: 35, width: 35 }} />
                </Marker>
            </MapView>
                <TopNavigation
                    leftControl={renderLeftControl()}
                    title='Booking Details'
                    alignment='center'
                    style={Styles.header}
                    titleStyle={Styles.headerTitle}
                />
                <Layout
                    style={{
                        padding: 8,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Layout
                        style={Styles.BookingModal}>
                        <ScrollView>
                            <View style={Styles.BookingDetailsContainer}>
                                <View style={{ width: '100%', padding: 20 }}>
                                    <Text style={Styles.boldText} category='h4'>Your ride</Text>
                                    <View style={[Styles.BookingDetailsTitle, { width: '100%' }]}>
                                        <View style={{
                                            flexDirection: "row",
                                            alignItems: "center"
                                        }}>
                                            <Icons name='local-taxi' style={{ marginRight: 15 }} size={60} color='#b82601' />
                                            <Icons name='person' style={{ marginRight: 8 }} size={35} color='#a9a9a9' />
                                            <Text style={[Styles.boldText], { color: '#a9a9a9' }}>1-4</Text>
                                        </View>
                                        <View style={{
                                            flexDirection: "row", marginLeft: 'auto'
                                        }}>
                                            <Text style={[Styles.boldText, { color: '#a9a9a9' }]}>PRICE: </Text>
                                            <Text style={[Styles.boldText]} category='h4'>${this.props.book_a_ride.payment_amount}</Text>
                                        </View>
                                    </View>

                                    <View style={[Styles.BookingDetailsTitle, { paddingBottom: 0, width: '100%'}]}>
                                        {this.props.book_a_ride.type == 1 ?
                                            <Button status='basic' onPress={() => this.Book_Cash()} style={{ backgroundColor: '#eee', width:'50%', color: '#212121'}} icon={() => <View backgroundColor='#243c88' style={[Styles.Viewicons]}><Icon name='cash-multiple' style={{ paddingTop: 9, width: 'auto', height: 'auto' }} size={20} color='#fff' /></View>}>Cash</Button>
                                            :null}
                                        <Button status='basic' onPress={() => this.Book_Paypal()} style={{ backgroundColor: '#eee', color: '#212121', alignSelf: 'center', width: (this.props.book_a_ride.type) == 1 ? '50%':'100%' }} icon={() => <View backgroundColor='#ff3a4b' style={{height: 40,width: 40,alignItems: 'center',borderRadius: 50,marginRight: 10}}><Icon name='credit-card' style={{ paddingTop: 9, width: 'auto', height: 'auto' }} size={20} color='#fff' /></View>}>Credit Card</Button>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </Layout>
                </Layout>
            </View>
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
        get_location: state.get_location,
        book_a_ride: state.book_a_ride,
        user_credentials: state.user_credentials,
        view_pending_booking: state.view_pending_booking,
        isDateTimePickerVisible: state.isDateTimePickerVisible,
        isTimePickerVisible: state.isTimePickerVisible
    }
}
const mapActionToProps = dispatch => {
    return {
        handle_changes_with_parent: (action, parent_state, child_state, value) => dispatch({ type: action, parent_state: parent_state, child_state: child_state, value: value }),
        setModalVisible: (state) => dispatch({ type: 'MODAL_VISIBLE', state: state }),
    }
}
export default connect(mapStateToProps, mapActionToProps)(BookingPayment);

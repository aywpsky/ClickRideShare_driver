import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    SafeAreaView,
    Alert,
    Image,
    Animated,
    TouchableOpacity,
    BackHandler,
    Platform,
    Dimensions
} from 'react-native';
import {
    Text,
    TopNavigation,
    TopNavigationAction,
    Button,
    Layout,
    Avatar,
    Tooltip
} from 'react-native-ui-kitten';
import Geocoder from 'react-native-geocoder';
import Moment from 'moment';
import { connect } from 'react-redux';
import { showMessage } from "react-native-flash-message";
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import { Styles } from '../../styles/Styles.js';
import SimpleReactValidator from 'simple-react-validator';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import  firebase  from '../../firebase.js';
import config from '../../config';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');
var isHidden = true;
var tooltip_isvisible: true;
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

class Trip extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator({ autoForceUpdanpte: this });
        this.ref = firebase.firestore().collection('tbl_booking');
        this.driver = firebase.firestore().collection('tbl_drivers').doc('driverid_'+this.props.user_credentials.fk_user_id);

        this.tripInfo = this.tripInfo.bind(this);
        this.state = {
            bounceValue: new Animated.Value(780),
            current_driver_location: {
                latitude: 0,
                longitude: 0,
                speed: 0,
            },
            show_trip: [],
            currentTime: {}

        };


    }


    componentDidMount() {

      // setInterval( () => {
      //   var current_time = Moment().format('hh:mm A');
      //   var eta = Moment().add(2, 'm').format('hh:mm A');
      //   console.log('Current',current_time);
      //   console.log('Moment',eta);
      //   // console.log(this.state.currentTime);
      // },10000)
        this._toggleSubview();
        BackHandler.addEventListener('hardwareBackPress', this.backPress)
        this.get_pick_up_lat_lng(this.props.current_trip.tripInfo.pickup_loc);
        this.get_drop_off_lat_lng(this.props.current_trip.tripInfo.dropoff_loc);
        console.log(this.props);
        this.ref.doc('USER'+this.props.current_trip.tripInfo.fk_user_id).collection('booking_list').doc('BOOKINGID_'+this.props.current_trip.tripInfo.booking_id).onSnapshot(this.getStatus);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backPress)
    }

    getStatus = (doc) => {
        if (doc.exists === false) {
        }else{
            const{status, booking_id}  = doc.data();
            let set_booking_status = '';
            let status_to_update = '';
            switch (status) {
                case 2:
                    set_booking_status = 'On the Way';
                    status_to_update =  3;
                    break;
                case 3:
                    set_booking_status = 'PICKUP';
                    status_to_update = 4;
                    break;
                case 4:
                    set_booking_status = 'DROP-OFF';
                    status_to_update = 5;
                    break;
                default:

            }
            console.log(status_to_update);
            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'current_trip', 'set_status', set_booking_status);
            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'current_trip', 'updateStatus', status_to_update);
            console.log(status_to_update);
        }
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
            console.log('droop')
            console.log(res[0].position['lng'])
            console.log(res[0].position['lat'])
            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'dropoff_location', 'longitude', res[0].position['lng']);
            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'dropoff_location', 'latitude', res[0].position['lat']);
            // this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'book_a_ride', 'pickup_loc', current_add)
        })
            .catch(err => console.log(err))
    }
    backPress = () => true;


    _toggleSubview = () => {
        var toValue = 0;

        if (!isHidden) {
            toValue = Platform.OS === 'ios' ? 390 : 385;
        } else {
            toValue = Platform.OS === 'ios' ? 45 : 10;
        }

        Animated.spring(
            this.state.bounceValue,
            {
                toValue: toValue,
                velocity: 3,
                tension: 2,
                friction: 8,
            }
        ).start();

        isHidden = !isHidden;

    }

    updateBooking = async () => {
      console.log('statussssss', this.props.current_trip.updateStatus);
        console.log(this.props.current_trip.updateStatus);
        let url = config.baseUrl + 'booking/updateDetails';
        let bodyFormdata = new FormData();

        bodyFormdata.append('up_bookingid', this.props.current_trip.tripInfo.booking_id);
        bodyFormdata.append('status', this.props.current_trip.updateStatus);
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
                status:this.props.current_trip.updateStatus //update status for customer booking notification
            })

            if (this.props.current_trip.updateStatus == 5) {
                let setDriver = this.driver.update({
                    booking_id: '',
                    is_available: true,
                    status: 1
                });
                Actions.DropOffSuccess()
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

    tripInfo = async () => {
        const type = this.props.book_a_ride.type;
        console.log(type);
        if (type == 1) {

            // var toValue = 450;
            var toValue = 385;

            Animated.spring(
                this.state.bounceValue,
                {
                    toValue: toValue,
                    velocity: 3,
                    tension: 2,
                    friction: 8,
                }
            ).start();

            console.log(toValue)

        } else {
            this._toggleSubview()
        }
    }

    toggleTooltip = () => {
        tooltip_isvisible = !tooltip_isvisible;
    }

    eta = () => {
      setInterval( () => {
        var current_time = Moment().format('hh:mm A');
        var eta = Moment().add(2, 'm').format('hh:mm A');
        console.log('Current',current_time);
        console.log('Moment',eta);
        // console.log(this.state.currentTime);
      },10000)
    }


    render() {
        Moment.locale('en');
        return (
            <SafeAreaView style={Styles.container}>
                <MapView ref={(map) => { this.mapView = map; }} style={Styles.map} showsMyLocationButton={true} followUserLocation={true} provider={PROVIDER_GOOGLE} initialRegion={this.props.get_location} showsUserLocation={true} zoomEnabled={true} mapType="standard"
                >
                    <MapViewDirections
                        origin={this.props.current_trip.tripInfo.pickup_loc}
                        destination={this.props.current_trip.tripInfo.dropoff_loc}
                        optimizeWaypoints={true}
                        apikey={GOOGLE_API_KEY}
                        strokeWidth={6}
                        strokeColor="hotpink"
                        mode="DRIVING"
                        onReady={result => {
                          let distance = (result.distance).toFixed(2);
                          let duration = (result.duration).toFixed(0);
                          this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'current_trip', 'distance', distance);
                          this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'current_trip', 'duration', duration);

                          this.mapView.fitToCoordinates(result.coordinates, {
                            edgePadding: {
                              right: (width / 20),
                              bottom: (height / 20),
                              left: (width / 20),
                              top: (height / 20),
                            }
                          });
                        }}
                    />
                    <Marker coordinate={this.props.dropoff_location}>
                        <Image source={require('../../images/pick-up-icon.png')} style={{ height: 35, width: 35 }} />
                    </Marker>
                    <Marker coordinate={this.props.pickup_location}>
                        <Image source={require('../../images/drop-off-icon.png')} style={{ height: 35, width: 35 }} />
                    </Marker>
                </MapView>
                <TopNavigation
                    alignment='center'
                    title='Current Trip'
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
                        style={[Styles.BookingModal, { margin: 0, padding: 0 }]}>
                        <ScrollView>
                            <View style={[Styles.BookingDetailsContainer, { paddingBottom: 0 }]}>
                                <View style={{ width: '100%' }}>
                                    <View style={[Styles.BookaRideheader, { textAlign: 'center', alignItems: 'center', height: 'auto', padding: 15 }]}>
                                        <Avatar
                                            style={Styles.sendFeedbackImage}
                                            size='giant'
                                            source={{ uri: 'https://www.clickitnride.com/admin/images/' + this.props.current_trip.tripInfo.profile_pic }}
                                        />
                                        <Text style={{color: '#b1c3fe'}}> PICK UP AT </Text>
                                        <Text style={[Styles.boldText, { color: '#fff', textAlign:'center' }]}>{this.props.current_trip.tripInfo.pickup_loc}</Text>
                                    </View>
                                    <View style={[Styles.BookingDetailsTitle, { padding: 10 }]}>
                                        <View style={{
                                            flexDirection: "row",
                                            justifyContent: 'space-between',
                                            paddingHorizontal: 15
                                        }}>
                                            <View style={{paddingHorizontal:10, alignItems: 'center', justifyContent: 'center'}}>
                                                <Layout style={[Styles.driverTripDetails]}>
                                                    <Text style={Styles.badgeText}>EST</Text>
                                                </Layout>
                                                <Text>{this.props.current_trip.duration}  min</Text>
                                            </View>
                                            <View style={{paddingHorizontal:10, alignItems: 'center', justifyContent: 'center'}}>
                                                <Layout style={[Styles.driverTripDetails]}>
                                                    <Text style={Styles.badgeText}>DISTANCE</Text>
                                                </Layout>
                                                <Text>{this.props.current_trip.distance} km</Text>
                                            </View>
                                            <View style={{paddingHorizontal:10, alignItems: 'center', justifyContent: 'center'}}>
                                                <Layout style={[Styles.driverTripDetails]}>
                                                    <Text style={Styles.badgeText}>ARRIVAL</Text>
                                                </Layout>
                                                <Text>10:00 AM</Text>
                                            </View>
                                            <View style={{paddingHorizontal:10, alignItems: 'center', justifyContent: 'center'}}>
                                                <Layout style={[Styles.driverTripDetails]}>
                                                    <Text style={Styles.badgeText}>FARE</Text>
                                                </Layout>
                                                <Text>${this.props.current_trip.tripInfo.amount}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={[Styles.BookingDetailsTitle, {textAlign: 'center', alignSelf:'center', alignItems: 'center', justifyContent: 'center'}]}>
                                        <Button status='danger' style={{ shadowRadius: 15, borderRadius: 30, alignSelf: 'center', width: '50%' }} onPress={this.updateBooking}>{this.props.current_trip.set_status}</Button>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </Layout>
                    </Layout>

            </SafeAreaView>
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
        get_location: state.get_location,
        dropoff_location: state.dropoff_location,
        pickup_location: state.pickup_location,
        user_credentials: state.user_credentials,
        current_trip: state.current_trip,
    }
}
const mapActionToProps = dispatch => {
    return {
        handle_changes_with_parent: (action, parent_state, child_state, value) => dispatch({ type: action, parent_state: parent_state, child_state: child_state, value: value }),
        handle_changes: (state, value) => dispatch({ type: 'HANDLE_CHANGE', state: state, value: value }),
        setModalVisible: (state) => dispatch({ type: 'MODAL_VISIBLE', state: state }),
    }
}
export default connect(mapStateToProps, mapActionToProps)(Trip);

import { connect } from 'react-redux';
import React from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { Alert, View, Image, Animated, TextInput, TouchableOpacity, ScrollView, Keyboard, PermissionsAndroid, Dimensions, SafeAreaView, Platform } from 'react-native';
import { Text, Button, TopNavigation, TopNavigationAction, Toggle, List, ListItem, Spinner } from 'react-native-ui-kitten';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder';
import { Styles } from '../../styles/Styles.js';
import firebase from '../../firebase.js';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from "react-native-modal-datetime-picker";
import Moment from 'moment';
import { Actions } from 'react-native-router-flux';
import config from '../../config';
import axios from 'axios';
import MapViewDirections from 'react-native-maps-directions';
const geolib = require('geolib');
const GOOGLE_API_KEY = 'AIzaSyBrwXxi22bC6f3MO89edmVieTIoIQJrnew';
const CONTAINER_HEIGHT = Math.round(Dimensions.get('window').height);
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const delta_latitude = 0.059;
const delta_longitude = delta_latitude * ASPECT_RATIO;

var isHidden = true;
// var current_address0 = '';

const BackIcon = (style) => (
   <Icon name='arrow-back' size={23} color='#ffff' />
);

const BackAction = (props) => (
   <TopNavigationAction {...props} style={Styles.text} icon={BackIcon} />
);



class Booking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            empty: false,
        }
    }

   getHistory = async (val, search) => {
       this.setState({loading:true})
       let url = config.baseUrl + 'booking/driverScheduledBooking';
       let bodyFormdata = new FormData();
       bodyFormdata.append('userid', this.props.user_credentials.fk_user_id);
       bodyFormdata.append('search', search);
       bodyFormdata.append('next', val);

       let response = await axios.post(url, bodyFormdata);
       let info = response.data;
       console.log(info);
       if (info.status == 'success') {
           let pendingbookings = [];
           info.data.map((data) => {
               var date = data.date;
               var formatted_date = Moment(date, "YYYY-MM-DD").calendar(null, {
                   sameDay: '[Today]',
                   nextDay: '[Tomorrow]',
                   nextWeek: 'MMMM DD, YYYY — dddd',
                   sameElse: 'MMMM DD, YYYY — dddd'
               });
               let x = {
                   bookingid: data.booking_id,
                   dropoff_loc: data.dropoff_loc,
                   pickup_loc: data.pickup_loc,
                   date: formatted_date,
                   time: data.time,
                   booking_status: data.booking_status,
                   first_name: data.first_name,
                   last_name: data.last_name,
                   profile_pic: data.profile_pic,
                   payment_type: data.payment_type,
                   amount: data.amount
               };
               pendingbookings.push(x);
               console.log(x);
           });
           this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_pending_booking', 'Pending', pendingbookings);
           this.setState({loading:false})
       } else {
           this.setState({loading:false})
           this.setState({empty:true})
           this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_pending_booking', 'Pending', '');
       }
   }

   componentDidMount() {
       this.getHistory(this.props.view_pending_booking.per_page, this.props.view_pending_booking.Searchdata);
       console.log('componentDidMountcomponentDidMountcomponentDidMountcomponentDidMountcomponentDidMount');
   }

   onSelect = (selectedIndex) => {
       this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_pending_booking', 'selectedIndex', selectedIndex)
   };

   nextPage = () => {
       let next = this.props.view_pending_booking.per_page + 10;
       this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_pending_booking', 'per_page', next)

       this.getHistory(next, this.props.view_pending_booking.Searchdata);
   }
   viewBookingDetails = (booking_id) => {
      let thisself = this;
       this.setState({loading:true})

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
               var proceedToView = function(){
                 thisself.setState({loading:false})
                  Actions.ViewPendingBooking()
                };
               setTimeout(proceedToView, 1000)
           }
       })
       .catch(error => {
         console.log(error.message);
       })
   };

   renderItemAccessory = (item) => (
       <View>
           <Button style={{ backgroundColor: '#243c88', borderColor: '#243c88' }} size='tiny' onPress={() => this.viewBookingDetails(item.bookingid)}>View Details</Button>
       </View>
   );

   renderItemPending = ({ item, index }) => (
       <ListItem
           style={Styles.items}
           title={`${item.dropoff_loc}`}
           description={`${item.date}`}
           titleStyle={Styles.listItemTitle}
           descriptionStyle={Styles.listItemDescComp}
           icon={() =>
               <Icon name="local-taxi" size={40} color="#243c88" />
           }
           accessory={() => this.renderItemAccessory(item)}
           onPress={() => this.viewBookingDetails(item)}
       />
   );



   ShowHideSearch = () => {
       if (this.props.view_pending_booking.search == true) {
           this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_pending_booking', 'search', false)
       } else {
           this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_pending_booking', 'search', true)
       }
   };

   SearchFunction = (value) => {
       this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_pending_booking', 'Searchdata', value)
       this.getHistory(this.props.view_pending_booking.per_page, value)
   }

   render() {
      const renderLeftControl = () => (
         <BackAction onPress={() => { Actions.replace('Dashboard') }} />
      );

      return (
         <SafeAreaView style={Styles.container}>

            <TopNavigation leftControl={renderLeftControl()} title='Bookings' alignment='center' style={Styles.header} titleStyle={Styles.headerTitle} />
            {this.state.loading == true ? <View style={{alignItems: 'center',height: '100%', justifyContent: 'center', zIndex: 1}}><Spinner/><Text style={{color: '#333'}}>Please wait...</Text></View>:null}

            {this.props.view_pending_booking.search ? (<Input style={Styles.search}
                placeholder='Search Pending Booking...'
                size='small'
                value={this.props.view_pending_booking.Searchdata}
                onChangeText={this.SearchFunction}
                clearButtonMode='while-editing'
            />) : null}

            <View style={Styles.listContainer}>
                {this.state.empty == true ?
                  <Text style={[Styles.center, {justifyContent: 'center',}]}>No data found.</Text>
                :
                  <List
                      style={Styles.tablist}
                      data={this.props.view_pending_booking.Pending}
                      renderItem={this.renderItemPending}
                      onEndReached={this.nextPage}
                  />
                }

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
   }
}
const mapActionToProps = dispatch => {
   return {
      handle_changes_with_parent: (action, parent_state, child_state, value) => dispatch({ type: action, parent_state: parent_state, child_state: child_state, value: value }),
      handle_changes: (state, value) => dispatch({ type: 'HANDLE_CHANGE', state: state, value: value }),
      setModalVisible: (state) => dispatch({ type: 'MODAL_VISIBLE', state: state }),
   }
}
export default connect(mapStateToProps, mapActionToProps)(Booking);

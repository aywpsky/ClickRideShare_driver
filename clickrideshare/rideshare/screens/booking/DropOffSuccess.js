import React, { } from 'react';
import {
   View,
   Keyboard,
} from 'react-native';
import {
   Text,
   Button,
} from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Styles } from '../../styles/Styles.js';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SimpleReactValidator from 'simple-react-validator';
import Moment from 'moment';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icons from 'react-native-vector-icons/MaterialIcons';

const GooglePlacesInput = () => {
   return (
      <GooglePlacesAutocomplete
         placeholder='Im from ...'
         minLength={2} // minimum length of text to search
         autoFocus={false}
         returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
         keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
         listViewDisplayed='auto'    // true/false/undefined
         fetchDetails={true}
         renderDescription={row => row.description} // custom description render
         onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            console.log(data, details);
         }}
         getDefaultValue={() => ''}
         query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: 'AIzaSyBrwXxi22bC6f3MO89edmVieTIoIQJrnew',
            language: 'en', // language of the results
            types: 'geocode' // default: 'geocode'
         }}
         styles={{
            textInputContainer: {

               width: '100%',
               backgroundColor: 'transparent',
               borderTopColor: 'transparent',
            },
            description: {
               fontWeight: 'bold',
            },
            predefinedPlacesDescription: {
               color: '#1faadb',
            }
         }}
         currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
         currentLocationLabel="Current location"
         nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
         GoogleReverseGeocodingQuery={{
         }}
         GooglePlacesSearchQuery={{
            rankby: 'distance',
         }}
         GooglePlacesDetailsQuery={{
            // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
            fields: 'formatted_address',
         }}
         filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
         debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
      />

   );

}
const GooglePlacesInput2 = () => {
   return (
      <GooglePlacesAutocomplete
         placeholder='Im going to ...'
         minLength={2} // minimum length of text to search
         autoFocus={false}
         returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
         // keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
         listViewDisplayed='auto'    // true/false/undefined
         fetchDetails={true}
         renderDescription={row => row.description} // custom description render
         onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            console.log(data, details);
         }}
         getDefaultValue={() => ''}
         query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: 'AIzaSyBrwXxi22bC6f3MO89edmVieTIoIQJrnew',
            language: 'en', // language of the results
            types: 'geocode' // default: 'geocode'
         }}
         styles={{
            textInputContainer: {

               width: '100%',
               backgroundColor: 'transparent',
               borderTopColor: 'transparent',
            },
            description: {
               fontWeight: 'bold',
               backgroundColor: 'red',
               zIndex: 9999999,
            },
            predefinedPlacesDescription: {
               color: '#1faadb',
               backgroundColor: 'transparent'
            }
         }}
         currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
         currentLocationLabel="Current location"
         nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
         GoogleReverseGeocodingQuery={{
         }}
         GooglePlacesSearchQuery={{
            rankby: 'distance',
         }}
         GooglePlacesDetailsQuery={{
            // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
            fields: 'formatted_address',
         }}
         filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
         debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
      />

   );
}

class DropOffSuccess extends React.Component {
   constructor(props) {
      super(props)
      this.validator = new SimpleReactValidator({ autoForceUpdanpte: this });
   }

   ProceedToPayment() {
      this.validator.hideMessages();
      this.forceUpdate();
      if (this.validator.allValid()) {
         //1 - Book a Ride, 2 - Book Now
         this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'book_a_ride', 'type', 2)
         Actions.BookingPayment()
      } else {
         this.validator.showMessages();
         this.forceUpdate();
      }

   }
   backToDashboard = () => {
       Actions.Dashboard()
   }

   render() {
      return (
         <View style={[Styles.container, Styles.header, {alignItems: 'center', justifyContent: 'center'}]}>
             <View backgroundColor='#fff' style={[Styles.Viewicons, {height: 100, width: 100,}]}>
                <Icons name='check' size={80} backgroundColor='#fff' color='rgb(36, 60, 136)' style={Styles.icons} />
             </View>
             <Text category='h5' style={{color:'#fff'}}>Drop Off Successful</Text>
             <View style={{position: 'absolute', bottom: 30}}>
                 <Button status='danger' style={{ shadowRadius: 15, borderRadius: 30, textAlign: 'center', paddingHorizontal:50}} onPress={() => this.backToDashboard()}>Continue</Button>
             </View>
         </View>
      );
   }
}

const mapStateToProps = state => {
   return {
      book_a_ride: state.book_a_ride,
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
export default connect(mapStateToProps, mapActionToProps)(DropOffSuccess);

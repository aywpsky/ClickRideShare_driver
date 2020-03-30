import { connect } from 'react-redux';
import React from 'react';
import { View, StyleSheet, Animated, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Button, TopNavigation, TopNavigationAction, Toggle } from 'react-native-ui-kitten';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Styles } from '../styles/Styles.js';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from "react-native-modal-datetime-picker";


var isHidden = true;

const styles = StyleSheet.create({
   container: {

   },
   map: {
      ...StyleSheet.absoluteFillObject,
      flex: 1,
      zIndex: -1,
   },
});

const GooglePlacesInput = () => {
   return (
      <GooglePlacesAutocomplete
         placeholder='Search'
         minLength={2}
         autoFocus={false}
         returnKeyType={'search'}
         keyboardAppearance={'light'}
         listViewDisplayed='auto'
         fetchDetails={true}
         renderDescription={row => row.description}
         onPress={(data, details = null) => {
            console.log(data, details);
         }}
         getDefaultValue={() => ''}
         query={{

            key: 'AIzaSyBrwXxi22bC6f3MO89edmVieTIoIQJrnew',
            language: 'en',
            types: 'geocode'
         }}
         styles={{
            textInputContainer: {
               width: '100%',
            },
            description: {
               fontWeight: 'bold'
            },
            predefinedPlacesDescription: {
               color: '#1faadb'
            }
         }}
         currentLocation={false}
         currentLocationLabel="Current location"
         nearbyPlacesAPI='GooglePlacesSearch'
         GoogleReverseGeocodingQuery={{
         }}
         GooglePlacesSearchQuery={{
            rankby: 'distance',
         }}
         GooglePlacesDetailsQuery={{
            fields: 'formatted_address',
         }}
         filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
         debounce={200}
      />

   );
}

const BackIcon = (style) => (
   <Icon name='arrow-back' size={23} color='#ffff' />
);

const BackAction = (props) => (
   <TopNavigationAction {...props} style={Styles.text} icon={BackIcon} />
);

class Myscreen extends React.Component {

   constructor(props) {
      super(props);
      this.state = {
         bounceValue: new Animated.Value(490),
      };
   }


   _toggleSubview(start) {
      var toValue = 130;

      if (start == 1) {
         if (!isHidden) {
            toValue = 490;
         }
      } else if (start == 0) {
         if (!this.props.toggleStatusBookLater) {
            toValue = 0;
         }
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
      if (start == 1) {
         this.props.setModalVisible('toggleStatus')
      } else {
         this.props.setModalVisible('toggleStatusBookLater')

      }
   }



   render() {

      const renderLeftControl = () => (
         <BackAction onPress={() => { Actions.pop(); }} />
      );

      return (
         <View style={Styles.container}>

            <TopNavigation leftControl={renderLeftControl()} title='Booking Details' alignment='center' style={Styles.header} titleStyle={Styles.headerTitle} />

            <MapView
               provider={PROVIDER_GOOGLE}
               style={styles.map}
               region={{
                  latitude: 37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
               }}
            >
            </MapView>

            <Animated.View style={[styles2.subView, { transform: [{ translateY: this.state.bounceValue }] }]} >

               <View style={Styles.BookaRideheader} >
                  <TouchableOpacity onPress={() => this._toggleSubview(1)}>
                     <View style={{ marginVertical: 10, width: '30%', alignSelf: 'center', borderBottomColor: '#eaebec', borderBottomWidth: 3 }} />
                     <Text style={Styles.BookaRideheaderText}> Where are you going? </Text>
                  </TouchableOpacity>
               </View>

               <ScrollView>

                  <View style={{ marginTop: 20, flexDirection: 'row' }}>


                     <View style={{ marginHorizontal: 20, marginTop: 30 }}>
                        <Icon name={'my-location'} size={20} color={'#ff3a4b'} />

                        <View style={{ marginVertical: 10, marginLeft: 10, height: 75, width: 1, backgroundColor: "#eaebec" }} />

                        <Icon name={'pin-drop'} size={20} color={'#243c88'} />
                     </View>


                     <View style={{ width: '80%' }}>

                        <View style={{ marginBottom: 50 }}>
                           <Text style={Styles.BookaRideText1}>PICKUP</Text>
                           <View>
                              <View style={{ position: 'absolute', width: '100%', backgroundColor: '#fff' }}>
                                 {GooglePlacesInput()}
                              </View>
                           </View>
                        </View>

                        <View style={{ marginVertical: 20, borderBottomColor: '#eaebec', borderBottomWidth: 1, zIndex: -1, }} />

                        <View style={{ position: 'relative' }}>
                           <Text style={Styles.BookaRideText2}>DROP-OFF</Text>
                           <View>
                              <View style={{ position: 'absolute', width: '100%', backgroundColor: '#fff', zIndex: -1, }}>
                                 {GooglePlacesInput()}
                              </View>
                           </View>
                        </View>

                     </View>


                  </View>

                  <View style={{ marginTop: 40, alignItems: 'flex-start', marginLeft: 20, zIndex: -2, }}>
                     <Toggle text={`Book a Ride`} checked={this.props.toggleStatusBookLater} style={{ zIndex: -2, }} onChange={() => { this._toggleSubview(0) }} />
                  </View>


                  {this.props.toggleStatusBookLater === true ?

                     <View style={Styles.BookaRideDetailsContent}>
                        <View style={Styles.BookaRideFlex}>
                           <View style={Styles.BookaRideCol}>
                              <Text style={Styles.BookaRideText}> NAME </Text>
                              <TextInput
                                 style={Styles.BookaRidePlaceholderTextSize}
                                 value={this.props.book_a_ride.name}
                                 size='small'
                                 onChangeText={value => this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'book_a_ride', 'name', value)}

                              />
                           </View>
                           <View style={Styles.BookaRideCol}>
                              <Text style={Styles.BookaRideText}> EMAIL ADDRESS </Text>
                              <TextInput
                                 style={Styles.BookaRidePlaceholderTextSize}
                                 value={this.props.book_a_ride.email_address}
                                 size='small'
                                 onChangeText={value => this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'book_a_ride', 'email_address', value)}

                              />
                           </View>
                        </View>
                        <View style={Styles.BookaRideCol1}>
                           <Text style={Styles.BookaRideText}> PHONE NUMBER </Text>
                           <TextInput
                              style={Styles.BookaRidePlaceholderTextSize}
                              value={this.props.book_a_ride.phone_number}
                              size='small'
                              onChangeText={value => this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'book_a_ride', 'phone_number', value)}
                           />
                        </View>
                        <View style={Styles.BookaRideFlex}>
                           <View style={Styles.BookaRideCol}>
                              <Text style={Styles.BookaRideText}> PICKUP DATE </Text>
                              <TouchableOpacity onPress={() => this.props.setModalVisible('isDateTimePickerVisible')}>
                                 <TextInput
                                    onTouchStart={this.handleModal}
                                    editable={false}
                                    style={Styles.BookaRidePlaceholderTextSize}
                                    value={this.props.book_a_ride.pickup_date}
                                    size='small'

                                 />
                              </TouchableOpacity>
                           </View>
                           <View style={Styles.BookaRideCol}>
                              <Text style={Styles.BookaRideText}> PICKUP TIME </Text>
                              <TouchableOpacity onPress={() => this.props.setModalVisible('isTimePickerVisible')}>
                                 <TextInput
                                    style={Styles.BookaRidePlaceholderTextSize}
                                    editable={false}
                                    value={this.props.book_a_ride.pickup_time}
                                    size='small'

                                 />
                              </TouchableOpacity>
                           </View>
                        </View>
                        <View>
                           <DateTimePicker
                              isVisible={this.props.isDateTimePickerVisible}
                              onConfirm={this.handleDatePicked}
                              onCancel={() => this.props.setModalVisible('isDateTimePickerVisible')}
                           />

                           <DateTimePicker
                              mode='time'
                              isVisible={this.props.isTimePickerVisible}
                              onConfirm={this.handleTimePicked}
                              is24Hour={false}
                              onCancel={() => this.props.setModalVisible('isTimePickerVisible')}
                           />
                        </View>
                     </View>

                     : <View></View>}

                  <View style={Styles.BookaRideButtonSubmit}>
                     <Button style={Styles.BookaRideSubmit} status='danger' onPress={() => this.ProceedToPayment()}>BOOKING PAYMENT</Button>
                  </View>
               </ScrollView>
            </Animated.View>



         </View>
      );
   }
}

const mapStateToProps = state => {
   return {
      book_a_ride: state.book_a_ride,
      isDateTimePickerVisible: state.isDateTimePickerVisible,
      isTimePickerVisible: state.isTimePickerVisible,
      toggleStatus: state.toggleStatus,
      toggleStatusBookLater: state.toggleStatusBookLater
   }
}
const mapActionToProps = dispatch => {
   return {
      handle_changes_with_parent: (action, parent_state, child_state, value) => dispatch({ type: action, parent_state: parent_state, child_state: child_state, value: value }),
      setModalVisible: (state) => dispatch({ type: 'MODAL_VISIBLE', state: state }),
   }
}
var styles2 = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
      marginTop: 66
   },
   button: {
      marginTop: 20,
      padding: 8,
      zIndex: 9999,
   },
   buttonText: {
      fontSize: 17,
      color: "#007AFF"
   },
   subView: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "#FFFFFF",
      height: '90%',
   }
});
export default connect(mapStateToProps, mapActionToProps)(Myscreen);

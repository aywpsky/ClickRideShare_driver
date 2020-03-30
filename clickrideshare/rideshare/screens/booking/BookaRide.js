import React, { } from 'react';
import {
   View,
   TouchableOpacity,
   TextInput,
   Keyboard
} from 'react-native';
import {
   Text,
   Button,
} from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Styles } from '../../styles/Styles.js';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Input } from 'react-native-elements';
import SimpleReactValidator from 'simple-react-validator';
import DateTimePicker from "react-native-modal-datetime-picker";
import Moment from 'moment';

class BookaRide extends React.Component {
   constructor(props) {
      super(props)
      this.validator = new SimpleReactValidator({ autoForceUpdate: this });
      this.ProceedToPayment = this.ProceedToPayment.bind(this);
   }

   ProceedToPayment = () => {
      this.validator.hideMessages();
      this.forceUpdate();
      if (this.validator.allValid()) {
         //1 - Book a Ride, 2 - Book Now
         this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'book_a_ride', 'type', 1)
         Actions.BookingPayment();
      } else {
         this.validator.showMessages();
         this.forceUpdate();
      }
   }

   handleDatePicked = date => {
      Keyboard.dismiss();
      Moment.locale('en');
      this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'book_a_ride', 'pickup_date', Moment(date).format('YYYY-MM-DD'))
      this.props.setModalVisible('isDateTimePickerVisible')
   };

   handleTimePicked = time => {
      Keyboard.dismiss();
      console.log(Moment(time).format('hh:mm A'));
      this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'book_a_ride', 'pickup_time', Moment(time).format('hh:mm A'))
      this.props.setModalVisible('isTimePickerVisible')
   };

   // handleModal = () => {
   //    console.log('test');
   //    Keyboard.dismiss();
   //    this.props.setModalVisible('isDateTimePickerVisible')
   // };

   render() {
      return (
         <View style={Styles.container}>
            <View style={Styles.BookaRidelocation}>
               <View style={Styles.BookaRideContents}>
                  <View style={Styles.BookaRideIcons}>
                     <Icon name={'my-location'} size={20} color={'#ff3a4b'} />

                     <View
                        style={{
                           marginVertical: 10,
                           marginLeft: 10,
                           height: 75,
                           width: 1,
                           backgroundColor: "#eaebec"
                        }}
                     />

                     <Icon name={'pin-drop'} size={20} color={'#243c88'} />
                  </View>
                  <View style={Styles.BookaRideInputs}>
                     <Text style={Styles.BookaRideText1}>PICKUP</Text>
                     <Input
                        style={Styles.BookaRideInput}
                        size='small'
                        placeholder='Im from...'
                        onChangeText={value => this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'book_a_ride', 'pickup_loc', value)}

                     />
                     <Text style={Styles.error}>{this.validator.message('pickup_location', this.props.book_a_ride.pickup_loc, 'required')}</Text>
                     <View
                        style={{
                           marginVertical: 20,
                           borderBottomColor: '#eaebec',
                           borderBottomWidth: 1,
                        }}
                     />

                     <Text style={Styles.BookaRideText1}>DROP-OFF</Text>
                     <Input
                        size='small'
                        placeholder='Im going to...'
                        onChangeText={value => this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'book_a_ride', 'dropoff_loc', value)}

                     />
                     <Text style={Styles.error}>{this.validator.message('dropoff_location', this.props.book_a_ride.dropoff_loc, 'required')}</Text>
                  </View>
               </View>
            </View>
            <View style={Styles.BookaRideDetailsContent}>
               <View>
                  <Text style={Styles.BookaRideDetailsText}> Book a ride </Text>
               </View>
               <View style={Styles.BookaRideFlex}>
                  <View style={Styles.BookaRideCol}>
                     <Text style={Styles.BookaRideText}> NAME </Text>
                     <TextInput
                        style={Styles.BookaRidePlaceholderTextSize}
                        value={this.props.user_credentials.first_name}
                        size='small'
                     />
                     <Text style={Styles.error}>{this.validator.message('name', this.props.user_credentials.first_name, 'required')}</Text>
                  </View>
                  <View style={Styles.BookaRideCol}>
                     <Text style={Styles.BookaRideText}> EMAIL ADDRESS </Text>
                     <TextInput
                        style={Styles.BookaRidePlaceholderTextSize}
                        value={this.props.user_credentials.email}
                        size='small'
                        onChangeText={value => this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'book_a_ride', 'email_address', value)}

                     />
                     <Text style={Styles.error}>{this.validator.message('email_address', this.props.user_credentials.email, 'required|email')}</Text>
                  </View>
               </View>
               <View style={Styles.BookaRideCol1}>
                  <Text style={Styles.BookaRideText}> PHONE NUMBER </Text>
                  <TextInput
                     style={Styles.BookaRidePlaceholderTextSize}
                     value={this.props.user_credentials.phone_number}
                     size='small'
                     onChangeText={value => this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'book_a_ride', 'phone_number', value)}
                  />
                  <Text style={Styles.error}>{this.validator.message('phone_number', this.props.user_credentials.phone_number, 'required|phone')}</Text>
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
                     <Text style={Styles.error}>{this.validator.message('pickup_date', this.props.book_a_ride.pickup_date, 'required')}</Text>
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
                     <Text style={Styles.error}>{this.validator.message('pickup_time', this.props.book_a_ride.pickup_time, 'required')}</Text>
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
                  <Button style={Styles.BookaRideSubmit} status='danger' onPress={this.ProceedToPayment}>BOOKING PAYMENT</Button>
               </View>
            </View>
            <View style={Styles.BookaRideDetailsContent}>
               <View>
                  <Text style={Styles.BookaRideDetailsText}> Book a ride </Text>
               </View>
               <View style={Styles.BookaRideFlex}>
                  <View style={Styles.BookaRideCol}>
                     <Text style={Styles.BookaRideText}> NAME </Text>
                     <TextInput
                        style={Styles.BookaRidePlaceholderTextSize}
                        value={this.props.book_a_ride.name}
                        size='small'
                        onChangeText={value => this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'book_a_ride', 'name', value)}

                     />
                     <Text style={Styles.error}>{this.validator.message('name', this.props.book_a_ride.name, 'required')}</Text>
                  </View>
                  <View style={Styles.BookaRideCol}>
                     <Text style={Styles.BookaRideText}> EMAIL ADDRESS </Text>
                     <TextInput
                        style={Styles.BookaRidePlaceholderTextSize}
                        value={this.props.book_a_ride.email_address}
                        size='small'
                        onChangeText={value => this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'book_a_ride', 'email_address', value)}

                     />
                     <Text style={Styles.error}>{this.validator.message('email_address', this.props.book_a_ride.email_address, 'required|email')}</Text>
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
                  <Text style={Styles.error}>{this.validator.message('phone_number', this.props.book_a_ride.phone_number, 'required|phone')}</Text>
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
                     <Text style={Styles.error}>{this.validator.message('pickup_date', this.props.book_a_ride.pickup_date, 'required')}</Text>
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
                     <Text style={Styles.error}>{this.validator.message('pickup_time', this.props.book_a_ride.pickup_time, 'required')}</Text>
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
                  <Button style={Styles.BookaRideSubmit} status='danger' onPress={() => this.ProceedToPayment()}>BOOKING PAYMENT</Button>
               </View>
            </View>
         </View>
      );
   }
}

const mapStateToProps = state => {
   return {
      book_a_ride: state.book_a_ride,
      isDateTimePickerVisible: state.isDateTimePickerVisible,
      isTimePickerVisible: state.isTimePickerVisible,
      user_credentials: state.user_credentials,
   }
}
const mapActionToProps = dispatch => {
   return {
      handle_changes_with_parent: (action, parent_state, child_state, value) => dispatch({ type: action, parent_state: parent_state, child_state: child_state, value: value }),
      setModalVisible: (state) => dispatch({ type: 'MODAL_VISIBLE', state: state }),
   }
}
export default connect(mapStateToProps, mapActionToProps)(BookaRide);

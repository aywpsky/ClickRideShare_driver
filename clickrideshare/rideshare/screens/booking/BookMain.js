import React, { } from 'react';
import {
   StyleSheet,
   View,
   ScrollView,
   Animated,
   TouchableHighlight
} from 'react-native';
import {
   Text,
   TopNavigation,
   TopNavigationAction,
   Tab,
   TabView,
} from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Styles } from '../../styles/Styles.js';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BookaRide from './BookaRide';


import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } } };

var isHidden = true;

const styles = StyleSheet.create({
   container: {

   },
});

const BackIcon = (style) => (
   <Icon name='arrow-back' size={23} color='#ffff' />
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


class BookMain extends React.Component {
   constructor(props) {
      super(props)
      this.state = {
         bounceValue: new Animated.Value(450),  //This is the initial position of the subview
      };
   }
   _toggleSubview() {
      var toValue = 450;

      if (isHidden) {
         toValue = 0;
      }

      //This will animate the transalteY of the subview between 0 & 100 depending on its current state
      //100 comes from the style below, which is the height of the subview.
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

   onSelect = (selectedIndex) => {
      this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_trip_history', 'selectedIndex', selectedIndex)
   };


   render() {

      const renderLeftControl = () => (
         <BackAction onPress={() => { Actions.pop(); }} />
      );


      return (
         <View style={Styles.container}>
            <TopNavigation
               leftControl={renderLeftControl()}
               title='Booking Details'
               alignment='center'
               style={Styles.header}
               titleStyle={Styles.headerTitle}
            />
            <ScrollView>
               <Animated.View style={[Styles.BookaRidecontainer, { transform: [{ translateY: this.state.bounceValue }] }]}>
                  <View style={Styles.BookaRideheader} >
                     <TouchableHighlight onPress={() => { this._toggleSubview() }}>
                        <Text style={Styles.BookaRideheaderText}> Where are you going? </Text>
                     </TouchableHighlight>
                  </View>
                  <TabView
                     selectedIndex={this.props.view_trip_history.selectedIndex}
                     onSelect={this.onSelect}
                     style={Styles.tabView}
                     tabBarStyle={Styles.tabBar}
                     indicatorStyle={Styles.tabViewIndicator}
                  >
                     <Tab title='Ride Now' titleStyle={this.props.view_trip_history.selectedIndex === -0 ? Styles.tabTitleSelected : ''}>


                     </Tab>
                     <Tab title='Book a Ride' titleStyle={this.props.view_trip_history.selectedIndex === 1 ? Styles.tabTitleSelected : ''} >
                        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                           <BookaRide />
                        </ScrollView>
                     </Tab>
                  </TabView>
               </Animated.View>
            </ScrollView>
            <MapView
               provider={PROVIDER_GOOGLE} // remove if not using Google Maps
               style={Styles.map}
               region={{
                  latitude: 37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
               }}
            >
            </MapView>
            <View style={Styles.footer}>
               <Text style={Styles.footerCenter}>All rights reserved 2019</Text>
            </View>
         </View>
      );
   }
}

const mapStateToProps = state => {
   return {
      view_trip_history: state.view_trip_history
   }
}
const mapActionToProps = dispatch => {
   return {
      handle_changes_with_parent: (action, parent_state, child_state, value) => dispatch({ type: action, parent_state: parent_state, child_state: child_state, value: value })
   }
}
export default connect(mapStateToProps, mapActionToProps)(BookMain);

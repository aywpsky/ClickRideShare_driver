import React, { Component } from 'react';
import { Icon, Layout, Text, Drawer, DrawerHeaderFooter } from 'react-native-ui-kitten';
import { Styles } from '../styles/Styles.js';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

const PersonIcon = (style) => (
  <Icon {...style} name='person' />
);

const CarIcon = (style) => (
  <Icon {...style} name='car-outline' />
);

const NotifyIcon = (style) => (
  <Icon {...style} name='bell-outline' />
);

const HistoryIcon = (style) => (
  <Icon {...style} name='clock-outline' />
);

const PinnedIcon = (style) => (
  <Icon {...style} name='pin-outline' />
);

const LogoutIcon = (style) => (
  <Icon {...style} name='log-out-outline' />
);

const NotificationBadge = (style) => (
  <Layout style={[style, Styles.badge]}>
    <Text style={Styles.badgeText}>5</Text>
  </Layout>
);

class Navigations extends Component {
  drawerData = [
    { title: 'Book a ride', location: '', icon: CarIcon, url: 'Dashboard' },
    { title: 'Notifications', location: '', accessory: NotificationBadge, icon: NotifyIcon, url: 'Dashboard' },
    { title: 'Trip History', location: 'ViewTripHistory', icon: HistoryIcon, url: 'ViewTripHistory' },
    { title: 'Pinned Locations', location: '', icon: PinnedIcon, },
    { title: 'Logout', location: '', icon: LogoutIcon, url: 'Logout' },
  ];


  renderProfileHeader = () => (
    <DrawerHeaderFooter style={Styles.drawer_header} title={this.props.user_credentials.first_name + ' ' + this.props.user_credentials.last_name} description='React Native Developer' icon={PersonIcon} />
  );

  onRouteSelect = (index) => {
    console.log(index);
    const routes = this.drawerData[index].url;

    if (routes == 'Logout') {
      this.props.logout();
      Actions.LoginForm();
    } else {
    }
  };
  render() {
    return (
      <Drawer
        data={this.drawerData}
        header={this.renderProfileHeader}
        onSelect={this.onRouteSelect}
        onPress={() => console.log('testetst')}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    user_credentials: state.user_credentials
  }
}
const mapActionToProps = dispatch => {
  return {
    handle_changes_with_parent: (action, parent_state, child_state, value) => dispatch({ type: action, parent_state: parent_state, child_state: child_state, value: value }),
    logout: () => dispatch({ type: 'SET_LOGGEDIN_BOOLEAN' })
  }
}
export default connect(mapStateToProps, mapActionToProps)(Navigations);

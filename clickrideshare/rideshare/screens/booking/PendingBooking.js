import React, { } from 'react';
import { View, SafeAreaView, } from 'react-native';
import { Text, TopNavigation, TopNavigationAction, List, ListItem, Button, Input } from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import { Styles } from '../../styles/Styles.js';
import config from '../../config';
import Icon from 'react-native-vector-icons/MaterialIcons';



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



class PendingBooking extends React.Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        console.log('constructorconstructorconstructor');
    }

    getHistory = async (val, search) => {

        let url = config.baseUrl + 'booking/pendingBooking';
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
                var newdate = new Date(data.date);
                var schedDate = new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: '2-digit',
                    weekday: 'long'
                }).format(newdate);
                let x = {
                    bookingid: data.booking_id,
                    dropoff_loc: data.dropoff_loc,
                    pickup_loc: data.pickup_loc,
                    date: schedDate,
                    time: data.time,
                    booking_status: data.booking_status
                };
                pendingbookings.push(x);
            });
            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_pending_booking', 'Pending', pendingbookings);
        } else {
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
    viewBookingDetails = (item, view) => {
        this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_pending_booking', 'up_bookingid', item.bookingid);
        this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_pending_booking', 'up_pickup_loc', item.pickup_loc);
        this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_pending_booking', 'up_dropoff_loc', item.dropoff_loc);
        this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_pending_booking', 'up_date', item.date);
        this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_pending_booking', 'up_time', item.time);
        Actions.ViewPendingBooking({
            bookingdetails: item,
            bookingdetailsview: view

        })
    };

    renderItemAccessory = (item) => (
        <View>
            <Button style={{ backgroundColor: '#243c88', borderColor: '#243c88' }} size='tiny' onPress={() => this.viewBookingDetails(item, 'view')}>View Details</Button>
            {item.booking_status == 0 ? <Button style={{ backgroundColor: '#328bc3', borderColor: '#328bc3', marginVertical: 2 }} size='tiny' onPress={() => this.viewBookingDetails(item, 'update')}>Update</Button> : null}

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
            <BackAction onPress={() => { Actions.pop(); }} />
        );

        const renderRightControl = () => (
            <SearchAction onPress={this.ShowHideSearch} />
        );

        return (
            <SafeAreaView style={Styles.container}>
                <TopNavigation
                    leftControl={renderLeftControl()}
                    rightControls={renderRightControl()}
                    title='Pending Booking'
                    alignment='center'
                    style={Styles.header}
                    titleStyle={Styles.headerTitle}
                />
                {this.props.view_pending_booking.search ? (<Input style={Styles.search}
                    placeholder='Search Pending Booking...'
                    size='small'
                    value={this.props.view_pending_booking.Searchdata}
                    onChangeText={this.SearchFunction}
                    clearButtonMode='while-editing'
                />) : null}
                <View style={Styles.listContainer}>
                    <List
                        style={Styles.tablist}
                        data={this.props.view_pending_booking.Pending}
                        renderItem={this.renderItemPending}
                        onEndReached={this.nextPage}
                    />

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
        handle_changes_with_parent: (action, parent_state, child_state, value) => dispatch({ type: action, parent_state: parent_state, child_state: child_state, value: value })
    }
}
export default connect(mapStateToProps, mapActionToProps)(PendingBooking);

import React, { } from 'react';
import {
    View,
    SafeAreaView,
    Alert
} from 'react-native';
import {
    Text,
    TopNavigation,
    TopNavigationAction,
    List,
    ListItem,
    Tab,
    TabView,
    Input,
    Button,
    Spinner
} from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import axios from 'axios'; 0.
import { Actions } from 'react-native-router-flux';
import { Styles } from '../styles/Styles.js';
import config from '../config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { showMessage } from "react-native-flash-message";


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



class ViewTripHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    getHistory = async (val, search) => {
        this.setState({loading:true})

        let url = config.baseUrl + 'booking/driverTripHistory';
        let bodyFormdata = new FormData();
        bodyFormdata.append('userid', this.props.user_credentials.fk_user_id);
        bodyFormdata.append('search', search);
        bodyFormdata.append('next', val);

        let response = await axios.post(url, bodyFormdata);
        let info = response.data;
        console.log(info);
        if (info.status == 'success') {
            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_trip_history', 'Completed', info.data_completed);
            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_trip_history', 'Cancelled', info.data_cancelled)
            this.setState({loading:false})
        } else {
            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_trip_history', 'Completed', '');
            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_trip_history', 'Cancelled', '')
        }
    }

    componentDidMount() {
        this.getHistory(this.props.view_trip_history.per_page, this.props.view_trip_history.Searchdata)
    }

    onSelect = (selectedIndex) => {
        this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_trip_history', 'selectedIndex', selectedIndex)
    };

    nextPage = () => {
        let next = this.props.view_trip_history.per_page + 10;
        this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_trip_history', 'per_page', next)

        this.getHistory(next, this.props.view_trip_history.Searchdata);
    }
    pinLocationProcess = async (id) => {
        let url = config.baseUrl + 'pinnedlocation/pinLocationNow';
        let bodyFormdata = new FormData();
        bodyFormdata.append('booking_id', id);

        let response = await axios.post(url, bodyFormdata);
        let info = response.data;

        if (info.status == 'success') {
            showMessage({
                message: "Pinned successfully!",
                type: "success",
                duration: 10000
            });
            this.getHistory(this.props.view_trip_history.per_page, this.props.view_trip_history.Searchdata)
        } else {
            showMessage({
                message: "Something went wrong!!!",
                type: "danger",
                duration: 10000
            });
        }
    }
    pinNow = (id) => (
        Alert.alert(
            'Pin Location?',
            "You can remove it on pinned location tab once you confirmed.",
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => this.pinLocationProcess(id) },
            ],
            { cancelable: false },
        )
    );
    renderItemAccessory = (id, status) => (
        <View>
            {(status == 0 ) ? <Button style={{ backgroundColor: '#328bc3', borderColor: '#328bc3', marginVertical: 2 }} size='tiny' onPress={() => this.pinNow(id)}>Pin this location</Button> : null}
        </View>
    );

    renderItemCompleted = ({ item, index }) => (
        <ListItem
            style={Styles.items}
            title={`${item.dropoff_loc}`}
            description={`${item.booking_status}`}
            titleStyle={Styles.historyListItemTitle}
            descriptionStyle={Styles.listItemDescComp}
            icon={() =>
                <Icon name="local-taxi" size={40} color="#243c88" />
            }
            accessory={() => this.renderItemAccessory(item.booking_id, item.pin_status)}
        />
    );

    renderItemCancelled = ({ item, index }) => (
        <ListItem
            style={Styles.items}
            title={`${item.dropoff_loc}`}
            description={`${item.booking_status}`}
            titleStyle={Styles.listItemTitle}
            descriptionStyle={Styles.listItemDescCanc}
            icon={() =>
                <Icon name="local-taxi" size={40} color='#e24e42' />
            }
        />

    );

    ShowHideSearch = () => {
        if (this.props.view_trip_history.search == true) {
            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_trip_history', 'search', false)
        } else {
            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_trip_history', 'search', true)
        }
    };

    SearchFunction = (value) => {
        this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'view_trip_history', 'Searchdata', value)
        this.getHistory(this.props.view_trip_history.per_page, value)
    }

    render() {
        const onBackPress = () => {
        };

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
                    title='Trip History'
                    alignment='center'
                    style={Styles.header}
                    titleStyle={Styles.headerTitle}
                />
                {this.state.loading == true ? <View style={{alignItems: 'center',height: '100%', justifyContent: 'center', zIndex: 1}}><Spinner/><Text style={{color: '#333'}}>Please wait...</Text></View>:null}

                {this.props.view_trip_history.search ? (<Input style={Styles.search}
                    placeholder='Search Trip History...'
                    size='small'
                    value={this.props.view_trip_history.Searchdata}
                    onChangeText={this.SearchFunction}
                    clearButtonMode='while-editing'
                />) : null}
                <View style={Styles.screen}>

                    <TabView
                        selectedIndex={this.props.view_trip_history.selectedIndex}
                        onSelect={this.onSelect}
                        style={Styles.tabView}
                        tabBarStyle={Styles.tabBar}
                        indicatorStyle={Styles.tabViewIndicator}
                    >
                        <Tab title='Completed Booking' titleStyle={this.props.view_trip_history.selectedIndex === -0 ? Styles.tabTitleSelected : ''}>
                            {this.props.view_trip_history.Completed == '' ? (
                                <Text style={Styles.center}>No results found.</Text>
                            ) : (
                                    <List
                                        style={Styles.tablist}
                                        data={this.props.view_trip_history.Completed}
                                        renderItem={this.renderItemCompleted}
                                        onEndReached={this.nextPage}
                                    />
                                )}

                        </Tab>
                        <Tab title='Cancelled Booking' titleStyle={this.props.view_trip_history.selectedIndex === 1 ? Styles.tabTitleSelected : ''} >
                            {this.props.view_trip_history.Cancelled == '' ? (
                                <Text style={Styles.center}>No results found.</Text>
                            ) : (
                                    <List
                                        style={Styles.tablist}
                                        data={this.props.view_trip_history.Cancelled}
                                        renderItem={this.renderItemCancelled}
                                        onEndReached={this.nextPage}
                                    />
                                )}

                        </Tab>
                    </TabView>
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
        view_trip_history: state.view_trip_history,
        user_credentials: state.user_credentials,
        pinned_booking_id: state.pinned_booking_id,
    }
}
const mapActionToProps = dispatch => {
    return {
        handle_changes_with_parent: (action, parent_state, child_state, value) => dispatch({ type: action, parent_state: parent_state, child_state: child_state, value: value }),
        setModalVisible: (state) => dispatch({ type: 'MODAL_VISIBLE', state: state }),
        viewChanges: (state) => dispatch({ type: 'MODAL_VISIBLE', state: state }),
    }
}
export default connect(mapStateToProps, mapActionToProps)(ViewTripHistory);

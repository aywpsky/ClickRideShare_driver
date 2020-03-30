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
import { Styles } from '../../styles/Styles.js';
import config from '../../config';
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



class PaymentRecords extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    getHistory = async (val, search) => {
        this.setState({loading:true})

        let url = config.baseUrl + 'payment/getDriverPayments';
        let bodyFormdata = new FormData();
        bodyFormdata.append('userid', this.props.user_credentials.fk_user_id);
        bodyFormdata.append('search', search);
        bodyFormdata.append('next', val);

        let response = await axios.post(url, bodyFormdata);
        let info = response.data;
        console.log(info);
        if (info.status == 'success') {
            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'payment_records', 'Completed', info.data_claimed);
            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'payment_records', 'Cancelled', info.data_to_be_claimed)
            this.setState({loading:false})
        } else {
            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'payment_records', 'Completed', '');
            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'payment_records', 'Cancelled', '')
        }
    }

    componentDidMount() {
        this.getHistory(this.props.payment_records.per_page, this.props.payment_records.Searchdata)
    }

    onSelect = (selectedIndex) => {
        this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'payment_records', 'selectedIndex', selectedIndex)
    };

    nextPage = () => {
        let next = this.props.payment_records.per_page + 10;
        this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'payment_records', 'per_page', next)

        this.getHistory(next, this.props.payment_records.Searchdata);
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
            this.getHistory(this.props.payment_records.per_page, this.props.payment_records.Searchdata)
        } else {
            showMessage({
                message: "Something went wrong!!!",
                type: "danger",
                duration: 10000
            });
        }
    }

    viewPaymentRecord = (item) => {
        Actions.ViewPaymentRecord({
            viewPaymentDetails:    item
        })
    }
    renderItemAccessory = (amount) => (
        <View>
            <Text style={{fontWeight: 'bold'}} category='h6'>${amount}</Text>
        </View>
    );

    renderItemCompleted = ({ item, index }) => (
        <ListItem
            style={Styles.items}
            title={`${item.first_name+' '+ item.last_name+'\n'+item.payment_id}`}
            description={`${item.status}`}
            titleStyle={Styles.historyListItemTitle}
            descriptionStyle={Styles.listItemDescComp}
            icon={() =>
                <Icon name="local-taxi" size={40} color="#243c88" />
            }
            accessory={() => this.renderItemAccessory(item.amount)}
            onPress={() => this.viewPaymentRecord(item)}
        />
    );

    renderItemCancelled = ({ item, index }) => (
        <ListItem
            style={Styles.items}
            title={`${item.first_name+' '+ item.last_name+'\n'+item.payment_id}`}
            description={`${item.status}`}
            titleStyle={Styles.listItemTitle}
            descriptionStyle={Styles.listItemDescToBeClaimed}
            icon={() =>
                <Icon name="local-taxi" size={40} color='#243c88' />
            }
            accessory={() => this.renderItemAccessory(item.amount)}
            onPress={() => this.viewPaymentRecord(item)}
        />

    );

    ShowHideSearch = () => {
        if (this.props.payment_records.search == true) {
            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'payment_records', 'search', false)
        } else {
            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'payment_records', 'search', true)
        }
    };

    SearchFunction = (value) => {
        this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'payment_records', 'Searchdata', value)
        this.getHistory(this.props.payment_records.per_page, value)
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
                    title='Payment Records'
                    alignment='center'
                    style={Styles.header}
                    titleStyle={Styles.headerTitle}
                />
                {this.state.loading == true ? <View style={{alignItems: 'center',height: '100%', justifyContent: 'center', zIndex: 1}}><Spinner/><Text style={{color: '#333'}}>Please wait...</Text></View>:null}

                {this.props.payment_records.search ? (<Input style={Styles.search}
                    placeholder='Search Payment Records...'
                    size='small'
                    value={this.props.payment_records.Searchdata}
                    onChangeText={this.SearchFunction}
                    clearButtonMode='while-editing'
                />) : null}
                <View style={Styles.screen}>

                    <TabView
                        selectedIndex={this.props.payment_records.selectedIndex}
                        onSelect={this.onSelect}
                        style={Styles.tabView}
                        tabBarStyle={Styles.tabBar}
                        indicatorStyle={Styles.tabViewIndicator}
                    >
                        <Tab title='Claimed' titleStyle={this.props.payment_records.selectedIndex === -0 ? Styles.tabTitleSelected : ''}>
                            {this.props.payment_records.Completed == '' ? (
                                <Text style={Styles.center}>No results found.</Text>
                            ) : (
                                    <List
                                        style={Styles.tablist}
                                        data={this.props.payment_records.Completed}
                                        renderItem={this.renderItemCompleted}
                                        onEndReached={this.nextPage}
                                    />
                                )}

                        </Tab>
                        <Tab title='Claimable' titleStyle={this.props.payment_records.selectedIndex === 1 ? Styles.tabTitleSelected : ''} >
                            {this.props.payment_records.Cancelled == '' ? (
                                <Text style={Styles.center}>No results found.</Text>
                            ) : (
                                    <List
                                        style={Styles.tablist}
                                        data={this.props.payment_records.Cancelled}
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
        user_credentials: state.user_credentials,
        payment_records: state.payment_records,
    }
}
const mapActionToProps = dispatch => {
    return {
        handle_changes_with_parent: (action, parent_state, child_state, value) => dispatch({ type: action, parent_state: parent_state, child_state: child_state, value: value }),
        setModalVisible: (state) => dispatch({ type: 'MODAL_VISIBLE', state: state }),
        viewChanges: (state) => dispatch({ type: 'MODAL_VISIBLE', state: state }),
    }
}
export default connect(mapStateToProps, mapActionToProps)(PaymentRecords);

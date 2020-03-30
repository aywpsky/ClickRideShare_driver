import React, { } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    StyleSheet
} from 'react-native';
import {
    Text,
    Icon,
    TopNavigation,
    TopNavigationAction,
    List,
    ListItem,
    Avatar,
    Layout,
    Button,
    // Modal,
    Input,
    Toggle
} from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { Actions } from 'react-native-router-flux';
import { Styles } from '../styles/Styles.js';
import SimpleReactValidator from 'simple-react-validator';
import { showMessage } from "react-native-flash-message";
import config from '../config';
import axios from 'axios';
import Moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';


const BackIcon = (style) => (
    <Icons name='arrow-left' size={23} color='#ffff' />
);
const CloseIcon = (style) => (
    <Icon {...style} style={Styles.ModalIcon} name='close-circle-outline' fill='red' />
);

const EditIcon = (style) => (
    <Icon {...style} style={Styles.text} name='edit-2-outline' fill='#ffff' />
);

const ChangePassIcon = (style) => (
    <Icon {...style} style={Styles.text} name='lock-outline' fill='#ffff' />
);

const BackAction = (props) => (
    <TopNavigationAction {...props} style={Styles.text} icon={BackIcon} />
);

const CloseModal = (props) => (
    <TopNavigationAction {...props} style={Styles.text} icon={CloseIcon} />
);

const EditAction = (props) => (
    <TopNavigationAction {...props} icon={EditIcon} />
);

const ChangePassAction = (props) => (
    <TopNavigationAction {...props} icon={ChangePassIcon} />
);

const RenderItemIcon = (style) => (
    <Icon {...style} name='person' />
);


class EditProfile extends React.Component {
    constructor(props) {
        super(props)
        this.validator = new SimpleReactValidator({ autoForceUpdate: this, locale: 'en' });
        //this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    }
    getCustomer() {
        let url = config.baseUrl + 'login/getCustomer';
        let bodyFormdata = new FormData();
        axios({
            'url': url,
            'data': bodyFormdata,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })

            .then(result => {
                let res = result.data.message;
                this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'edit_user_credentials', 'edit_first_name', result.data[0].first_name)
                this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'edit_user_credentials', 'edit_last_name', result.data[0].last_name)
                this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'edit_user_credentials', 'edit_phone_number', result.data[0].phone_number)
                this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'edit_user_credentials', 'edit_profile_pic', result.data[0].edit_profile_pic)
                this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'edit_user_credentials', 'edit_email', this.props.user_credentials.email)
            });
    }

    componentDidMount() {
        this.getCustomer();
    }

    uploadImage(cropit, circular = false, mediaType) {
        ImagePicker.openPicker({
            width: 500,
            height: 500,
            cropping: cropit,
            cropperCircleOverlay: circular,
            compressImageMaxWidth: 1000,
            compressImageMaxHeight: 1000,
            compressImageQuality: 1,
            compressVideoPreset: 'MediumQuality',
            includeExif: true,
        }).then(image => {
            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'edit_user_credentials', 'edit_profile_pic', { uri: image.path, width: image.width, height: image.height, mime: image.mime })

        }).catch(e => {
            console.log(e);
        });

    }

    renderImage(image) {
        return <Image style={{ alignSelf: 'center', height: 200, width: 200, borderWidth: 1, borderRadius: 100, resizeMode: 'cover' }} source={image} />
    }

    renderAsset(image) {
        if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
            return this.renderVideo(image);
        }

        return this.renderImage(image);
    }

    UpdateProfile() {
        Alert.alert(
            'Save Changes?',
            '',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => this.saveProfile() },
            ],
            { cancelable: false },
        );
    }

    saveProfile() {
        this.validator.hideMessages();
        this.forceUpdate();
        if (this.validator.allValid()) {
            const image = this.props.edit_user_credentials.edit_profile_pic;
            let url = config.baseUrl + 'home/updateProfile';

            let bodyFormdata = new FormData();
            bodyFormdata.append('user_id', this.props.user_credentials.fk_user_id);
            bodyFormdata.append('first_name', this.props.edit_user_credentials.edit_first_name);
            bodyFormdata.append('last_name', this.props.edit_user_credentials.edit_last_name);
            bodyFormdata.append('phone_number', this.props.edit_user_credentials.edit_phone_number);

            if (image != null) {
                bodyFormdata.append('image', {
                    name: image.uri.split('/').pop(),
                    type: image.mime,
                    uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
                });
            }

            axios({
                method: 'post',
                url: url,
                data: bodyFormdata,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            })

                .then(result => {

                    let res = result.data.message;
                    if (res == 'Success') {
                        showMessage({
                            message: "Successfully Updated!",
                            type: "success",
                            duration: 10000
                        });
                        if (this.props.edit_user_credentials.edit_profile_pic != null) {
                            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'user_credentials', 'first_name', this.props.edit_user_credentials.edit_first_name)
                        }
                        this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'user_credentials', 'last_name', this.props.edit_user_credentials.edit_last_name)
                        this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'user_credentials', 'phone_number', this.props.edit_user_credentials.edit_phone_number)

                        if (result.data.profile_name != '') {
                            this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'user_credentials', 'profile_pic', result.data.profile_name)
                        }
                        this.props.setModalVisible('modalVisible');
                    } else {
                        showMessage({
                            message: "Something went wrong!!!",
                            type: "danger",
                            duration: 10000
                        });
                        this.props.setModalVisible('modalVisible');
                    }
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }

    }

    refreshEditPass() {
        this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'edit_user_credentials', 'edit_old_password', '')
        this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'edit_user_credentials', 'edit_password', '')
        this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'edit_user_credentials', 'edit_confirm_password', '')
    }

    UpdatePassword() {
        this.validator.hideMessages();
        this.forceUpdate();
        if (this.validator.allValid()) {
            let url = config.baseUrl + 'home/updatePass';

            let bodyFormdata = new FormData();
            bodyFormdata.append('user_id', this.props.user_credentials.fk_user_id);
            bodyFormdata.append('old_password', this.props.edit_user_credentials.edit_old_password);
            bodyFormdata.append('password', this.props.edit_user_credentials.edit_password);
            bodyFormdata.append('confirm_password', this.props.edit_user_credentials.edit_confirm_password);

            axios({
                method: 'post',
                url: url,
                data: bodyFormdata,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            })

                .then(result => {
                    let res = result.data.message;
                    if (res == 'Success') {
                        showMessage({
                            message: "Successfully Updated!",
                            type: "success",
                            duration: 10000
                        });
                        this.props.setModalVisible('changePassmodalVisible');
                        refreshEditPass();
                    } else if (res == 'Wrong Old Password') {
                        showMessage({
                            message: "Old Password not correct!",
                            type: "danger",
                            duration: 10000
                        });
                        this.props.setModalVisible('changePassmodalVisible');
                        refreshEditPass();
                    } else {
                        showMessage({
                            message: "Something went wrong!!!",
                            type: "danger",
                            duration: 10000
                        });
                        this.props.setModalVisible('changePassmodalVisible');
                        refreshEditPass();
                    }
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }

    }

    changePassModal = () => {
        return (
            <Layout
                level='3'
                style={Styles.modalContainer}>
                <TopNavigation
                    rightControls= <CloseModal onPress={() => this.props.setModalVisible('changePassmodalVisible')}/>
                style={Styles.ModalTopNavigation}
                />

            <Text style={Styles.modalText}>Old Password</Text>
                <Input style={Styles.modalInput}
                    size='small'
                    placeholder='Enter Old Password'
                    value={this.props.edit_user_credentials.edit_old_password}
                    onChangeText={value => this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'edit_user_credentials', 'edit_old_password', value)}
                    secureTextEntry={true}

                />
                {this.props.changePassmodalVisible ?
                    <Text style={Styles.error}>{this.validator.message('old_password', this.props.edit_user_credentials.edit_old_password, 'required')}</Text>
                    :
                    <Text></Text>
                }

                <Text style={Styles.modalText}>Password</Text>
                <Input style={Styles.modalInput}
                    size='small'
                    placeholder='Enter New Password'
                    value={this.props.edit_user_credentials.edit_password}
                    onChangeText={value => this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'edit_user_credentials', 'edit_password', value)}
                    secureTextEntry={true}

                />
                {this.props.changePassmodalVisible ?
                    <Text style={Styles.error}>{this.validator.message('password', this.props.edit_user_credentials.edit_password, 'required')}</Text>
                    :
                    <Text></Text>
                }

                <Text style={Styles.modalText}>Confirm Password</Text>
                <Input style={Styles.modalInput}
                    size='small'
                    placeholder='Enter New Password'
                    value={this.props.edit_user_credentials.edit_confirm_password}
                    onChangeText={value => this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'edit_user_credentials', 'edit_confirm_password', value)}
                    secureTextEntry={true}

                />
                {this.props.changePassmodalVisible ?
                    <Text style={Styles.error}>{this.validator.message('confirm_password', this.props.edit_user_credentials.edit_confirm_password, `required|in:${this.props.edit_user_credentials.edit_password}`, { messages: { in: 'Passwords need to match!' } })}</Text>
                    :
                    <Text></Text>
                }


                <Button style={Styles.buttonSubmit} status='success' onPress={() => this.UpdatePassword()}>Update</Button>
            </Layout>
        );
    };

    updateProfileModal = () => {
        let profile_picture = { uri: 'https://www.clickitnride.com/admin/images/' + this.props.user_credentials.profile_pic };
        return (
            <Layout
                level='3'
                style={Styles.modalContainer}>
                <TopNavigation
                    rightControls= <CloseModal onPress={() => this.props.setModalVisible('modalVisible')}/>
              style={Styles.ModalTopNavigation}
                />

          <ScrollView>
                    {this.props.edit_user_credentials.edit_profile_pic ? this.renderAsset(this.props.edit_user_credentials.edit_profile_pic, 1) : this.renderAsset(profile_picture)}
                </ScrollView>

                <TouchableOpacity onPress={() => this.uploadImage(true, true)}>
                    <Text style={Styles.change_profile_picture}>Change Profile Picture</Text>
                </TouchableOpacity>

                <Text style={Styles.modalText}>First Name</Text>
                <Input style={Styles.modalInput}
                    size='small'
                    placeholder='First Name'
                    value={this.props.edit_user_credentials.edit_first_name}
                    onChangeText={value => this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'edit_user_credentials', 'edit_first_name', value)}

                />
                {this.props.modalVisible ?
                    <Text style={Styles.error}>{this.validator.message('first_name', this.props.edit_user_credentials.edit_first_name, 'required')}</Text>
                    :
                    <Text></Text>
                }

                <Text style={Styles.modalText}>Last Name</Text>
                <Input style={Styles.modalInput}
                    size='small'
                    placeholder='Last Name'
                    value={this.props.edit_user_credentials.edit_last_name}
                    onChangeText={value => this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'edit_user_credentials', 'edit_last_name', value)}

                />
                {this.props.modalVisible ?
                    <Text style={Styles.error}>{this.validator.message('last_name', this.props.edit_user_credentials.edit_last_name, 'required')}</Text>
                    :
                    <Text></Text>
                }

                <Text style={Styles.modalText}>Phone Number</Text>
                <Input style={Styles.modalInput}
                    size='small'
                    placeholder='Phone Number'
                    value={this.props.edit_user_credentials.edit_phone_number}
                    onChangeText={value => this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'edit_user_credentials', 'edit_phone_number', value)}

                />
                {this.props.modalVisible ?
                    <Text style={Styles.error}>{this.validator.message('phone_number', this.props.edit_user_credentials.edit_phone_number, 'required')}</Text>
                    :
                    <Text></Text>
                }


                <Button style={Styles.buttonSubmit} status='success' onPress={() => this.UpdateProfile()}>Update</Button>
            </Layout>
        );
    };

    render() {
        Moment.locale('en');
        var profile_pic = 'https://www.clickitnride.com/admin/images/' + this.props.user_credentials.profile_pic;

        console.log(profile_pic)
        var dt = this.props.user_credentials.date_added;
        var my = this;

        const DATA = [
            {
                title: 'Phone Number',
                description: my.props.user_credentials.phone_number,
                icon: "phone-call-outline",
            },
            {
                title: 'Email Address',
                description: my.props.user_login.email,
                icon: "email-outline",
            },
        ];
        const onBackPress = () => {
        };

        const renderLeftControl = () => (
            <BackAction onPress={() => { Actions.pop(); }} />
        );

        const renderRightControls = () => [
            <EditAction onPress={() => this.props.setModalVisible('modalVisible')} />,
            <ChangePassAction onPress={() => this.props.setModalVisible('changePassmodalVisible')} />,
        ];
        const data = new Array(5).fill(DATA);



        const renderItem = ({ item, index }) => (
            <ListItem
                title={`${item.title}`}
                description={`${item.description}`}
                icon={(style) =>
                    <Icon   {...style} name={item.icon} />}
            />
        );
        return (
            <View style={Styles.view}>

                <View style={Styles.header}>
                    <TopNavigation
                        leftControl={renderLeftControl()}
                        rightControls={renderRightControls()}
                        style={Styles.editHeader}
                    />
                    <Image style={Styles.backgroundImage2} source={require('../images/download.png')}></Image>
                    <View style={Styles.headerContent}>
                        <Avatar
                            style={Styles.avatar}
                            size='giant'
                            source={{ uri: profile_pic }}
                        />
                        <Text style={Styles.name}>{this.props.user_credentials.first_name + ' ' + this.props.user_credentials.last_name} </Text>
                        <Text style={Styles.userInfo}>Joined last {Moment(dt).format('MMMM YYYY')}</Text>

                    </View>
                </View>
                <List
                    style={Styles.list}
                    data={
                        DATA
                    }
                    renderItem={renderItem}
                />

                {/*Update Profile Modal*/}
                <Layout>

                    <Modal
                        style={{ marginVertical: 55 }}
                        isVisible={this.props.modalVisible}
                        backdropStyle={{ backgroundColor: 'black', opacity: 0.90 }}
                        onBackdropPress={() => this.props.setModalVisible('modalVisible')}
                        onSwipeComplete={() => this.props.setModalVisible('modalVisible')}
                    >
                        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ alignItems: 'center' }}>
                            {this.updateProfileModal()}
                        </ScrollView>
                    </Modal>
                </Layout>
                {/*End Update Profile Modal*/}

                {/*Update Password*/}
                <Layout>

                    <Modal
                        style={{ marginVertical: 55 }}
                        isVisible={this.props.changePassmodalVisible}
                        backdropStyle={{ backgroundColor: 'black', opacity: 0.5 }}
                        onSwipeComplete={() => this.props.setModalVisible('changePassmodalVisible')}
                        onBackdropPress={() => this.props.setModalVisible('changePassmodalVisible')}
                        onSwipeComplete={() => this.props.setModalVisible('changePassmodalVisible')}
                    >
                        <ScrollView ckeyboardShouldPersistTaps="handled" ontentContainerStyle={{ alignItems: 'center' }}>
                            {this.changePassModal()}
                        </ScrollView>
                    </Modal>
                </Layout>
                {/*End Update Password*/}

            </View>


        );
    }
}
const styles = StyleSheet.create({
  toggle: {
    margin: 8,
  },
});
const mapStateToProps = state => {
    return {
        user_credentials: state.user_credentials,
        edit_user_credentials: state.edit_user_credentials,
        user_login: state.user_login,
        modalVisible: state.modalVisible,
        changePassmodalVisible: state.changePassmodalVisible,
    }
}
const mapActionToProps = dispatch => {
    return {
        handle_changes_with_parent: (action, parent_state, child_state, value) => dispatch({ type: action, parent_state: parent_state, child_state: child_state, value: value }),
        setModalVisible: (state) => dispatch({ type: 'MODAL_VISIBLE', state: state }),
    }
}
export default connect(mapStateToProps, mapActionToProps)(EditProfile);

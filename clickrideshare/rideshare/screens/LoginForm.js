import React, { } from 'react';
import {
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { Input, Text, Button } from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import ResponsiveImage from 'react-native-responsive-image';
import { Actions } from 'react-native-router-flux';
import SimpleReactValidator from 'simple-react-validator';
import { showMessage } from "react-native-flash-message";
import axios from 'axios';
import config from '../config';
import { Styles } from '../styles/Styles.js';

class LoginForm extends React.Component {

    constructor(props) {
        super(props)
        this.validator = new SimpleReactValidator({ autoForceUpdate: this });

        this.validateRegister = this.validateRegister.bind(this);
    }

    validateRegister() {
        if (this.validator.allValid()) {
            let url = config.baseUrl + 'login/auth';
            let bodyFormdata = new FormData();
            bodyFormdata.append('email', this.props.user_login.email);
            bodyFormdata.append('password', this.props.user_login.password);
            bodyFormdata.append('type', 2);
            axios({
                'method': 'post',
                'url': url,
                'data': bodyFormdata,
                config: { headers: { 'Content-Type': 'multipart/form-data' } }
            })

                .then(result => {
                    console.log(result)
                    let res = result.data.message;
                    if (res == 'Success') {
                        showMessage({
                            message: "Successfully logged in!",
                            style: Styles.alert,
                            icon: 'auto',
                            type: "success",
                            duration: 5000
                        });
                        this.props.set_logged_in();
                        this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'user_login', 'user_id', result.data[0].user_id)
                        Actions.Dashboard();
                    } else if (res == 'Incorrect Password') {
                        showMessage({
                            message: "Incorrect Password",
                            style: Styles.alert,
                            icon: 'auto',
                            type: "danger",
                            duration: 5000
                        });
                    } else {
                        showMessage({
                            message: "Account not found. Please register.",
                            style: Styles.alert,
                            icon: 'auto',
                            type: "danger",
                            duration: 5000
                        });
                    }
                });
        } else {
            this.validator.showMessages();
            // rerender to show messages for the first time
            // you can use the autoForceUpdate option to do this automatically`
            this.forceUpdate();
        }
    }

    render() {
        const { isLoggedIn } = this.props;
        return (
            <SafeAreaView style={Styles.view}>
                <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
                    <Text category='h2' appearance='alternative' style={Styles.text}>Driver Login</Text>
                    <ResponsiveImage style={Styles.logo} source={require('../images/Logo.png')} initWidth="200" initHeight="300" />
                    <Input style={Styles.input}
                        size='small'
                        placeholder='Email Address'
                        value={this.props.user_login.email}
                        onChangeText={value => this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'user_login', 'email', value)}
                    />
                    <Text style={Styles.error}>{this.validator.message('email', this.props.user_login.email, 'required')}</Text>
                    <Input style={Styles.input}
                        size='small'
                        placeholder='Password'
                        value={this.props.user_login.password}
                        onChangeText={value => this.props.handle_changes_with_parent('HANDLE_CHANGES_WITH_PARENT', 'user_login', 'password', value)}
                        secureTextEntry={true}
                    />
                    <Text style={Styles.error}>{this.validator.message('password', this.props.user_login.password, 'required')}</Text>
                    <Text appearance='hint' onPress={() => { Actions.ForgotPass(); }}>Forgot Password?</Text>
                    <Button style={Styles.button} size='giant' onPress={this.validateRegister}>LOG IN</Button>
                    <Text appearance='hint'>New User? <Text appearance='alternative' onPress={() => { Actions.RegisterForm(); }}>Sign up for a new account.</Text></Text>
                </ScrollView>
            </SafeAreaView>
        );
    }
}
const mapStateToProps = state => {
    return {
        user_login: state.user_login,
        isLoggedIn: state.isLoggedIn,
        user_credentials: state.user_credentials,
    }
}
const mapActionToProps = dispatch => {
    return {
        handle_changes_with_parent: (action, parent_state, child_state, value) => dispatch({ type: action, parent_state: parent_state, child_state: child_state, value: value }),
        set_logged_in: () => dispatch({ type: 'SET_LOGGEDIN_BOOLEAN' })

    }
}
export default connect(mapStateToProps, mapActionToProps)(LoginForm);

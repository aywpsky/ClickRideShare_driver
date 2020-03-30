import React, { } from 'react';
import {
   View,
   ScrollView,
} from 'react-native';
import { Input, Text, Button } from 'react-native-ui-kitten';
import ResponsiveImage from 'react-native-responsive-image';
import { Actions } from 'react-native-router-flux';
import SimpleReactValidator from 'simple-react-validator';
import { showMessage, } from "react-native-flash-message";
import axios from 'axios';
import config from '../config';
import { Styles } from '../styles/Styles.js';

export class ChangePass extends React.Component {

   constructor(props) {
      super(props)
      this.validator = new SimpleReactValidator({ autoForceUpdate: this });

      this.state = {
         email: this.props.pass_email,
         password: '',
         confirm_password: '',
      };

      this.changePass = this.changePass.bind(this);
   }

   onChangeText = (value) => {
      this.setState({ value });
   };

   changePass() {
      let url_ = config.baseUrl + 'forgotpassword/update_password';

      let bodyFormdata = new FormData();
      bodyFormdata.append('email_address', this.state.email);
      bodyFormdata.append('password', this.state.password);
      bodyFormdata.append('confirm_password', this.state.confirm_password);

      axios({
         method: 'post',
         url: url_,
         data: bodyFormdata,
         config: { headers: { 'Content-Type': 'multipart/form-data' } }
      })

         .then(result => {
            console.log(result);
            let res = result.data.message;
            if (res == 'Success') {
               showMessage({
                  message: 'Password was successfully changed! Please login with your new password.',
                  type: "success",
                  duration: 10000
               });
               Actions.LoginForm();
            } else if (res == 'Password not matched!') {
               showMessage({
                  message: "Password not matched!!!",
                  type: "danger",
                  duration: 10000
               });
            } else {
               showMessage({
                  message: "Something went wrong!!!",
                  type: "danger",
                  duration: 10000
               });
            }
         });

   }
   render() {
      return (
         <View style={[Styles.view, { flex: 1 }]}>
            <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
               <ResponsiveImage style={Styles.logo} source={require('../images/Logo.png')} initWidth="200" initHeight="300" />
               <Text category='h4' appearance='alternative'>Change Password</Text>

               <Input style={Styles.input}
                  size='small'
                  placeholder='New Password'
                  value={this.state.password}
                  onChangeText={value => this.setState({ password: value.trim() })}
                  secureTextEntry={true}
               />
               <Text style={Styles.error}>{this.validator.message('Password', this.state.password, 'required')}</Text>

               <Input style={Styles.input}
                  size='small'
                  placeholder='Confirm Password'
                  value={this.state.confirm_password}
                  onChangeText={value => this.setState({ confirm_password: value.trim() })}
                  secureTextEntry={true}
               />
               <Text style={Styles.error}>{this.validator.message('Confirm Password', this.state.confirm_password, 'required')}</Text>

               <Button style={Styles.button} onPress={this.changePass} size='giant'>SAVE</Button>
            </ScrollView>
         </View>
      );
   }
}

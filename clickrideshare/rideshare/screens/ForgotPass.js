import React, { } from 'react';
import {
   View,
   ScrollView,
} from 'react-native';
import { Input, Text, Button } from 'react-native-ui-kitten';
import ResponsiveImage from 'react-native-responsive-image';
import { Actions } from 'react-native-router-flux';
import SimpleReactValidator from 'simple-react-validator';
import { showMessage } from "react-native-flash-message";
import axios from 'axios';
import config from '../config';
import { Styles } from '../styles/Styles.js';

export class ForgotPass extends React.Component {

   constructor(props) {
      super(props)
      this.validator = new SimpleReactValidator({ autoForceUpdate: this });

      this.state = {
         email: '',
      };

      this.changePass = this.changePass.bind(this);
   }

   onChangeText = (value) => {
      this.setState({ value });
   };

   changePass() {
      if (this.validator.allValid()) {
         let url = config.baseUrl + 'forgotpassword/forgotPassProcess';

         let bodyFormdata = new FormData();
         bodyFormdata.append('email', this.state.email);

         axios({
            'method': 'post',
            'url': url,
            'data': bodyFormdata,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
         }).then(result => {
            console.log(result)
            let res = result.data.message;
            if (res == 'Success') {
               showMessage({
                  message: "Send Successfully!",
                  type: "success",
                  duration: 100000
               });
            } else if (res == 'Email not found') {
               showMessage({
                  message: "Email not found!!!",
                  type: "danger",
                  duration: 100000
               });
            } else if (res == 'Email Sent') {
               showMessage({
                  message: "Email sent!",
                  type: "success",
                  duration: 5000
               });
               Actions.ChangePassCode({
                  code: result.data.code,
                  pass_email: result.data.email
               });
            } else {
               showMessage({
                  message: "Something went wrong!!!",
                  type: "danger",
                  duration: 5000
               });
            }
         }).catch((error) => {
            console.log(error.message);
         });
      } else {
         this.validator.showMessages();
         this.forceUpdate();
      }

   }
   render() {
      return (
         <View style={[Styles.view, { flex: 1 }]}>
            <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
               <ResponsiveImage style={Styles.logo} source={require('../images/Logo.png')} initWidth="200" initHeight="300" />
               <Text category='h4' appearance='alternative'>Forgot Password</Text>
               <Text category='s2' appearance='alternative' style={Styles.subtext}>Please enter your email address. You will receive a code via email.</Text>

               <Input style={Styles.input}
                  size='small'
                  placeholder='Email Address'
                  value={this.state.email}
                  onChangeText={value => this.setState({ email: value.trim() })}
               />
               <Text style={Styles.error}>{this.validator.message('Email', this.state.email, 'required|email')}</Text>

               <Button style={Styles.button} onPress={this.changePass} size='giant'>SEND</Button>
            </ScrollView>
         </View>
      );
   }
}

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
import { Styles } from '../styles/Styles.js';

export class RegisterForm extends React.Component {

   constructor(props) {
      super(props)
      this.validator = new SimpleReactValidator({ autoForceUpdate: this });

      this.state = {
         first_name: '',
         last_name: '',
         phone_number: '',
         email_address: '',
         password: '',
         confirm_password: '',
      };

      this.validateRegister = this.validateRegister.bind(this);
   }

   validateRegister() {
       console.log(this.state);
      // if (this.validator.allValid()) {
      let url_ = 'https://www.clickitnride.com/admin/registration/register';

      let bodyFormdata = new FormData();
      bodyFormdata.append('first_name', this.state.first_name);
      bodyFormdata.append('last_name', this.state.last_name);
      bodyFormdata.append('phone_number', this.state.phone_number);
      bodyFormdata.append('email_address', this.state.email_address);
      bodyFormdata.append('password', this.state.password);
      bodyFormdata.append('confirm_password', this.state.confirm_password);
      bodyFormdata.append('type', 2);

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
                  message: "We have received your registration! Please check your email.",
                  type: "success",
                  duration: 100000
               });
               Actions.LoginForm();
            } else if (res == 'Password not matched') {
               showMessage({
                  message: "Password not matched!!!",
                  type: "danger",
                  duration: 100000
               });
            } else if (res == 'Email already registered') {
               showMessage({
                  message: "Email already registered!!!",
                  type: "danger",
                  duration: 100000
               });
            } else {
               showMessage({
                  message: "Something went wrong!!!",
                  type: "danger",
                  duration: 100000
               });
            }
         });
   }
   render() {
      return (
         <View style={Styles.view}>
            <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
               <Text category='h2' appearance='alternative' style={Styles.text}>Register</Text>
               <ResponsiveImage style={Styles.logo} source={require('../images/Logo.png')} initWidth="200" initHeight="300" />

               <Input style={Styles.input}
                  size='small'
                  placeholder='First Name'
                  value={this.state.first_name}
                  onChangeText={value => this.setState({ first_name: value.trim() })}
               />
               <Text style={Styles.error}>{this.validator.message('First Name', this.state.first_name, 'required|alpha')}</Text>

               <Input style={Styles.input}
                  size='small'
                  placeholder='Last Name'
                  value={this.state.last_name}
                  onChangeText={value => this.setState({ last_name: value.trim() })}
               />
               <Text style={Styles.error}>{this.validator.message('Last Name', this.state.last_name, 'required|alpha')}</Text>

               <Input style={Styles.input}
                  size='small'
                  placeholder='Phone Number'
                  value={this.state.phone_number}
                  onChangeText={value => this.setState({ phone_number: value.trim() })}
               />
               <Text style={Styles.error}>{this.validator.message('Phone Number', this.state.phone_number, 'required|phone')}</Text>

               <Input style={Styles.input}
                  size='small'
                  placeholder='Email Address'
                  value={this.state.email_address}
                  onChangeText={value => this.setState({ email_address: value.trim() })}
               />
               <Text style={Styles.error}>{this.validator.message('email', this.state.email_address, 'required|email')}</Text>

               <Input style={Styles.input}
                  size='small'
                  placeholder='Password'
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

               <Button style={Styles.button} onPress={this.validateRegister} size='giant'>REGISTER NOW</Button>
               <Text appearance='hint'>Already a User? <Text appearance='alternative' onPress={() => { Actions.LoginForm(); }}>Login now.</Text></Text>
            </ScrollView>
         </View>
      );
   }
}

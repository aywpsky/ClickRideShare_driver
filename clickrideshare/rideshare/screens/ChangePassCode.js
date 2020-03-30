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
import { Styles } from '../styles/Styles.js';

export class ChangePassCode extends React.Component {

  constructor(props) {
    super(props)
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });

    this.state = {
      setCode: this.props.code,
      email: this.props.pass_email,
      code: '',
    };

    this.changePassCode = this.changePassCode.bind(this);
  }

  onChangeText = (value) => {
    this.setState({ value });
  };

  changePassCode() {
    if (this.validator.allValid()) {
      if (this.state.code == this.state.setCode) {
        Actions.ChangePass({
          pass_email: this.state.email
        });
      } else {
        showMessage({
          message: "The code is incorrect!",
          type: "danger",
          duration: 10000
        });

      }
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
          <Text category='h4' appearance='alternative'>Change Password</Text>
          <Text category='s2' appearance='alternative' style={Styles.subtext}>A code has been sent to your email. Please enter it below.</Text>

          <Input style={Styles.input}
            size='small'
            placeholder='Enter Code'
            value={this.state.code}
            onChangeText={value => this.setState({ code: value.trim() })}
          />
          <Text style={Styles.error}>{this.validator.message('Code', this.state.code, 'required')}</Text>

          <Button style={Styles.button} onPress={this.changePassCode} size='giant'>SUBMIT</Button>
        </ScrollView>
      </View>
    );
  }
}

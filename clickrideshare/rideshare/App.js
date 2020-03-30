
import React, { Component } from  'react';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import {SafeAreaView,StyleSheet,ScrollView,View,StatusBar,Text, Alert } from 'react-native';
import FlashMessage from "react-native-flash-message";
// import firebase from "./Firebase";

import {createStore, applyMiddleware } from 'redux';

import {Provider} from 'react-redux';

import reducers from './stores/reducers';

import thunk from 'redux-thunk';
import Routes from './routes';

// import {LoginForm} from './screens/LoginForm';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { Layout, Button,ApplicationProvider, IconRegistry, Spinner } from 'react-native-ui-kitten';
import { PersistGate } from 'redux-persist/integration/react';
import AsyncStorage from '@react-native-community/async-storage';
import { persistStore, persistReducer } from 'redux-persist'
import { composeWithDevTools } from 'remote-redux-devtools';

const persistConfig = {
  key: 'root',
  timeout: 0,
  storage:AsyncStorage,
  whitelist: ['isLoggedIn','user_credentials']
}

const persistedReducer = persistReducer(persistConfig, reducers)

const store = createStore(persistedReducer,composeWithDevTools(applyMiddleware(thunk)));

const persistor =  persistStore(store);
const loading = <View style={{flex:1, alignItems: 'center', justifyContent: 'center', backgroundColor:'rgba(0, 0, 0, 0.6)',}}><Spinner/></View>;
class App extends React.Component {
   render(){
      return (
         <Provider store={store}>
                <React.Fragment>
                   <IconRegistry icons={EvaIconsPack} />
                   <ApplicationProvider mapping={mapping} theme={lightTheme}>
                     <PersistGate loading={loading} persistor={persistor}>
                        <Routes />
                      <FlashMessage position="top"/>
                      </PersistGate>
                   </ApplicationProvider>
                </React.Fragment>
         </Provider>
      )
   }
}


export default App;

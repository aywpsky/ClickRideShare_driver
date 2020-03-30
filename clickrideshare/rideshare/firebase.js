import * as firebase from 'firebase';
import firestore from 'firebase/firestore'


var firebaseConfig = {
    apiKey: "AIzaSyAGR9cmdHFHti2i74qTHxgtTyVTlwGoOo0",
    authDomain: "clickrideshare.firebaseapp.com",
    databaseURL: "https://clickrideshare.firebaseio.com",
    projectId: "clickrideshare",
    storageBucket: "clickrideshare.appspot.com",
    messagingSenderId: "514550728286",
    appId: "1:514550728286:web:07a5bc157604832fa256cf",
    measurementId: "G-5LJ5PS1MYV"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


  export default firebase;
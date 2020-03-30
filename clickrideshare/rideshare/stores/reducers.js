import Moment from 'moment';
const initialMoment = Moment();
const initState = {
   count: 0,
   modalVisible: false,
   pinned_booking_id:[],
   changePassmodalVisible: false,
   isDateTimePickerVisible: false,
   isTimePickerVisible: false,
   search: false,
   isLoggedIn: false,
   toggleStatus: false,
   toggleStatusBookLater: false,

   user_login: {
      user_id: '',
      email: '',
      password: '',
   },
   user_credentials: {
      fk_user_id: '',
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      profile_pic: '',
      date_added: '',
   },
   edit_user_credentials: {
      edit_first_name: '',
      edit_last_name: '',
      edit_phone_number: '',
      edit_profile_pic: null,
      edit_password: '',
      edit_confirm_password: '',
      edit_old_password: '',
      image: null,
      images: null,
   },
   payment_records: {
     selectedIndex: 0,
     Claimed: [],
     ToBeClaimed: [],
     Searchdata: '',
     per_page: 30,
   },
   notifications: {
       selectedIndex: null,
       claimed_payments: [],
       alertCustomer: []
   },
   view_trip_history: {
      selectedIndex: 0,
      Completed: [],
      Cancelled: [],
      Searchdata: '',
      per_page: 30,

   },
   current_trip: {
       tripInfo: {},
       set_status: {},
       updateStatus: {},
       distance: '',
       duration: '',
   },
   decline_booking: {
     reason: ''
   },
   pickup_location: {
         latitude: 0,
         longitude: 0
   },
   dropoff_location: {
         latitude: 0,
         longitude: 0
   },
   view_pending_booking: {
      selectedIndex: 0,
      Pending: [],
      Searchdata: '',
      per_page: 10,
      up_bookingid: '',
      up_pickup_loc: '',
      up_dropoff_loc: '',
      up_date: '',
      up_time: ''
   },
   get_location: {
      latitude: 10.318597,
      longitude: 123.908437,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
  },
    get_distance:0.0,
}

const reducers = (state = initState, action) => {
   switch (action.type) {
      case 'INC':
         return {
            ...state,
            count: state.count += 1
         }
      case 'SET_LOGGEDIN_BOOLEAN':
         return {
            ...state,
            isLoggedIn: !state.isLoggedIn
         }
      case 'MODAL_VISIBLE':
         return {
            ...state,
            [action.state]: !state[action.state]
         }
      case 'SEARCH_VISIBLE':
         return {
            ...state,
            [action.state]: !state[action.state]
         }

      case 'HANDLE_CHANGES_WITH_PARENT':
         return {
            ...state,
            [action.parent_state]: {
               ...state[action.parent_state],
               [action.child_state]: action.value
            }
         }

      case 'HANDLE_CHANGE':
         return {
            ...state,
            [action.state]: action.value
         }
      case 'DEC':
         return {
            ...state,
            count: state.count -= 1
         }
      default:
         return state;
   }
}

export default reducers;

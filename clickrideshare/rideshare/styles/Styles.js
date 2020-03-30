import { StyleSheet, Dimensions, Platform } from 'react-native';

var width = Dimensions.get('window').width; //full width

export const Styles = StyleSheet.create({
    center: {
        textAlign: 'center'
    },
    footerCenter: {
        textAlign: 'center',
    },
    boldText: {
        fontWeight: 'bold'
    },
    icons: {
        paddingTop: 9,
    },
    sampleLeftButton: {
        height: '100%',
        width: '10%',
        // marginTop:50,
    },
    Viewicons: {
        marginLeft: 20,
        marginRight: 20,
        height: 40,
        width: 40,
        alignItems: 'center',
        borderRadius: 50,
    },
    buttonSubmit: {
        marginBottom: 10,
        marginTop: 10,
    },
    drawerHeaderName: {
        fontWeight: 'bold',
        marginTop: 95,
        fontSize: 20,
        alignSelf: 'center',
    },
    BookingModalBackground: {
        padding: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        top: 0,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1
    },
    ModalTopNavigation: {
        backgroundColor: 'transparent',
    },
    ModalIcon: {
        alignItems: 'flex-start',
    },
    modalText: {
        alignSelf: 'flex-start',
        marginHorizontal: 35,
    },
    change_profile_picture: {
        marginBottom: 10,
        marginTop: 10,
        color: '#6ab4d8',
    },
    modalInput: {
        borderRadius: 30,
        marginTop: 15,
        shadowRadius: 15,
        marginVertical: 15,
        marginHorizontal: 15,
    },
    ratingContent:{
        marginTop: 100,
    },
    textAreaContainer: {
        flexDirection: 'column',
        borderColor: 'grey',
        borderWidth: 1,
        width: '80%',
        marginTop:20,
        marginHorizontal: 50,
      },
      textArea: {
        textAlignVertical: "top",
        height: 150,
        justifyContent: "flex-start",
        fontSize:20,
      },
    FeedbackText:{
        marginVertical:10,
        marginHorizontal:50,
        fontSize: 20,
    },
    sendFeedbackImage:{
        width: 100,
        height: 100,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginTop:20,
    },
    sendFeedbackSubmitBtn: {
        marginVertical: 30,
        marginHorizontal: 10,
    },
    sendFeedbackSubmitBtnContainer: {
        flexDirection:'row',
        flexWrap:'wrap'
    },
    container: {
        flex: 1,
    },
    screen: {
        // position: 'absolute',
        // bottom: 0,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        zIndex: -1,
    },
    mapTextInputContainer: {
        width: '100%',
     },
    mapDescription: {
        fontWeight: 'bold'
     },
    mapPredefinedPlacesDescription: {
        color: '#1faadb'
     },
    containerFluid: {
        backgroundColor: '#fff',
    },
    subView: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        height: '85%',
     },
    BookaRidecontainer: {
        backgroundColor: '#ffffff',
        marginHorizontal: 15,
        marginTop: 180,
        flex: 1,
        borderRadius: 15,
    },
    BookaRidecontainer2: {
        backgroundColor: '#ffffff',
        marginHorizontal: 15,
        flex: 1,
        borderRadius: 15,
    },
    BookaRideheader: {
        backgroundColor: '#243c88',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        height: 60,
    },
    BookaRideheaderText: {
        color: '#fff',
        fontSize: 23,
        alignSelf: 'center',
        paddingVertical: 5,
    },
    BookaRidelocation: {
        backgroundColor: '#f9fcff',
    },
    BookaRideContents: {
        margin: 20,
        flexDirection: 'row',
    },
    BookaRideDetailsContent: {
        margin: 20,
        zIndex: -2,
    },
    BookaRideFlex: {
        flexDirection: 'row'
    },
    BookaRideCol: {
        width: '50%',
        paddingHorizontal: 5
    },
    BookaRideCol1: {
        width: '100%',
        paddingHorizontal: 5
    },
    BookaRideText: {
        color: '#919292',
    },
    BookaRideText1: {
        color: '#919292',
        marginLeft: 15,
        borderBottomColor: 'red',
    },
    BookaRideText2: {
        color: '#919292',
        marginLeft: 15,
        borderBottomColor: 'red',
        zIndex: -1,
    },
    BookaRideInput: {
        borderBottomColor: 'red',
    },
    BookaRideDetailsText: {
        fontSize: 23,
        paddingVertical: 20,
    },
    BookaRideIcons: {
        marginRight: 20,
        marginTop: 15,
    },
    BookaRideSubmit: {
        marginBottom: 10,
        marginTop: 10,
        paddingVertical: 20,
        borderRadius: 50,
        zIndex: -2,
    },
    DriverBookingButton: {
        marginBottom: 10,
        marginTop: 10,
        paddingVertical: 15,
        width: '48%',
        borderRadius: 50,
        zIndex: -2,
    },
    BookaRideInputs: {
        width: '85%',
    },
    BookaRidePlaceholderTextSize: {
        marginVertical: 5,
        height: 40,
        borderColor: '#eaebec',
        borderWidth: 1
    },
    BookaRideButtonSubmit: {
        marginBottom: 20,
        marginTop: 20,
        marginHorizontal: 30,
        zIndex: -2,
    },
    spinner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        paddingVertical: 4,
        paddingHorizontal: 4,
    },
    modalContainer: {
        width: 100 + '%',
        borderRadius: 15,
        elevation: 6,
        justifyContent: 'center',
        alignItems: 'center',
        shadowRadius: 15,
    },
    BookingModal: {
        borderRadius: 15,
        elevation: 6,
        shadowRadius: 15,
        width: '100%',
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    BookingDetailsContainer: {
        width: '100%',
        flexDirection: 'row',
        paddingBottom: 15,
    },
    BookingDetails: {
        borderColor: 'rgb(228, 233, 242)',
        borderRadius: 30,
    },
    BookingDetailsTitle: {
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center"
    },
    view: {
        backgroundColor: '#243c88',
    },
    error: {
        color: 'red'
    },
    header2: {
        marginTop: 70,
        backgroundColor: "transparent",
        zIndex:9999,
    },
    header: {
        backgroundColor: "#243c88",
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
    },
    editHeader: {
        backgroundColor: "transparent",
        zIndex:9999,
        marginTop:30,
    },
    headerTitle: {
        color: "#ffff",
    },
    headerContent: {
        padding: 30,
        alignItems: 'center',
    },
    drawer: {
        backgroundColor: '#fff',
        // backgroundColor: '#e8e8e8',
        height: '100%',
        marginBottom: 30
    },
    backgroundImage: {
        flex: 1,
        height: '300%',
        width: '200%',
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        top: -130,
        left: -130,
        bottom: 0,
        right: 0,
        opacity: 0.3
    },
    backgroundImage2: {
        flex: 1,
        height: '140%',
        width: '200%',
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        top: -130,
        left: -130,
        bottom: 0,
        right: 0,
        opacity: 0.3
    },
    backgroundImage3: {
        flex: 1,
        height: '200%',
        width: '200%',
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        top: -130,
        left: -130,
        bottom: 0,
        right: 0,
        opacity: 0.3
    },
    drawerHeader: {
        alignItems: 'center',
        backgroundColor: '#243c88'
    },
    drawerContent: {
        height: '23%',
        alignItems: 'center',
        backgroundColor: '#e8e8e8',
        zIndex: -1
    },
    drawerHeaderDescription: {
        color: '#78849e',
    },
    drawerBody: {
        height: 30,
        alignItems: 'center',
        backgroundColor: '#007849'
    },
    menus: {
    },
    menuListSelected: {
        backgroundColor: '#d0e3f6',
        borderLeftWidth: 3,
        borderLeftColor: '#0353a1',
        height: 75,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuList: {
        height: 75,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    notifList: {
        marginHorizontal: 8,
        marginVertical: 3,
        height: 75,
        width: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 8,
    },
    drawerFooter: {
        height: 30,
        alignItems: 'center',
        backgroundColor: '#eeaa7b',
    },
    drawer_header: {
        backgroundColor: "#243c88",
    },
    listContainer: {
        paddingTop: 5,
        height: Dimensions.get('window').height - 90,
        paddingBottom: 3
    },
    list: {
        height: 'auto',
        backgroundColor: '#cccccc'
    },
    tabTitleSelected: {
        backgroundColor: '#243c88',
        color: '#ffff',
        borderRadius: 30,
        width: Platform.OS === 'ios' ? '100%':'95%',
        textAlign: 'center',
        paddingVertical: 12,
    },
    tabView: {
        backgroundColor: 'transparent',
        height: Dimensions.get('window').height - 160
    },
    tabBar: {
        backgroundColor: '#ffffff',
        height: 50,
        margin: 10,
        padding: 15,
        borderRadius: 30,
        overflow: 'hidden',
        elevation: 2,
    },
    footer: {
        backgroundColor: '#fff',
        paddingVertical: 5,
    },
    tabViewIndicator: {
        backgroundColor: 'transparent'
    },
    tablist: {
        backgroundColor: 'transparent',

    },
    pinnedTablist: {
        backgroundColor: '#fff',
        marginHorizontal: 5,
        borderRadius:10,
        marginBottom:5
    },
    pinnedTablistItems: {
        margin:10
    },
    pinnedDataItem: {
        marginBottom:10
    },
    pinnedHeaderText: {
        fontWeight: 'bold'
    },
    pinnedContentText: {
        color: '#3766ff',
        fontStyle:'italic'
    },
    items: {
        marginTop: 3,
        borderRadius: 10,
        marginHorizontal: 7,
        height: 80
    },
    pinnedButtons: {
        flexDirection: 'row',
        marginHorizontal: '25%',
        marginBottom:10
    },
    pinnedItems: {
        marginTop: 3,
        borderRadius: 10,
        marginHorizontal: 7,
    },
    listItemTitle: {
        width: 200
    },
    historyListItemTitle: {
        width: 175
    },
    pinnedListItemTitle: {
        width: 200,
        color: '#000',
        fontSize: 15,
        marginBottom:10,
    },

    listItemDescComp: {
        color: '#3766ff',
    },
    listItemDescCanc: {
        color: '#ff3a4b'
    },
    listItemDescToBeClaimed: {
        color: '#209973'
    },
    text: {
        color: '#ffff',
    },
    subtext: {
        color: '#9ab2ff',
        textAlign: 'center'
    },
    logo: {
        marginBottom: 40,
        marginTop: 40
    },
    // modalContainer: {
    //   width: 100+'%',
    //   height: 100+'%',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    // },
    input: {
        borderRadius: 30,
        elevation: 6,
        shadowRadius: 15,
        marginTop: 15
    },
    search: {
        borderRadius: 30,
        fontSize: 12,
        marginVertical: 7,
        alignItems: 'center',
        position: 'absolute',
        height: 45,
        right: 50,
        top: Platform.OS === 'ios' ? 45 : 50,
        width: Dimensions.get('window').width - 100,
        zIndex: 3
        // transform: [
        //   { perspective: 850 },
        //   { translateX: - Dimensions.get('window').width * 0.24 },
        //   { rotateY: '60deg'},
        // ],
    },
    button: {
        marginVertical: 4,
        marginHorizontal: 4,
        alignSelf: 'stretch',
        borderRadius: 30,
        backgroundColor: '#ff3a4b',
        borderColor: '#243c88',
        elevation: 6,
        shadowRadius: 15,
        marginBottom: 30,
        marginTop: 30,
    },
    alert: {
        borderRadius: 3,
        opacity: 0.85,
        margin: 0.5
    },
    icon: {
        width: 50,
        height: 30,
        marginTop: 20,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
    },
    avatar2: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: -65,
    },
    name: {
        marginTop: 10,
        fontSize: 22,
        color: "#ffff",
        fontWeight: '600',
    },
    userInfo: {
        fontSize: 12,
        color: "#ffff",
        fontWeight: 'normal',
        alignItems: 'flex-start',
    },
    screens: {
        width: Dimensions.get('window').width - 120
    },
    driverTripDetails: {
        alignItems: 'center',
        height: 24,
        width: 'auto',
        paddingHorizontal: 8,
        borderRadius: 12,
        backgroundColor: '#c5c5c5',
    },
    badge: {
        alignItems: 'center',
        height: 24,
        width: 24,
        borderRadius: 30,
        backgroundColor: 'red',
    },
    badgeText: {
        color: '#ffff',
        fontSize: 14
    },
});

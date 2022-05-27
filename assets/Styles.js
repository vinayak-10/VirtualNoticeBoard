import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
      
      marginTop: 0,
      padding: 5,
    },
    swipe_container: { 
      flex: 0, 
      backgroundColor: 'white' 
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    wrapper: {
      flex: 0,
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
      backgroundColor: 'white',
    },
    bottom: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#eaeaea',
    },
    tinyLogo: {
      width: 100,
      height: 100,
      
      flex: 1,
    },
    text: {
      fontSize: 20,
    },
  
    home_item: {
      padding: 20,
      height: 250,
      width: Dimensions.get('window').width,
    },
    contacts_item: {
      padding: 20,
      height: 100,
      width: Dimensions.get('window').width,
    },
    home_card: {
      padding: 0,
      flex: 1,
      position: 'relative',
      overflow: 'scroll',
      height: 90,
      maxWidth: Dimensions.get('window').width-40,
    },
    contacts_card: {
      padding: 0,
      flex: 1,
      position: 'relative',
      overflow: 'scroll',
      height: 90,
      maxWidth: Dimensions.get('window').width-30,
    },
    input: {
      marginTop: 20,
      paddingHorizontal: 24,
      fontSize: 20,
      height: 70,
      borderRadius: 20,
      width: Dimensions.get('window').width,
    },
    otp: {
  
    },
    button: {
      marginTop: 30,
      fontSize: 24,
      width: Dimensions.get('window').width,
  
    },
    resend_button:{
      fontSize: 24,
      color:'blue',
      width: Dimensions.get('window').width/2.6,
      flexDirection: 'row',
      marginLeft: Dimensions.get('window').width/1.5,
    },
    logo: {
      marginLeft: 72,
      width: 200,
      height: 200,
          
    },
    roundButton: {
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderRadius: 50,
      backgroundColor: 'blue',
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
   
    root: {
      flex: 2,
      marginTop: StatusBar.currentHeight || 0,
      backgroundColor: '#eaeaea',
    },
    editor: {
      flex: 1,
      padding: 0,
      borderColor: 'gray',
      
      backgroundColor: 'white',
    },
  });
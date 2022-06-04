import React,{useState ,Component,useEffect} from 'react';
 import type {Node} from 'react';
 import {
   SafeAreaView,
   ScrollView,
   StatusBar,
   StyleSheet,
   Text,
   TextInput,
   useColorScheme,
   ActivityIndicator,
   View,
   Button,
   Image,
   TouchableOpacity,
   ToastAndroid,
   FlatList,
   TouchableHighlight,
   useWindowDimensions,
   KeyboardAvoidingView,
   TouchableWithoutFeedback,
   Keyboard,
   Dimensions,
   Linking,
   Platform,
   RefreshControl,
   PermissionsAndroid,
   Alert,
   BackHandler,
 } from 'react-native';





import { NavigationContainer } from '@react-navigation/native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { WebView } from "react-native-webview";
import {createStackNavigator} from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { createDrawerNavigator, DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Animated,{ Value } from 'react-native-reanimated';
import 'react-native-gesture-handler';


import { FAB, DefaultTheme, Portal, Provider, Card, Appbar,  Menu, Divider, Avatar, Title, Paragraph } from 'react-native-paper';
import * as RNP from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import * as icon from 'react-native-vector-icons/FontAwesome';
import {MaterialCommunityIcons} from "react-native-vector-icons";
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';

import { Cache } from "react-native-cache";
import { SearchBar } from 'react-native-elements';



import { addUser, updateUser} from './feature/User';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import OTPInput from 'react-native-otp';


const App: () => Node = ({navigation}) => {

    const [hid ,setHid] = useState('');
    const [search ,setSearch] = useState('');
    const [visible, setVisible] = React.useState(false);
    

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);
    const [filteredDataSource, setFilteredDataSource] = useState([]);


    function OTPScreen({navigation}) {

    const [code, setCode] = useState('');
    const handleOTPChange = (otp) => {
      setCode(otp);
    };
  
    const clearOTP = () => {
      setCode('');
    };
  
    const autoFill = () => {
      setCode( '221198' );
    };
        return(
          <View style={styles.container}>
            <OTPInput
                value={code}
                onChange={handleOTPChange}
                tintColor="#FB6C6A"
                offTintColor="#BBBCBE"
                otpLength={6}
            />
            <Button onPress={clearOTP} title="Clear" />
            <Button onPress={autoFill} title="Auto fill" />
          </View>
        );
      }

      const DrawerContent = (props) =>(
            <DrawerContentScrollView {...props}>
              <View style={styles.drawerContent}>
                <RNP.Drawer.Section style={styles.drawerSection}>
                  <RNP.Drawer.Item
                    icon="account-outline"
                    label="Profile"
                    onPress={() => {alert('Profile pressed')}}
                  />
                  <RNP.Drawer.Item
                    icon="bookmark-outline"
                    label="Bookmarks"
                    onPress={() => {alert('Bookmark added')}}
                  />
                  <Divider />
                  <RNP.Drawer.Item
                    icon="tune"
                    label="Settings"
                    onPress={() => {alert('Settings pressed')}}
                  />
                </RNP.Drawer.Section>
              </View>
            </DrawerContentScrollView>
        );
      
      
      const Drawer = createDrawerNavigator();

      return(
        <Provider>
          <NavigationContainer>
            <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props}/>} >
              <Drawer.Screen name="OTP" component={OTPScreen} />
            </Drawer.Navigator>
          </NavigationContainer>
        </Provider>
  
  
      );
  

    


}


const styles = StyleSheet.create({

  drawerContent: {
    flex: 1,
  },

  drawerSection: {
    marginTop: 15,
  },
  borderStyleBase: {
    width: 30,
    height: 45
  },

  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    fontSize: 24,
    color: '#000000',
  },

  underlineStyleHighLighted: {
    borderColor: "#03DAC6",
    color: '#000000'
  },
    container_signUp: {
  
      marginTop: 0,
      padding: 20,
      
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    container:{
      marginTop: 0,
      padding: 5,
      flex: 1,
      
  
    },
    new_user_container:{
      marginTop: 0,
      padding: 5,
      justifyContent: 'space-around',
  
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
      position: 'relative',
      left: 0,
      right: 0,
      bottom: 0,
      height: 50,
      backgroundColor: '#84dbfa',
      alignItems: 'center',
      justifyContent: 'center',
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
      marginTop: 40,
      paddingHorizontal: 24,
      fontSize: 20,
      height: 70,
      borderRadius: 20,
      width: Dimensions.get('window').width,
    },
    new_input: {
      position: 'relative',
      marginTop: 40,
      paddingHorizontal: 24,
      fontSize: 20,
      height: 70,
      borderRadius: 20,
      width: Dimensions.get('window').width,
    },
    otp: {
  
    },
    button: {
      marginTop: 15,
      marginLeft: Dimensions.get('window').width/50,
      marginRight: Dimensions.get('window').width/20,
      fontSize: 24,
      
      alignItems: 'center',
      backgroundColor: '#214463',
    },
    next_button: {
      position: 'relative',
      marginTop: Dimensions.get('window').height/1.85,
      marginLeft: Dimensions.get('window').width/1.4,
      
      flexDirection: 'row',
      fontSize: 24,
      alignContent: 'center',
      backgroundColor: '#214463',
    },
    skip_button: {
      marginTop: Dimensions.get('window').height/1.18,
      position: 'absolute',
      color: '#000000',
      marginRight: Dimensions.get('window').width/2,
      fontSize: 24,   
      alignSelf: 'flex-start',
      flexDirection: 'column-reverse',
      
    },
    resend_button:{
      fontSize: 24,
      color:'blue',
      width: Dimensions.get('window').width/2.6,
      flexDirection: 'row',
      marginLeft: Dimensions.get('window').width/1.7,
    },
    logo: {
      marginLeft: Dimensions.get('window').width/40,
      marginBottom: 20,
      marginTop:5,
      width: 300,
      height: 300,
  
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
      backgroundColor: '#214463',
    },
  
    fab_post: {
      position: 'relative',
      margin: 16,
      right: 0,
      bottom: 0,
      left: -20,
      backgroundColor: '#214463',
    },
  
    fab_sigOut: {
      position: 'relative',
      margin: 16,
      right: -30,
      bottom: 0,
      left: 20,
      backgroundColor: '#214463',
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

export default App;
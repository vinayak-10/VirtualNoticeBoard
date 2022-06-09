/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

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
   ImageBackground,
 } from 'react-native';





import { NavigationContainer } from '@react-navigation/native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from "react-native-webview";
import {createStackNavigator} from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { createDrawerNavigator, DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Animated,{ Value, BounceIn, BounceOut, Layout } from 'react-native-reanimated';
import 'react-native-gesture-handler';

import Contacts from 'react-native-contacts';

import { FAB, DefaultTheme, Portal, Caption, Provider, Card, Appbar,  Menu, Divider, Avatar, Title, Paragraph } from 'react-native-paper';
import * as RNP from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import * as icon from 'react-native-vector-icons/FontAwesome';

import { Cache } from "react-native-cache";
import { SearchBar } from 'react-native-elements';
import OTPInput from 'react-native-otp';
import Swiper from "react-native-custom-swiper";




import { addUser, updateUser} from './feature/User';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import auth from '@react-native-firebase/auth';

import { Divider as ElementsDivider } from "react-native-elements";

// Require `PhoneNumberFormat`.
const PNF = require('google-libphonenumber').PhoneNumberFormat;



// Get an instance of `PhoneNumberUtil`.
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();


 /*
  function onPressAddImage() {
    // you can easily add images from your gallery
    richText.current?.insertImage(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png"
    );
  }

  const richText = React.createRef();
  return (
    <View style={styles.root}>
      <StatusBar style="auto"  barStyle={'dark-content'}/>
      <ScrollView>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}	style={{ flex: 1 }}>
                    <Text>Description:</Text>
                    <RichEditor
                        ref={richText}
                        onChange={ descriptionText => {
                            console.log("descriptionText:", descriptionText);
                        }}
                    />
                </KeyboardAvoidingView>
            </ScrollView>

            <RichToolbar
                editor={richText}
                actions={[ actions.setBold, actions.setItalic, actions.setUnderline, actions.heading1,actions.insertImage ]}
                onPressAddImage={onPressAddImage}
                iconMap={{ [actions.heading1]: ({tintColor}) => (<Text style={[{color: tintColor}]}>H1</Text>), }}
            />

    </View>
  );
  _editor.current?.insertEmbed(
        0,
        'image',
        'https://picsum.photos/200/300'
      );

*/



class User{
    constructor(number='',name=''){
      this.number = number;
      this.name = name;
      this.email = "";
      this.token = null;
      this.dspn = '';
      this.Permissions = [];
    }

    update(name='', number='', email='', token=null,permissions=[],dspn='') {
      if(name) this.name = name;
      if(number) this.number = number;
      if(email) this.email = email;
      if(token) this. token = token;
      if(dspn) this.dspn = dspn;
      if(permissions) this.Permissions = permissions;
      //updateUser(this.number,this.name,this.dspn,this.email);
    }

}


const App: () => Node = ({navigation}) => {

  //Declarations.

  const AuthContext = React.createContext();
  const Stack = createNativeStackNavigator();
  const Tab = createMaterialTopTabNavigator();
  const Drawer = createDrawerNavigator();

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };





  const [selectedUser, setSelectedUser] = useState(['']);
  //const [displayName, setDisplayName] = useState('');
  //const [token, setToken] = useState(null);
  //const [initializing, setInitializing] = useState(true);
  const [confirm, setConfirm] = useState(null);

  //const [logIn, setLogIn] = useState(true);
  const [hid, setHid] = useState(null);
  //const [cid, setCid] = useState(null);
  //const [nom, setNom] = useState('');
  const [user, setUser] = useState({});
  //const [post, setPost] = useState(null);
  //const [usr, setUsr] = useState();


/*
  const [stat, setStat] = React.useState({ open: false });
  const { open } = stat;
  const onStateChange = ({ open }) => setStat({ open });
*/

  const [visible, setVisible] = React.useState(false);


  //const openMenu = () => setVisible(true);
  //const closeMenu = () => setVisible(false);
  //const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';
  //const [isReady, setIsReady] = React.useState(false);

  const [cache,setCache] = useState(new Cache({
    namespace: "User",
    policy: {
        maxEntries: 50000, // if unspecified, it can have unlimited entries
        stdTTL: 0 // the standard ttl as number in seconds, default: 0 (unlimited)
    },
    backend: AsyncStorage
  }));

  const [current_user, setCurUser] = useState(new User());

  const URL_PROFILE = "http://api.dwall.xyz/v1/profile/";
  const URL_POST = "http://api.dwall.xyz/v1/post/";

  const html = `<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>`;

  const htmlCard = `<head><meta name="viewport" content="width=device-width, initial-scale=0.3"></head>`;


  const [posts, setPosts] = useState([]);

  const [g_contacts, setGcontacts] = useState([{}]);

  const [postTitle, setTitle] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'newTitle':
          return{
            title: action.payload,
          };
        case 'reset':
          return{
            title: '',
          };
      }
    },
    {
      title: '',
    }
  );

  const bootstrapAsync = async () => {
    let userToken=null;

    try {
      // Restore token stored in `SecureStore` or any other encrypted storage
      //userToken = await confirm.confirm(code);

      const luser = await cache.get("SignedIn_User");
      const lJsonUser = JSON.parse(luser);
      console.log("Calling from bootstrapasync:\nluser :-   " + luser+"\nlJsonUser:-   "+lJsonUser);
      userToken = lJsonUser.auth_token;
      current_user.update(lJsonUser.name,lJsonUser.Author,lJsonUser.e_mail,lJsonUser.auth_token,lJsonUser.Permissions,lJsonUser.displayName);

      //g_contacts[0].name=current_user.name;
      //g_contacts[0].PhoneNumber=current_user.number;
    } catch (e) {
      // Restoring token failed
      //console.log(e);
      //console.log("No user exists in cache.");
      userToken = null;
    }
    finally{
      let response = await getAllUsers();
      if(response !== null){
        setGcontacts(response);
      }
      else{
        console.log("Users not retrieved");
      }
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    }
    // After restoring token, we may need to validate it in production apps

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    
    
  };



  //Functions dealing with server related data operations.

  const getUser = (num) => new Promise(async resolve => {
      //Need to get all users to display contacts.

      try{
        console.log("Fetching profile");
         const response = await fetch(URL_PROFILE+'get',{
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },
              body: JSON.stringify({
              Author: num,
              ReportType: "Detailed",
              Permissions: ["Add", "View"]

              })
          });
          console.log("Waiting for fetch profile response");

          let jsonResponse = await response.json();
          //let obj = {};
          if(jsonResponse.Response === 200) {
              console.log("Calling from getUser:\n" + JSON.stringify(jsonResponse.profile[0]));
              /*
              for (const [key, value] of Object.entries(jsonResponse.profile)){
                  console.log("Key: "+key+ " Value: "+value);
                  obj[key] = value;
              }
              console.log(JSON.stringify(obj));
              */

              //Set current_user here .
              await cache.set("SignedIn_User",JSON.stringify(jsonResponse.profile[0]));
              current_user.update(jsonResponse.profile[0].name,jsonResponse.profile[0].Author,jsonResponse.profile[0].e_mail,jsonResponse.profile[0].auth_token,jsonResponse.profile[0].Permissions,'');
              //setUser(jsonResponse.profile);
              //console.log("Calling from getUser on user:\n" + JSON.stringify(user));
              //dispatch({ type: 'SIGN_IN', token: current_user.token });
              resolve(true);
            }
            else{
              console.log("User Not Found Will Collect Profile.");
              //dispatch({ type: 'SIGN_UP', token: current_user.token });
              resolve(false);
            }

    }catch(err){
      console.log(err);
      resolve(false);
    }
  });



  const getAllUsers = () => new Promise(async resolve => {
    //Need to get all users to display contacts.

    try{
      console.log("Fetching profile");
       const response = await fetch(URL_PROFILE+'get',{
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
              },
            body: JSON.stringify({
            Authors: [],
            ReportType: "Summary",
            Permissions: ["Add"]
            })
        });
        console.log("Waiting for fetch profile response");

        let jsonResponse = await response.json();
        let obj = {};
        let objArray = [];
        if(jsonResponse.Response === 200) {
            console.log("Calling from getAllUser jsonResponse.profile:\n" + JSON.stringify(jsonResponse.profile));
            
            for (var element in jsonResponse.profile){
                objArray.push(jsonResponse.profile[element]);
            }
            console.log("objArray from GetAllUsers: \n" + JSON.stringify(objArray));
            
            //await cache.set("SignedIn_User",JSON.stringify(jsonResponse.profile));
            //setUser(jsonResponse.profile);
            //console.log("Calling from getUser on user:\n" + JSON.stringify(user));
            //dispatch({ type: 'SIGN_IN', token: current_user.token });
            resolve(objArray);
          }
          else{
            //console.log("User Not Found Will Collect Profile.");
            //dispatch({ type: 'SIGN_UP', token: current_user.token });
            resolve(null);
          }

    }catch(err){
    console.log(err);
    resolve(false);
    }
  });




  function getPost(num){

       fetch(URL_POST+'get',{
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
          body: JSON.stringify({
              Author: num,
          })
      })
          .then((response) => {
              //console.log(response);
              return response.json();
            })
          .then((jsonResponse) => {
            console.log("Log of jsonResponse from getPost: " + JSON.stringify(jsonResponse));

            if (jsonResponse.Response==200) {

            let resp_arr = [];
            let resp = {};
              jsonResponse.p.forEach((element,i) => {
                  resp["_id"] = element._id;
                  resp["Author"] = element.Author;
                  resp["CreatedOn"] = element.CreatedOn;
                  resp["Post"] = html+"<body>"+element.Post+"</body>";
                  resp_arr[resp_arr.length] = resp;
                  //console.log("\nCalling inside forEach : \n" + JSON.stringify(element) + "\n");
                  //console.log("Logging Response arraya from get post: \n" + JSON.stringify(resp_arr));
                  resp={};
                });

              setPosts(resp_arr);
              resp_arr = [];
              setTimeout(() => {}, 20000);
             
            }
            else{
              console.log("User has no posts available or the user is not registered.");

            }
            })
          .catch((err) => {
              console.log(err);
          });
  }



  function deletePost(postId,createdOn,author){
    fetch(URL_POST+'delete',{
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
      body: JSON.stringify({
          _id: postId,
          CreatedOn: createdOn,
          Author: author,
      })
      })
      .then((response) => {
          //console.log(response);
          return response.json();
        })
      .then((jsonResponse) => {
        console.log(jsonResponse);

        if (jsonResponse.Response==200) {
            posts.forEach((element,i) => {
              if(element._id === postId){
                  posts.splice(i,i);
              }
            });
            console.log("Post was successfully deleted.");
        }
        else{
          console.log("Something went wrong.");

        }
        })
      .catch((err) => {
          console.log(err);
      });
  }



  const GetContacts = async () => {


      try{
      const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                  {
                    'title': 'Contacts',
                    'message': 'This app would like to view your contacts.',
                    'buttonPositive': 'Please accept bare mortal'
                  }
                );
        if(permission === PermissionsAndroid.RESULTS.GRANTED)
        {
          let cs = await Contacts.getAllWithoutPhotos();

            // work with contacts
            //console.log("Printing cs: \n" + cs);
            let contactsObj = [];
            let num_array = [];
            cs.forEach((contact, i) => {
                let contactObj = {};
                contactObj.name = contact.givenName + ' ' + contact.familyName;
                
                contactObj.index = i+1;
                contact.phoneNumbers.forEach((num, i) => {
                    try {
                      console.log(contactObj.name);
                      const nformat = phoneUtil.parseAndKeepRawInput(num.number, 'IN');
                      console.log("Parsed number: " + nformat.getRawInput());
                      let e164num = phoneUtil.format(nformat, PNF.E164);
                      console.log("e164: " + e164num);
                      contactObj.Author = e164num;
                    } catch (err) {
                      console.log("Invalid phone numner:" + num.number + " skipping...")
                    }
                  });        // end foreach
                contactObj.postCount = 0;
                contactObj.recentPost = '';  
              contactsObj.push(contactObj);
              num_array.push(contactObj.Author);
            }); // end foreach

            let response = await getAllUsers(num_array);


            //filter registered contacts.
            
            if(response !== null) {
              // prepare responseArray from response
              let responseArray =  [];

              response.forEach(element => {
                responseArray.push(element.Author);
              });


              // for each element in contactsObj; check if number is present in response
              // if Yes, Ignore it ( don't append )

              var filtered = contactsObj.filter( (value) => {
                return !responseArray.includes(value.Author);
                });

                let key = "name";
                filtered.sort(function(a,b){
                  var x = a[key]; var y = b[key];
                  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                });

              setGcontacts(response.concat(filtered)); 
              
            } 
            else {

              let key = "name";
              contactsObj.sort(function(a,b){
                var x = a[key]; var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                });

                setGcontacts(contactsObj);
            }


            // for each element in contactsObj; check if number is present in response
            // if Yes, Ignore it ( don't append )

            /*
            let key = "name";
            contactsObj.sort(function(a,b){
              var x = a[key]; var y = b[key];
              return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
            setGcontacts(contactsObj);*/
            //console.log("Everything run successfully in GetContacts: \n" + JSON.stringify(g_contacts) + "\n"+ JSON.stringify(contactsObj));



        } // end then
        else{
          console.log("Calling from GetContacts else \n" + "Permission not granted");
        }
      }
      catch(err){
        console.log("Calling from GetContacts last catch() \n"+err);
      }

  };



  async function signInWithPhoneNumber(phoneNumber) {
    console.log(phoneNumber);
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber,true);
    console.log(confirmation.verificationId);

    setConfirm(confirmation);
  }

  const confirmCode = (code) => new Promise(async resolve => {
    console.log("Inside Confirm Code");
    try {
      if(await confirm.confirm(code)){

        current_user.token = confirm.verificationId;
        //setIsReady(true);
        ToastAndroid.showWithGravityAndOffset(
          "Code Confirmed",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );

        //console.log("Code confirmed for user:" + number + " Name:" + name + " Display Name:" + displayName + " email:" + email );

        //addUser(current_user.number,current_user.name,current_user.name,current_user.email,current_user.token);


        resolve(true);


      }
    } catch (error) {
        console.log(error);
        ToastAndroid.showWithGravityAndOffset(
          "Wrong Code Entered, Enter the correct code.",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
          resolve(false);
      }
  });



  //Screen Functions defining defferent screens.
  /*
           <RNP.ActivityIndicator animating={true} color={RNP.Colors.red800} size='large' />

  */

  function ProfileScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Profile!</Text>
      </View>
    );
  }


  function SplashScreen() {
    return (
      
      <View style={{justifyContent:'space-evenly', alignItems:'center',flex: 1}}>
        <Image
          source={require('./assets/Virtual-Notice-Board-logos.png')}
          style={styles.logo} />
        <RNP.ActivityIndicator animating={true} color={RNP.Colors.red800} size='large' />
        <Text>Loading...</Text>
      </View>
      
    );
  }


  function WelcomeScreen() {
    return(
      <RNP.TouchableRipple
        onPress={() => {
          bootstrapAsync();
          //GetContacts();
        }}
        centered
        rippleColor="rgba(0, 0, 0, .32)"
        style={styles.container}
      >
      <Animated.View 
        entering={BounceIn} 
        style={styles.container}
        layout={Layout.springify()}
        exiting={BounceOut}
        
        >
        <Image source={require('./assets/Virtual-Notice-Board-logos.png')} style={styles.welcome_logo} />
        <Title style={styles.title}>A Notice Board that never lets you fall behind</Title>
      </Animated.View>
      </RNP.TouchableRipple>
    );
  }


  function SignUpScreen() {
    //Beautify text inputs.
    //Give Country code functionality to user.
    const [number, setNumber] = useState('');
    const {OTP} = React.useContext(AuthContext);
    const image = { uri: "http://api.dwall.xyz/v1/app/random-image" };


    return (
      <KeyboardAwareScrollView
          style={{flex:1, height: Dimensions.get('window').height}}>
         <View style={styles.container_signUp}>
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>

            <RNP.TextInput
              keyboardType='numeric'
              mode='outlined'
              style={styles.input}
              outlineColor='white'
              activeOutlinedColor='#214463'
              placeholder="Enter Phone Number"
              label="Phone Number"
              maxLength={10}
              onChangeText={(text) => setNumber( text ) }
              value={number}
              />
            <RNP.Button
                mode='contained'
                style={styles.button}
                compact
                onPress={() =>
                          {
                            current_user.update("","+91"+number,"");
                            //signInWithPhoneNumber(current_user.number);
                            OTP();
                          } }
                disabled={false} >
              GET OTP
            </RNP.Button>
        </ImageBackground>
        </View>
      </KeyboardAwareScrollView>
    );
  }


  function OTPScreen() {
    //Add resend OTP functionality, Hide/Disable OTP Text Box until required

    const { signUp } = React.useContext(AuthContext);
    const { signIn } = React.useContext(AuthContext);
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

    useEffect(() => {

      const backStart = () => {
        dispatch({ type: 'RESTORE_TOKEN', token: null });
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backStart
      );

      return () => backHandler.remove();
    }, []);

    //console.log("name: "+current_user.name+" number: "+current_user.number+" email: "+current_user.email);

    return (

      <View>

        <OTPInput
          value={code}
          onChange={handleOTPChange}
          cellStyle={{marginBottom:5,
            marginTop:Dimensions.get('window').height/4,}}
          tintColor="#FB6C6A"
          offTintColor="#BBBCBE"
          otpLength={6}
        />

        <RNP.Button
          mode='contained'
          style={{
            width:Dimensions.get('window').width/1.5,
            left: Dimensions.get('window').width/6,
            }}
          onPress={async () =>{
            //If user found in database then log in to contacts screen, else go to create user screen.
            
            //confirmed
            //let confirmed = await confirmCode(code);

            if ( code == current_user.number.substring(3,9) ) {
              console.log("Calling get user" );
              let response = await getUser(current_user.number);

              if (response) console.log("getuser successfull");
              else  console.log("getuser Failed");
              //setIsReady(false);
              if(response){
                signIn()
              }
              else{
                current_user.token = 'DUMMY';
                signUp()
              }
            } else {
              // remain in OTP screen
              console.log("Confirm Code failed");
            }
            
          }}
          >
         Confirm Code
        </RNP.Button>
        <RNP.Button  mode='text' compact style={styles.resend_button} onPress={()=>{}}>Resend OTP </RNP.Button>
      </View>

    );
  }


  function CreateUserScreen({ navigation }) {

    const { signIn } = React.useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    //Call getUser here before rendering Register user page.

    useEffect(() => {
      const backStart = () => {
        dispatch({ type: 'RESTORE_TOKEN', token: null });
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
          backStart
      );

      return () => backHandler.remove();
    }, []);



    return (
      <KeyboardAwareScrollView>
        <View style={styles.new_user_container}>
            <RNP.TextInput
              style={styles.new_input}
              mode='outlined'
              keyboardType='default'
              placeholder="Enter Full Name"
              label='Full Name'
              outlineColor='white'
              activeOutlinedColor='#214463'
              onChangeText={(text) => setName( text ) }
              value={name}
              />
            <RNP.TextInput
              keyboardType='email-address'
              mode='outlined'
              label='E-mail'
              style={styles.new_input}
              value={email}
              placeholder="Enter Email"
              onChangeText={(text) => setEmail( text ) }
              />
            <RNP.Button
              style={styles.next_button}
              mode='contained'
              onPress={async () => {
                       //Add User with name and E-mail
                       current_user.update(name,'',email,'',['View']);
                       console.log(current_user.name + " "+ current_user.email + " " + current_user.Permissions);
                       addUser(current_user.number,current_user.name,current_user.name,current_user.email,current_user.token);
                       let luser = {};
                        luser["_id"] = current_user.number;
                        luser["name"] = current_user.name;
                        luser["displayName"] = current_user.dspn;
                        luser["e_mail"] = current_user.email;
                        luser["auth_token"] = current_user.token;
                        luser["auth_type"] = "Google FireBase";
                        luser["Permissions"] = ["View"];

                       await cache.set("SignedIn_User", JSON.stringify(luser));
                       let c = await cache.get("SignedIn_User");
                       console.log("Calling from Create User function: \n"+c);
                       signIn();
                      }}
              disabled={false}
            >
            Next
            </RNP.Button>
        </View>
      </KeyboardAwareScrollView>
    );
  }


  function CreatePost({navigation}){
    //Attached to FAB on Home Screen.

    const { signOut } = React.useContext(AuthContext);
    const { back } = React.useContext(AuthContext);
    const URLName = encodeURIComponent(current_user.number);  //current_user.number
    const URL = "http://editor.dwall.xyz/?Author="+ URLName+"&DisplayName="+encodeURIComponent(current_user.name);
    //let webRef = React.createRef(null);
    Alert.alert("You can copy this URL into your browser to create a post from there.:\n", URL);

    console.log(URL);
    //const URL = "http://editor.dwall.xyz/?Author="+current_user.number.substring(3);

    //console.log("state.isInput : " + state.isInput);

    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <FAB
          style={styles.fab_sigOut}
          small
          icon="logout-variant"
          onPress={() => {
            setConfirm(null);
            signOut()
          }}
            title="Sign Out"
          />
        ),
        headerLeft: () => (
          <FAB
              style={styles.fab_post}
              small
              icon="keyboard-backspace"
              onPress={back}
            />
        ),

      }
      );
    }, [navigation]);

    useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        back
      );

      return () => backHandler.remove();
    }, []);
    /*
    const run = `
    document.body.style.backgroundColor = 'blue';
    setTimeout(()=> {
      window.ReactNativeWebView.postMessage("Hello!");
    }, 2000);
    true;
    `;

    setTimeout(() => {
      webRef.current.injectJavaScript(run);
    }, 3000);
    */
    return(
      <KeyboardAwareScrollView style={styles.container_creatPost}>
        <WebView
          originWhitelist={['*']}

          onMessage={(event) => {
            alert(event.nativeEvent.data);
          }}
          source={{uri:URL }}
          style={{backgroundColor: 'white', position: 'relative' }}
          containerStyle={{width:Dimensions.get('window').width-10,
                  height: Dimensions.get('window').height/1.2,
                  flex: 0,}}
        />
      </KeyboardAwareScrollView>
    );



    /*
    //populate current_user with user details currently signed in and use that user's phone number to create a post.
    return(
      <KeyboardAwareScrollView style={styles.container}>
        <WebView
          originWhitelist={['*']}
          source={{uri:URL }}
          style={{backgroundColor: 'white', position: 'relative' }}
          containerStyle={{width:Dimensions.get('window').width-10,
                  height: Dimensions.get('window').height/1.2,
                  flex: 0,}}
        />
      </KeyboardAwareScrollView>
    );
    */
  }


  function ContactsScreen({navigation, route}) {

    //Use Contacts array to populate FlatList.
    //Map Contacts to their posts through getUser
    //First contact should be this user.

    const { input } = React.useContext(AuthContext);
    const { view } = React.useContext(AuthContext);
    const { signOut } = React.useContext(AuthContext);
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState(g_contacts);
    


    /*
      React.useLayoutEffect(() => {
        navigation.setOptions({
          headerSearchBarOptions: {
            onChangeText: (event) => searchFilterFunction(event.nativeEvent.text),
            onClear:(event) => searchFilterFunction(''),
            hideNavigationBar: true,
            disableBackButtonOverride: false,
          },


        });
      }, [navigation]);
    */

      React.useEffect(() => {

        //current_user.update(user.name,user._id,user.e_mail,user.auth_token,user.displayName);
        //console.log(g_contacts);
        if(filteredDataSource.length === 0){
            setFilteredDataSource(g_contacts);
          }
      },[]);




    // store item.phoneNumber in some variable

    const searchFilterFunction = (text) => {
      // Check if searched text is not blank
      if (text) {
        // Inserted text is not blank
        // Filter the masterDataSource
        // Update FilteredDataSource
        const newData = g_contacts.filter(function (item) {
          const itemData = item.name
            ? item.name.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        setFilteredDataSource(newData);
        setSearch(text);
      } else {
        // Inserted text is blank
        // Update FilteredDataSource with masterDataSource
        setFilteredDataSource(g_contacts);
        setSearch(text);
      }
    };


      // Removed subtitle for notice board use case. Will have to add it again later. subtitle={this.props.item.Author}

      class Item extends React.PureComponent {

        render()
          {
            return(
            <Provider>
            <TouchableOpacity
                onPress={() => {
                    if(this.props.item.postCount > 0){
                    setSelectedUser(this.props.item.Author);
                    getPost(this.props.item.Author);
                    setTitle({type:'newTitle', payload: this.props.item.name});
                    view()
                  } else {
                    ToastAndroid.showWithGravityAndOffset(
                      "Selected User has not created any posts.",
                      ToastAndroid.LONG,
                      ToastAndroid.BOTTOM,
                      25,
                      50
                    );
                  }                  
                  }}
                style={[styles.contact_item]}>
              <Card style={[styles.contacts_card]} mode='outlined'>
                <Card.Title title={this.props.item.name} titleStyle={{color:'#214463',fontSize:22}}  subtitleStyle={{fontSize: 16}} left={(props) => <Avatar.Icon {...props} icon="account-circle-outline" backgroundColor="#214463" />} />
                <Card.Content>                   
                    {this.props.item.recentPost !== '' ?
                      (
                      <RNP.Surface style={styles.surface}>
                      <WebView
                            originWhitelist={['*']}
                            source={{html: htmlCard+"<body>"+this.props.item.recentPost+"</body>"}}
                            containerStyle={{width:'100%',
                                    height: '100%',
                                    flex: 0,position:'relative' }}
                            style={{
                              height: '100%',
                              width: '100%',
                            }}
                            scalesPageToFit={true}
                          /> 
                    </RNP.Surface>
                    ) : null
                    }
                    <Paragraph style={{color:'#780b10',fontSize:16,fontStyle:'italic',alignSelf:'center'}}>Total Post(s): {this.props.item.postCount}</Paragraph>
                  </Card.Content>
              </Card>

            </TouchableOpacity>
            </Provider>

          );
        }
      }


     const renderItem = ({ item }) => {


        return (
          <Item
            key={item.index}
            item={item}
            style={{paddingHorizontal:0, marginHorizontal:10,width: Dimensions.get("window").width / 2.6,
            height: Dimensions.get("window").width / 2.6,}}
          />
        );
    };



    const _onPress = (item)=>{
      ToastAndroid.showWithGravityAndOffset(
        `${item.title}  called`,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

    }


      return(
      <Provider>
        <View style={styles.container}>
            <FlatList
              bounces={true}
              data={filteredDataSource}
              renderItem={({item}) =>
                <Item
                  key={item.index}
                  item={item}
                  style={{paddingHorizontal:0, marginHorizontal:10,width: Dimensions.get("window").width / 2.6,
                  height: Dimensions.get("window").width / 2.6,}}
                />
              }
              keyExtractor={(item) => item.index}
              initialNumToRender={10}
              onEndReached={()=>{}}
              contentInsetAdjustmentBehavior="automatic"
              ListHeaderComponent={
                visible?
                  <SearchBar
                    round
                    searchIcon={{ size: 24 }}
                    onChangeText={(text) => searchFilterFunction(text)}
                    onClear={(text) => searchFilterFunction('')}
                    placeholder="Search..."
                    value={search}
                    lightTheme
                    onCancel={()=>{setVisible(false)}}
                    showCancel={true}
                  /> : null
              }
              style={{width: Dimensions.get("window").width,
              height: Dimensions.get("window").height/1.1, flex:0 }}
              refreshControl={
                <RefreshControl refreshing={false}/>
              }
            />
            {current_user.Permissions.includes('Add') ?
            <>
            <FAB
                style={styles.fab}
                medium
                icon="plus"
                onPress={() => input()}
              />
            </> : null
            }
          </View>
        </Provider>


      );


  }


  function HomeScreen({navigation}) {


    const { signOut } = React.useContext(AuthContext);
    const { input } = React.useContext(AuthContext);
    const { view } = React.useContext(AuthContext);
    console.log("state.isInput : " + state.isInput);




    const DATA = [
      {
        id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
        title: "First Item",
        img: require('./assets/Virtual-Notice-Board-logos.png'),
      },
      {
        id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
        title: "Second Item",
        img: require('./assets/Virtual-Notice-Board-logos.png'),
      },
      {
        id: "58694a0f-3da1-471f-bd96-145571e29d72",
        title: "Third Item",
        img: require('./assets/Virtual-Notice-Board-logos.png'),
      },
      {
        id: "58694a0f-3da1-471f-bd96-fbd91aa97f63",
        title: "Fourth Item",
        img: require('./assets/Virtual-Notice-Board-logos.png'),
      },
      {
        id: "58694a0f-3da1-471f-bd96-3ad53abb28ba",
        title: "Fifth Item",
        img: require('./assets/Virtual-Notice-Board-logos.png'),
      },
      {
        id: "58694a0f-3da1-471f-bd96-bd7acbea",
        title: "Sixth Item",
        img: require('./assets/Virtual-Notice-Board-logos.png'),
      },
    ];


    //Show all available posts in a list
    const Item = ({ item, onPress, backgroundColor, textColor }) => (

        <TouchableOpacity onPress={() => view()} style={[styles.home_item, backgroundColor]}>
          <Card style={[styles.home_card, backgroundColor]} mode='outlined'>
            <Card.Title title={item.title} subtitle={item.id} left={(props) => <Avatar.Icon {...props} icon="folder" />} />
            <Card.Content>
              <Title>{item.title}</Title>
            </Card.Content>
            <Card.Cover style={styles.tinyLogo} source={ item.img} />
          </Card>
        </TouchableOpacity>

    );

     const renderItem = ({ item }) => {
        const backgroundColor = item.id === hid ? "#228B22" : "#FFFFFF";
        const color = item.id === hid ? 'white' : 'black';

        return (
          <Item
            item={item}
            onPress={() => setHid(item.id)}
            backgroundColor={{ backgroundColor }}
            textColor={{ color }}
            style={{paddingHorizontal:0, marginHorizontal:10,width: Dimensions.get("window").width / 2.6,
            height: Dimensions.get("window").width / 2.6,}}
          />
        );
    };

    const _onPress = (item)=>{
      ToastAndroid.showWithGravityAndOffset(
        `${item.title}  called`,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

    }





    return(
      <Provider>
      <View style={styles.container}>
            <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            extraData={hid}
            contentInsetAdjustmentBehavior="automatic"
            style={{width: Dimensions.get("window").width,
            height: Dimensions.get("window").height-120 ,}}
          />


        <>
        <FAB
            style={styles.fab}
            medium
            icon="plus"
            color={'white'}
            onPress={() => input()}
          />
        </>
    </View>
    </Provider>

      );

  }


  function FeedbackScreen({navigation}) {

    const { back } = React.useContext(AuthContext);
    const URLName = encodeURIComponent(current_user.number);  //current_user.number
    const URL = "http://api.dwall.xyz/app/feedback.html?Author="+ URLName;

    React.useLayoutEffect(() => {
      navigation.setOptions({
        
        headerLeft: () => (
          <FAB
              style={styles.fab_post}
              small
              icon="keyboard-backspace"
              onPress={back}
            />
        ),

      }
      );
    }, [navigation]);

    useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        back
      );

      return () => backHandler.remove();
    }, []);

    return(
      <WebView
          originWhitelist={['*']}
          source={{uri:URL }}
          style={{backgroundColor: 'white', position: 'relative' }}
          containerStyle={{width:Dimensions.get('window').width,
                  height: Dimensions.get('window').height/1.1,
                  flex: 1, alignSelf:'center'}}
        />
    )
  }


 function HomeDrawer({navigation}) {
  const { input } = React.useContext(AuthContext);
  const { view } = React.useContext(AuthContext);
  const { signOut } = React.useContext(AuthContext);
  const { feedback } = React.useContext(AuthContext);

    const DrawerContent = (props) =>(
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <RNP.Drawer.Section style={styles.drawerSection}>
            <View style={styles.userInfoSection}>
                <Avatar.Icon
                  icon="account-outline"
                  size={100}
                  style={{backgroundColor:'#214463',alignSelf:'center'}}
                />
                <Title style={styles.title}>{current_user.name}</Title>
                <Caption style={styles.caption}>{current_user.number}</Caption>
            </View>
          </RNP.Drawer.Section>
          
          <RNP.Drawer.Section style={styles.drawerSection}>
            { current_user.Permissions.includes('Add') ?
              <RNP.Drawer.Item
              icon="account-outline"
              label="My Posts"
              onPress={() => {
                setSelectedUser(current_user.number);
                getPost(current_user.number);
                setTitle({type:'newTitle', payload: current_user.name});
                view()
              }}
            /> : null
            }
            <RNP.Drawer.Item
              icon="bookmark-outline"
              label="Bookmarks"
              onPress={() => {alert('New Functionality Coming Soon......')}}
            />
            
            <RNP.Drawer.Item
              icon="tune"
              label="Settings"
              onPress={() => {alert('Settings Coming Soon.....')}}
            />
          </RNP.Drawer.Section>
          <RNP.Drawer.Section style={styles.drawerSection}>
          <RNP.Drawer.Item
              icon="message-star-outline"
              label="Feedback"
              onPress={() => {
                  feedback()
              }}
            />
          <RNP.Drawer.Item
              icon="logout"
              label="Sign-Out"
              onPress={async () => {
                Alert.alert(
                  "Sign Out",
                  "Are you sure you want to Sign-Out.",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Pressed Cancel"),
                      style: "cancel"
                    },
                    { 
                      text: "OK", 
                      onPress: async () => {
                        setConfirm(null);
                        await cache.clearAll();
                        signOut()
                      }
                    }
                  ]
                )
              }}
            />
          </RNP.Drawer.Section>
        </View>
      </DrawerContentScrollView>
    );




    return(

      <Drawer.Navigator screenOptions = {{
        showLabel: false,
        inactiveTintColor: '#2D3038',
        activeTintColor: '#FFFFFF',
        style: {
          height: '10%',
          backgroundColor: '#214463',
        },
        headerShown: true,
        header: (props) => <HeaderBar title='Home' isBack={false} isSearch={true}  isDrawer={true} {...props} />
        }}
        drawerContent={(props) => <DrawerContent {...props}/>}
      >
        <Drawer.Screen name="Users" component={ContactsScreen} />
        <Drawer.Screen name="Feed" component={HomeScreen} />
      </Drawer.Navigator>


    );

}


  /*
    <SwiperFlatList
                index={posts.length-1}
                style={styles.wrapper}
                data={posts}
                renderItem={Page}
              />
  */

  function PostScreen({navigation}) {


    const { back } = React.useContext(AuthContext);
    //const [post,setPost] = useState(getPost(selectedUser));

    console.log("Current User : - " + current_user.number);

    const theme = {
      ...DefaultTheme,
      roundness: 3,
      colors: {
        ...DefaultTheme.colors,
        primary: '#3498db',
        accent: '#f1c40f',
      },
      mode: 'adaptive',

    };



    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerLeft: () => (
          <FAB
              style={styles.fab_post}
              small
              icon="keyboard-backspace"
              onPress={() => {
                setPosts([]);
                back()
              }}
            />
        ),
      });
    }, [navigation]);

    useEffect(() => {

      setTimeout(() => {}, 10000);
      console.log(postTitle);
      if(selectedUser !== '') {
        console.log("Got posts for :" + selectedUser);
        //let userForPost = selectedUser;
        setSelectedUser('');
        //setPost(getPost(userForPost));
      }

      console.log(posts.length);

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          setPosts([]);
          back();
          return true;
        }
      );

      return () => backHandler.remove();
    }, []);


      const Page = (item) => {
          
          return(
            //Allow local file access with allowFileAccess prop (use local file uri to render post html)
            <Provider>
              <WebView
                originWhitelist={['*']}
                source={{html: item.Post}}
                containerStyle={{width:Dimensions.get('window').width,
                        height: Dimensions.get('window').height/1.5,
                      flex: 1, }}
              />
              {current_user.number==item.Author ?
                (<Appbar style={styles.bottom}>
                <FAB
                  style={styles.fab_delete}
                  small
                  icon="delete"
                  label="Delete this Post"
                  onPress={() => {deletePost(item._id,item.CreatedOn,item.Author);}}
                />
              </Appbar>) : null
              }
            </Provider>

          );
        };



        return(
          <>
            <View style={styles.swipe_container}>
              
              <Swiper
                style={styles.wrapper}
                swipeData={posts}
                renderSwipeItem={Page}
                currentSelectIndex={posts.length-1}
                autoplay={false}
              />
            </View>
          </>

        );
  }




  //Different header bars to use 

  const HeaderBar = ({navigation, isBack, isSearch, isDrawer, title}) => {
        const {back} = React.useContext(AuthContext);
        return(
          <Appbar.Header style={{backgroundColor:"#214463", alignItems:'center'}}>
            {isDrawer? <Appbar.Action icon="account-details" onPress={() => navigation.toggleDrawer()}  /> : null}
            {isBack? <Appbar.BackAction onPress={back} /> : null}
            <Appbar.Content title={title} style={{alignContent: 'center'}}/>
            {isSearch?<Appbar.Action icon="magnify" onPress={() => setVisible(!visible)} /> : null}
          </Appbar.Header>

          );
  }



  const HeaderMenuBar = ({navigation, isBack, isSearch, isDrawer, title}) => {
    const {back} = React.useContext(AuthContext);
    const [menuOn, setMenuOn] = React.useState(false);

    const openMenu = () => setMenuOn(true);

    const closeMenu = () => setMenuOn(false);
    return(
      <Appbar.Header style={{backgroundColor:"#214463", alignItems:'center'}}>
        {isDrawer? <Appbar.Action icon="account-details" onPress={() => navigation.toggleDrawer()}  /> : null}
        {isBack? <Appbar.BackAction onPress={()=> {
            back();
            setPosts([]);
            }} /> : 
            null
        }
        <Appbar.Content title={title} style={{alignContent: 'center'}}/>
      </Appbar.Header>
      );
}




  //Hooks to to help in proper rendering.

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
            isSignout: false,
            isInput: false,
            isView: false,
            homeInitial: false,
            isFeedback: false,
            
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            isInput: false,
            isView: false,
            isNewUser: false,
            homeInitial: false,
            isFeedback: false,
            
          };
        case 'SIGN_UP':
          return {
            ...prevState,
            isSignout: false,
            isNewUser: true,
            userToken: action.token,
            homeInitial: false,
            isFeedback: false,
            
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            isInput: false,
            isView: false,
            isNewUser: false,
            homeInitial: false,
            
            isFeedback: false,
          };
        case 'INPUT':
          return{
            ...prevState,
            isSignout: false,
            isInput: true,
            isView: false,
            isFeedback: false,
            
          };
        case 'BACK':
          return{
            ...prevState,
            isInput: false,
            isSignout: false,
            isView: false,
            isFeedback: false,
            
          };
        case 'VIEW':
          return{
            ...prevState,
            isInput: false,
            isSignout: false,
            isView: true,
            isNewUser: false,
            homeInitial: false,
            isFeedback: false,
            
          };
        case 'OTP':
          return{
            ...prevState,
            homeInitial: true,
            isFeedback: false,
           
          };
        case 'Feedback':
          return{
            ...prevState,
            isFeedback:true,
            
          };
      }
    },

    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      isInput: false,
      isView: false,
      homeInitial: false,
      isFeedback: false,
      
    }
  );



  /*
  React.useEffect(() => {
      // Fetch the token from storage then navigate to our appropriate place
      

      //GetContacts();
      //bootstrapAsync();

      //setTimeout(()=>{Alert.alert('I am appearing...', 'After 10 seconds!');},10000);
      //getPost("+919000945575");
    }, []
  );
  */


  const authContext = React.useMemo(
      () => ({
        signIn: async () => {
          // In a production app, we need to send some data (usually username, password) to server and get a token
          // We will also need to handle errors if sign in failed
          // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
          // In the example, we'll use a dummy token
          //console.log("signIn: " + user);
          dispatch({ type: 'SIGN_IN', token: current_user.token });
        },
        signOut: async () => {
          dispatch({ type: 'SIGN_OUT' });
        },
        signUp: async () => {
          // In a production app, we need to send user data to server and get a token
          // We will also need to handle errors if sign up failed
          // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
          // In the example, we'll use a dummy token

          dispatch({ type: 'SIGN_UP', token: current_user.token });
        },
        input: async ()=>{
          dispatch({type: 'INPUT'});
        },
        back: async ()=>{
          dispatch({type: 'BACK'});
        },
        view: async ()=>{
          dispatch({type: 'VIEW'});
        },
        OTP: async ()=>{
          dispatch({type:'OTP'});
        },
        feedback: async ()=>{
          dispatch({type: 'Feedback'});
        },
      }),
      []
  );




 
  //Rendering starts here.

  if(state.isLoading){
    setTimeout(() => {}, 40000);
    return(
      <WelcomeScreen />
    );
  }


  if(!state.userToken){

    return(
      <AuthContext.Provider value={authContext} theme={RNP.DarkTheme}>
      <NavigationContainer>
        <Stack.Navigator headerBackVisible={true}>
        {!state.homeInitial?
              (
                <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{
                  title: 'Sign Up',
                // When logging out, a pop animation feels intuitive
                 animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                 headerTitleAlign: 'center',
                 headerStyle: {
                  backgroundColor: '#214463',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                }}
              />
              ) : (
                <Stack.Screen
                  name="OTP"
                  component={OTPScreen}
                  options={{
                    title: 'Enter OTP',
                  // When logging out, a pop animation feels intuitive
                   animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                   headerTitleAlign: 'center',
                   headerStyle: {
                    backgroundColor: '#214463',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  header: (props) => <HeaderBar title='Enter OTP' {...props} />
                }}
                />
                )
              }
        </Stack.Navigator>
      </NavigationContainer>
      </AuthContext.Provider>
    );
  }


  if(state.isNewUser){
    return(
      <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="NewUser" component={CreateUserScreen}
            options={{
              headerTitleStyle: {
                fontWeight: 'bold',
                color: 'white',
              },
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#214463',
              }
              }
            }
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
    )
  }


  if(state.isView){
    return(
      <Provider>
      <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Post" component={PostScreen}
            options={{
              headerTitleStyle: {
                fontWeight: 'bold',
                color: 'white',
              },
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#214463',
              },
              header: (props) => <HeaderMenuBar title={postTitle.title} isBack={true} isSearch={false} isDrawer={false} {...props} />

              }
            }
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
    </Provider>

    );
  }


  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator headerBackVisible={true}>
          { !state.isInput ?
              (!state.isFeedback ?
                (
                <Stack.Screen
                  name="Home"
                  component={HomeDrawer}
                  options={{
                    title: 'Home',
                  // When logging out, a pop animation feels intuitive
                   animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                   headerTitleAlign: 'center',
                   headerStyle: {
                    backgroundColor: '#214463',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  headerShown: false,
                  header: (props) => <HeaderBar title='Home' isBack={false} isSearch={true} {...props} />
                }}

              />
              ) 
              : 
              (
                <Stack.Screen
                  name="Feedback"
                  component={FeedbackScreen}
                  options={{
                    title: 'Home',
                  // When logging out, a pop animation feels intuitive
                   animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                   headerTitleAlign: 'center',
                   headerStyle: {
                    backgroundColor: '#214463',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  headerShown: true,
                  header: (props) => <HeaderBar title='Feedback' isBack={true} isSearch={false} {...props} />
                }}

              />
              ))
              :
              (
              <Stack.Screen
                name="Input"
                component={CreatePost}
                options={{
                title: 'Create Post',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                headerTitleAlign: 'center',
                header: (props) => <HeaderBar title="Create Post" isBack={true} {...props} />
              }}
              />
            )
          }
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );


}



//Styles for various components of the app.

const styles = StyleSheet.create({
  container_signUp: {

    marginTop: 0,
    padding: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  container:{
    marginTop: 0,
    padding: 5,
    flex: 1,
    justifyContent: 'center',
  },
  container_creatPost:{
    marginTop: 0,
    padding: 5,
    flex: 1,
    
  },
  image: {
    alignContent: 'center',
    height: Dimensions.get('window').height,
  },
  new_user_container:{
    marginTop: 0,
    paddingTop: "30%",
    justifyContent: 'flex-start',
    height: Dimensions.get('window').height,
  },
  swipe_container: {
    flex: 1,
    backgroundColor: 'white'
  },
  drawerSection: {
    marginTop: 15,
  },
  title: {
    fontSize: 32,
    marginTop: '15%',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    marginTop: '5%',
    alignSelf: 'center',
  },
  surface: {
    padding: 0,
    height: 130,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    alignSelf:'stretch',
    elevation: 4,
  },
  wrapper: {
    flex: 1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'white',
  },
  bottom: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: '#214463',
    justifyContent: 'space-around',
    alignItems: 'center',

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
    height: 'auto',
    maxWidth: Dimensions.get('window').width/1.03,
  },
  input: {
    marginTop: '90%',
    paddingHorizontal: 24,
    fontSize: 20,
    height: 70,
    borderRadius: 20,
    width: Dimensions.get('window').width,
    alignSelf: 'center',
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
    marginLeft: Dimensions.get('window').width/3,
    marginRight: Dimensions.get('window').width/20,
    fontSize: 24,
    width: Dimensions.get('window').width/3,

    alignItems: 'center',
    backgroundColor: '#214463',
  },
  next_button: {
    position: 'absolute',
    marginTop: Dimensions.get('window').height/1.1,
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
    marginLeft: Dimensions.get('window').width/10,
    marginBottom: 20,
    marginTop:5,
    width: 300,
    height: 300,

  },
  welcome_logo: {
    alignSelf:'center',
    marginBottom: 20,
    marginTop:5,
    width: Dimensions.get('window').width,
    height: 300,
    flex: 1,
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

  fab_delete: {
    position: 'relative',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'powderblue',
    flexDirection: 'row-reverse',
    alignSelf: 'center',
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


/*


  <RNP.TextInput
        mode='outlined'
        keyboardType='numeric'
        value={code}
        maxLength={6}
        onChangeText={setCode}
        style={{
          marginBottom:5,
          marginTop:Dimensions.get('window').height/4,
          width:Dimensions.get('window').width/1.5,
          left: Dimensions.get('window').width/6,
        }}
        placeholder="Enter OTP"
        outlineColor='white'
        activeOutlinedColor='white'
        />
  <Button title="Sign-IN" disabled={true} onPress={signIn} />
    options={{
                  title: 'My home',
                  headerStyle: {
                    backgroundColor: '#FFF',
                  },
                  headerTintColor: '#214463',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  headerTitleAlign: 'center',
                  }
                }

    {isSearch?<Appbar.Action icon="magnify" onPress={() => {}} /> : null}
    <Appbar.Action icon="delete-empty" onPress={() => console.log('Pressed archive')}/>
    <Appbar.Action icon="delete-forever" onPress={() => console.log('Pressed delete')} />
    <Menu
                  visible={menuOn}
                  onDismiss={closeMenu}
                  anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}>
                  <Menu.Item onPress={() => {console.log("Delete this post.");}} title="Delete" />
                  <Menu.Item onPress={() => {}} title="Item 2" />
                  <Divider />
                  <Menu.Item onPress={() => {}} title="Item 3" />
        </Menu>



*/

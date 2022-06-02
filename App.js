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
 } from 'react-native';





import { NavigationContainer } from '@react-navigation/native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from "react-native-webview";
import {createStackNavigator} from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { createDrawerNavigator } from '@react-navigation/drawer';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Animated,{ Value } from 'react-native-reanimated';
import 'react-native-gesture-handler';

import Contacts from 'react-native-contacts';

import { FAB, DefaultTheme, Portal, Provider, Card, Appbar,  Menu, Divider, Avatar, Title, Paragraph } from 'react-native-paper';
import * as RNP from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import * as icon from 'react-native-vector-icons/FontAwesome';

import { Cache } from "react-native-cache";



import { addUser, updateUser} from './feature/User';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import auth from '@react-native-firebase/auth';












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
    }

    update(name='', number='', email='', token=null,dspn='') {
      if(name) this.name = name;
      if(number) this.number = number;
      if(email) this.email = email;
      if(token) this. token = token;
      if(dspn) this.dspn = dspn;
      //updateUser(this.number,this.name,this.dspn,this.email);
    }

}


const App: () => Node = ({navigation}) => {

  //Put declarations in a different file.

  const AuthContext = React.createContext();
  const Stack = createNativeStackNavigator();
  const Tab = createMaterialTopTabNavigator();
  const Drawer = createDrawerNavigator();

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };





  const [selectedUser, setSelectedUser] = useState(['']);
  const [displayName, setDisplayName] = useState('');
  const [token, setToken] = useState(null);
  //const [initializing, setInitializing] = useState(true);
  const [confirm, setConfirm] = useState(null);

  //const [logIn, setLogIn] = useState(true);
  const [hid, setHid] = useState(null);
  const [cid, setCid] = useState(null);
  //const [nom, setNom] = useState('');
  const [user, setUser] = useState({});
  const [post, setPost] = useState(null);
  //const [usr, setUsr] = useState();


  const [edit, setEdit] = useState('');
/*
  const [stat, setStat] = React.useState({ open: false });
  const { open } = stat;
  const onStateChange = ({ open }) => setStat({ open });
*/

  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';
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

  let URL_PROFILE = "http://api.dwall.xyz/v1/profile/";
  let URL_POST = "http://api.dwall.xyz/v1/post/";

  const html = `<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>`;


  const [posts, setPosts] = useState([]);

  const [g_contacts, setGcontacts] = useState([{}]);



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

              })
          });
          console.log("Waiting for fetch profile response");

          let jsonResponse = await response.json();
          //let obj = {};
          if(jsonResponse.Response === 200) {
              console.log("Calling from getUser:\n" + JSON.stringify(jsonResponse.profile));
              /*
              for (const [key, value] of Object.entries(jsonResponse.profile)){
                  console.log("Key: "+key+ " Value: "+value);
                  obj[key] = value;
              }
              console.log(JSON.stringify(obj));
              */
              await cache.set("SignedIn_User",JSON.stringify(jsonResponse.profile));
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
            console.log(jsonResponse);

            if (jsonResponse.Response==200) {

            let resp_arr = [];
            
              jsonResponse.p.forEach((element,i) => {

                  resp_arr.push(html+"<body>"+element.Post+"</body>");
                });
              console.log(resp_arr);
              setPosts(resp_arr);
            }
            else{
              console.log("User has no posts available or the user is not registered.");

            }
            })
          .catch((err) => {
              console.log(err);
          });
  }


  const getPostNext = async (num,lastDate) => {

       fetch(URL_POST+'get',{
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
          body: JSON.stringify({
              Author: num,
              CreatedOn: lastDate,
              Direction: "next",
          })
      })
          .then((response) => response.json())
          .then((jsonResponse) => {
            console.log(jsonResponse);
            setPost(jsonResponse);})
          .catch((err) => {
              console.log(err);
          });
  };


  function LoadPost() {
    getPost("+919000945575");
    setPosts([ html+post.Post, ...posts ]);
  }

  function LoadNewPost() {
    getPost("+919000945575");
    setPosts([ html+post.Post, ...posts ]);
  }



  function CreatePost({navigation}){
    //Attach to FAB on Home Screen

    const { signOut } = React.useContext(AuthContext);
    const { back } = React.useContext(AuthContext);
    const URLName = encodeURIComponent(current_user.number);  //current_user.number
    const URL = "http://editor.dwall.xyz/?Author="+ URLName;
    let webRef = React.createRef(null);

    console.log(URL);
    //const URL = "http://editor.dwall.xyz/?Author="+current_user.number.substring(3);

    //console.log("state.isInput : " + state.isInput);
    /*
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
    */
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

    return(
      <KeyboardAwareScrollView style={styles.container}>
        <WebView
          originWhitelist={['*']}
          ref={(r) => { webRef=r }}
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


  function GetPost({navigation}) {
    //Link with Swiper FlatList to display created posts.
    return(
      <View style={styles.container}>
      <RNP.Button mode='text' compact onPress={() => {getPost('+919000945575', "2022-05-23T20:11:14.696Z");}}>Get Post</RNP.Button>
      </View>
    );

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
            let name_array = [];

            cs.forEach((contact, i) => {
                let contactObj = {};
                contactObj.DisplayName = contact.givenName + ' ' + contact.familyName;
                name_array.push(contactObj.DisplayName);
                
                contact.phoneNumbers.forEach((num, i) => {
                      //console.log(number.number);
                      contactObj.PhoneNumber = num.number;
                  });        // end foreach
              contactsObj.push(contactObj);
            }); // end foreach

            name_array.sort();
            let key = "DisplayName";
            contactsObj.sort(function(a,b){
              var x = a[key]; var y = b[key];
              return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
            setGcontacts([{"DisplayName":current_user.name,"PhoneNumber":current_user.number}].concat(contactsObj));//Set first element to be the use in g_contacts array.
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
          source={require('./assets/Virtual-Notice-Board-logos.jpeg')}
          style={styles.logo} />
        <RNP.ActivityIndicator animating={true} color={RNP.Colors.red800} size='large' />
        <Text>Loading...</Text>
      </View>
    );
  }


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


  function HomeScreen({navigation}) {


    const { signOut } = React.useContext(AuthContext);
    const { input } = React.useContext(AuthContext);
    const { view } = React.useContext(AuthContext);
    console.log("state.isInput : " + state.isInput);




    const DATA = [
      {
        id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
        title: "First Item",
        img: require('./assets/Virtual-Notice-Board-logos.jpeg'),
      },
      {
        id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
        title: "Second Item",
        img: require('./assets/Virtual-Notice-Board-logos.jpeg'),
      },
      {
        id: "58694a0f-3da1-471f-bd96-145571e29d72",
        title: "Third Item",
        img: require('./assets/Virtual-Notice-Board-logos.jpeg'),
      },
      {
        id: "58694a0f-3da1-471f-bd96-fbd91aa97f63",
        title: "Fourth Item",
        img: require('./assets/Virtual-Notice-Board-logos.jpeg'),
      },
      {
        id: "58694a0f-3da1-471f-bd96-3ad53abb28ba",
        title: "Fifth Item",
        img: require('./assets/Virtual-Notice-Board-logos.jpeg'),
      },
      {
        id: "58694a0f-3da1-471f-bd96-bd7acbea",
        title: "Sixth Item",
        img: require('./assets/Virtual-Notice-Board-logos.jpeg'),
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



  
  function CreateUserScreen({ navigation }) {

    const { signIn } = React.useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    //Call getUser here before rendering Register user page.
   
    

    return (


      <KeyboardAwareScrollView>


        <View style={styles.new_user_container}>

            <TextInput
              style={styles.new_input}
              keyboardType='default'
              placeholder="Enter Full Name"
              onChangeText={(text) => setName( text ) }
              value={name}
              />
            <TextInput
              keyboardType='email-address'
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
                       current_user.update(name,'',email,'');
                       console.log(current_user.name + " "+ current_user.email);
                       addUser(current_user.number,current_user.name,current_user.name,current_user.email,current_user.token);
                       let luser = {};
                        luser["_id"] = current_user.number;
                        luser["name"] = current_user.name;
                        luser["displayName"] = current_user.dspn;
                        luser["e_mail"] = current_user.email;
                        luser["auth_token"] = current_user.auth_token;
                        luser["auth_type"] = "Google FireBase";
                       
                       await cache.set("SignedIn_User", JSON.stringify(luser));
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



  function OTPScreen() {
    //Add resend OTP functionality, Hide/Disable OTP Text Box until required
  
    const { signUp } = React.useContext(AuthContext);
    const { signIn } = React.useContext(AuthContext);
    const [code, setCode] = useState('');

    //console.log("name: "+current_user.name+" number: "+current_user.number+" email: "+current_user.email);

    return (

      <View>
      
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
      
      <RNP.Button
        mode='contained'
        style={{
          width:Dimensions.get('window').width/1.5,
          left: Dimensions.get('window').width/6,
          }}
         onPress={async () =>{
          //If user found in database then log in to contacts screen, else go to create user screen.
          let confirmed = await confirmCode(code);
          
          if ( confirmed ) {
            console.log("Calling get user" );
            let response = await getUser(current_user.number);
          
            if (response) console.log("getuser successfull");
            else  console.log("getuser Failed");
            //setIsReady(false);
            if(response){    
              signIn()
            }
            else{
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



  function ContactsScreen({navigation}) {

    //Use Contacts array to populate FlatList.
    //Map Contacts to their posts through getUser
    //First contact should be this user.

    const { input } = React.useContext(AuthContext);
    const { view } = React.useContext(AuthContext);
    const { signOut } = React.useContext(AuthContext);
    
    
   
    
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

          />
          ),


        });
      }, [navigation]);
    

    
      React.useEffect(() => {

        //current_user.update(user.name,user._id,user.e_mail,user.auth_token,user.displayName);        
        g_contacts[0].DisplayName=current_user.name;
        g_contacts[0].PhoneNumber=current_user.number;
        
      },[]);

    


    // store item.phoneNumber in some variable

    
      const Item = ({ item }) => (

      <Provider>
        <TouchableOpacity
            onPress={() => {
                setSelectedUser(item.PhoneNumber);
                view()}}
            style={[styles.contact_item]}>
          <Card style={[styles.contact_card]} mode='outlined'>
            <Card.Title title={item.DisplayName} subtitle={item.PhoneNumber} left={(props) => <Avatar.Icon {...props} icon="account-circle-outline" />} />
          </Card>

        </TouchableOpacity>
        </Provider>

      );


      
     const renderItem = ({ item }) => {
       console.log(item);

        return (
          <Item
            key={item.PhoneNumber}
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

      <View style={styles.container}>
            <FlatList
              bounces={true}
              data={g_contacts}
              renderItem={renderItem}
              keyExtractor={(item) => item.PhoneNumber}
              onEndReached={()=>{}}
              style={{width: Dimensions.get("window").width,
              height: Dimensions.get("window").height-120 }}
              refreshControl={
                <RefreshControl refreshing={false}/>
              }
            />
        <>
        <FAB
            style={styles.fab}
            medium
            icon="plus"
            onPress={() => input()}
          />
        </>
    </View>


      );
    

  }


 function HomeTabs({navigation}) {
    const { signOut } = React.useContext(AuthContext);
    //console.log("isReady: "+ isReady);

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

          />
        ),
        /*headerLeft: () =>(
          confirm.verificationId
        )
        headerSearchBarOptions: {
          // search bar options
          onChangeText: (event) => setEdit(event.nativeEvent.text),

          textColor: '#fff',
        },*/
      });
    }, [navigation]);

    return(

      <Tab.Navigator screenOptions = {{
        showLabel: false,
        inactiveTintColor: '#2D3038',
        activeTintColor: '#FFFFFF',
        style: {
          height: '10%',
          backgroundColor: '#11b6f2',
        }
      }}
      >
        <Tab.Screen name="Users" component={ContactsScreen} />
        <Tab.Screen name="Feed" component={HomeScreen} />
      </Tab.Navigator>
    );

}


  function PostScreen({navigation}) {


    const { back } = React.useContext(AuthContext);

    if(selectedUser != '') {
      getPost(selectedUser);
      console.log("Got posts for :" + selectedUser);
      setSelectedUser('');
    }
    console.log(posts.length);

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
              onPress={() => {back()
                setPosts([])}
              }
            />
        ),
      });
    }, [navigation]);


      const Page = ({item}) => {
          return(
            //Allow local file access with allowFileAccess prop (use local file uri to render post html)
            <WebView
              originWhitelist={['*']}
              source={{html: item}}
              containerStyle={{width:Dimensions.get('window').width,
                      height: Dimensions.get('window').height,
                    flex: 1, }}
            />
          );
        };



        return(
            <View style={styles.swipe_container}>
              <SwiperFlatList
                pagingEnabled
                showPagination
                index={posts.length-1}
                showPagination
                style={styles.wrapper}
                data={posts}
                renderItem={Page}
              />
            </View>
        );
  }



  function SignUpScreen() {
    //Beautify text inputs.
    const [number, setNumber] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');


    return (
      <KeyboardAwareScrollView 
          style={{flex:1}}
          >
          <View style={styles.container_signUp}>
            <Image
              style={styles.logo}
              source={require('./assets/Virtual-Notice-Board-logos.jpeg')}
                />
            <TextInput
              keyboardType='numeric'
              style={styles.input}
              placeholder="Enter Phone Number"
              maxLength={10}
              onChangeText={(text) => setNumber( text ) }
              value={number}
              />
            
            <RNP.Button
                mode='contained'
                style={styles.button}
                onPress={() =>
                          {
                            current_user.update(name,"+91"+number,email);
                            
                            signInWithPhoneNumber(current_user.number);
                          } }
                disabled={false} >
              GET OTP
            </RNP.Button>
            
        </View>
        </KeyboardAwareScrollView>
    );
  }

  const HeaderBar = ({navigation, back,title}) => {
        return(
          <Appbar.Header style={{backgroundColor:"#214463", alignItems:'center'}}>
            {back? <Appbar.BackAction onPress={back} /> : null}
            <Appbar.Content title={title} style={{alignContent: 'center'}}/>
          </Appbar.Header>
          );                    
  }


 





  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
            isInput: false,
            isView: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            isInput: false,
            isView: false,
            isNewUser: false,
          };
        case 'SIGN_UP':
          return {
            ...prevState,
            isSignout: false,
            isNewUser: true,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            isInput: false,
            isView: false,
            isNewUser: false,
          };
        case 'INPUT':
          return{
            ...prevState,
            isSignout: false,
            isInput: true,
            isView: false,
          };
        case 'BACK':
          return{
            ...prevState,
            isInput: false,
            isSignout: false,
            isView: false,
          };
        case 'VIEW':
          return{
            ...prevState,
            isInput: false,
            isSignout: false,
            isView: true,
            isNewUser: false,
          };
        case 'HOME_INITIAL':
          return{
            ...prevState,
            homeInitial: action.payload,
            isNewUser: false,
          };
      }
    },

    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      isInput: false,
      isView: false,
      homeInitial: null,
    }
  );



  React.useEffect(() => {
      // Fetch the token from storage then navigate to our appropriate place
      const bootstrapAsync = async () => {
        let userToken=null;
        
        try {
          // Restore token stored in `SecureStore` or any other encrypted storage
          //userToken = await confirm.confirm(code);
          
          const luser = await cache.get("SignedIn_User");
          const lJsonUser = JSON.parse(luser);
          userToken = lJsonUser.auth_token;
          current_user.update(lJsonUser.name,lJsonUser._id,lJsonUser.e_mail,lJsonUser.auth_token,lJsonUser.displayName);
          
          //g_contacts[0].DisplayName=current_user.name;
          //g_contacts[0].PhoneNumber=current_user.number;
        } catch (e) {
          // Restoring token failed
          //console.log(e);
          //console.log("No user exists in cache.");
          userToken = null;
        }
        
        // After restoring token, we may need to validate it in production apps

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        dispatch({ type: 'RESTORE_TOKEN', token: userToken });
      };
      
      GetContacts();
      bootstrapAsync();
      
      //setTimeout(()=>{Alert.alert('I am appearing...', 'After 10 seconds!');},10000);
      //getPost("+919000945575");
    }, []
  );

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
      }),
      []
  );





  if(state.isLoading){
    return(
      <SplashScreen />
    );
  }


// If confirm is there & user Token is not present =>


  if(!state.userToken){

    return(
      <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator headerBackVisible={true}>
        {!confirm?
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
                  backgroundColor: '#84dbfa',
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
                    backgroundColor: '#84dbfa',
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
                backgroundColor: '#84dbfa',
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
                backgroundColor: '#84dbfa',
              }
              }
            }
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator headerBackVisible={true}>
          { !state.isInput ?

                (
                <Stack.Screen
                  name="Home"
                  component={ContactsScreen}
                  options={{
                  title: 'My home',
                  headerStyle: {
                    backgroundColor: '#84dbfa',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  headerTitleAlign: 'center',
                  }
                }
              />
              )
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
                header: (props) => <HeaderBar title="Create Post" back={() => {return React.useContext(AuthContext);}} {...props} />
              }}
              />
            )
          }
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );




}


const styles = StyleSheet.create({
  container_signUp: {

    marginTop: 0,
    padding: 20,
    
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container:{
    marginTop: 0,
    padding: 5,
    

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


/*<Button title="Sign-IN" disabled={true} onPress={signIn} />*/
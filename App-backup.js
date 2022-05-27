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
 } from 'react-native';





import { NavigationContainer } from '@react-navigation/native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from "react-native-webview";
import {createStackNavigator} from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Animated,{ Value } from 'react-native-reanimated';
import 'react-native-gesture-handler';
import { PermissionsAndroid } from 'react-native';

import Contacts from 'react-native-contacts';

import { FAB, DefaultTheme, Portal, Provider, Card, Appbar,  Menu, Divider, Avatar, Title, Paragraph } from 'react-native-paper';
import * as RNP from 'react-native-paper';
import {
  Menu as PMenu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from 'react-native-popup-menu';
import * as icon from 'react-native-vector-icons/FontAwesome';



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
      updateUser(this.number,this.name,this.dspn,this.email);
    }

}


const App: () => Node = ({navigation}) => {

  //Put declarations in a different file.
  const AuthContext = React.createContext();
  const Stack = createNativeStackNavigator();
  const Tab = createMaterialTopTabNavigator();


  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

/*
  let number = '';
  let name = '';
  let email = '';
*/

  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [displayName, setDisplayName] = useState('');
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [signUpInProgress, setSignUpInProgress] = useState(false);
  const [otpValidationInProgress, setOtpValidationInProgress] = useState(false);
  const [code, setCode] = useState('');
  const [logIn, setLogIn] = useState(true);
  const [hid, setHid] = useState(null);
  const [cid, setCid] = useState(null);
  const [nom, setNom] = useState('');
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [usr, setUsr] = useState();


  const [edit, setEdit] = useState('');

  const [stat, setStat] = React.useState({ open: false });
  const { open } = stat;
  const onStateChange = ({ open }) => setStat({ open });

  const _editor = React.createRef();
  const richText = React.createRef();
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState({
    routes: [{ name: 'Home' }, { name: 'Profile' }],
    index: 0,
  });

  let current_user = new User();

  let URL_PROFILE = "http://api.dwall.xyz/v1/profile/";
  let URL_POST = "http://api.dwall.xyz/v1/post/";

  const html = `<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>`;

  let Posts = [];

  let g_contacts = [];



  const getUser = async (num) => {
      //Need to get all users to display contacts.
       fetch(URL_PROFILE+'get',{
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
          body: JSON.stringify({
              Author: num,

          })
      })
          .then((response) => response.json())
          .then((jsonResponse) => {
            console.log(jsonResponse);
            setUser(jsonResponse);})
          .catch((err) => {
              console.log(err);
          });


  };


  const getPost = async (num) => {

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
          .then((response) => response.json())
          .then((jsonResponse) => {
            console.log(jsonResponse);
            setPost(jsonResponse);})
          .catch((err) => {
              console.log(err);
          });
  };


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
    getPost(user.profile.Author);
    Posts.push(html+post);
  }



  function CreatePost({navigation}){
    //Attach to FAB on Home Screen

    const { signOut } = React.useContext(AuthContext);
    const { back } = React.useContext(AuthContext);

    //console.log("state.isInput : " + state.isInput);

    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <Button onPress={signOut}
            title="Sign Out"
          />
        ),
        headerLeft: () => (
          <Button onPress={back}
            title="Back"
          />
        ),

      });
    }, [navigation]);

    return(
      <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{html:html }}
        style={{backgroundColor: 'white' }}
        containerStyle={{width:Dimensions.get('window').width,
                height: Dimensions.get('window').height/1.2,
                flex: 0,}}
      />
      </View>
    );
  }


  function GetPost({navigation}) {
    //Link with Swiper FlatList to display created posts.
    return(
      <View style={styles.container}>
      <RNP.Button mode='text' compact onPress={() => {getPost('+919000945575', "2022-05-23T20:11:14.696Z");}}>Get Post</RNP.Button>
      </View>
    );

  }


  function GetContacts(){
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            'title': 'Contacts',
            'message': 'This app would like to view your contacts.',
            'buttonPositive': 'Please accept bare mortal'
          }
        )
        .then(Contacts.getAllWithoutPhotos()
        .then((cs) => {
          // work with contacts
            //console.log(contacts)


            cs.forEach((contact, i) => {
                let contactObj = {};
                contactObj.DisplayName = contact.givenName + ' ' + contact.familyName;
                contact.phoneNumbers.forEach((num, i) => {
                      //console.log(number.number);
                      contactObj.PhoneNumber = num.number;
              });        // end foreach
              g_contacts.push(contactObj);
            }); // end foreach

            console.log(JSON.stringify(g_contacts));

          }) // end then
        .catch((e) => {
                console.log(e)
            })
            );
  }




  function ProfileScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Profile!</Text>
      </View>
    );
  }



  function SplashScreen() {
    return (
      <View>
        <ActivityIndicator />
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

  async function confirmCode() {
    try {
      if(await confirm.confirm(code)){

        current_user.token = confirm.verificationId;

        console.log("Code confirmed for user:" + number + " Name:" + name + " Display Name:" + displayName + " email:" + email );

        addUser(number,name,displayName,email,current_user.token);

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

      }
  }


  function HomeScreen({navigation}) {


    const { signOut } = React.useContext(AuthContext);
    const { input } = React.useContext(AuthContext);
    const { view } = React.useContext(AuthContext);
    console.log("state.isInput : " + state.isInput);

    console.log("Visible : " + visible);



    const DATA = [
      {
        id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
        title: "First Item",
        img: require('./Virtual-Notice-Board-logos.jpeg'),
      },
      {
        id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
        title: "Second Item",
        img: require('./Virtual-Notice-Board-logos.jpeg'),
      },
      {
        id: "58694a0f-3da1-471f-bd96-145571e29d72",
        title: "Third Item",
        img: require('./Virtual-Notice-Board-logos.jpeg'),
      },
      {
        id: "58694a0f-3da1-471f-bd96-fbd91aa97f63",
        title: "Fourth Item",
        img: require('./Virtual-Notice-Board-logos.jpeg'),
      },
      {
        id: "58694a0f-3da1-471f-bd96-3ad53abb28ba",
        title: "Fifth Item",
        img: require('./Virtual-Notice-Board-logos.jpeg'),
      },
      {
        id: "58694a0f-3da1-471f-bd96-bd7acbea",
        title: "Sixth Item",
        img: require('./Virtual-Notice-Board-logos.jpeg'),
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
            //<Card.Cover style={styles.tinyLogo} source={ item.img} />
            <Card.Actions>

                    <View
                      style={{
                        paddingTop: 0,
                        marginLeft: Dimensions.get('window').width/1.5,
                        //flexDirection: 'row-reverse',
                        justifyContent: 'center',
                        //position: 'absolute',
                      }}>
                      <Portal>
                      <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={<FAB
                                style={styles.fab_menu}
                                small
                                icon="dots-horizontal"
                                onPress={() => setVisible(true)}
                              />}
                        >
                        <Menu.Item onPress={() => {}} title="Item 1" />
                        <Menu.Item onPress={() => {}} title="Item 2" />
                        <Menu.Item onPress={() => {}} title="Item 3" />
                      </Menu>
                      </Portal>
                    </View>
            </Card.Actions>
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

    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <Button onPress={signOut}
            title="Sign Out"
          />
        ),
        /*headerLeft: () =>(
          confirm.verificationId
        )
        headerSearchBarOptions: {
          // search bar options
          onChangeText: (event) => setEdit(event.nativeEvent.text),

          textColor: '#fff',
        }, */
      });
    }, [navigation]);


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


        <Portal>
        <FAB
            style={styles.fab_menu}
            small
            icon="plus"
            onPress={() => input()}
          />
        </Portal>
    </View>
    </Provider>

      );

  }


  /* function Input({ navigation }) {

    const { signOut } = React.useContext(AuthContext);
    const { back } = React.useContext(AuthContext);

    console.log("state.isInput : " + state.isInput);

    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <Button onPress={signOut}
            title="Sign Out"
          />
        ),
        headerLeft: () => (
          <Button onPress={back}
            title="Back"
          />
        ),

      });
    }, [navigation]);

   const onPressAddImage = () => {
        // you can easily add images from your gallery
        richText.current?.insertImage(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png"
        );
      };

      const editorInitializedCallback = () => {
        richText.current?.registerToolbar(function (items) {});
      };


      return (
      <Provider>
        <>
        <View>
            <Portal>
                <View
                  style={{
                    paddingTop: 0,
                    marginLeft: Dimensions.get('window').width/2,
                    flexDirection: 'row-reverse',
                    justifyContent: 'center',
                    position: 'absolute',
                  }}>
                  <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={<RNP.Button mode='text' style={styles.button} compact onPress={openMenu}>"Show menu"</RNP.Button>}>
                    <Menu.Item onPress={() => {}} title="Item 1" />
                    <Menu.Item onPress={() => {}} title="Item 2" />
                    <Divider />
                    <Menu.Item onPress={() => {}} title="Item 3" />
                  </Menu>
                </View>
              </Portal>
            </View>
        <SafeAreaView style={styles.root}>
          <StatusBar style="auto"  barStyle={'dark-content'}/>
            <ScrollView>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}	style={{ flex: 1 }}>
                        <Text>Description:</Text>


                        <RichEditor
                            ref={richText}
                            onChange={ descriptionText => {
                                console.log("descriptionText:", descriptionText);
                            }}
                            editorInitializedCallback={editorInitializedCallback}
                        />
                        <RichToolbar
                            editor={richText}
                            actions={[ actions.setBold, actions.setItalic, actions.setUnderline, actions.heading1,actions.insertImage ]}
                            onPressAddImage={onPressAddImage}
                            iconMap={{ [actions.heading1]: ({tintColor}) => (<Text style={[{color: tintColor}]}>H1</Text>), }}
                        />
            </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
        </>
        </Provider>
      );
  } */


/*  function SignInScreen({ navigation }) {

    const { signIn } = React.useContext(AuthContext);


    return (


      <KeyboardAvoidingView
              behaviour={Platform.OS=="ios"?"padding":"height"}
              style={styles.container}>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <View style={styles.container}>

            <Image
              style={styles.logo}
              source={require('./Virtual-Notice-Board-logos.jpeg')}
                />

            <TextInput
              style={styles.input}
              keyboardType='numeric'
              placeholder="Enter Number"
              onEndEditing={(text) => setText(text)}
              defaultValue={text}
              maxLength={10}
              editable={true}

            />
            <Button
              style={styles.button}
              onPress={() => {
                        //Add functionality to send OTP to Mobile
                        //signInWithPhoneNumber("+91"+text)
                        //setLogIn(false)
                        signIn()
                      }}
              disabled={false}
              title={"Send OTP"}
            />
            <TextInput
              keyboardType='numeric'
              style={styles.input}
              value={code}
              defaultValue={code}
              placeholder="Enter OTP"
              maxLength={10}
              onEndEditing={(text) => setCode(text)}
              editable={ confirm===null ? false : true }

              />
            <Button
                title="Confirm Code"
                onPress={() =>
                          {
                              confirmCode();
                              console.log("edit: "+ edit);
                              setEdit("01")
                              console.log("edit: "+ edit);
                              signIn()
                          } }
                disabled={confirm===null ? true : false }
              />
              <RNP.Button mode='text' style={styles.resend_button} compact  onPress={() => console.log(' Resend Pressed')}>
                Resend OTP
              </RNP.Button>

        </View>

      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
  */


  function OTPScreen() {
    //Add resend OTP functionality, Hide/Disable OTP Text Box until required
    const { signIn } = React.useContext(AuthContext);

    return (

      <View>
      <Appbar.Header>
        <Appbar.Content title={number} style={{alignContent: 'center'}}/>
      </Appbar.Header>
      <TextInput
        keyboardType='numeric'
        value={code}
        maxLength={10}
        onChangeText={setCode}
        />
        <Button title="Confirm Code" onPress={() =>
          {
          confirmCode();
          {signIn}
        }
         } />
      </View>

    );
  }



  function ContactsScreen({navigation}) {

    //Use Contacts array to populate FlatList.

    const { input } = React.useContext(AuthContext);
    const { view } = React.useContext(AuthContext);
    console.log("state.isInput : " + state.isInput);

    console.log("Visible : " + visible);



    /*  const DATA = [
      {
        id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
        title: "First Item",
        img: require('./My-project-1.png'),
      },
      {
        id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
        title: "Second Item",
        img: require('./My-project-1.png'),
      },
      {
        id: "58694a0f-3da1-471f-bd96-145571e29d72",
        title: "Third Item",
        img: require('./My-project-1.png'),
      },
      {
        id: "58694a0f-3da1-471f-bd96-fbd91aa97f63",
        title: "Fourth Item",
        img: require('./My-project-1.png'),
      },
      {
        id: "58694a0f-3da1-471f-bd96-3ad53abb28ba",
        title: "Fifth Item",
        img: require('./My-project-1.png'),
      },
      {
        id: "58694a0f-3da1-471f-bd96-bd7acbea",
        title: "Sixth Item",
        img: require('./My-project-1.png'),
      },
    ];
    */



    const Item = ({ item, backgroundColor, textColor }) => (
      <MenuProvider skipInstanceCheck>
        <TouchableOpacity onPress={() => {view()}} style={[styles.contact_item, backgroundColor]}>
          <Card style={[styles.contact_card, backgroundColor]} mode='outlined'>
            <Card.Title title={item.DisplayName} subtitle={item.PhoneNumber} left={(props) => <Avatar.Icon {...props} icon="account-circle-outline" />} />

            <Card.Actions>
                <PMenu>
                  <MenuTrigger text='Select action' />
                  <MenuOptions>
                  <MenuOption onSelect={() => alert(`Save`)} text='Save' />
                  <MenuOption onSelect={() => alert(`Delete`)} >
                  <Text style={{color: 'red'}}>Delete</Text>
                  </MenuOption>
                  <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Disabled' />
                  </MenuOptions>
                </PMenu>
            </Card.Actions>

          </Card>

        </TouchableOpacity>
        </MenuProvider>

      );



     const renderItem = ({ item }) => {
        const backgroundColor = item.PhoneNumber === cid ? "#228B22" : "#FFFFFF";
        const color = item.PhoneNumber === cid ? 'white' : 'black';

        return (
          <Item
            item={item}
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
            data={g_contacts}
            renderItem={renderItem}
            keyExtractor={(item) => item.PhoneNumber}
            extraData={cid}
            contentInsetAdjustmentBehavior="automatic"
            style={{width: Dimensions.get("window").width,
            height: Dimensions.get("window").height-120 ,}}
          />

        <FAB
            style={styles.fab}
            small
            icon="plus"
            onPress={() => input()}
          />

    </View>
    </Provider>

      );

  }


 function HomeTabs({navigation}) {
    const { signOut } = React.useContext(AuthContext);
    console.log("isReady: "+ isReady);
    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <Button onPress={signOut}
            title="Sign Out"
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
          backgroundColor: '#1E1B26'
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
          <Button onPress={back}
            title="Back"
          />
        ),

      });
    }, [navigation]);



        const Page = ({item}) => {
          return(
            //Allow local file access with allowFileAccess prop (use local file uri to render post html)
            <WebView
              originWhitelist={['*']}
              source={{html:item}}
              style={{width:Dimensions.get('window').width,
                      height: Dimensions.get('window').height,
                    flex: 1, }}
            />
          );
        };

        return(
          <Provider theme={theme}>
          <View style={styles.swipe_container}>
            <SwiperFlatList
              index={0}
              showPagination
              style={styles.wrapper}
              data={Posts}
              renderItem={Page}
              onMomentumScrollEnd={LoadPost}
          />
        </View>
        </Provider>
        );
  }

/*
  function setName(text) {
      name = text;
  }


  function setNumber(text) {
      number = text;
  }

  function setEmail(text) {
      email = text;
  }
*/


  function SignUpScreen() {


    //setSignUpInProgress(true);

    return (

          <View style={styles.container}>
            <TextInput
              style={styles.input}
              keyboardType='default'
              placeholder="Enter Full Name"
              //onChangeText={(text) => { lname = text; } }
              onEndEditing={(text) => setName( text ) }
              value={name}
            />

            <TextInput
              keyboardType='numeric'
              style={styles.input}
              value={number}
              placeholder="Enter Phone Number"
              maxLength={10}
              //onChangeText={(text) => { lnumber = text; } }
              onEndEditing={(text) => setNumber( text ) }
              />

            <TextInput
              keyboardType='email-address'
              style={styles.input}
              value={email}
              placeholder="Enter Email"
              //onChangeText={(text) => { lemail = text; }}
              onEndEditing={(text) => setEmail( text ) }
              />


            <RNP.Button
                mode='contained'
                style={styles.button}
                onPress={() =>
                          {
                            setName(lname);
                            setEmail(lemail);
                            setNumber(lnumber);

                            signInWithPhoneNumber("+91"+number);
                          } }
                disabled={false}>
              Sign Up
            </RNP.Button>
        </View>
    );
  }















  /*   // Handle user state changes
     function onAuthStateChanged(user) {
      setUsr(usr);
      if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;
*/

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
            userToken: action.token,
            isNewUser: true,
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
        } catch (e) {
          // Restoring token failed
        }

        // After restoring token, we may need to validate it in production apps

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        dispatch({ type: 'RESTORE_TOKEN', token: userToken });
      };

      bootstrapAsync();
      GetContacts();
  }, []
  );

  const authContext = React.useMemo(
      () => ({
        signIn: async () => {
          // In a production app, we need to send some data (usually username, password) to server and get a token
          // We will also need to handle errors if sign in failed
          // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
          // In the example, we'll use a dummy token
          console.log("signIn: " + user);
          dispatch({ type: 'SIGN_IN', token: current_user.token });
        },
        signOut: () => dispatch({ type: 'SIGN_OUT' }),
        signUp: async () => {
          // In a production app, we need to send user data to server and get a token
          // We will also need to handle errors if sign up failed
          // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
          // In the example, we'll use a dummy token

          dispatch({ type: 'SIGN_UP', token: "dummy" });
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


// If confirm is there & user Token is not present => OTP
if (confirm && !otpValidationInProgress) {

  setSignUpInProgress(false);
  setOtpValidationInProgress(true);

  return(
    <AuthContext.Provider value={authContext}>
    <NavigationContainer>
      <Stack.Navigator headerBackVisible={true}>
              <Stack.Screen
                name="OTP"
                component={OTPScreen}
                options={{
                  title: 'Enter OTP',
                // When logging out, a pop animation feels intuitive
                 animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                 headerTitleAlign: 'center',
                 headerStyle: {
                  backgroundColor: '#054d17',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                }}
              />
      </Stack.Navigator>
    </NavigationContainer>
    </AuthContext.Provider>
  );

  }

  // SignUp -> confirmation code -> OPT Screen -> userToken
  // If confirm is there & user Token is not present => OTP
  if (state.userToken == null && !signUpInProgress) {
    setSignUpInProgress(true);
    return(
      <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator headerBackVisible={true}>
                <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{
                  title: 'Sign Up',
                // When logging out, a pop animation feels intuitive
                 animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                 headerTitleAlign: 'center',
                 headerStyle: {
                  backgroundColor: '#054d17',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                }}
              />
        </Stack.Navigator>
      </NavigationContainer>
      </AuthContext.Provider>
    );
  }


  if (state.userToken) {
  setOtpValidationInProgress(false);

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator headerBackVisible={true}>
          { !state.isInput ?
              (!state.isView ?
                (
                <Stack.Screen
                  name="Home"
                  component={ContactsScreen}
                  options={{
                  title: 'My home',
                  headerStyle: {
                    backgroundColor: '#054d17',
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
                  name="Posts"
                  component={PostScreen}
                  options={{
                    title: 'Posts',
                    headerStyle:{
                      backgroundColor: '#054d17',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                    fontWeight: 'bold',
                    } ,
                    headerTitleAlign: 'center',
                  }}
                  />
              ))
              :
              (
              <Stack.Screen
                name="Input"
                component={CreatePost}
                options={{
                title: 'Creat Post',
                headerStyle: {
                  backgroundColor: '#054d17',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                headerTitleAlign: 'center',
              }}
              />
            )
          }
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

return null;
};

const styles = StyleSheet.create({
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
    position: 'relative',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  fab: {

    margin: 0,
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

export default App;








  /*
    <Provider>
                      <View
                        style={{
                          paddingTop: 10,
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}>
                        <Menu
                          visible={visible}
                          onDismiss={closeMenu}
                          anchor={<FAB
                            style={styles.fab}
                            small
                            icon="dots-horizontal"
                            onPress={openMenu}
                          />}>
                          <Menu.Item onPress={() => {}} title="Item 1" />
                          <Menu.Item onPress={() => {}} title="Item 2" />
                          <Divider />
                          <Menu.Item onPress={() => {}} title="Item 3" />
                        </Menu>
                      </View>
                    </Provider>
<View>
      <FlatList
      ItemSeparatorComponent={
        Platform.OS === 'android' &&
        (({ highlighted }) => (
          <View
            style={[
              style.separator,
              highlighted && { marginLeft: 0 }
            ]}
          />
        ))
      }
      data={[{ title: 'Title Text', key: 'item1' }]}
      renderItem={({ item, index, separators }) => (
        <TouchableHighlight
          key={item.key}
          onPress={() => _onPress(item)}
          onShowUnderlay={separators.highlight}
          onHideUnderlay={separators.unhighlight}>
          <View style={{ backgroundColor: 'white' }}>
            <Text>{item.title}</Text>
          </View>
        </TouchableHighlight>
      )}
    />
    </View>
    <Appbar style={styles.bottom}>
                <Appbar.Action
                  icon="archive"
                  onPress={() => console.log('Pressed archive')}
                />
                <Appbar.Action icon="mail" onPress={() => console.log('Pressed mail')} />
                <Appbar.Action icon="label" onPress={() => console.log('Pressed label')} />
                <Appbar.Action
                  icon="delete"
                  onPress={() => console.log('Pressed delete')}
                />
              </Appbar>

    /*
      <FAB
          style={styles.fab}
          small
          icon="plus"
          onPress={() => console.log('Pressed')}
      />


      <Card.Actions>

                    <View
                      style={{
                        paddingTop: 0,
                        marginLeft: Dimensions.get('window').width/1.5,
                        //flexDirection: 'row-reverse',
                        justifyContent: 'center',
                        //position: 'absolute',
                      }}>
                      <Portal>
                      <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={<FAB
                                style={styles.fab}
                                small
                                icon="dots-horizontal"
                                onPress={() => setVisible(true)}
                              />}
                        >
                        <Menu.Item onPress={() => {}} title="Item 1" />
                        <Menu.Item onPress={() => {}} title="Item 2" />
                        <Menu.Item onPress={() => {}} title="Item 3" />
                      </Menu>
                      </Portal>
                    </View>
            </Card.Actions>



             React.useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <Button onPress={() => {
            setConfirm(null); 
            signOut()
          }}
            title="Sign Out"
          />
        ),
        /*headerLeft: () =>(
          confirm.verificationId
        )
        headerSearchBarOptions: {
          // search bar options
          onChangeText: (event) => setEdit(event.nativeEvent.text),

          textColor: '#fff',
        }, 
      });
    }, [navigation]);



    const [initialState, setInitialState] = React.useState({
    routes: [{ name: 'Home' }, { name: 'Profile' }],
    index: 0,
  });
      */

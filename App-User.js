import 'react-native-gesture-handler';
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




import auth from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { WebView } from "react-native-webview";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';



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

import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";

import { addUser, updateUser} from './feature/User';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';









export default function App()
{
    const Tab = createMaterialTopTabNavigator();
    const [number, setNumber] = useState('');
    const [name, setName] = React.useState('');
    const [email, setEmail] = useState('');
    const [nom, setNom] = useState('');
    const [user, setUser] = useState(null);
    const [post, setPost] = useState(null);

    let URL_PROFILE = "http://api.dwall.xyz/v1/profile/";
    let URL_POST = "http://api.dwall.xyz/v1/post/";
    const stack = createNativeStackNavigator();
    const [visible, setVisible] = React.useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = {backgroundColor: 'white', padding: 20};


    const getUser = async (number) => {
        //Need to get all users to display contacts.
         fetch(URL_PROFILE+'get',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                Author: number,

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


    const getPost = async (number) => {

         fetch(URL_POST+'get',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                Author: number,
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


    const getPostNext = async (number,lastDate) => {

         fetch(URL_POST+'get',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                Author: number,
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


function AddUSer({navigation}){
    return (
    <View>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>


        <Image
          style={styles.logo}
          source={require('./Virtual-Notice-Board-logos.jpeg')}
            />


        <TextInput
          style={styles.input}

          keyboardType='default'
          placeholder="Enter Full Name"
          label="Full Name"
          onEndEditing={(text) => setName(text)}
          defaultValue={name}
        />

        <TextInput
          keyboardType='numeric'
          style={styles.input}
          defaultValue={number}
          placeholder="Enter Phone Number"
          label="Number"
          maxLength={10}
          onEndEditing={(text) => setNumber(text)}
          />

        <TextInput
          keyboardType='email-address'
          style={styles.input}
          defaultValue={email}
          placeholder="Enter Email"
          label="Number"
          onEndEditing={(text) => setEmail(text)}
          />


        <RNP.Button
            mode='contained'
            style={styles.button}
            onPress={() =>
                      {
                        addUser(number,name,"Kapil",email)
                      } }
            disabled={false}
          >
          Add User
        </RNP.Button>
    </View>
  </TouchableWithoutFeedback>
  </View>

);
}


const html = `<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body> <h1 style=\"text-align: center;\"><span style=\"color: rgb(224, 62, 45);\">Ram Darbar-3</span></h1><p style=\"text-align: center;\"><span style=\"color: rgb(186, 55, 42);\"><img src=\"http://api.dwall.xyz/images/e6379285ce509dcd545c914195658f02\" width=\"286\" height=\"354\"></span></p><p style=\"text-align: center;\">"
"<span style=\"color: rgb(186, 55, 42);\">Bhagwan Ram. Jai Hanuman.</span></p></body>" `;
function GetUser() {
    return (
        <View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>


            <Image
              style={styles.logo}
              source={require('./Virtual-Notice-Board-logos.jpeg')}
                />


            <TextInput
              style={styles.input}

              keyboardType='numeric'
              placeholder="Enter Mobile Number"
              maxLength={10}
              onEndEditing={(text) => setNom(text)}
              defaultValue={nom}
            />


            <RNP.Button
                mode='contained'
                style={styles.button}
                onPress={() =>
                          {
                            console.log(nom);
                            getUser(nom);
                            console.log(user);
                          } }
                disabled={false}
              >
              Get User
            </RNP.Button>

        {user!=null &&
          <Provider>

            <Card mode='outlined' style={styles.home_card}>
                <Card.Title title={user.profile.name} subtitle={user.profile._id}/>
                <Card.Content>
                    <Paragraph>{user.profile.displayName}</Paragraph>
                </Card.Content>
            </Card>

        </Provider>
      }
        </View>
      </TouchableWithoutFeedback>
      </View>

    );
}

function CreatePost(){
  //Attach to FAB on Home Screen
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

const Drawer = createDrawerNavigator();





return(
    <NavigationContainer>
    <Drawer.Navigator initialRouteName="ADD">
            <Drawer.Screen name="ADD" component={AddUSer}/>
            <Drawer.Screen name="Create" component={CreatePost} />
            <Drawer.Screen name="GET" component={GetUser} />
            <Drawer.Screen name="GET_POST" component={GetPost} />
    </Drawer.Navigator>
    </NavigationContainer>
);



}




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
      marginTop: 30,
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

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

import { createDrawerNavigator } from '@react-navigation/drawer';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Animated,{ Value } from 'react-native-reanimated';
import 'react-native-gesture-handler';


import { FAB, DefaultTheme, Portal, Provider, Card, Appbar,  Menu, Divider, Avatar, Title, Paragraph } from 'react-native-paper';
import * as RNP from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import * as icon from 'react-native-vector-icons/FontAwesome';

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



const App: () => Node = ({navigation}) => {

    const [hid ,setHid] = useState('');
    const [search ,setSearch] = useState('');
    const [visible, setVisible] = React.useState(false);

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);
    const [filteredDataSource, setFilteredDataSource] = useState([]);


   

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

        useEffect(() => {
          setFilteredDataSource(DATA);
        },[]);

        //Show all available posts in a list
        const Item = ({ item, onPress, backgroundColor, textColor }) => (

            <TouchableOpacity onPress={() => {}} style={[styles.home_item, backgroundColor]}>
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

        const renderHeader = () => {
          return(
            <SearchBar
                  placeholder="Type Here..."
                  onChangeText={setSearch}
                  value={search}
                />
          );
        };

        const searchFilterFunction = (text) => {
          // Check if searched text is not blank
          if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = DATA.filter(function (item) {
              const itemData = item.title
                ? item.title.toUpperCase()
                : ''.toUpperCase();
              const textData = text.toUpperCase();
              return itemData.indexOf(textData) > -1;
            });
            setFilteredDataSource(newData);
            setSearch(text);
          } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFilteredDataSource(DATA);
            setSearch(text);
          }
        };





        return(
        <Provider>
        <View style={styles.container}>
              <Appbar.Header>
                <Appbar.BackAction onPress={()=>{}} />
                <Appbar.Content title="Title" subtitle="Subtitle" />
                <Appbar.Action icon="magnify" onPress={() => {renderHeader}} />
                <Menu
                  visible={visible}
                  onDismiss={closeMenu}
                  anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}>
                  <Menu.Item onPress={() => {}} title="Item 1" />
                  <Menu.Item onPress={() => {}} title="Item 2" />
                  <Divider />
                  <Menu.Item onPress={() => {}} title="Item 3" />
                </Menu>
                
              </Appbar.Header>
              <SearchBar
                round
                searchIcon={{ size: 24 }}
                onChangeText={(text) => searchFilterFunction(text)}
                onClear={(text) => searchFilterFunction('')}
                placeholder="Type Here..."
                value={search}
                showLoading
                lightTheme
              />
              <FlatList
                data={filteredDataSource}
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
                onPress={() => {}}
              />
            </>
        </View>
        </Provider>

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
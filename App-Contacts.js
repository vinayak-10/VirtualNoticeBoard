
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
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-vector-icons';
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';

import {createStackNavigator} from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as RNP from 'react-native-paper';


import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
  } from 'react-native/Libraries/NewAppScreen';







export default function App() {

  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const toggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const name = "Kapil Bhavsar";

      //Profile page design
      /*
        Switch -> In the top right corner to allow subscribing
        Image -> Account Icon from FontAwesome
        Name -> displayName of the User
        Post Cards -> Cards showing mosy recent posts by user.
      */

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
          .then((contacts) => {
            // work with contacts
              //console.log(contacts)
              let contactsObj = [{}];

              contacts.forEach((contact, i) => {
                  let contactObj = {};
                  contactObj.DisplayName = contact.givenName + ' ' + contact.familyName;
                  contact.phoneNumbers.forEach((number, i) => {
                        //console.log(number.number);
                        contactObj.PhoneNumber = number.number;
                });        // end foreach
                contactsObj[i] = contactObj;
              }); // end foreach

              console.log(JSON.stringify(contactsObj));
            }) // end then
          .catch((e) => {
                  console.log(e)
              }));
      }

      return (
        <SafeAreaView style={styles.root}>
          <StatusBar style="auto"  barStyle={'dark-content'}/>
          <RNP.Switch value={isSwitchOn} onValueChange={toggleSwitch} style={styles.switch} />
          <RNP.Avatar.Icon size={100} icon="account" style={{alignItems:'center',alignContent:'center'}} />
          <RNP.Title style={{alignItems:'center',alignContent: 'center'}}>{name}</RNP.Title>


          <Button title="Get Contacts" onPress={()=>GetContacts()} />

        </SafeAreaView>
      );




}



  const styles = StyleSheet.create({
    editor: {
        flex: 1,
        padding: 0,
        borderColor: 'gray',

        backgroundColor: 'white',
      },
      root: {
        flex: 2,
        marginTop: StatusBar.currentHeight || 0,
        backgroundColor: '#eaeaea',
        alignContent: 'center',
      },
      switch: {
        flexDirection: 'row-reverse',
      },
    });




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
          */


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

import {createStackNavigator} from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as RNP from 'react-native-paper';
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
  } from 'react-native/Libraries/NewAppScreen';







export default function Input() {

  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const toggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    const onPressAddImage = () => {
        // you can easily add images from your gallery
        richText.current?.insertImage(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png"
        );
      };

      const editorInitializedCallback = () => {
        RichText.current?.registerToolbar(function (items) {});
      };
      //Profile page design
      /*
        Switch -> In the top right corner to allow subscribing
        Image -> Account Icon from FontAwesome
        Name -> displayName of the User
        Post Cards -> Cards showing mosy recent posts by user.
      */
      const richText = React.createRef();
      return (
        <SafeAreaView style={styles.root}>
          <StatusBar style="auto"  barStyle={'dark-content'}/>
          <RNP.Switch value={isSwitchOn} onValueChange={toggleSwitch} style={styles.switch} />
          <RNP.Avatar.Icon size={32} icon="account" />
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
      },
      switch: {
        flexDirection: 'row-reverse',
      },
    });

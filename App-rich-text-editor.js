
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

import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
  } from 'react-native/Libraries/NewAppScreen';
  






export default function App() {

    const onPressAddImage = () => {
        // you can easily add images from your gallery
        richText.current?.insertImage(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png"
        );
      };

      const editorInitializedCallback = () => {
        richText.current?.registerToolbar(function (items) {});
      };
      
      const richText = React.createRef();
      return (
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
                            actions={[ actions.setBold, actions.setItalic, actions.setUnderline, actions.heading1,actions.insertImage,actions.setColor ]}
                            onPressAddImage={onPressAddImage}
                            iconMap={{ [actions.heading1]: ({tintColor}) => (<Text style={[{color: tintColor}]}>H1</Text>), }}
                        />
            </KeyboardAvoidingView>
            </ScrollView>
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
    });




    
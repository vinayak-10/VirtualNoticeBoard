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
  } from 'react-native';

    import { FAB, Portal, Provider, Card, Appbar,Button,  Menu, Divider, Avatar, Title, Paragraph } from 'react-native-paper';
    import * as RNP from "react-native-paper";

    import {
        Colors,
        DebugInstructions,
        Header,
        LearnMoreLinks,
        ReloadInstructions,
      } from 'react-native/Libraries/NewAppScreen';



  const App: () => Node = ({navigation}) => {

  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  console.log("Visible: "+visible);
    return(
      <Provider>
        <Portal>
            
                <View
                  style={{
                    paddingTop: 0,
                    marginLeft: Dimensions.get('window').width/1.5,
                    flexDirection: 'row-reverse',
                    justifyContent: 'center', 
                    position: 'absolute',
                  }}>
                      
                  <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={<RNP.Button style={styles.button} compact onPress={openMenu} mode='text'>Show menu</RNP.Button>}
                    >
                    <Menu.Item onPress={() => {}} title="Item 1" />
                    <Menu.Item onPress={() => {}} title="Item 2" />
                    <Divider />
                    <Menu.Item onPress={() => {}} title="Item 3" />
                  </Menu>
                </View>
            </Portal>
          </Provider>
    );

}

const styles = StyleSheet.create({
    button: {
        marginTop: 20,
        fontSize: 24,
        
     
    
      },
});


export default App;
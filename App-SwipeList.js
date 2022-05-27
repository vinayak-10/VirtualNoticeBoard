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


import FlipPage, {FlipPagePage} from 'react-native-flip-page';
import { FAB, Portal, Provider, Card, Appbar,Button,  Menu, Divider, Avatar, Title, Paragraph } from 'react-native-paper';
import 'react-native-gesture-handler';
import { SwiperFlatList } from 'react-native-swiper-flatlist';

import { WebView } from "react-native-webview";
 import Swiper from 'react-native-swiper';
import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
  } from 'react-native/Libraries/NewAppScreen';


  const App: () => Node = () => {

  /*
    return(
    <FlipPage  orientation='vertical'>
        <FlipPagePage style={{backgroundColor:'#228B22'}}>
            <TouchableOpacity>
                <Text style={styles.title}>CARD 1</Text>
                <Image
                    style={styles.tinyLogo}
                    source={require('./My-project-1.png')}
                />
            </TouchableOpacity>
        </FlipPagePage>
        <FlipPagePage style={{backgroundColor:'#228B22'}}>

            <TouchableOpacity >
                <Text style={styles.title}>CARD 2</Text>

                <Image
                    style={styles.tinyLogo}
                    source={require('./Virtual-Notice-Board.png')
                }
                />
            </TouchableOpacity>
        </FlipPagePage>
        <FlipPagePage style={{backgroundColor:'#228B22'}}>

            <TouchableOpacity >
                <Text style={styles.title}>CARD 3</Text>

                <Image
                    style={styles.tinyLogo}
                    source={require('./Virtual-Notice-Board-logos.jpeg')}
                />
            </TouchableOpacity>
        </FlipPagePage>
        <FlipPagePage style={{backgroundColor:'#228B22'}}>

            <TouchableOpacity>
                <Text style={styles.title}>CARD 4</Text>

                <Image
                    style={styles.tinyLogo}
                    source={{
                    uri: 'https://reactnative.dev/img/tiny_logo.png',
                }}
                />
            </TouchableOpacity>
        </FlipPagePage>
        <FlipPagePage style={{backgroundColor:'#228B22'}}>

            <TouchableOpacity >
                <Text style={styles.title}>CARD 5</Text>

                <Image
                    style={styles.tinyLogo}
                    source={{
                    uri: 'https://reactnative.dev/img/tiny_logo.png',
                }}
                />
            </TouchableOpacity>
        </FlipPagePage>
    </FlipPage>
    );
    */

/*
  const [selectedId, setSelectedId] = useState(null);
  const [stat, setStat] = React.useState({ open: false });
  const { open } = stat;
  const onStateChange = ({ open }) => setStat({ open });





      const Item = ({ items, backgroundColor, textColor }) => (

             <View>

               {items.map((item)=> (

                  <FlipPagePage
                    key={item.id}
                    style={[textColor,backgroundColor]}>
                      <Title>{item.title}</Title>
                      <Paragraph>{item.id}</Paragraph>
                      <Image
                        style={styles.tinyLogo}
                        source={item.img}
                       />
                  </FlipPagePage>

               )
               )}

              </View>


        );

      return(
        <View style={styles.root}>
          <FlipPage>
          <Item
            items={DATA}
            backgroundColor="#228B22"
            textColor="white"
          />
          </FlipPage>
        </View>
      );
      */




      const Item = ({item}) => {


            return(
            <View
              key={item.id}
              style={[styles.child,{backgroundColor: item.color}]}>
                 <Title style={styles.text}>{item.title}</Title>
                 <Paragraph style={styles.text}>{item.id}</Paragraph>
                 <Image
                   style={styles.tinyLogo}
                   source={item.img}
                  />
             </View>
            );
      }


      const Colors = ({item}) => {
        return(
          <View style={[styles.child, { backgroundColor: item }]}>
          <Text style={styles.text}>{item}</Text>
        </View>
        );
      }

      const pages = [
        "https://reactnative.dev/",
        "https://www.google.com/",
        "https://reactnavigation.org/",
        "https://www.anaconda.com/",
        "http://editor.dwall.xyz/?Author=%2B919000945575"
      ]










      const Pages = ({item}) => {
        return(
          //Allow local file access with allowFileAccess prop (use local file uri to render post html)
          <WebView
            source={{uri:item}}
            style={{width:Dimensions.get('window').width,
                    height: Dimensions.get('window').height,
                  flex: 1, }}
          />
        );
      }



      return(
        <View style={styles.container}>
          <SwiperFlatList
            index={0}
            showPagination
            style={styles.wrapper}
            data={pages}
            renderItem={Pages}
        />

      </View>
      );
  }

 const colors = ['tomato', 'thistle', 'skyblue', 'teal'];
  const { width } = Dimensions.get('window');



  const styles = StyleSheet.create({
    title: {
        fontSize: 50,
        fontWeight: 'bold',
      },
      container: { flex: 0, backgroundColor: 'white' },
    child: { width, justifyContent: 'center', alignItems: 'center',  },
    text: { fontSize: width * 0.5, textAlign: 'center',color:'white', },
      tinyLogo: {
        margin: 40,
        width: 150,
        height: 150,
        alignContent: 'center',
      },

      item: {
        padding: 20,
        height: 250,
        width: 700,
      },
      root: {
        flex: 0,
        marginTop: StatusBar.currentHeight || 0,
        backgroundColor: '#eaeaea',
      },
      fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
      },

      slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
      },
      slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
      },
      slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
      },
      text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
      },
      wrapper: {
        flex: 0,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        backgroundColor: 'white',
      },
  });

  export default App;


  //backgroundColor:'#042c27'
  /*<SwiperFlatList
          index={0}
          showPagination
          data={DATA}
          renderItem={Item}
        />*/

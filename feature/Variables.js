import React,{useState ,Component,useEffect} from 'react';
import type {Node} from 'react';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';




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



 const AuthContext = React.createContext();
 const Stack = createNativeStackNavigator();
 const Tab = createMaterialTopTabNavigator();


 const isDarkMode = useColorScheme() === 'dark';
 const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

 const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';


export const {
    AuthContext,Stack,Tab,PERSISTENCE_KEY, backgroundStyle, User,
};

import React,{useState} from 'react';
import { View, Text, Image, Button } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { launchImageLibrary } from 'react-native-image-picker';

const createFormData = (photo, body = {}) => {
    const data = new FormData();
  
    data.append('photo', {
      name: photo.fileName,
      type: photo.type,
      uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
    });
  
    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });
  
    return data;
  };
  

  const App = () => {
    const [photo, setPhoto] = useState(null);


    React.useEffect(()=>{
        setPhoto({'uri':'file:///data/user/0/com.fresh/cache/rn_image_picker_lib_temp_3cacc59e-1178-4606-bcf3-6f9760a436da.jpg',
        "height": 192,"width": 119});
        console.log(photo);

    });
  
    const handleChoosePhoto = () => {
      launchImageLibrary({ noData: true, title: 'You can choose one image',
      maxWidth: 256,
      maxHeight: 256,
      storageOptions: {
        skipBackup: true
      } }, 
      (response) => {
        // console.log(response);
        setPhoto(response);
        if (response) {
          
          console.log(response);
        }
        //console.log(response);
        console.log(photo);
      });
    };
  
    /*
    const handleUploadPhoto = () => {
      fetch(`${SERVER_URL}/api/upload`, {
        method: 'POST',
        body: createFormData(photo, { userId: '123' }),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log('response', response);
        })
        .catch((error) => {
          console.log('error', error);
        });
    };
  */
    return (
      <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
        {photo && (
          <>
            <Image
              source={{ uri: photo.uri }}
              style={{ flex: 1,width: 300, height: 300 }}
            />
          </>
        )}
        <Button title="Choose Photo" onPress={handleChoosePhoto} />
      </View>
    );
  };
  
  export default App;
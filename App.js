/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useState, useEffect} from 'react';
// import auth from '@react-native-firebase/auth';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  Alert,
  Image,
  FlatList,
  TextInput,
  SafeAreaView
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {ActivityIndicator} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Loading } from './Loading';
import Config from './config';
const App = () => {

  GoogleSignin.configure({
    iosClientId:Config.iosId,
    webClientId: Platform.OS === 'ios' ?Config.iosId:Config.androidId
  });

  const [name, setName] = useState("");
  const [photo, setPhoto] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [checkList, setCheckList] = useState([]);
  const [text, setText] = useState("")
  useEffect(()=>{
    AsyncStorage.getItem("userData")
    .then(data=>{
      if(data){
        data = JSON.parse(data);
        setPhoto(data.photo);
        setName(data.name);
        setCheckList(data.checkList);
      }
      setIsLoading(false)
    })
  },[])
  const signIn = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.hasPlayServices();
      const userData = await GoogleSignin.signIn();
      console.log(userData)
      setPhoto(userData.user.photo);
      setName(userData.user.name);
      setIsLoading(false);
      await AsyncStorage.setItem('userData', JSON.stringify({name:userData.user.name, photo:userData.user.photo}))
      .catch(err=>console.log(err))
    } catch (error) {
      Alert.alert(JSON.stringify(error));
      console.log(JSON.stringify(error))
      setIsLoading(false)
      // if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      //   // user cancelled the login flow
      // } else if (error.code === statusCodes.IN_PROGRESS) {
      //   // operation (e.g. sign in) is in progress already
      // } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      //   // play services not available or outdated
      // } else {
      // }
      // Alert.alert(error)
    }
  };
  const signOut = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setPhoto("");
      setName("");
      setCheckList([])
      await AsyncStorage.setItem('userData', JSON.stringify({name:"", photo:"", checkList:[]}))
      .catch(err=>console.log(err))
      setIsLoading(false);
    } catch (error) {
      Alert.alert(JSON.stringify(error));
    }
  };
  const handleSubmit = async() =>{
    if(text==""){
      Alert.alert("Please enter a todo first!");
    }
    else{
      let temp = [];
      if(checkList==undefined)
      temp = [];
      else
      temp = checkList;
      temp.push(text);
      setText("");
      setCheckList([...temp])
      await AsyncStorage.setItem('userData', JSON.stringify({name:name, photo:photo, checkList:temp}))
        .catch(err=>console.log(err))
    }
  }
  const onRemove = async(id) => {
    // console.log(id);
    let tempList = checkList.filter((todo,index) => index !== id);
    setCheckList(tempList);
    await AsyncStorage.setItem('userData', JSON.stringify({name:name, photo:photo, checkList:tempList}))
    .catch(err=>console.log(err))
  };
  
  const renderItem = ({ item,index }) => {return(

    <View key={index} style={{padding:5}}>
      <View style={styles.innerBox}>
        <View style={{flexDirection:'row', height:100}}>
          <View style={ styles.center,{flex:7,justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize:15}}>{item}</Text>
          </View>
          <TouchableOpacity style={styles.center} onPress={()=>onRemove(index)} >
            <Image source = {require('./delete.png')}  style={{width:30,height:30}} color="#e33057" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );}
  if(isLoading){
    return(
      <Loading/>
    )
  }
  else if(name && photo){
    return(
      <LinearGradient colors={['#99ddff','#99ddaa']} style={{flex:2}}>
      <SafeAreaView>
        <View style={styles.box}>
          <View style={{flexDirection:'row'}}>
            <View style={{padding:'2%'}}>
              <Image source={{ uri: photo }} style={{ width: 100, height: 100, borderRadius: 100, justifyContent:'flex-start' }} />
            </View>
            <View style={styles.center}>
              <Text style={{fontSize:25}}>{name.substr(0,name.indexOf(" "))+"'s Todo List"}</Text>
              <TouchableOpacity style={{marginTop:'2%',backgroundColor:"#F4D4B7"}}>
                <Button onPress = {signOut} color="#F4D4B7" style={{marginTop:'5%',backgroundColor:"#F4D4B7"}} title="LOG OUT"></Button>
              </TouchableOpacity>
            </View>
          </View>
          {/* {/* */}
        </View >
        <View style = {styles.flatList}>
          <FlatList
            nestedScrollEnabled
            data={checkList}
            renderItem={renderItem}
            keyExtractor={(item,index) => index.toString()}
          />
          </View>
        
          <TextInput
            style={styles.input}
            onChangeText={setText}
            value={text}
            placeholder="Enter new Todo to add to list"
            required
          />
        
          <TouchableOpacity style={{height:45}}>
            <Button onPress={handleSubmit} color="#F4D4B7" title="Submit">Submit</Button>
          </TouchableOpacity>
        
      </SafeAreaView>
      </LinearGradient>
    )
  }
  else{
    return (
      <LinearGradient colors={['#99ddff','#99ddaa']} style={styles.center}>
        <GoogleSigninButton
          style={{ width: 208, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
        />
      </LinearGradient>
    );
  }
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  loadingView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  loadingText: {
    color: '#99ddff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  box:{
    borderWidth: 2,
    borderColor: "#20232a",
    borderRadius: 3,
    margin:'5%',
    marginTop:'0%'
  },
  innerBox:{
    borderWidth: 2,
    borderColor: "#20232a",
    borderRadius: 3,
    margin:'2%',
    marginTop:'5%'
  },
  center:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },

  input: {
    marginTop:'-2%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    backgroundColor:'white',
  },
  flatList:{
    borderWidth: 2,
    borderColor: "#20232a",
    borderRadius: 3,
    margin:'5%', 
    marginTop:0,
    maxHeight:'60%',
    minHeight:'60%',
    borderWidth: 1,
  }
  
});

export default App;

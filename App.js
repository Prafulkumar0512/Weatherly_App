import { StatusBar } from 'expo-status-bar';
import React,{useState} from 'react';
import AppLoading from 'expo-app-loading';
import { StyleSheet, Text, View } from 'react-native';
import * as Font from 'expo-font'
import Navigation from './navigation/Navigator'
const fontloading=async ()=>{
  return  await Font.loadAsync({
    'light':require('./assets/Montserrat/Montserrat-Light.ttf'),
    'bold':require('./assets/Montserrat/Montserrat-Bold.ttf'),
    'cursive':require('./assets/Montserrat/Pacifico-Regular.ttf')
 
  })
}

export default function App() {
  const[loaded,isloaded]=useState(false)
  if(!loaded){
    return <AppLoading
      startAsync={fontloading}
      onFinish = {() => isloaded(true)}
      onError = {(test)=> console.log(test) }
    />
  }
  return (
    <Navigation/>
  );
}



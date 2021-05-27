import React, { useEffect } from 'react'
import {View,Image,Text} from 'react-native'
import * as Permissions from 'expo-permissions'
import * as Locat from 'expo-location'

const Location=(props)=>{
    const permissionHandler=async()=>{
        const permission=await Permissions.askAsync('location');
        if(!permission)
        {
            Alert.alert('Permission Denied','Permission Denied for accessing Location',[{text:'Okay'}])
        }
        return true
    }
    const perm=permissionHandler()
    const geolocation=async()=>{
        let location = await Locat.getCurrentPositionAsync({});
        const currentLongitude =JSON.stringify(location.coords.longitude);
        const currentLatitude =JSON.stringify(location.coords.latitude);
        props.setfunc(currentLatitude,currentLongitude)
    }
    useEffect(()=>{
        geolocation()
    })
    if (!perm){
        return(
            <View style={{justifyContent:'center',alignItems:'center'}} >
                <Text>Access Denied</Text>
            </View>
        )
    }
    return(
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}} >
           <Image style={{height:70,width:70}} source={{uri:'https://thumbs.gfycat.com/FlawedDistantBrocketdeer-max-1mb.gif'}} />
        </View>
    )
}

export default Location;
import React from 'react'
import {View,Text,Image,StyleSheet, ImageBackground} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Card=props=>{
    return(
        <View style={styles.container} >
        <ImageBackground source={{uri:props.image}} style={{opacity:0.9,borderRadius:20,width:'100%',height:'100%',overflow:'hidden'}}   >
        <View style={{top:'50%',padding:5,height:'40%',width:'100%',borderBottomLeftRadius:20,borderBottomRightRadius:20}} >
        <Text style={{fontFamily:'bold',color:'white',fontSize:15,marginLeft:10}} >{props.time}</Text>
            <View style={{flexDirection:'row',marginLeft:10}} >
                <MaterialCommunityIcons name={props.icon} size={40} color="white"  />                
                    <Text style={{fontFamily:'bold',fontSize:30,color:'white'}} >{props.temp}</Text>
                    <Text style={{fontFamily:'bold',fontSize:16,color:'white'}} >°C</Text>
            </View>
            <Text style={{fontFamily:'bold',fontSize:15,marginLeft:10,color:'white'}} >{props.description}</Text>
        </View>
        </ImageBackground>
        
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        width:250,
        height:250
    }
})

export default Card;
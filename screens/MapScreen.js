import React, { useState,useEffect } from 'react'
import { View,ScrollView,Text, Dimensions, TouchableOpacity, SafeAreaView,TextInput } from 'react-native'
import Geocoder from 'react-native-geocoding';
import CustomBottomSheet from 'react-native-custom-bottom-sheet'
import MapView,{Marker} from 'react-native-maps'
import Carousel from 'react-native-snap-carousel'
import Location from '../components/Location'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { wdata } from '../components/Background';
import Card from '../components/Card';


const MapScreen=props=>{
    var addressComponent;
    const[loc,setloc]=useState()
    const[data,setdata]=useState()
    const[latitude,setlatitude]=useState()
    const[longitude,setlongitude]=useState()
    const[visible,setvisible]=useState(false)
    const[lat,setlat]=useState()
    const[long,setlong]=useState()
    const[pressed,onpressed]=useState(false)
    const getloc=(lat,lon)=>{
        setlatitude(parseFloat(lat))
        setlongitude(parseFloat(lon))
    }
    const convertdate=(dt)=>{
        var date = new Date(dt * 1000);
        var formattedTime = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
        return formattedTime
    }
    const converttime=(dt)=>{
        var date = new Date(dt * 1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var formattedTime = hours + ':' + minutes.substr(-2) ;
        return formattedTime
    }
    const titleCase=(str)=>{
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        return splitStr.join(' '); 
     }
    const converttemp=(f)=>{
        var value = f - 273.15;
        return value.toFixed(2);
    }

    const API_KEY='e5735fe7347b27edfe245a48b8d5a5ff'
    const SLIDER_WIDTH = Dimensions.get('screen').width;
    const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
    
    const renderlist=itemData=>{
        return(
            <Card
                icon={wdata[itemData.item.weather[0].id].icon}
                temp={converttemp(itemData.item.temp)}
                time={converttime(itemData.item.dt)}
                description={titleCase(itemData.item.weather[0].description)}
                image={wdata[itemData.item.weather[0].id].image}
            />
        )
    }
    const renderlist1=itemData=>{
        return(
            <Card
                icon={wdata[itemData.item.weather[0].id].icon}
                temp={converttemp(itemData.item.temp.day)}
                time={convertdate(itemData.item.dt)}
                description={titleCase(itemData.item.weather[0].description)}
                image={wdata[itemData.item.weather[0].id].image}
            />
        )
    }
    const getweatherFromApi = (lat,lon) => {
        fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`
          )
            .then(res => res.json())
            .then(json => {
                setdata(json)
            })
          .catch((error) => {
            console.error(error);
          });
      };
    useEffect(()=>{
        const fetchweather=async()=>{
            if(pressed){
                await getweatherFromApi(lat,long)
            }
            else{
                await getweatherFromApi(latitude,longitude)
            }
        }
        if(long!=null || longitude!=null)
        {
            fetchweather()
        }
        
    },[lat,long,latitude,longitude])
    
    const findloc=async()=>{
        Geocoder.init("AIzaSyDsDKH-37DS6ZnGY_oIi7t5YE0oAAZ-V88");
        await Geocoder.from(lat, long)
		.then(json => {
        	addressComponent = json.results[0].formatted_address;
            setloc(addressComponent)
            console.log(addressComponent)
		})
		.catch(error => console.warn(error));
    }
    useEffect(()=>{
        findloc()
    },[lat,long])
    if(!latitude || !data ){
        return(
            <Location setfunc={getloc}  />
        )
    }
    return(
        <View style={{flex:1}}>
        <MapView style={{flex:1}} mapType="standard" initialRegion={{latitude:latitude,longitude:longitude,latitudeDelta:1.04,longitudeDelta:1.05}} >
            <Marker draggable={pressed} useNativeDriver={true}
           onDragEnd={(e) => {
                setlat(e.nativeEvent.coordinate.latitude)
                setlong(e.nativeEvent.coordinate.longitude)
                setvisible(true)
            }}
            title={titleCase(data.current.weather[0].description)}
            description={'Temperature:' +converttemp(data.current.temp)+ '°C'} 
            coordinate={{latitude:pressed?lat:latitude,longitude:pressed?long:longitude}} />
            
            </MapView>
            <View style={{height:60,width:60,borderRadius:30,backgroundColor:"#272756",justifyContent:'center',alignItems:'center',position: 'absolute',right:20,top:Dimensions.get('screen').height*0.75}}>
                <TouchableOpacity onPress={()=>onpressed(prevState=>!prevState)}  >
                <MaterialCommunityIcons name={pressed?"map-marker-off":"map-marker"} size={40} color="red" />
                </TouchableOpacity>
            </View>
            <View>
                <CustomBottomSheet visible={visible} onVisibilityChange={()=>setvisible(prevState=>!prevState)} height={500} >
                <View >
                <View style={{borderBottomWidth:0.9,padding:8,flexDirection:'row',justifyContent:'space-between'}} >
                    <Text style={{fontFamily:'bold',fontSize:15}} >Weather Forecast</Text>
                    <TouchableOpacity onPress={()=>setvisible(prevState=>!prevState)} >
                        <MaterialCommunityIcons size={25} color='black' name='close-thick' />
                    </TouchableOpacity>
                </View>
               <ScrollView style={{marginTop:40}} >
                <View>
                <Text style={{fontSize:16,fontFamily:'bold',textAlign:'center'}} >Location:{loc}</Text>
                <Text style={{marginTop:5,fontSize:16,fontFamily:'bold',textAlign:'center'}}>{titleCase(data.current.weather[0].description)}</Text>            
                <View style={{justifyContent:'center',alignItems:'center',marginTop:5}} >
                <MaterialCommunityIcons name={wdata[data.current.weather[0].id].icon} size={40} color="black"  />                
                </View>
                <View style={{flexDirection:'row',justifyContent:'center'}} >
                <Text style={{fontSize:60,fontFamily:'light',textAlign:'center',marginTop:2,marginLeft:2}}>{converttemp(data.current.temp)}</Text>
                <Text style={{fontSize:20,textAlign:'center',marginTop:10,fontFamily:'light'}}>°C</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:'center'}} >
                    <View>
                        <Text style={{fontFamily:'bold',fontSize:18}} >Sunrise</Text>
                        <Text style={{fontFamily:'light',fontSize:18}} >{converttime(data.current.sunrise)} am</Text>
                    </View>
                    <View style={{marginLeft:20}} >
                        <Text style={{fontFamily:'bold',fontSize:18}} >Sunset</Text>
                        <Text style={{fontFamily:'light',fontSize:18}} >{converttime(data.current.sunset)} pm</Text>
                    </View>
                </View>
                </View>
            <View style={{marginTop:40}} >
            <View style={{padding:5}} >
            <Text style={{marginTop:5,fontSize:16,fontFamily:'bold',marginLeft:5}} >Today's Hourly Forecast</Text>
            <Carousel
                data={data.hourly}
                renderItem={renderlist}
                layout={'default'}
                sliderWidth={SLIDER_WIDTH}
                itemWidth={ITEM_WIDTH}
                
            />
            </View>
            <View style={{marginBottom:40}} >
            <Text style={{marginTop:5,fontSize:16,fontFamily:'bold',marginLeft:5}} >Next 7 Days Forecast</Text>
            <Carousel
                data={data.daily}
                renderItem={renderlist1}
                layout={'default'}
                sliderWidth={SLIDER_WIDTH}
                itemWidth={ITEM_WIDTH}
                
            />
            </View>
            </View>
            </ScrollView>
                </View>
                </CustomBottomSheet>
            </View>
        </View>
    )
}

MapScreen.navigationOptions=navData=>{
    return{
        header:()=>{
            return false;
        }
    }
}

export default MapScreen
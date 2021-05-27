import React,{useEffect, useState} from 'react'
import { View,Dimensions,Image,Text, Alert,StyleSheet, ImageBackground, ScrollView } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { wdata } from '../components/Background'
import Location from '../components/Location'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../components/Card'
import Geocoder from 'react-native-geocoding';
import { hasStartedLocationUpdatesAsync } from 'expo-location'

const HomeScreen=props=>{
    var addressComponent;
    const[latitude,setlatitude]=useState()
    const[longitude,setlongitude]=useState()
    const[data,setdata]=useState()
    const[loc,setloc]=useState()
    const convertdate=(dt)=>{
        var date = new Date(dt * 1000);
        var formattedTime = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
        return formattedTime
    }
    const converttime=(dt)=>{
        var tm;
        var date = new Date(dt * 1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        if(hours<12){
            tm='am'
        }
        else{
            tm='pm'
        }
        var formattedTime = hours + ':' + minutes.substr(-2)+ tm ;
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

    //const API_KEY='4535d641bf6040309403ce879e61447a'
    const API_KEY='e5735fe7347b27edfe245a48b8d5a5ff'
    const SLIDER_WIDTH = Dimensions.get('screen').width;
    const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
    const getloc=(lat,lon)=>{
        setlatitude(lat)
        setlongitude(lon)
    }
    const renderlist=itemData=>{
        return(
            <Card
                icon={wdata[itemData.item.weather[0].id].icon}
                temp={converttemp(itemData.item.temp)}
                time={'Time: '+converttime(itemData.item.dt)}
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
      const findloc=async()=>{
        Geocoder.init("AIzaSyDsDKH-37DS6ZnGY_oIi7t5YE0oAAZ-V88");
        await Geocoder.from(latitude, longitude)
		.then(json => {
        	const array = json.results[0].address_components;
            const length = array.length;
            const city = json.results[0].address_components[length-6].long_name
            setloc(city)
		})
		.catch(error => console.warn(error));
    }
    useEffect(()=>{
        findloc()
    },[latitude,longitude])
    useEffect(()=>{
        const fetchweather=async()=>{
            await getweatherFromApi(latitude,longitude)
        }
        if(longitude!=null)
        {
            fetchweather()
        }
        
    },[latitude,longitude])
    if(!latitude || !data ){
        return(
                <Location setfunc={getloc} />
        )
    }
    return(
        <View style={{flex:1}} >
        <ImageBackground source={{uri:'https://wallpaper.dog/large/10717885.jpg'}} style={{flex:1,resizeMode: "cover",}} >
        <Text style={{marginTop:50,textAlign:'center',fontFamily:'cursive',fontSize:22,color:'#1843f5'}} >Weatherly</Text>
            <ScrollView style={{marginTop:20}}>
                <Text style={{fontSize:16,fontFamily:'bold',color:'white',textAlign:'center'}} >TimeZone:{data.timezone}</Text>
                <Text style={{fontSize:16,fontFamily:'bold',color:'white',textAlign:'center',margin:5}} >{loc}</Text>
                <Text style={{marginTop:5,fontSize:16,fontFamily:'bold',textAlign:'center',color:'white'}}>{titleCase(data.current.weather[0].description)}</Text>            
                <View style={{justifyContent:'center',alignItems:'center',marginTop:5}} >
                <MaterialCommunityIcons name={wdata[data.current.weather[0].id].icon} size={40} color="white"  />                
                </View>
                <View>
                <View style={{flexDirection:'row',justifyContent:'center'}} >
                <Text style={{fontSize:60,fontFamily:'light',textAlign:'center',color:'white',marginTop:2,marginLeft:2}}>{converttemp(data.current.temp)}</Text>
                <Text style={{fontSize:20,textAlign:'center',color:'white',marginTop:10,fontFamily:'light'}}>°C</Text>
                </View>
                </View>
                <View style={{flexDirection:'row',justifyContent:'center'}} >
                    <View>
                        <Text style={{fontFamily:'bold',fontSize:18,color:'white'}} >Sunrise</Text>
                        <Text style={{fontFamily:'light',fontSize:18,color:'white'}} >{converttime(data.current.sunrise)} </Text>
                    </View>
                    <View style={{marginLeft:20}} >
                        <Text style={{fontFamily:'bold',fontSize:18,color:'white'}} >Sunset</Text>
                        <Text style={{fontFamily:'light',fontSize:18,color:'white'}} >{converttime(data.current.sunset)} </Text>
                    </View>
                </View>
                <View style={{flexDirection:'row',marginTop:20,justifyContent:'center'}} >
                <View>
                <View>
                <Text  style={{fontFamily:'bold',fontSize:18,color:'white'}} >Feels Like</Text>
                <Text  style={{fontFamily:'light',fontSize:17,color:'white'}} >{converttemp(data.current.feels_like)}°C</Text>
                </View>
                <View style={{marginTop:10}} >
                <Text  style={{fontFamily:'bold',fontSize:18,color:'white'}} >Humidity</Text>
                <Text  style={{fontFamily:'light',fontSize:17,color:'white'}} >{data.current.humidity}%</Text>
                </View>
                </View>
                <View style={{marginLeft:20}} >
                <View>
                <Text  style={{fontFamily:'bold',fontSize:15,color:'white'}} >Wind Speed</Text>
                <Text  style={{fontFamily:'light',fontSize:17,color:'white'}} >{data.current.wind_speed}KM/H</Text>
                </View>
                <View style={{marginTop:10}} >
                <Text  style={{fontFamily:'bold',fontSize:15,color:'white'}} >Dew Point</Text>
                <Text  style={{fontFamily:'light',fontSize:17,color:'white'}} >{converttemp(data.current.dew_point)}°C</Text>
                </View>
                </View>
                </View>
            <View style={{padding:5,marginTop:30}} >
            <Text style={{marginTop:5,fontSize:16,fontFamily:'bold',marginLeft:5,color:'white'}} >Today's Hourly Forecast</Text>
            <Carousel
                data={data.hourly}
                renderItem={renderlist}
                layout={'default'}
                sliderWidth={SLIDER_WIDTH}
                itemWidth={ITEM_WIDTH}
                
            />
            </View>
            <View style={{marginBottom:20}} >
            <Text style={{marginTop:5,fontSize:16,fontFamily:'bold',marginLeft:5,color:'white'}} >Next 7 Days Forecast</Text>
            <Carousel
                data={data.daily}
                renderItem={renderlist1}
                layout={'default'}
                sliderWidth={SLIDER_WIDTH}
                itemWidth={ITEM_WIDTH}
                
            />
            </View>
            </ScrollView>
        </ImageBackground>
            
        </View>
    )
}

HomeScreen.navigationOptions=navData=>{
    return{
        header:()=>{
            return false;
        }
    }
}

const styles=StyleSheet.create({
})
export default HomeScreen
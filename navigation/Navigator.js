import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import HomeScreen from '../screens/HomeScreen'
import MapScreen from '../screens/MapScreen'
import { MaterialCommunityIcons } from '@expo/vector-icons';
const defaultNavOptions = {
    headerStyle:{
        backgroundColor:'#27327F'
    },
    headerTintColor:'#eaf8ff'
}
const Home=createStackNavigator({
    home:HomeScreen
},{defaultNavigationOptions:defaultNavOptions})
const Map=createStackNavigator({
    map:MapScreen
},{defaultNavigationOptions:defaultNavOptions})

const tabconfig={
    Home:{
        screen:Home,
        navigationOptions:{
            tabBarLabel:'Weather',
            tabBarIcon:(tabInfo)=>{
                return <MaterialCommunityIcons name="weather-cloudy" size={24} color={tabInfo.tintColor} />
            },
            tabBarColor:'transparent'
        }
    },
    Map:{
        screen:Map,
        navigationOptions:{
            tabBarLabel:'Maps',
            tabBarIcon:(tabInfo)=>{
                return <MaterialCommunityIcons name="map-marker" size={24} color={tabInfo.tintColor} />
            },
            tabBarColor:'transparent'
        }
    }

}

const bottomnav=createMaterialBottomTabNavigator(tabconfig,{
    activeColor:'#27327F',
    inactiveColor:'#5679c3',
    shifting:true,
})

export default createAppContainer(bottomnav)
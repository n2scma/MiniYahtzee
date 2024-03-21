import React, { useEffect } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { View } from 'react-native';
import Header from './components/Header'
import Gameboard from './components/Gameboardc'
import Footer from './components/Footer';
import Styles from './style/style';
import Home from './components/Home'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Scoreboard from './components/Scoreboard';

const Tab = createBottomTabNavigator();

const saveGameResults = async (playerName, score, points) => {
  try {
      const existingResults = await AsyncStorage.getItem('gameResults');
      let results = existingResults ? JSON.parse(existingResults) : [];

      results.push({ playerName, score, points });

      await AsyncStorage.setItem('gameResults', JSON.stringify(results));
      console.log('Game results saved successfully!');
  } catch (error) {
      console.error('Error saving game results:', error);
  }
};

export default function App() {

  return(
    <NavigationContainer>
      <Tab.Navigator
        sceneContainerStyle={{backgroundColor: 'transparent'}}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused
              ? 'information'
              : 'information-outline';
            } else if (route.name === 'Gameboard') {
              iconName = focused 
              ? 'dice-multiple'
              : 'dice-multiple-outline'
            }
             else if (route.name === 'Scoreboard') {
            iconName = focused 
            ? 'view-list'
            : 'view-list-outline'
            }


            return <MaterialCommunityIcons
            name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'steelblue',
          tabBarInactiveTintColor: 'grey',
        })}
        >
          <Tab.Screen name="Home" component={Home}
          options={{tabBarStyle: {display: "none"}}} />
          <Tab.Screen 
          name="Gameboard"
          options={{ tabBarLabel: 'Gameboard'}}
          >
            {({ navigation, route }) => (
              <Gameboard
              saveGameResults={saveGameResults}
              {...{ navigation, route }}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Scoreboard">
            {() => <Scoreboard saveGameResults={saveGameResults} />}
          </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  )
}


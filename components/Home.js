import React, { useState, useEffect } from 'react';
import { Text, TextInput, Keyboard,  View, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from '../style/style';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
    NBR_OF_DICES,
    NBR_OF_THROWS,
    MIN_SPOT,
    MAX_SPOT,
    BONUS_POINTS_LIMIT,
    BONUS_POINTS } from '../constants/Game'
import style from '../style/style';

export default function Home({ navigation }) {
    const [playerName,setPlayerName] = useState('');
    const [hasPlayerName, setHasPlayerName] = useState(false);
  

    const handlePlayerName = (value) => {
        if (value.trim().length > 0) {
            setHasPlayerName(true);
            Keyboard.dismiss();
        }
    }

    return (
        <>
        <Header style={styles.header}/>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons
            name="information"
            size={70}
            color="steelblue"
            />
            {!hasPlayerName ?
            <>
            <Text style={{ marginBottom: 10 }}>For scoreboard enter your name...</Text>
            <TextInput
            style={styles.namebox}
            onChangeText={setPlayerName}
            autoFocus={true}
            />
            <Pressable
            style={styles.buttons}
            onPress={() => handlePlayerName(playerName)}>
                <Text>OK</Text>
            </Pressable>
            </>
            :
            <>
            <Text style={{ textAlign: 'center'}}>Rules of the game</Text>
            <Text multiline ="true" style={{ textAlign: 'center'}}>
            THE GAME:
            </Text>
            <Text style={{ textAlign: 'center'}}>
            Upper section of the classic Yahtzee
            dice game. You have {NBR_OF_DICES} dices and
            for the every dice you have {NBR_OF_THROWS}
            throws. After each throw you can keep dices in
            order to get same dice spot counts as many as
            possible. In the end of the turn you must select
            your points from {MIN_SPOT} to {MAX_SPOT}.
            Game ends when all points have been selected.
            The order for selecting those is free.
            </Text>
            <Text style={{ textAlign: 'center'}}>
            POINTS:
            </Text>
            <Text style={{ textAlign: 'center'}}>
            After each turn game calculates the sum
            for the dices you selected.
            </Text> 
            <Text style={{ textAlign: 'center'}}>
            Only the dices having
            the same spot count are calculated.
            </Text>
            <Text style={{ textAlign: 'center'}}>
            Inside the
            game you can not select same points from
            {MIN_SPOT} to {MAX_SPOT} again.
            </Text>
            <Text style={{ textAlign: 'center'}}>
            GOAL:
            </Text>
            <Text style={{ textAlign: 'center'}}>
            To get as much points as possible.
            </Text>
            <Text style={{ textAlign: 'center'}}>
            {BONUS_POINTS_LIMIT} points is the limit of
            getting bonus which gives you {BONUS_POINTS}
            points more.
            </Text>
            <Text>Good Luck, {playerName}</Text>
            <Pressable
            style={styles.buttons}
            onPress={() => navigation.navigate('Gameboard', {player: playerName})}>
                <Text>PLAY</Text>
            </Pressable>
            </>
            }
        </View>
        <Footer />
        </>
    )
}

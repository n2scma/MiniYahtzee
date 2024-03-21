import React from 'react'
import { useState, useEffect } from 'react'
import Scoreboard from './Scoreboard'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Text, View, Pressable, Button, Alert } from 'react-native'
import {
    NBR_OF_DICES,
    NBR_OF_THROWS,
    MIN_SPOT,
    MAX_SPOT,
    BONUS_POINTS_LIMIT,
    BONUS_POINTS
} from '../constants/Game'
import { Container, Row, Col } from 'react-native-flex-grid'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import styles from '../style/style'
import AsyncStorage from '@react-native-async-storage/async-storage';


let board = [];

export default function Gameboard({ navigation, route }) {

    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState (<Text style={{ textAlign: 'center'}}>{status}</Text>);
    const [gameEndStatus, setGameEndStatus] = useState(false);

    const [selectedDices, setSelectedDices] = useState (new Array (NBR_OF_DICES).fill(false));

    const [diceSpots, setDiceSpots] = useState (new Array (NBR_OF_DICES).fill(0));
    const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(false));
    const [dicePointsTotal, setDicePointsTotal] = useState (new Array (MAX_SPOT).fill(0))
    const [pointsNeededForBonus, setPointsNeededForBonus] = useState(BONUS_POINTS_LIMIT);
    const [totalScore, setTotalScore] = useState(0);
    const [totalScoreWithBonus, setTotalScoreWithBonus] = useState(0);

    const [playerName, setPlayerName] = useState('');

    useEffect(() => {
        if (playerName === '' && route.params?.player) {
            setPlayerName(route.params.player);
        }

    }, []);

    useEffect(() => {
        if (gameEndStatus) {
          saveGameResult(playerName, totalScoreWithBonus);
        }
      }, [gameEndStatus]);

    const row = [];
    for (let dice = 0; dice < NBR_OF_DICES; dice++) {
        row.push(
            <Col key={"dice" + dice}>
                <Pressable
                    key={"dice" + dice}
                    onPress={() => selectDice(dice)}
                    >
                        <MaterialCommunityIcons
                        name={board[dice]}
                        key={"row" + dice}
                        size={50}
                        color={getDiceColor(dice)}
                        >

                        </MaterialCommunityIcons>
                        </Pressable>
            </Col>
        )
    }

    const resetGame = () => {
        setNbrOfThrowsLeft(NBR_OF_THROWS);
        setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        setDiceSpots(new Array(NBR_OF_DICES).fill(0));
        setSelectedDicePoints(new Array(MAX_SPOT).fill(false));
        setDicePointsTotal(new Array(MAX_SPOT).fill(0));
        setPointsNeededForBonus(BONUS_POINTS_LIMIT);
        setGameEndStatus(false);
    };

    const pointsRow = [];
    for (let spot = 0; spot < MAX_SPOT; spot++) {
        pointsRow.push(
            <Col key ={"pointsRow" + spot}>
                <Text key={"pointsRow" + spot}>{getSpotTotal(spot)}</Text>
            </Col>
        );
    }

    const pointsToSelectRow = [];
    for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
        pointsToSelectRow.push(
        <Col key={"buttonsRow" + diceButton}>
            <Pressable 
                key={"buttonsRow" + diceButton}
                onPress={() => selectDicePoints(diceButton)}
            >
                <MaterialCommunityIcons
                    key={"buttonsRow" + diceButton}
                    name={"numeric-" + (diceButton + 1) + "-circle"}
                    size={35}
                    color={getDicePointsColor(diceButton)}
                    >
                </MaterialCommunityIcons>
            </Pressable>
        </Col>
        );
    }

    const selectDice = (i) => {
        let dices = [...selectedDices];
        dices[i] = !dices[i];
        setSelectedDices(dices);
    }

    const saveGameResult = async (playerName, score, date, callback) => {
        const existingScores = await AsyncStorage.getItem('scoreboard');
        const scoreboard = existingScores ? JSON.parse(existingScores) : [];
        const newScore = { playerName, score, date: new Date().toISOString() };
        scoreboard.push(newScore);
        scoreboard.sort((a, b) => b.score - a.score);
        await AsyncStorage.setItem('scoreboard', JSON.stringify(scoreboard));
        if (callback) callback();
      };

    function getDiceColor(i) {
        return selectedDices[i] ? "black" : "steelblue"
    }

    function getDicePointsColor(i) {
        return selectedDicePoints[i] ? "black" : "steelblue"
    }

    const selectDicePoints = (i) => {
        if (nbrOfThrowsLeft === 0) {
        let selected = [...selectedDices];
        let selectedPoints = [...selectedDicePoints];
        let points = [...dicePointsTotal];
        if(!selectedPoints[i]) {
        selectedPoints[i] = true;
        let nbrOfDices = 
            diceSpots.reduce
            ((total, x) => (x === (i + 1) ? total + 1 : total), 0);
        points[i] = nbrOfDices * (i + 1);
        setDicePointsTotal(points);
        setSelectedDicePoints(selectedPoints);
        setNbrOfThrowsLeft(NBR_OF_THROWS);
        return points[i];
        }
        else {
            setStatus('You already selected points for' + (i + 1));
        }
    }
    else {
        setStatus("Throw" + NBR_OF_THROWS + " times before setting points.")
    }

    const totalScore = dicePointsTotal.reduce((acc, curr) => acc + curr, 0);
    setPointsNeededForBonus(totalScore >= BONUS_POINTS_LIMIT ? 0 : BONUS_POINTS_LIMIT - totalScore);
}

const savePoints = async (points) => {
    try {
        await AsyncStorage.setItem('points', JSON.stringify(points));
        console.log('Points saved successfully!');
    } catch (error) {
        console.error('Error saving points:', error);
    }
};


const throwDices = () => {
    let spots = [...diceSpots];
    for (let i = 0; i < NBR_OF_DICES; i++) {
        if (!selectedDices[i]) {
            let randomNumber = Math.floor(Math.random() * MAX_SPOT + 1);
            spots[i] = randomNumber;
            board[i] = 'dice-' + randomNumber;
        }
    }

    if (selectedDicePoints.every(point => point)) {
        endGame();
    } else {
        setDiceSpots(spots);
        if (nbrOfThrowsLeft > 0) {
            setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
        }

        const totalScore = dicePointsTotal.reduce((acc, curr) => acc + curr, 0);
        setPointsNeededForBonus(totalScore >= BONUS_POINTS_LIMIT ? 0 : BONUS_POINTS_LIMIT - totalScore);
    }
}

    function getSpotTotal(i) {
        return dicePointsTotal[i];
    }

    useEffect(() => {
        const sum = dicePointsTotal.reduce((acc, curr) => acc + curr, 0);
        setTotalScore(sum);
    }, [dicePointsTotal]);

    useEffect(() => {
        if (nbrOfThrowsLeft === 0 && selectedDicePoints.every(point => point)) {
            endGame();
        }
    }, [nbrOfThrowsLeft, selectedDicePoints]);

    const endGame = () => {
        savePoints(dicePointsTotal);
        const totalScore = dicePointsTotal.reduce((acc, curr) => acc + curr, 0);
        const totalScoreWithBonus = totalScore >= BONUS_POINTS_LIMIT ? totalScore + BONUS_POINTS : totalScore;
        saveGameResult(playerName, totalScore, dicePointsTotal);
        Alert.alert(
            'Game Over',
            'Your points have been saved. Do you want to start a new game?',
            [
                {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => resetGame()
                }
            ],
            { cancelable: false }
        );
        saveGameResult(playerName, totalScoreWithBonus);
    };

    return (
        <>
        <Header style={styles.header}/>
        <View style={{alignItems: 'center'}}>
            <MaterialCommunityIcons
                name="dice-multiple"
                size={75}
                color="black"
            />
            <Container style={styles.container}>
                <Row>{row}</Row>
            </Container>
            <Text style={{ textAlign: 'center'}}>Throws left: {nbrOfThrowsLeft}</Text>
            <Text>{status}</Text>
            <View style={styles.button}>
                <Button
                    title="Throw Dices"
                    onPress={() => throwDices()}
                    style={styles.button}
                    disabled={nbrOfThrowsLeft === 0}
                />
                </View>
            <Container>
                <Row>{pointsRow}</Row>
            </Container>
            <Container>
                <Row>{pointsToSelectRow}</Row>
            </Container>
            <Text style={{textAlign: 'center', marginTop: 10}}>Player name: {playerName}</Text>
            <Text style={{ textAlign: 'center', marginTop: 10 }}>Total Score: {totalScore}</Text>
            <Text style={{textAlign: 'center', marginTop: 10}}>Points Needed for Bonus: {pointsNeededForBonus}</Text>
            {gameEndStatus && (
                <View style={styles.endGameMessage}>
                    <Text>Game Over!</Text>
                </View>
            )}
        </View>
        <Footer />
        </>
    )
}
import { Link } from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import {useNavigate } from 'react-router-dom';
import { useWebSocket } from '../websocketContext/websocketContext';
import React, {useState, useEffect } from 'react';
import './endGameScreen.css';

function EndGameScreen(){

    const [roundState, setRoundState] = useState(0);
    const { stompClient, sendMessage, subscribe } = useWebSocket();
    const location = useLocation();
    const {state} = location;
    const {lobbyKey, userType} = state || {};
    const navigate = useNavigate();
    const [message, setMessages] = useState("Host start the game");
    const [playerPoints, setPlayerPoints] = useState([]);

    useEffect(() => {
        if (stompClient && lobbyKey) {
            let subscription2 = stompClient.subscribe("/room/" + lobbyKey + "/points", handleNewMessage);
            
            let payload = {
                token: "getPoints",
                gameKey: lobbyKey,
                userName: "user"};
            
    
            stompClient.send('/app/' + lobbyKey + "/points", {}, JSON.stringify(payload));
            
      
            return () => {
                
                subscription2.unsubscribe();
            };
        }
    }, [stompClient, lobbyKey]);

        const handleNewMessage = (message) => {
        console.log('New message received:', message.body); 
        const parsedMessages = JSON.parse(message.body);

        let { data, token, players} = parsedMessages;

      
        console.log("data: " + data);
        console.log("token: " + token);
        console.log("players: " + players);

       if(token === "score"){
            setPlayerPoints(players);
        }
       
      

 

    };

    const leaveGame = () =>{

        if(userType === 'screen'){

            let payload = {
                token: "endGame",
                gameKey: lobbyKey,
                userName: "user"};
            
    
            stompClient.send('/app/' + lobbyKey + "/endGame", {}, JSON.stringify(payload));
            

        }

        navigate('/');
    }

    

    return (
        <div id='endGameMainDiv'>
            <h1>FACT FRENZY</h1>
            

            <div id='scoresDiv'>
                <h2 id="finalScores">Final Scores</h2>
            </div>
            <div id='pointsList'>

                <ol id='screenList'>
                    {playerPoints.length > 0 ? (
                        playerPoints.map((msg, index) => (
                            <li key={index}>{msg}</li>
                        ))
                    ) : (
                        <li> </li>
                    )}
                </ol>
            </div>

            <button id='leaveGameButton' onClick={leaveGame}>Leave Game</button>
        </div>
    );

}

export default EndGameScreen;
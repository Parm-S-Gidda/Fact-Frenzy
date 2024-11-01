import { Link } from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import {useNavigate } from 'react-router-dom';
import { useWebSocket } from '../websocketContext/websocketContext';
import React, {useState, useEffect } from 'react';
import './screenGame.css';

function ScreenGame(){

    const [roundState, setRoundState] = useState(0);
    const { stompClient, sendMessage, subscribe } = useWebSocket();
    const location = useLocation();
    const {state} = location;
    const {lobbyKey, userName, userType} = state || {};
    const navigate = useNavigate();
    const [message, setMessages] = useState("Host start the game");
    const [playerPoints, setPlayerPoints] = useState([]);

    useEffect(() => {
        if (stompClient && lobbyKey) {
            let subscription = stompClient.subscribe("/room/" + lobbyKey + "/Screen", handleNewMessage);
            let subscription2 = stompClient.subscribe("/room/" + lobbyKey + "/points", handleNewMessage);
            
            let payload = {
                token: "getQuestion",
                gameKey: lobbyKey,
                userName: "user"};
            
    
        
            console.log("Requesting Question");
      
            return () => {
                subscription.unsubscribe();
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

        if(token === "question"){
            setMessages(data);
        }
        else if(token === "score"){
            setPlayerPoints(players);
        }
        else if(token === "done"){
            navigate('/game-over', {state:{lobbyKey:lobbyKey, userType:'screen'}});
        }
      

 

    };

    return(
        <div id='screenMainDiv'>
            <h1>FACT FRENZY</h1>

            <div id='screenQuestionDiv'>
                <h1 id='screenMessage'>{message}</h1>
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
        </div>
    )
}

export default ScreenGame;
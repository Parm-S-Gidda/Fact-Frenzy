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

    useEffect(() => {
        if (stompClient && lobbyKey) {
            let subscription = stompClient.subscribe("/room/" + lobbyKey + "/Screen", handleNewMessage);

            
            let payload = {
                token: "getQuestion",
                gameKey: lobbyKey,
                userName: "user"};
            
    
        
            console.log("Requesting Question");
      
            return () => {
                subscription.unsubscribe();
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
        setMessages(data);

    };

    return(
        <div id='screenMainDiv'>
            <h1>FACT FRENZY</h1>

            <div id='screenQuestionDiv'>
                <h1 id='screenMessage'>{message}</h1>
            </div>
        </div>
    )
}

export default ScreenGame;
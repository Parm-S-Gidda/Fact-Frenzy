import { Link } from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import {useNavigate } from 'react-router-dom';
import { useWebSocket } from '../websocketContext/websocketContext';
import React, {useState, useEffect } from 'react';

function ScreenGame(){

    const [roundState, setRoundState] = useState(0);
    const { stompClient, sendMessage, subscribe } = useWebSocket();
    const location = useLocation();
    const {state} = location;
    const {lobbyKey, userName, userType} = state || {};
    const navigate = useNavigate();
    const [message, setMessages] = useState("");

    useEffect(() => {
        if (stompClient && lobbyKey) {
            let subscription = stompClient.subscribe("/room/" + lobbyKey + "/Screen", handleNewMessage);

            
            let payload = {
                token: "getQuestion",
                gameKey: lobbyKey,
                userName: "user"};
            
    
        
            console.log("Requesting Question");
           // stompClient.send('/app/' + lobbyKey, {}, JSON.stringify(payload));
            

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
        <div>
            <h1>Trivia</h1>
            <h1>{message}</h1>
        </div>
    )
}

export default ScreenGame;
import { Link } from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import {useNavigate } from 'react-router-dom';
import { useWebSocket } from '../websocketContext/websocketContext';
import React, {useState, useEffect } from 'react';

function PlayerGame() {

        //0 = show question, 1 = no buzz,  2 = right/wrong
        const [roundState, setRoundState] = useState(0);
        const { stompClient, sendMessage, subscribe } = useWebSocket();
        const location = useLocation();
        const {state} = location;
        const {lobbyKey, userName, userType} = state || {};
        const navigate = useNavigate();
        const [question, setQuestion] = useState("");
        const [answer, setAnswer] = useState("");
        const [score, setScore] = useState("0");


    function buzzer(){

        let currentTime = Date.now();

        let payload = {
            token: "buzz",
            gameKey: lobbyKey,
            userName: userName,
            time:currentTime};

         stompClient.send('/app/' + lobbyKey + "/buzz", {}, JSON.stringify(payload));
       
    }

    useEffect(() => {
        if (stompClient && lobbyKey) {
            let subscription = stompClient.subscribe("/room/" + lobbyKey + "/points", handleNewMessage);
           // let subscription2 = stompClient.subscribe("/room/" + lobbyKey + "/Screen", handleNewMessage);

            
            let payload = {
                token: "getAnswer",
                gameKey: lobbyKey,
                userName: "user"};
            
    
        
            console.log("Requesting Answer");
           // stompClient.send('/app/' + lobbyKey, {}, JSON.stringify(payload));
            

            return () => {
                subscription.unsubscribe();
               // subscription2.unsubscribe();
            };
        }
    }, [stompClient, lobbyKey]);

    const handleNewMessage = (message) => {
        console.log('New message received:', message.body); 
        const parsedMessages = JSON.parse(message.body);

        let { data, token, players, name} = parsedMessages;

        if(token === "score" && name === userName){
            setScore(data)
        }

      
        console.log("data: " + data);
        console.log("token: " + token);
        console.log("players: " + players);
        console.log("name: " + name);
        console.log("actual: " + userName)

    

    };

    return (
        
        <div className='mainDiv'>
            <div>
                <h1>Trivia</h1>
                <h3>{userName}</h3>
                <h3>{score}</h3>
            </div>
            <div>
                <button onClick={buzzer}>BUZZER</button>
            </div>
        </div>


    );

}

export default PlayerGame
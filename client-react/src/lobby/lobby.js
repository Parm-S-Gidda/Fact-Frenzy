import { Link } from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import {useNavigate } from 'react-router-dom';
import './lobbyStyle.css';
import { useWebSocket } from '../websocketContext/websocketContext';
import React, {useState, useEffect } from 'react';

function Lobby() 
{

    const { stompClient, sendMessage, subscribe } = useWebSocket();
    const location = useLocation();
    const {state} = location;
    const {lobbyKey, userName, userType} = state || {};
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    let isHost = false;

    useEffect(() => {
        if (stompClient && lobbyKey) {
            let subscription = stompClient.subscribe("/room/" + lobbyKey, handleNewMessage);

            let payload = "";
            if(userType == "hoster"){
                    payload = {
                    token: "joinGame",
                    gameKey: lobbyKey,
                    userName: "hoster"
                }
            }
            else{
                     payload = {
                    token: "joinGame",
                    gameKey: lobbyKey,
                    userName: userName
                }
            }
           
                console.log("sending player join");
                stompClient.send('/app/' + lobbyKey, {}, JSON.stringify(payload));
            

            return () => {
                subscription.unsubscribe();
            };
        }
    }, [stompClient, lobbyKey]);

    const handleNewMessage = (message) => {
        console.log('New message received:', message.body); 
        const parsedMessages = JSON.parse(message.body);

        let { data, token, players} = parsedMessages;

        if(token === "host" && data === userName){

            console.log("I am the host");
            isHost = true;
        }
        else if(token === "start"){

            if(userType === "hoster"){
                navigate('/screenGame', {state:{lobbyKey:lobbyKey, userName:'screen'}});
            }
            else if(isHost){
                navigate('/hostGame', {state:{lobbyKey:lobbyKey, userName:userName}});
            }
            else{
                navigate('/playerGame', {state:{lobbyKey:lobbyKey, userName:userName}});
            }
       
        }

        console.log("data: " + data);
        console.log("token: " + token);
        console.log("players: " + players);
        setMessages(players);

    };

    const startGame = () => {

        let payload = {
            token: "startGame",
            gameKey: lobbyKey,
            userName: "hoster" };

        stompClient.send('/app/' + lobbyKey, {}, JSON.stringify(payload));
    }

    const leaveLobby = () => {

        console.log("leaving----------");

        let payload = "";
        if(userType === "hoster"){
                payload = {
                token: "leaveLobby",
                gameKey: lobbyKey,
                userName: "hoster"
            }
        }
        else{
                 payload = {
                token: "leaveLobby",
                gameKey: lobbyKey,
                userName: userName
            }
        }

        console.log("sending leave");
        stompClient.send('/app/' + lobbyKey, {}, JSON.stringify(payload));
        navigate('/');
    }

 


    return (
        <div class='mainDiv'> 
            <div id='titleInfo'>
                <h1>FACT FRENZY</h1>
                <h3>Lobby Code: {lobbyKey}</h3>
                <h3>{userName}</h3>
                
            </div>
            <div id='userList'>
            <ul>
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))
                ) : (
                    <li>No Users yet</li>
                )}
            </ul>
            </div>
            <div id='buttons'> 
                <button onClick={leaveLobby} id='leaveButton'>Leave Lobby</button>

                {userType === "hoster" && (  <button onClick={startGame} id='startButton' >Start Game</button>)}
              
            </div>


        </div>
    );

    
}

export default Lobby;
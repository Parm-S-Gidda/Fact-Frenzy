import { Link } from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import {useNavigate } from 'react-router-dom';
import { useWebSocket } from '../websocketContext/websocketContext';
import React, {useState, useEffect } from 'react';

function HostGame(){

    //0 = show question, 1 = no buzz,  2 = right/wrong
    const [roundState, setRoundState] = useState(0);
    const { stompClient, sendMessage, subscribe } = useWebSocket();
    const location = useLocation();
    const {state} = location;
    const {lobbyKey, userName, userType} = state || {};
    const navigate = useNavigate();
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [buzzName, setBuzzName] = useState("");

    const showNextQuestion = () =>
    {
       let payload = {
            token: "getQuestion",
            gameKey: lobbyKey,
            userName: "user"};

        stompClient.send('/app/' + lobbyKey + "/Screen", {}, JSON.stringify(payload));
        setRoundState(1);
    }

    const skipQuestion = () =>
    {

        let payload = {
            token: "getAnswer",
            gameKey: lobbyKey,
            userName: "user"};

        stompClient.send('/app/' + lobbyKey + "/GameHost", {}, JSON.stringify(payload));

  
        setRoundState(2);
    }

    const correctAnswer = () =>
    {
        let payload = {
            token: "correct",
            gameKey: lobbyKey,
            userName: buzzName};

        stompClient.send('/app/' + lobbyKey + "/correct", {}, JSON.stringify(payload));

        setRoundState(0);
    }

    const IncorrectAnswer = () =>
    {
        let payload = {
            token: "wrong",
            gameKey: lobbyKey,
            userName: buzzName};

        stompClient.send('/app/' + lobbyKey + "/wrong", {}, JSON.stringify(payload));

        setRoundState(0);
    }

    useEffect(() => {
        if (stompClient && lobbyKey) {
            let subscription = stompClient.subscribe("/room/" + lobbyKey + "/GameHost", handleNewMessage);
            let subscription2 = stompClient.subscribe("/room/" + lobbyKey + "/Screen", handleNewMessage);
            let subscription3 = stompClient.subscribe("/room/" + lobbyKey + "/buzz", handleNewMessage);

            
            let payload = {
                token: "getAnswer",
                gameKey: lobbyKey,
                userName: "user"};
            
    
        
            console.log("Requesting Answer");
           // stompClient.send('/app/' + lobbyKey, {}, JSON.stringify(payload));
            

            return () => {
                subscription.unsubscribe();
                subscription2.unsubscribe();
                subscription3.unsubscribe();
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

        if(token === "answer"){
            setAnswer(data);
        }
       else if(token === "question"){
           setQuestion(data);
       }
       else if(token === "buzz"){
           setBuzzName(data);
           let payload = {
            token: "getAnswer",
            gameKey: lobbyKey,
            userName: "user"};

        stompClient.send('/app/' + lobbyKey + "/GameHost", {}, JSON.stringify(payload));
           setRoundState(2);
       }

    };


    

    return(

        <div>
              <h1>Trivia</h1>

              <div>
                {roundState === 0 ? (
                    <div>
                        <h3>Display the next Question</h3>
                        <button onClick={showNextQuestion}>Show Next Question</button>
                    </div>
                ) : roundState === 1 ? (
                    <div>
                        <h3>{question}</h3>
                        <h3>Skip Question</h3>
                        <button onClick={skipQuestion}>Skip Question</button>
                    </div>
                ) : roundState === 2 ? (
                    <div>
                        <h3>Did {buzzName} answer correctly?</h3>
                        <h3>Answer: {answer}</h3>
                        <button onClick={correctAnswer}>Correct</button>
                        <button onClick={IncorrectAnswer}>Incorrect</button>
                    </div>
                ) : (
                    <h1>Number is neither zero, one, nor two</h1>
                )}
            </div>


        </div>
      
        
    );
}

export default HostGame
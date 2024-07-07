import { Link } from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import {useNavigate } from 'react-router-dom';
import { useWebSocket } from '../websocketContext/websocketContext';
import React, {useState, useEffect } from 'react';
import './hostGame.css';

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

    var canBuzz = false;

    const showNextQuestion = () =>
    {
        canBuzz = true;
       let payload = {
            token: "getQuestion",
            gameKey: lobbyKey,
            userName: "user"};

        stompClient.send('/app/' + lobbyKey + "/Screen", {}, JSON.stringify(payload));
        setRoundState(1);
    }

    const skipQuestion = () =>
    {

        canBuzz = false;
        let payload = {
            token: "getAnswer",
            gameKey: lobbyKey,
            userName: "user"};

        stompClient.send('/app/' + lobbyKey + "/GameHost", {}, JSON.stringify(payload));
        console.log("we tried skipping");
        setRoundState(3);
    }

    const correctAnswer = () =>
    {
        canBuzz = false;
        let payload = {
            token: "correct",
            gameKey: lobbyKey,
            userName: buzzName};

        stompClient.send('/app/' + lobbyKey + "/correct", {}, JSON.stringify(payload));

        setRoundState(0);
    }

    const Continue = () =>
        {
          
            canBuzz = false;
            setRoundState(0);
        }

    const IncorrectAnswer = () =>
    {
        canBuzz = false;
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

        <div id='hostGameDiv'>
              <h1>FACT FRENZY</h1>

              <div>
                {roundState === 0 ? (
                    <div id='nextQuestionDiv'>

                        <div id='backGroundDiv'>
                            <h3>Display the next Question</h3>
                        </div>
                        <button onClick={showNextQuestion} id='showNextButton'>Show Next Question</button>
                    </div>
                ) : roundState === 1 ? (
                    <div id='skipQuestionDiv'>

                        <div id='backGroundDiv'>
                            <h3>{question}</h3>
                        </div>
                        <button onClick={skipQuestion} id='skipQuestionButton'>Skip Question</button>
                    </div>
                ) : roundState === 2 ? (
                    <div id='rightOrWrongDiv'>
                        
                        <div id='backGroundDiv'>
                            <h3>Did {buzzName} answer correctly?</h3>
                            <h3>Answer: {answer}</h3>
                        </div>

                        <button onClick={correctAnswer} id='correctButton'>Correct</button>
                        <button onClick={IncorrectAnswer} id='wrongButton'>Incorrect</button>
                    </div>
                )  : roundState === 3 ? (
                    <div id='questionSkippedDiv'>

                        <div id='backGroundDiv'>
                            <h3>Question Skipped</h3>
                            <h3>Correct Answer was: {answer}</h3>
                        </div>
                        <button onClick={Continue} id='continueButton'>Continue</button>
                   
                    </div>
                )
                 : (
                    <h1>Number is neither zero, one, nor two</h1>
                )}
            </div>


        </div>
      
        
    );
}

export default HostGame
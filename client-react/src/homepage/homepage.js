import './homepage.css';
import { Link } from 'react-router-dom';
import {useNavigate } from 'react-router-dom';
import { useWebSocket } from '../websocketContext/websocketContext';

function HomePage() 
{

    const navigate = useNavigate();
    const handleHostClicked = () => 
    {
        fetch('http://localhost:8080/createRoom')
        .then(response => 
        {
            if(!response.ok)
            {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {


            navigate('/lobby', {state:{lobbyKey:data, userType:'hoster'}});

        })
        .catch((error) => 
        {
            console.error('Host Catch Error', error);
        });
    }

    const handleJoinClicked = () => 
    {
        const gameKeyInput = document.getElementById('gameKey'); 
        let gameKey = gameKeyInput.value;

        fetch(`http://localhost:8080/checkKey?key=${gameKey}`)
            .then(response => 
            {
                if (!response.ok) 
                {
                    throw new Error('Did not get key check response');
                }
                return response.text();
            })
            .then(data => 
            {
              
    
                if (data === "true") 
                {
                    
                    navigate('/name-selection', {state:{lobbyKey:gameKey}});
    
                 
                } else 
                {
        
                    alert("Key does not exist");
                }
            })
            .catch(error => {
                console.error('Did not get key check response ', error);
            });
   
    }


    return (
    <div>
        <div className="title">
            <h1>Trivia</h1>
        </div>  
    
        <div>
            <div id="createGame">
            
                <button id="hostGameButton" onClick={handleHostClicked}>Host Game</button>
               
            </div>
            <div id="joinGame">

                <div className='joinDiv'>
                    <form>
                        <input type="text" id="gameKey" name="gameKey" placeholder="Lobby Code"></input>
                    </form>

                 
                    <button id="joinGameButton" onClick={handleJoinClicked}>Join Game</button>
                   

                </div>
            
            
            </div>
        </div>
    </div>
    );
}

export default HomePage;
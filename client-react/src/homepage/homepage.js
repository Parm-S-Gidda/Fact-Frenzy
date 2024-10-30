import './homepage.css';
import { Link } from 'react-router-dom';
import {useNavigate } from 'react-router-dom';
import { useWebSocket } from '../websocketContext/websocketContext';

function HomePage() 
{

    const navigate = useNavigate();
    const handleHostClicked = () => 
    {
        fetch('https://fact-frenzy-01-8036074015.us-central1.run.app/createRoom')
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

        fetch(`https://fact-frenzy-01-8036074015.us-central1.run.app/checkKey?key=${gameKey}`)
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
    <div className='main'>
        <div className="title">
            <h1>FACT FRENZY</h1>
        </div>  
    
        <div className='second'>
            <div id="createGame">
            
                <button id="hostGameButton" onClick={handleHostClicked}>Host Game</button>
               
            </div>
            <div id="joinGame">

                <div className='joinDiv'>

                <button id="joinGameButton" onClick={handleJoinClicked}>Join Game</button>
                    <form>
                        <input type="text" id="gameKey" name="gameKey" placeholder="Lobby Code"></input>
                    </form>

                </div>
            
            
            </div>
        </div>
    </div>
    );
}

export default HomePage;
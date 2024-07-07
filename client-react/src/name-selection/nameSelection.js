import { Link } from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import {useNavigate } from 'react-router-dom';
import { useWebSocket } from '../websocketContext/websocketContext';
import './name-select.css';

function NameSelection()
{

    const location = useLocation();
    const {state} = location;
    const {lobbyKey} = state || {};
    const navigate = useNavigate();
    const { socket, sendMessage, subscribeToRoom } = useWebSocket();
    
    

    const linkToLobby = () => {

        const playerName = document.getElementById('username');
     //   subscribeToRoom(lobbyKey);

        const payload = {
            token: "joinGame",
            gameKey: lobbyKey,
            userName: playerName.value

        }
     //   sendMessage(lobbyKey, payload);
        navigate('/lobby', {state:{lobbyKey:lobbyKey, userName:playerName.value, userType:'player'}});

    }

    return (

        <div class='mainDiv'>
            <div id='titleDiv'>
                <h1>Trivia</h1>
                <h3>Choose a Username</h3>
                <form>
                        <input type="text" id="username" name="username" placeholder="Enter a Username"></input>
                </form>
            </div>

            <div id='buttonDiv' className='userNameButtonDiv'>
                
                <Link to="/">
                    <button id='userNameBackButton'>Back</button>
                </Link>
                
                    <button id='saveNameBackButton' onClick={linkToLobby}>Save</button>
                
            </div>
        </div>
    );

}

export default NameSelection
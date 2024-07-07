import SockJS from 'sockjs-client';
import Stomp from 'stompjs';


const joinGameButton = document.getElementById('joinGameButton');
const hostGameButton = document.getElementById('hostGameButton');
const gameKeyText = document.getElementById('gameKey');


//check if given key exists 
//todo: join game if key exists 
joinGameButton.addEventListener('click', function() {
    let gameKey = gameKeyText.value;

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
            console.log("Key Exist?: " + data);

            if (data === "true") 
            {
                console.log("Key Exists");

                connect(gameKey).then( () => 
                {
                    alert("connected");
        
                });
            } else 
            {
                console.log("Key Does not Exist");
                alert("Key does not exist");
            }
        })
        .catch(error => {
            console.error('Did not get key check response ', error);
        });
});



hostGameButton.addEventListener('click', function() {
    
    fetch('http://localhost:8080/createRoom')
    .then(response => 
    {

        if(!response.ok){
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => 
    {
        console.log("Room Key: " + data);
        alert("room Key: " + data);

        connect(data).then( () => 
        {
            alert("connected");

        });

    })
    .catch((error) => 
    {
        console.error('Failed to connect: ', error);
    });
});

function connect(roomKey) 
{
    return new Promise((resolve, reject) => 
    {
        console.log("Trying to connect...");
        var socket = new SockJS('http://localhost:8080/connect');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, function(frame) 
        {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/' + roomKey, function(messageOutput) 
            {
                console.log("Received a message");
                showMessageOutput(messageOutput);
            });
            resolve();
        }, function(error) 
        {
            console.error('Connection error: ', error);
            reject(error);
        });
    });
}

function showMessageOutput(messageOutput) 
{
    console.log('Message Output:');
    console.log(messageOutput);
}
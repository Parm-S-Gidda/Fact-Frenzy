const { userInfo } = require('os');
const SockJS = require('sockjs-client');
const Stomp = require('stompjs');
const readline = require('node:readline');

let stompClient = null;

function connect(roomKey) {
    return new Promise((resolve, reject) => {
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

function sendMessage() {
    
    stompClient.send("/app/chat", {}, "Hello");

    
}

function showMessageOutput(messageOutput) {
    console.log('Message Output:');
    console.log(messageOutput);
}

const joinGameButton = document.getElementById('joinGameButton');
const hostGameButton = document.getElementById('hostGameButton');

// Attach a click event listener to the button
joinGameButton.addEventListener('click', function() {
    alert('Join Game was clicked!');
});

hostGameButton.addEventListener('click', function() {
    alert('Host Game was clicked!');
});



    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      rl.question('Join room or Create Room (roomKey or C): ', (name) => {
        console.log(`Hello, ${name}!`);

        if(name === "C"){

            //grab a roomKey from server
fetch('http://localhost:8080/createRoom').then(
    response => {

        if(!response.ok){
            throw new Error('Network response was not ok');
        }
        return response.text();
    }

//then ues the room key to connect to server and subscribe to that room 
).then(
    data => {
        console.log("Room Key: " + data);
        
   
    connect(data).then(() => {



        sendMessage();
    }).catch((error) => {
        console.error('Failed to connect: ', error);
    });

    }
)
            
        }
        else{
            connect(name).then(() => {



                sendMessage();
            }).catch((error) => {
                console.error('Failed to connect: ', error);
            });
        }




        rl.close();
      });







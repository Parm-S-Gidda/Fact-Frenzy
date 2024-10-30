import React, { createContext, useState, useEffect, useContext } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);
  const url = 'https://fact-frenzy-01-8036074015.us-central1.run.app/connect'; // 

  useEffect(() => {

 
    const newSocket = new SockJS(url, null, {
      transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
      withCredentials: true
    });

    const newStompClient = Stomp.over(newSocket);

    newStompClient.connect({}, () => {
      console.log("STOMP client connected");
      setStompClient(newStompClient);
    }, (error) => {
      console.error("STOMP client connection error:", error);
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  //send message to a room 
  const sendMessage = (room, data) => {
    if (stompClient) {
     // stompClient.send('/app/' + room, {}, JSON.stringify(data));
    }
  };

  //subscribe to a room
  const subscribeToRoom = (roomKey) => {

    console.log("key is: " + roomKey);
    if (stompClient) {
      stompClient.subscribe('/room/' + roomKey, (message) => {
        console.log("Server says: ", message);
      });
    }
  };

  return (
    <WebSocketContext.Provider value={{ stompClient, sendMessage, subscribeToRoom }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use the WebSocket context
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};


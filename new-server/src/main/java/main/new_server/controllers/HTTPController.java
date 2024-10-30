package main.new_server.controllers;

import main.new_server.classes.ResponseObject;
import main.new_server.classes.Room;
import main.new_server.classes.TriviaResponse;
import main.new_server.classes.roomSubscription;
import main.new_server.services.TriviaService;
import netscape.javascript.JSObject;
import org.apache.coyote.Response;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class HTTPController {

    int roomKey = 0;
    private Set<Integer> roomKeys = new HashSet<>();
    private HashMap<Integer, Room> allRooms = new HashMap<Integer, Room>();




    @GetMapping("/createRoom")
    public int generateRoomKey() {

        roomKey++;
        allRooms.put(roomKey, (new Room(roomKey)));
        roomKeys.add(roomKey);

        return roomKey;
    }


    @GetMapping("/checkKey")
    public boolean checkKey(@RequestParam int key) {


        return roomKeys.contains(key);
    }

    //will handle initial subscriptions to room (including main screen, host, and regular players)
    @MessageMapping("/{roomId}")
    @SendTo("/room/{roomId}")
    public ResponseObject handleRoomSubscription(@RequestBody roomSubscription jsonData) {

        String gameKey = jsonData.getGameKey();
        String username = jsonData.getUserName();
        String token = jsonData.getToken();

        ResponseObject responseObject = new ResponseObject();

        ArrayList<String> bbb = allRooms.get(Integer.parseInt(gameKey)).getQuestions();

        System.out.println("------Top-------");
        for (String question : bbb) {
            System.out.println(question);
        }
        System.out.println("------Bottom-------");


        if(!Objects.equals(username, "hoster")){

            if(Objects.equals(token, "leaveLobby")){

                if(allRooms.get(Integer.parseInt(gameKey)).removePlayer(username) != null){

                    responseObject.setToken("host");
                    responseObject.setData(username);

                }
            }
            else if(Objects.equals(token, "joinGame")){


                if(allRooms.get(Integer.parseInt(gameKey)).addPlayer(username)){

                    responseObject.setToken("host");
                    responseObject.setData(username);
                }

            }

            responseObject.setPlayers(allRooms.get(Integer.parseInt(gameKey)).getPlayers());
            return responseObject;

        }
        else{

            if(Objects.equals(token, "leaveLobby")){

                System.out.println("Removing Room: " + roomKey);
                allRooms.remove(Integer.parseInt(gameKey));
                roomKeys.remove(Integer.parseInt(gameKey));
            }
            else if(Objects.equals(token, "startGame")){

                responseObject.setToken("start");

                return responseObject;

            }

        }

        return null;



    }

    @MessageMapping("/{roomId}/Screen")
    @SendTo("/room/{roomId}/Screen")
    public ResponseObject ScreenHandler(@RequestBody roomSubscription jsonData) {

        String gameKey = jsonData.getGameKey();
        String username = jsonData.getUserName();
        String token = jsonData.getToken();

        ResponseObject responseObject = new ResponseObject();

        if(Objects.equals(token, "getQuestion")){

            String temp = allRooms.get(Integer.parseInt(gameKey)).retrieveQuestion();
            temp = temp.replace("&#039;", "'");
            temp = temp.replace("&quot;", "\"");

            if(temp == "done"){

                responseObject.setToken("done");


            }
            else{
                responseObject.setData(temp);
                responseObject.setToken("question");
            }





            allRooms.get(Integer.parseInt(gameKey)).setTime(System.currentTimeMillis());
            allRooms.get(Integer.parseInt(gameKey)).setSomeoneBuzzed(false);
            allRooms.get(Integer.parseInt(gameKey)).setCanBuzz(true);
            return responseObject;
        }

        return null;

    }

    @MessageMapping("/{roomId}/GameHost")
    @SendTo("/room/{roomId}/GameHost")
    public ResponseObject GameHostHandler(@RequestBody roomSubscription jsonData) {

        String gameKey = jsonData.getGameKey();
        String username = jsonData.getUserName();
        String token = jsonData.getToken();

        System.out.println(gameKey);

        ResponseObject responseObject = new ResponseObject();

        System.out.println("Game Host");

        if(Objects.equals(token, "getAnswer")){

            allRooms.get(Integer.parseInt(gameKey)).setSomeoneBuzzed(true);
            String temp = allRooms.get(Integer.parseInt(gameKey)).retrieveAnswer();
            temp = temp.replace("&#039;", "'");
            responseObject.setData(temp);
            responseObject.setToken("answer");
            return responseObject;
        }

        return null;

    }

    @MessageMapping("/{roomId}/buzz")
    @SendTo("/room/{roomId}/buzz")
    public ResponseObject UserBuzzed(@RequestBody roomSubscription jsonData) {

        String gameKey = jsonData.getGameKey();
        String username = jsonData.getUserName();
        String token = jsonData.getToken();
        long time = jsonData.getTime();



        System.out.println(time);

        ResponseObject responseObject = new ResponseObject();

        System.out.println("Buzz");

        if(Objects.equals(token, "buzz")){

            if(allRooms.get(Integer.parseInt(gameKey)).validBuzz(time, username)){
                responseObject.setData(username);
                responseObject.setToken("buzz");
                return responseObject;
            }
        }

        return null;

    }

    @MessageMapping("/{roomId}/correct")
    @SendTo("/room/{roomId}/points")
    public ResponseObject rightAnswer(@RequestBody roomSubscription jsonData) {

        String gameKey = jsonData.getGameKey();
        String username = jsonData.getUserName();
        String token = jsonData.getToken();
        long time = jsonData.getTime();



        System.out.println(time);

        ResponseObject responseObject = new ResponseObject();

        System.out.println("outside");

        if(Objects.equals(token, "correct")){

            System.out.println("We're in");

            responseObject.setData(allRooms.get(Integer.parseInt(gameKey)).increaseScore(username));
                responseObject.setToken("score");
                responseObject.setPlayers(allRooms.get(Integer.parseInt(gameKey)).getPlayerPoints());
                responseObject.setUserName(username);
                return responseObject;

        }

        return null;

    }

    @MessageMapping("/{roomId}/wrong")
    @SendTo("/room/{roomId}/points")
    public ResponseObject wrongAnswer(@RequestBody roomSubscription jsonData) {

        String gameKey = jsonData.getGameKey();
        String username = jsonData.getUserName();
        String token = jsonData.getToken();
        long time = jsonData.getTime();



        System.out.println(time);

        ResponseObject responseObject = new ResponseObject();

        System.out.println("Buzz");

        if(Objects.equals(token, "wrong")){

            responseObject.setData(allRooms.get(Integer.parseInt(gameKey)).decreaseScore(username));
            responseObject.setToken("score");
            responseObject.setPlayers(allRooms.get(Integer.parseInt(gameKey)).getPlayerPoints());
            responseObject.setUserName(username);
            return responseObject;

        }

        return null;

    }

    @MessageMapping("/{roomId}/points")
    @SendTo("/room/{roomId}/points")
    public ResponseObject getPoints(@RequestBody roomSubscription jsonData) {

        String gameKey = jsonData.getGameKey();
        String username = jsonData.getUserName();
        String token = jsonData.getToken();
        long time = jsonData.getTime();



        System.out.println(time);

        ResponseObject responseObject = new ResponseObject();

        System.out.println("requesting points");

         if (Objects.equals(token, "getPoints")) {

            responseObject.setPlayers(allRooms.get(Integer.parseInt(gameKey)).getPlayerPoints());
            responseObject.setToken("score");
            return responseObject;

        }

        return null;

    }

    @MessageMapping("/{roomId}/endGame")
    public void endGame(@RequestBody roomSubscription jsonData) {

        String gameKey = jsonData.getGameKey();
        allRooms.remove(Integer.parseInt(gameKey));
        roomKeys.remove(Integer.parseInt(gameKey));

    }

    @MessageMapping("/{roomId}/leaveGame")
    @SendTo("/room/{roomId}/end")
    public ResponseObject leaveGame(@RequestBody roomSubscription jsonData) {

        String gameKey = jsonData.getGameKey();
        String username = jsonData.getUserName();


        ResponseObject responseObject = new ResponseObject();

        System.out.println("Here");

       if(username == "hoster"){

           System.out.println("bbb");

           allRooms.remove(Integer.parseInt(gameKey));
           roomKeys.remove(Integer.parseInt(gameKey));

           responseObject.setToken("endGame");
           responseObject.setData("hoster");
           return responseObject;

       }
       else if(username == "host"){

           allRooms.remove(Integer.parseInt(gameKey));
           roomKeys.remove(Integer.parseInt(gameKey));

           responseObject.setToken("endGame");
           responseObject.setData("host");
           return responseObject;

       }

       return null;

    }



}


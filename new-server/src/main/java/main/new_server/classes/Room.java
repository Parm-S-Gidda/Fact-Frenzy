package main.new_server.classes;

import main.new_server.services.TriviaService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Room {

    private final int roomId;
    private ArrayList<String> players;
    private ArrayList<String> questions;
    private ArrayList<String> answers;
    private int currentQuestion = 0;
    private int currentAnswer = 0;
    private long QuestionSentTime = 0;
    private boolean someoneBuzzed = false;
    private String host = "";
    private String BuzzUser = "";
    private HashMap<String, Integer> playerScores;
    private boolean allowedBuzz = false;



    public Room(int roomId){
        this.roomId = roomId;
        this.players = new ArrayList<>();
        this.playerScores = new HashMap<String, Integer>();

        TriviaService triviaService = new TriviaService();
        TriviaResponse triviaResponse = triviaService.getTriviaQuestions();

        this.questions = triviaResponse.getQuestions();
        this.answers = triviaResponse.getCorrectAnswers();
    }

    public int getRoomId() {
        return roomId;
    }

    public boolean addPlayer(String newPlayerName){

        System.out.println("adding player: " + newPlayerName);
        playerScores.put(newPlayerName, 0);
        if(players.size() == 0){
            playerScores.put(newPlayerName, 0);
            players.add(newPlayerName + " (Host)");
            host = newPlayerName;
            return true;
        }
        else{
            players.add(newPlayerName);
            return false;
        }
    }

    public String removePlayer(String playerName){

        System.out.println("Removing player: " + playerName);

        if(!players.remove(playerName)){
            players.remove(playerName + " (Host)");
        }

        playerScores.remove(playerName);

        if(players.size() == 1 && !players.getFirst().contains("(Host)")){

            players.set(0, players.getFirst() + " (Host)");

            return players.getFirst();
        }
        return null;

    }

    public ArrayList<String> getPlayers() {
        return players;
    }


    public ArrayList<String> getCorrectAnswers() {
        return answers;
    }

    public ArrayList<String> getQuestions() {
        return questions;
    }

    public String retrieveQuestion(){

        if(currentQuestion < questions.size()){

            currentQuestion++;
            return questions.get(currentQuestion-1);
        }

        return "done";

    }

    public String retrieveAnswer(){

        if(currentQuestion < questions.size()){

            currentAnswer++;

            return answers.get(currentAnswer-1);
        }

        return null;

    }

    public void setTime(long epochTime){
        QuestionSentTime = epochTime;
    }

    public boolean validBuzz(long buzzTime, String playerName){

        if(buzzTime > QuestionSentTime & buzzTime < QuestionSentTime + 5000){

            if(!someoneBuzzed && allowedBuzz){
                someoneBuzzed = true;
                BuzzUser = playerName;
                return true;
            }

        }
        return false;
    }

    public void setSomeoneBuzzed(boolean someoneBuzzed){
        this.someoneBuzzed = someoneBuzzed;
        this.BuzzUser = "";
    }

    public String increaseScore(String playerName){
        playerScores.put(playerName, playerScores.get(playerName) + 1);

        return playerScores.get(playerName).toString();

    }

    public String decreaseScore(String playerName){
        playerScores.put(playerName, playerScores.get(playerName) - 1);

        if(playerScores.get(playerName) < 0){
            playerScores.put(playerName, 0);
        }

        return playerScores.get(playerName).toString();

    }

    public void setCanBuzz(boolean canBuzz){
        allowedBuzz = canBuzz;

    }

    public ArrayList<String> getPlayerPoints(){


        List<Map.Entry<String, Integer>> entryList = new ArrayList<>(playerScores.entrySet());


        entryList.sort((entry1, entry2) -> entry2.getValue().compareTo(entry1.getValue()));


        ArrayList<String> sortedScores = new ArrayList<>();


        for (Map.Entry<String, Integer> entry : entryList) {

            if(entry.getKey() != host) {
                String combinedString = entry.getKey() + ": " + entry.getValue();
                sortedScores.add(combinedString);
            }
        }

        // Return the ArrayList
        return sortedScores;
    }


}

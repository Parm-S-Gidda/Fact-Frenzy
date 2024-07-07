package main.new_server.classes;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;

public class ResponseObject {
    private String data;
    private String token;

    @JsonProperty("name")
    private String name;
    private ArrayList<String> players;

    // Getters and setters

    public ResponseObject(){
        this.players = new ArrayList<>();
        this.token = "";
        this.data = "";
        this.name = "";
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {

        if(data.contains("(Host)")){

            data = data.replace("(Host)", "");
            data = data.replace(" ", "");
        }
        this.data = data;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public ArrayList<String> getPlayers() {
        return players;
    }

    public void setPlayers(ArrayList<String> players) {
        this.players = players;
    }

    public String getUserName() {
        return name;
    }

    public void setUserName(String userName) {
        this.name = userName;
    }


}

package main.new_server.classes;

public class roomSubscription {

    private String token;
    private String gameKey;
    private String userName;
    private long time;

    // Getters and setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUserName() {
        return userName;
    }

    public void setUsername(String userName) {
        this.userName = userName;
    }

    public String getGameKey() {
        return gameKey;
    }

    public void setGameKey(String gameKey) {
        this.gameKey = gameKey;
    }

    public long getTime() {return time;}

    public void setTime(long time) {this.time = time;}
}

package Trivia.HTTP.Server.Server.Controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;
import java.util.Set;

@RestController
public class HTTPController {

    int roomKey = 0;
    private Set<Integer> roomKeys = new HashSet<>(Set.of(1, 2, 3));



    @CrossOrigin
    @GetMapping("/createRoom")
    public int generateRoomKey() {

        roomKey++;
        roomKeys.add(roomKey);

        return roomKey;
    }

    @CrossOrigin
    @GetMapping("/checkKey")
    public boolean checkKey(@RequestParam int key) {

        return roomKeys.contains(key);
    }

}

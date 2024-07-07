package Trivia.HTTP.Server.Server.Controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;


@Controller
public class WebSocketController {

    @MessageMapping("/chat")
    @SendTo("/topic/0")
    public String send() throws Exception {

        System.out.println("Got a chat");

        return "Message Sent";
    }
}

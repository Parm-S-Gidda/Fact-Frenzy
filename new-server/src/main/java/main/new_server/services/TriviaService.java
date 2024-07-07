package main.new_server.services;

import main.new_server.classes.TriviaResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TriviaService {

    @Autowired
    private RestTemplate restTemplate = new RestTemplate();

    public TriviaResponse getTriviaQuestions() {
        String url = "https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple";
        return restTemplate.getForObject(url, TriviaResponse.class);
    }
}
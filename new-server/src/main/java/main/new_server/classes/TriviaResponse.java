package main.new_server.classes;

import java.util.ArrayList;
import java.util.List;

public class TriviaResponse {

    private List<Question> results;

    public List<Question> getResults() {
        return results;
    }

    public void setResults(List<Question> results) {
        this.results = results;
    }

    public ArrayList<String> getQuestions() {
        ArrayList<String> questions = new ArrayList<>();
        for (Question question : results) {
            questions.add(question.getQuestion());
        }
        return questions;
    }

    public ArrayList<String> getCorrectAnswers() {
        ArrayList<String> correctAnswers = new ArrayList<>();
        for (Question question : results) {
            correctAnswers.add(question.getCorrect_answer());
        }
        return correctAnswers;
    }

    public static class Question {
        private String question;
        private String correct_answer;

        public String getQuestion() {
            return question;
        }

        public void setQuestion(String question) {
            this.question = question;
        }

        public String getCorrect_answer() {
            return correct_answer;
        }

        public void setCorrect_answer(String correct_answer) {
            this.correct_answer = correct_answer;
        }
    }
}

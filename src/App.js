import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showTest, setShowTest] = useState(true);
  const totalQuestions = 10; // Total number of questions you want to display
  const [timer, setTimer] = useState(15);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timer === 0) {
      goToNextQuestion();
    }
  }, [timer]);

  useEffect(() => {
    const countdown = setTimeout(() => {
      setTimer(prevTimer => prevTimer - 1);
    }, 1000);
    return () => clearTimeout(countdown);
  }, [timer]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('https://opentdb.com/api.php?amount=10');
      const { results } = response.data;
      setQuestions(results);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAnswerClick = (answer) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (answer === currentQuestion.correct_answer) {
      setCorrectAnswers(prevCorrectAnswers => prevCorrectAnswers + 1);
    }
    goToNextQuestion();
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setTimer(10); 
    } else {
      setShowTest(false); // Hide test container
    }
  };

  return (
    <div className="App">
      {showTest && (
        <div>
          <h1>Quiz Questions</h1>
          <p >Time Remaining: {timer} seconds</p>
          {questions && questions.length > 0 && (
            <div>
              <h3>Question {currentQuestionIndex + 1}</h3>
              <p className='questions-list'>{questions[currentQuestionIndex].question}</p>
              <ul className='optionsK'>
                {questions[currentQuestionIndex].incorrect_answers.map((answer, idx) => (
                  <li key={idx}>
                    <button onClick={() => handleAnswerClick(answer)}>{answer}</button>
                  </li>
                ))}
                <li>
                  <button onClick={() => handleAnswerClick(questions[currentQuestionIndex].correct_answer)}>
                    {questions[currentQuestionIndex].correct_answer}
                  </button>
                </li>
              </ul>
              <button className='next-button' onClick={goToNextQuestion}>Next Question</button>
            </div>
          )}
        </div>
      )}
      {!showTest && (
        <div className='result'>
          <h1>Quiz Result</h1>
          <p>Correct Answers: {correctAnswers}</p>
          <p>Total Questions: {totalQuestions}</p>
        </div>
      )}
    </div>
  );
}

export default App;

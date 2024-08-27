let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
const questionTime = 10; 
const pointsPerQuestion = 2; 

const questionElement = document.getElementById('question');
const optionsElements = document.querySelectorAll('.option');
const progressBar = document.querySelector('progress');
const resultModal = document.getElementById('resultModal');
const resultText = document.getElementById('resultText');
const restartButton = document.getElementById('restart-btn');
const timerElement = document.getElementById('timer');

fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        startQuiz();
    })
    .catch(error => console.error('Error loading questions:', error));

function startQuiz() {
    shuffle(questions); 
    showQuestion(questions[currentQuestionIndex]);
    updateProgressBar();
}

function showQuestion(question) {
    questionElement.textContent = question.question;
    optionsElements.forEach((button, index) => {
        button.textContent = question.options[index];
        button.classList.remove('is-success', 'is-danger');
        button.addEventListener('click', selectOption);
    });
    resetTimer(); 
}

function selectOption(event) {
    clearInterval(timerInterval); 

    const selectedOption = event.target.textContent;
    const correctAnswer = questions[currentQuestionIndex].answer;

    if (selectedOption === correctAnswer) {
        score += pointsPerQuestion; 
        event.target.classList.add('is-success'); 
    } else {
        event.target.classList.add('is-danger'); 
    }

    optionsElements.forEach(button => {
        if (button.textContent === correctAnswer) {
            button.classList.add('is-success'); 
        }
        button.removeEventListener('click', selectOption); 
    });

    disableOptions();

    setTimeout(() => {
        nextQuestion();
    }, 2000);
}

function disableOptions() {
    optionsElements.forEach(button => {
        button.style.cursor = 'default';
    });
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        resetOptions();
        showQuestion(questions[currentQuestionIndex]);
        updateProgressBar();
    } else {
        showResults();
    }
}

function resetOptions() {
    optionsElements.forEach(button => {
        button.classList.remove('is-success', 'is-danger');
        button.style.cursor = 'pointer';
    });
}

function updateProgressBar() {
    const progress = (currentQuestionIndex / questions.length) * 100;
    progressBar.value = progress;
}

function showResults() {
    clearInterval(timerInterval); 
    resultText.textContent = `You scored ${score} out of ${questions.length * pointsPerQuestion} points!`; // Show total points
    resultModal.classList.add('is-active');
}

function startTimer() {
    let timeLeft = questionTime;
    timerElement.textContent = `Time: ${timeLeft}s`;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            selectOptionAutomatically(); 
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval); 
    startTimer(); 
}

function selectOptionAutomatically() {
    optionsElements[0].click();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

restartButton.addEventListener('click', () => location.reload());

document.querySelector('.delete').addEventListener('click', () => {
    resultModal.classList.remove('is-active');
});

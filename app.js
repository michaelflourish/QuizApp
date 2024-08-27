let questions = [];
let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById('question');
const optionsElements = document.querySelectorAll('.option');
const nextButton = document.getElementById('next-btn');
const progressBar = document.querySelector('progress');
const resultModal = document.getElementById('resultModal');
const resultText = document.getElementById('resultText');
const restartButton = document.getElementById('restart-btn');

// Fetch questions from the JSON file
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        startQuiz();
    })
    .catch(error => console.error('Error loading questions:', error));

function startQuiz() {
    shuffle(questions); // Shuffle the questions before starting
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
}


function selectOption(event) {
    const selectedOption = event.target.textContent;
    const correctAnswer = questions[currentQuestionIndex].answer;

    if (selectedOption === correctAnswer) {
        score++;
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

    nextButton.disabled = true;

    setTimeout(() => {
        nextButton.disabled = false;
    }, 2000);
}


function disableOptions() {
    optionsElements.forEach(button => {
        button.removeEventListener('click', selectOption);
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
    resultText.textContent = `You scored ${score} out of ${questions.length}!`;
    resultModal.classList.add('is-active');
}

nextButton.addEventListener('click', nextQuestion);

restartButton.addEventListener('click', () => location.reload());

document.querySelector('.delete').addEventListener('click', () => {
    resultModal.classList.remove('is-active');
});

// Shuffle function (optional)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

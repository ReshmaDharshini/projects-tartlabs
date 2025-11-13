const questions = [
    {
        question: "Which keyword is used to declare a variable in JavaScript?",
        answers:[
            {text: "var", correct: false},
            {text: "let", correct: false},
            {text: "const", correct: false},
            {text: "All of the above", correct: true},
        ]
    },
    {
        question: "Which symbol is used for single-line comments in JavaScript?",
        answers:[
            {text: "#", correct: false},
            {text: "//", correct: true},
            {text: "##", correct: false},
            {text: "/* */", correct: false},
        ]
    },
    {
        question: "What method is used to print messages to the browser console?",
        answers:[
            {text: "print()", correct: false},
            {text: "console.print()", correct: false},
            {text: "console.log()", correct: true},
            {text: "echo()", correct: false},
        ]
    }
];

const startButton = document.getElementById("start-btn");
const welcomeScreen = document.querySelector(".welcome-screen");
const app = document.querySelector(".app");

startButton.addEventListener("click", () => {
    const usernameInput = document.getElementById("username");
    const username = usernameInput.value.trim();
    if(username) {
        welcomeScreen.style.display = "none";
        app.style.display = "block";
        localStorage.setItem("username", username);
        startQuiz();
    } else {
        alert("Please enter your name to start the quiz.");
    }
    document.getElementById("welcome-message").innerText = `Welcome to the Quiz, ${username}!`;
});

const questionElement = document.getElementById("question");
const optionsButton = document.getElementById("options");
const nextButton = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
let quizStartTime = 0;


function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    timerElement.style.display = "block";
    quizStartTime = Date.now();
    showQuestion()
}

function formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function showQuestion(){
    resetState();
    document.querySelector(".progress-container").style.display = "block";
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + '. ' + currentQuestion.question;

    currentQuestion.answers.forEach (answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        optionsButton.appendChild(button);
        if(answer.correct){
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click",selectAnswer);
    });
    updateProgressBar();
    startTimer();
}

function resetState() {
    nextButton.style.display ="none";
    clearInterval(timer);
    while(optionsButton.firstChild) {
        optionsButton.removeChild(optionsButton.firstChild)
    }
    const timerElement = document.getElementById("timer");
    timerElement.classList.remove("flash"); 
    timerElement.style.color = "#b28768";   
    timerElement.style.fontWeight = "500";
}

function startTimer(){
    timeLeft = 15;
    const timerElement = document.getElementById("timer");
    timerElement.innerHTML = `Time left: ${timeLeft}s`;
    timerElement.style.color = "#b28768";
    timerElement.style.fontWeight = "500";

    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerHTML = `Time left: ${timeLeft}s`;
        if(timeLeft <= 5){
            timerElement.style.color = "red";
            timerElement.style.fontWeight = "bold";
            timerElement.classList.add("flash");
        }

        if(timeLeft <= 0){
            timerElement.classList.remove("flash");
            clearInterval(timer);
            handleNextButton();
        }
    }, 1000);

}

function selectAnswer(e){
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if(isCorrect){
        selectedBtn.classList.add("correct");
        score++;
    }else{
        selectedBtn.classList.add("incorrect");
    }

    Array.from(optionsButton.children).forEach(button => {
        if(button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

const timerElement = document.getElementById("timer");
function showScore(){
    clearInterval(timer);
    resetState();
    document.getElementById("question-count").style.display = "none";
    document.querySelector(".progress-container").style.display = "none";
    timerElement.style.display = "none";

    const totalSeconds = Math.floor((Date.now() - quizStartTime) / 1000);
    const timeTaken = formatTime(totalSeconds);
    const percentage = Math.round((score / questions.length) * 100);

    questionElement.innerHTML = `
        <div class="result-card">
           <div class="result-content">
            <h2>Quiz Summary...</h2>
            <p><strong>Total Score:</strong> ${score} / ${questions.length}</p>
            <p><strong>Time Taken:</strong> ${timeTaken}</p>
            <p><strong>Percentage:</strong> ${percentage}%</p>
            </div>
            <canvas id="scoreChart" width="50" height="50"></canvas>
            
        </div>
    `;
    const correctAnswers = score;
const wrongAnswers = questions.length - score;

const ctx = document.getElementById('scoreChart').getContext('2d');
new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Correct', 'Wrong'],
    datasets: [{
      data: [correctAnswers, wrongAnswers],
      backgroundColor: ['#4CAF50', '#F44336'] 
    }]
  },
  options: {
    cutout: '50%',
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
});

    nextButton.innerHTML = "play Again";
    nextButton.style.display = "block";
}



function handleNextButton(){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
    }else{
        showScore();
    }
}


nextButton.addEventListener("click", ()=> {
    if(currentQuestionIndex < questions.length){
        handleNextButton();
    }else{
        startQuiz();
    }
})

function updateProgressBar() {
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;

  const questionCount = document.getElementById("question-count");
  questionCount.innerHTML = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
}

startQuiz();
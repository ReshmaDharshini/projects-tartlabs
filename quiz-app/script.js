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

const questionElement = document.getElementById("question");
const optionsButton = document.getElementById("options");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion()
}

function showQuestion(){
    resetState();
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

    })
}

function resetState() {
    nextButton.style.display ="none";
    while(optionsButton.firstChild) {
        optionsButton.removeChild(optionsButton.firstChild)
    }
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

function showScore(){
    resetState();
    questionElement.innerHTML = `you have scored ${score} out of ${questions.length}!`
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
startQuiz();
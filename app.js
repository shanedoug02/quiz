//this object bundles data for the question, answer options, correct answer 
//and checks if user's guess is correct
class QuestionClass {
    constructor(question, answerOptionsArr, correctAnswerIndex) {
        this.question = question;
        this.answerOptionsArr = answerOptionsArr;
        this.correctAnswerIndex = correctAnswerIndex;
    }
}


QuestionClass.prototype.isCorrect = function (userGuessIndex) {
    return userGuessIndex === this.correctAnswerIndex;
}

//console.log(question1.isCorrect(0));

//this object stores all 4 question objects for the quiz
// and allows us to: keep score, keep track of question Index, move to next question
class Quiz {
    //when creating this constructor it is expecting 1 instance 
    // for example all the data from "question2" 
    // BUT when we run a new instance from Quiz it wants to process all
    // the questions So we put in an ARRAY of all the 3 question instances
    // to be able to traverse through them 
    // i.e. look at Quiz1 instance- I put in an Array to make all data sets available
    constructor (questionInstances) {
        this.questionInstances = questionInstances;
        this.currentQuestionIndex = 0;
        this.score = 0;
    }

}

Quiz.prototype.getCurrentQuestionIndex = function() {
    return this.questionInstances[this.currentQuestionIndex];
}

// no return here bec its initialized to 0?  I think?! 
Quiz.prototype.nextQuestion = function() {
    this.currentQuestionIndex++;
}

Quiz.prototype.hasEnded = function() {
    return this.currentQuestionIndex === this.questionInstances.length;
}



//tried to use the getCurrentQuestionIndex function here
//but I couldnt 
// i was able to use the isCorrect function though-- not sure why???
Quiz.prototype.guess = function(userGuess) {
    const currentQuestion = this.questionInstances[this.currentQuestionIndex];
    if (currentQuestion.isCorrect(userGuess) ) {
        this.score++;
    }
    this.nextQuestion();

}

Quiz.prototype.reset = function () {
    this.currentQuestionIndex = 0;
    this.score = 0;
}

const quizHeaderBodyEl = document.querySelector(".quiz__header__body");
const quizTitleEl = document.querySelector(".quiz__title");
const quizTrackerEl = document.querySelector(".quiz__tracker");
const progressBarEl = document.querySelector(".progress__bar");
const quizTaglineEl = document.querySelector(".quiz__tagline");
const quizUlOptionsEl = document.querySelector(".quiz__ul__options");
const submitButtonEl = document.querySelector(".submit");
const restartButtonEl = document.querySelector(".restart");

const question1 = new QuestionClass(
        "Who is the greatest basketball player of all time?",
        ["LeBron James", "Michael Jordan", "Kareem Abdul Jabar", "Magic Johnson"],
        0
);
    
const question2 = new QuestionClass(
        "When is my anniversary?",
        ["May 23, 2011", "May 22, 2010", "June 22, 2010", "Everyday is an anniversary for me"],
        1
);
    
const question3 = new QuestionClass(
        "What is the funniest movie listed below?",
        ["Jungle Book", "Toy Story", "Ice Age", "Finding Nemo"],
        2
);
    
const allQuestionsArr = [question1, question2, question3];
    
const Quiz1 = new Quiz(allQuestionsArr);
    
    // within the code block the whole question object will return if you do not 
    // append .question to the end of getCurrentQuestion Index
    // which is the first key:value pair from the question constructor
 
const changeHTML = (elem, value) => {
        elem.innerHTML = value;
}
    
    
const renderQuestionTitle = () => {
        const question = Quiz1.getCurrentQuestionIndex().question;
        changeHTML(quizTitleEl,question);
}
    


const renderAnswerOptions = () => {
        let markup = "";
        const currentOptions = Quiz1.getCurrentQuestionIndex().answerOptionsArr;
        currentOptions.forEach((elem, index) => {
           
            markup += `
           <li class="quiz__answer__option">
                <input type="radio" name="choice" class="quiz__input" id="${index}">
                <label for="${index}" class="quiz__label">
                <i></i>
                <span>${elem}</span> 
                </label>
            </li>
           ` 
        });
    
        changeHTML(quizUlOptionsEl, markup);
            
}

const renderTracker = () => {
        const index = Quiz1.currentQuestionIndex;
        changeHTML(quizTrackerEl,`Question #${index +1} of ${Quiz1.questionInstances.length}`);

}



const getPercentage = (num1, num2) => {
    return Math.round((num1/num2) *100)
}

const launch = (width, maxPercent)=> {
    let loadingBar = setInterval(function (){
        if (width >= maxPercent) {
            clearInterval(loadingBar);
        } else {
            width++;
            progressBarEl.style.width = `${width}%`;
        }
            
    }, 13) 
}



const renderProgress = () => {
    // get width
    const currentWidth = getPercentage(Quiz1.currentQuestionIndex, Quiz1.questionInstances.length);
    // launch (0, width)
    launch(0, currentWidth);
}


const renderEndScreen = () => {
    changeHTML(quizTitleEl, `You've completed the quiz!`)
    changeHTML(quizTaglineEl, `Click RESTART to redo the quiz.`)
    changeHTML(quizTrackerEl, `Your score: ${getPercentage(Quiz1.score,Quiz1.questionInstances.length)}%`)
    progressBarEl.style.width = '100%';  
    submitButtonEl.style.opacity = 0;
    restartButtonEl.style.opacity = 1;
}

const renderAll = () => {
    if (Quiz1.currentQuestionIndex === Quiz1.questionInstances.length) {    
        renderEndScreen(); 
    } else {
        renderQuestionTitle();
        renderAnswerOptions();
        renderTracker();
        renderProgress();
    }
}

renderAll();

console.log(Quiz1.questionInstances.length)


const listeners = () => {
    submitButtonEl.addEventListener("click", function(){
        // be sure to use single quotes below
        const selectedRadioElem = document.querySelector('input[name="choice"]:checked');
        if (selectedRadioElem) {
            const id = Number(selectedRadioElem.getAttribute("id"));
            Quiz1.guess(id); 
            renderAll();
        }
    })

    restartButtonEl.addEventListener("click", function(){
        
        Quiz1.reset();
        renderAll();
        submitButtonEl.style.opacity =1;
        restartButtonEl.style.opacity = 0;
        changeHTML(quizTaglineEl, `Pick An Option Below`);
    })
}

listeners();







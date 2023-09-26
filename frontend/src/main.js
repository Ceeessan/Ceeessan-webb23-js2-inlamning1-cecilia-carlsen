const formForRegistratingName = document.querySelector('#inputYourName');
const picturesDiv = document.querySelector('#picturesDiv');
const userNameInput = document.querySelector('#userName');
const showUserName = document.querySelector('#userNameOutputh3');
const errorOnUserName = document.querySelector('#errorUserNameOutput');
const yourScore = document.querySelector('#yourScore');
const computerWinsTheGame = document.querySelector('#tryAgainText');
const buttonForComputerWin = document.querySelector('#tryAgainButton');
const highScoreList = document.querySelector('ol');

buttonForComputerWin.style.display = 'none';



let playerWin = 0;
let computerMoveWin = 0;
let result;
let playerMove;
let computerMove;
let userName;

//Denna funktion är kallad först så att min highscore-lista alltid är synlig.
getHighScores();


formForRegistratingName.addEventListener('submit', (event) => {
    event.preventDefault();


    userName = userNameInput.value;

    //Man ska inte kunna registrera ett tomt namn.
    if (userName.trim() === '') {
        errorNoName();
    }
    else {
        showUserName.innerText = `Hello ${userName}, let's play!`;
        errorOnUserName.innerText = '';

        formForRegistratingName.reset();

        picturesDiv.addEventListener('click', gameRockPaperScissor);
    }

});


//Error Username-input.
function errorNoName() {

    errorOnUserName.innerText = `Please enter a username!`;
    showUserName.innerText = '';

    picturesDiv.removeEventListener('click', gameRockPaperScissor);

};


function gameRockPaperScissor(event) {


    playerMove = event.target.id;
    const moves = ["rock", "paper", "scissor"];
    const randomChoiseOfArray = Math.floor(Math.random() * moves.length);
    computerMove = moves[randomChoiseOfArray];



    if (playerMove === 'rock') {
        if (computerMove === 'rock') {
            result = 'tie';
            console.log('tie');
        } else if (computerMove === 'paper') {
            result = 'you lose'
            computerMoveWin++;
            console.log('you lose')
        } else if (computerMove === 'scissor') {
            result = 'you win';
            playerWin++;
            console.log('you win')
        }
    }

    if (playerMove === 'paper') {
        if (computerMove === 'rock') {
            result = 'you win';
            playerWin++
            console.log('you win');
        } else if (computerMove === 'paper') {
            result = 'tie';
            console.log('tie')
        } else if (computerMove === 'scissor') {
            result = 'you lose';
            computerMoveWin++;
            console.log('you lose')
        }
    }

    if (playerMove === 'scissor') {
        if (computerMove === 'rock') {
            result = 'you lose'
            computerMoveWin++;
            console.log('you lose');
        } else if (computerMove === 'paper') {
            result = 'you win';
            playerWin++
            console.log('you win')
        } else if (computerMove === 'scissor') {
            result = 'tie';
            console.log('tie')
        }
    }

    const yourChoise = document.querySelector('#youPicked');
    const computerChoise = document.querySelector('#computerPicked');

    yourChoise.innerText = `You picked: ${playerMove}`
    computerChoise.innerText = `Computer picked: ${computerMove}`;


    if (result === 'you lose') {
        updateHighScore()
            .then(getHighScores())
            .catch(error => console.error('Error för att uppdatera Highscore:', error));
    }

    resultOfGame()

}


// Vinner datorn, kommer ett meddelande om att spela igen. 
function resultOfGame() {

    yourScore.innerText = `Your score : ${playerWin}`;

    if (computerMoveWin > 0) {

        computerWinsTheGame.innerText = `You lose. Your score: ${playerWin}. 
        Submit a new username and play again!`
        buttonForComputerWin.style.display = 'block';

        //Jag tar bort spelfunktionen så att man inte ska kunna spela när datorns meddelande kommer upp.
        picturesDiv.removeEventListener('click', gameRockPaperScissor);


        buttonForComputerWin.addEventListener('click', listenOnTryAgainButton);

        playerWin = 0;
        yourScore.innerText = `Your score : ${playerWin} `;
        computerMoveWin = 0;

    }
}


function listenOnTryAgainButton() {

    buttonForComputerWin.style.display = 'none';
    computerWinsTheGame.innerText = '';

}


//Hämtar highscorelistan från backend och skapar en html-lista för att visa highscoren
async function getHighScores() {

    try {
        const urlHighScore = 'http://localhost:3000/highscore';

        const response = await fetch(urlHighScore);
        const highScores = await response.json();
        theHighScoreList(highScores)

        // highScoreList.innerHTML = '';

        // highScores.forEach((item, index) => {
        //     const listItem = document.createElement('li');
        //     listItem.innerText = `${item.name}: ${item.score}`;
        //     highScoreList.appendChild(listItem);
        // });
    } catch (error) {
        console.log('error fetching data:', error);
    }
}


async function updateHighScore() {

    try {
        const urlHighScore = `http://localhost:3000/name`;

        console.log({
            name: userName, score: playerWin
        });

        const updateResponse = await fetch(urlHighScore, {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: userName, score: playerWin
            })
        });

        const updatedHighScoresResponse = await updateResponse.json();
        theHighScoreList(updatedHighScoresResponse)

    } catch (error) {
        console.error('Error', error);
        throw error;
    }
}

function theHighScoreList(listForHighscore) {
    highScoreList.innerHTML = '';

    listForHighscore.forEach(score => {
        const listItem = document.createElement('li');
        listItem.innerText = `${score.name}: ${score.score}`;
        highScoreList.appendChild(listItem);
    });
}
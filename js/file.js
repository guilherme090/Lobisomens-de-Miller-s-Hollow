/* 
----------------------------------------------------------------------------------
Addressable tags
----------------------------------------------------------------------------------
Query selectors which point to HTML elements related to CHARACTERS.
*/ 

// position 0 is for game text. 1-10 are for players.
// game-text: board to write informative messages for the players, like instructions.
let playerNames = Array.from(document.querySelectorAll("[id^='name']"));
playerNames.push(document.querySelector('#game-text'));
// console.log(playerNames); 

// position 0 is for the whole group of labels. 1-10 are individual labels.
let playerNamesFromInput = Array.from(document.querySelectorAll("[id^='player']"));
// console.log(playerNamesFromInput);

// character names to be shuffled.
let roleNames = Array.from(document.querySelectorAll("[id^='role']"));
console.log(roleNames);

// turn counter to be updated after all characters played.
let turnNo = document.querySelector('#turn-number');

/*
----------------------------------------------------------------------------------
Buttons
----------------------------------------------------------------------------------
List of buttons and onclick functions
*/ 

let eliminateButtons = document.querySelectorAll("[id^='btn-eliminate-']");

let startButton = document.querySelector('#btn-start-game');

let nextSceneButton = document.querySelector('#btn-next-scene');

let shuffleCharactersButton = document.querySelector('#btn-shuffle-characters');

let clearPlayersButton = document.querySelector('#btn-clear-players');
clearPlayersButton.onclick = function(){
    for(let i = 0; i < playerNamesFromInput.length; i++){
       playerNamesFromInput[i].value = '';
    }
}

let hideButton = document.querySelector('#btn-toggle-characters');
hideButton.onclick = function(){
    for(let i = 0; i < roleNames.length; i++){
        if(roleNames[i].style.display == 'none'){
            roleNames[i].style.display = 'inline';
        }else{
            roleNames[i].style.display = 'none';
        }
    }
};

/*
----------------------------------------------------------------------------------
Images
----------------------------------------------------------------------------------
Game display and player tokens
*/ 

// position 0 is for display picture. 1-10 are for players.
let playerFigures = document.querySelectorAll("[id^='display']");
// console.log(playerFigures);


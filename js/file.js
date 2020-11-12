/* 
----------------------------------------------------------------------------------
Addressable tags
----------------------------------------------------------------------------------
Query selectors which point to HTML elements related to CHARACTERS.
*/ 

// playerNames: Names of the players on the gameboard.
// gameText: board to write informative messages for the players, like instructions.
let playerNames = Array.from(document.querySelectorAll("[id^='name']"));
let gameText = document.querySelector('#game-text');
// console.log(playerNames); 

// playerNamesFromInput: names of the players typed by the user (input boxes)
let playerNamesFromInput = Array.from(document.querySelectorAll("[id^='input-player']"));
// console.log(playerNamesFromInput);

// character names to be shuffled.
let roleNames = Array.from(document.querySelectorAll("[id^='role']"));
// console.log(roleNames);

// number of characters for each role
let roleNo = Array.from(document.querySelectorAll("[id$='-no']"));
console.log(roleNo);

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
startButton.onclick = function(){
    sceneNo = 1;
    turnNo.innerHTML = 'Rodada ' + sceneNo;
    for(let i = 0; i < playerNo; i++){
        if (playerNamesFromInput[i].value == ''){
            playerNames[i].innerHTML = '-';
        }else{
            playerNames[i].innerHTML = playerNamesFromInput[i].value;
        } 
    }
}

let nextSceneButton = document.querySelector('#btn-next-scene');

let shuffleCharactersButton = document.querySelector('#btn-shuffle-characters');
shuffleCharactersButton.onclick = function(){
    let roles = ['aldeão', 'bruxa', 'caçador', 'cupido', 'vidente', 'raposa', 'lobisomem',
                'lobisomem branco'];
    
    // if the player chooses more than 10 characters, default values will be used
    let defaultCharacters = [2, 1, 1, 1, 1, 1, 2, 1];
    
    // count number of players.
    playerNo = 0;
    for(let i = 0; i < roleNo.length; i++){
        playerNo += Number(roleNo[i].value);
    }

    if(playerNo > 10){
        playerNo = 10;
        gameText.innerHTML = 'Você escolheu mais de 10 personagens.' + 
        'Valores padrão foram colocados no lugar.' + '<br>' +
        'Caso não queira jogar com valores padrão, altere novamente os números de personagens.'
        for(let i = 0; i < roleNo.length; i++){
            roleNo[i].value = defaultCharacters[i];
        }
    }

    // erase previous shuffling
    for(let i = 0; i < 10; i++){
        roleNames[i].innerHTML = '(papel)';
    }

    // shuffle by role
    let charsTaken = 0;
    for(let i = 0; i < roleNo.length; i++){
        for(let k = 0; k < roleNo[i].value; k++){
            let shuffledNumber = Math.floor(Math.random() * (playerNo - charsTaken));
            // console.log(shuffledNumber);
            // find shuffled number on list.
            for(let j = 0; j < shuffledNumber; j++){
                if (roleNames[j].innerHTML != '(papel)'){
                    shuffledNumber++;
                }
            }
            while(roleNames[shuffledNumber].innerHTML != '(papel)'){
                shuffledNumber++;   
            }
            roleNames[shuffledNumber].innerHTML = roles[i];
            charsTaken++;
        } 
    }   
}

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

/*
----------------------------------------------------------------------------------
Audio
----------------------------------------------------------------------------------
Game music and sounds
*/ 

let aCucaTePega = document.getElementById('a-cuca-te-pega');
let estupidoCupido = document.getElementById('estupido-cupido');
let euNasciHa10MilAnosAtras = document.getElementById('eu-nasci-ha-dez-mil-anos-atras');
let jirafalesFlorinda = document.getElementById('jirafales-florinda');
let mascara = document.getElementById('mascara');
let misteriosDaMeiaNoite = document.getElementById('misterios-da-meia-noite');
let vamos = document.getElementById('vamos');

/*
----------------------------------------------------------------------------------
Game variables and data structures
----------------------------------------------------------------------------------
Useful game information stored in variables and data structure for controlling 
events.
*/ 

let playerNo = 0; // will be updated when the shuffle button is activated.
let sceneNo = 0; // current turn (must be updated to turnNo label).
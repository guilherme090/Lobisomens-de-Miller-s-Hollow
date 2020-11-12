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

for(let i = 0; i < eliminateButtons.length; i++){
    eliminateButtons[i].onclick = function(){
        console.log(i);
        console.log(charactersList[i]);
        if (this.innerHTML == 'ELIMINAR'){
            playerFigures[i + 1].src = charactersList[i].picture;
            this.innerHTML = 'RESTAURAR';
        }else{
            playerFigures[i + 1].src = 'img/question-mark.png';
            this.innerHTML = 'ELIMINAR';
        }
    }
}

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
    console.log(charactersList);
};

let nextSceneButton = document.querySelector('#btn-next-scene');

let shuffleCharactersButton = document.querySelector('#btn-shuffle-characters');
shuffleCharactersButton.onclick = function(){
    
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
            charactersList[shuffledNumber].role = roles[i];
            charactersList[shuffledNumber].picture = pictures[i];
            charsTaken++;
        } 
    }   
};

let clearPlayersButton = document.querySelector('#btn-clear-players');
clearPlayersButton.onclick = function(){
    for(let i = 0; i < playerNamesFromInput.length; i++){
       playerNamesFromInput[i].value = '';
    }
};

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

// roles & pictures: will be used to create data structures for the chosen players.
// roles contain the role names, pictures contain path to their PNG files.
let roles = ['aldeão', 'bruxa', 'caçador', 'cupido', 'vidente', 'raposa', 'lobisomem',
'lobisomem branco'];

let pictures = ['img/villager.PNG', 'img/witch.PNG', 'img/hunter.PNG', 'img/cupid.PNG',
'img/seer.PNG', 'img/fox.PNG', 'img/werewolf.PNG', 'img/white-werewolf.PNG'];

let charactersList = [];
class character {
    constructor(player, role, picture){
        this._player = player;
        this._role = role;
        this._picture = picture;
    }

    get player(){
        return this._player;
    }

    set player(newPlayer){
        this._player = newPlayer;
    }

    get role(){
        return this._role;
    }

    set role(newRole){
        this._role = newRole;
    }

    get picture(){
        return this._picture;
    }

    set picture(newPicture){
        this._picture = newPicture;
    }
}

//initialize empty list of characters
for (let i = 0; i < 10; i++){
    charactersList.push(new character('Player ' + i, 'role', 'picture'));
}
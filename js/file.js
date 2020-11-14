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
// console.log(roleNo);

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
        // console.log(i);
        // console.log(charactersList[i]);
        if (this.innerHTML == 'ELIMINAR'){
            playerFigures[i].src = charactersList[i].picture;
            roleNo[charactersList[i].fellows].value--; // update number of characters with this role
            this.innerHTML = 'RESTAURAR';
        }else{
            playerFigures[i].src = 'img/question-mark.png';
            roleNo[charactersList[i].fellows].value++; // update number of characters with this role
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
    // console.log(charactersList);
    stateMachine(states.GAME_STARTED);  
};

let nextSceneButton = document.querySelector('#btn-next-scene');
nextSceneButton.onclick = function(){
    turnNo.innerHTML = 'Rodada ' + sceneNo;
    while(!listOfScenes[sceneStep][0]()){
        sceneStep++;
        if(sceneStep >= listOfScenes.length){
            sceneNo ++;
            sceneStep = 0;
        }
    }
    // console.log(listOfScenes[sceneStep]);
    // console.log(sceneStep);
    // playerFigures[0].style.backgroundImage = url(listOfScenes[sceneStep][1]);
    boardSkin.style.backgroundImage = 'url(' + listOfScenes[sceneStep][1] + ')';
    gameText.innerHTML = listOfScenes[sceneStep][2];
    if(listOfScenes[sceneStep][3] == 'stop'){
        currentSong.load();
    }else if(listOfScenes[sceneStep][3] != currentSong){
        currentSong.load();
        currentSong = listOfScenes[sceneStep][3];
        currentSong.play();
    }
    sceneStep++;
    if(sceneStep >= listOfScenes.length){
        sceneNo ++;
        sceneStep = 0;
    }
}

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
            charactersList[shuffledNumber].fellows = i;
            charsTaken++;
        } 
    } 
    stateMachine(states.GAME_READY_TO_START);  
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
let boardSkin = document.querySelector('#board');
// boardSkin.style.backgroundImage = 'url(img/cover.PNG)';
// boardSkin.style.backgroundRepeat = 'no-repeat';
console.log(playerFigures);

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
let ira = document.getElementById('ira');
let blueMoon = document.getElementById('blue-moon');
let currentSong = misteriosDaMeiaNoite;

/*
----------------------------------------------------------------------------------
Game variables and data structures
----------------------------------------------------------------------------------
Useful game information stored in variables and data structure for controlling 
events.
*/ 

let playerNo = 0; // will be updated when the shuffle button is activated.
let sceneNo = 0; // current turn (must be updated to turnNo label).
let sceneStep = 0; // denotes the part of the scene that is being played (cursor in listOfScenes).

// roles & pictures: will be used to create data structures for the chosen players.
// roles contain the role names, pictures contain path to their PNG files.
let roles = ['aldeão', 'bruxa', 'caçador', 'cupido', 'vidente', 'raposa', 'lobisomem',
'lobisomem branco'];

let pictures = ['img/villager.PNG', 'img/witch.PNG', 'img/hunter.PNG', 'img/cupid.PNG',
'img/seer.PNG', 'img/fox.PNG', 'img/werewolf.PNG', 'img/white-werewolf.PNG'];

// indexes (codes) to the above arrays reference the roles below:

const VILLAGER = 0;
const WITCH = 1;
const HUNTER = 2;
const CUPID = 3;
const SEER = 4;
const FOX = 5;
const WEREWOLF = 6;
const WHITE_WEREWOLF = 7;


let charactersList = [];
class character {
    constructor(player, role, picture, fellows){
        this._player = player;
        this._role = role;
        this._picture = picture;
        this._fellows = fellows; // code to find character's role in array of roles
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

    get fellows(){
        return this._fellows;
    }

    set fellows(newFellows){
        this._fellows = newFellows;
    }
}

// initialize empty list of characters
for (let i = 0; i < 10; i++){
    charactersList.push(new character('Player ' + i, 'role', 'picture', 'fellows'));
}

// list of scenes
// format: condition to play the scene (or otherwise skip it) / image / text / song

let listOfScenes = [
    [function(){return sceneNo == 1}, 'img/actor.PNG', 'REVELAÇÃO. <br>Os habitantes descobrem os seus papéis secretos.', 
    mascara],
    [function(){return sceneNo == 1}, 'img/night.PNG', 'A PRIMEIRA NOITE. <br>Uma estranha magia invade Miller\'s Hollow.', 
    'stop'],
    [function(){return sceneNo != 1}, 'img/night.PNG', 'UMA NOITE NA VILA. <br>Os seres sobrenaturais se preparam para agir.', 
    blueMoon],
    [function(){return(roleNo[CUPID].value>0 && sceneNo == 1)}, 'img/cupid.PNG', 'O CUPIDO escolhe dois jogadores para atirar-lhes flechas.',
    estupidoCupido],
    [function(){return(roleNo[SEER].value>0)}, 'img/seer.PNG', 'A VIDENTE descobre a identidade de um jogador à sua escolha.',
    blueMoon],
    [function(){return(roleNo[FOX].value>0)}, 'img/fox.PNG', 'A RAPOSA, se quiser ativar os seus poderes, escolhe um jogador' + 
    ' e descobre se, entre ele e seus dois vizinhos, há pelo menos um lobisomem. <br>' +
    ' Caso não haja nenhum lobisomem, ela perde os seus poderes pelo resto do jogo.',
    blueMoon],
    [function(){return(roleNo[CUPID].value>0 && sceneNo == 1)}, 'img/lovers.PNG', 'OS AMANTES flechados pelo cupido' + 
    ' se reconhecem. <br>Se um dos dois morrer, o outro também morrerá de solidão.',
    jirafalesFlorinda],
    [function(){return(roleNo[WEREWOLF].value>0)}, 'img/werewolf.PNG', 'OS LOBISOMENS se reunem e votam em um jogador para ser devorado.',
    misteriosDaMeiaNoite],
    [function(){return(roleNo[WHITE_WEREWOLF].value>0 && sceneNo%2==1)}, 'img/white-werewolf.PNG', 'O LOBISOMEM BRANCO odeia tanto os humanos ' +  
    'quanto os demais lobismonens. <br>Alimenta-se de humanos com o resto da matilha, mas, a cada duas noites, pode devorar outro lobisomem.',
    misteriosDaMeiaNoite],
    [function(){return(roleNo[WITCH].value>0)}, 'img/witch.PNG', 'A BRUXA possui uma poção de cura e outra letal. Cada uma só pode ser usada uma vez.',
    aCucaTePega],
    [function(){return true}, 'img/day.PNG', 'UM DIA NA VILA. <br>A vila desperta, todos abrem seus olhos...', 
    ira],
    [function(){return true}, 'img/village.PNG', 'OS HABITANTES DISCUTEM. <br>Quem será condenado à forca hoje?', 
    vamos],
];

/* 
----------------------------------------------------------------------------------
State Machine
----------------------------------------------------------------------------------
This part of the code configures every button that must be activated or
deactivated depending on the program's state to prevent users from activating
forbidden functions (like starting a quiz without a verb list).
*/ 

const states = {
    CHARACTER_SELECTION: 'character-selection',
    GAME_READY_TO_START: 'game-ready-to-start', 
    GAME_STARTED: 'game-started'
};

stateMachine(states.CHARACTER_SELECTION);

function stateMachine(currentState){
    if(!currentState){
        throw new Error('State is not defined');
    }
    switch(currentState){
        case states.CHARACTER_SELECTION:
            // Input Setup
            gameText.innerHTML = 'Escolha o número de cada personagem a participar do jogo. O número total de personagens não pode exceder 10.';
            setArrayDisabled(playerNamesFromInput, false, 'input'); // interface for choosing player names and characters is active during setup.
            setArrayDisabled(roleNo, false, 'input');

            // Button Setup
            setArrayDisabled(eliminateButtons, true, 'button'); // characters are not eliminated during setup.
            setButtonDisabled(startButton, true); // game must be shuffled before starting.
            setButtonDisabled(nextSceneButton, true);
            setButtonDisabled(shuffleCharactersButton, false);
            setButtonDisabled(clearPlayersButton, false);

            break;
        case states.GAME_READY_TO_START:
            // Input Setup
            gameText.innerHTML = 'O jogo foi sorteado. Você pode fazer novo sorteio ou escrever os nomes dos jogadores e clicar no botão COMEÇAR JOGO.';
            setArrayDisabled(playerNamesFromInput, false, 'input'); // interface for choosing player names and characters is active during setup.
            setArrayDisabled(roleNo, false, 'input');

            // Button Setup
            setArrayDisabled(eliminateButtons, true, 'button'); // characters are not eliminated during setup.
            setButtonDisabled(startButton, false); // game must be shuffled before starting.
            setButtonDisabled(nextSceneButton, true);
            setButtonDisabled(shuffleCharactersButton, false);
            setButtonDisabled(clearPlayersButton, false);

            break;
        case states.GAME_STARTED:
            // Input Setup
            gameText.innerHTML = 'O jogo começou. Proceda com o botão PRÓXIMA CENA.';
            setArrayDisabled(playerNamesFromInput, true, 'input'); // interface for choosing player names and characters is not active during game.
            setArrayDisabled(roleNo, true, 'input');

            // Button Setup
            setArrayDisabled(eliminateButtons, false, 'button'); // characters are eliminated during game.
            setButtonDisabled(startButton, true); 
            setButtonDisabled(nextSceneButton, false);
            setButtonDisabled(shuffleCharactersButton, true); 
            setButtonDisabled(clearPlayersButton, true);

            break;
    }
}

// support function to disable an entire array of inputs.
// mode is true for disabled and false for not disabled
// type is 'button' for buttons (a different function will be called to customize it)

function setArrayDisabled(arrayToDisable, mode, type){
    for(let i = 0; i < arrayToDisable.length; i++){
        if(type == 'button'){
            setButtonDisabled(arrayToDisable[i], mode);
        }else{
            arrayToDisable[i].disabled = mode;
        }       
    }
}


function setButtonDisabled(buttonToDisable, mode){
    buttonToDisable.disabled = mode;
    if(mode == true){
        buttonToDisable.style.backgroundColor = "#330000"; 
    }else{
        buttonToDisable.style.backgroundColor = "#B5651D"; 
    }  
}


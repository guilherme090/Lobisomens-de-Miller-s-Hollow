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

// Labels and inputs for target characters.
let lover1Label = document.querySelector('#lover-1');
let lover1Code = document.querySelector('#lover-1-code');
let lover2Label = document.querySelector('#lover-2');
let lover2Code = document.querySelector('#lover-2-code');
let crystalBallLabel = document.querySelector('#crystal-ball');
let crystalBallCode = document.querySelector('#crystal-ball-code');
let werewolfVictimLabel = document.querySelector('#werewolf-victim');
let werewolfVictimCode = document.querySelector('#werewolf-victim-code');
let whiteWerewolfVictimLabel = document.querySelector('#white-werewolf-victim');
let whiteWerewolfVictimCode = document.querySelector('#white-werewolf-victim-code');
let witchSavedLabel = document.querySelector('#witch-saved');
let witchSavedCode = document.querySelector('#witch-saved-code');
let witchKilledLabel = document.querySelector('#witch-killed');
let witchKilledCode = document.querySelector('#witch-killed-code');
let hunterKilledLabel = document.querySelector('#hunter-killed');
let hunterKilledCode = document.querySelector('#hunter-killed-code');

// In the last scene step, automatically kill the victims.

function resolveScene() {
    if (Number.isSafeInteger(parseInt(witchSavedCode.value)) && parseInt(witchSavedCode.value) > 0) {
        werewolfVictimCode.value = '';
    }
    witchSavedCode.value = '';
    if (Number.isSafeInteger(parseInt(witchKilledCode.value))) {
        if (parseInt(witchKilledCode.value) - 1 >= 0 || parseInt(witchKilledCode.value) - 1 < playerNo) {
            eliminateCharacter(parseInt(witchKilledCode.value - 1));
        }
    }
    if (Number.isSafeInteger(parseInt(werewolfVictimCode.value))) {
        if (parseInt(werewolfVictimCode.value) - 1 >= 0 || parseInt(werewolfVictimCode.value) - 1 < playerNo) {
            eliminateCharacter(parseInt(werewolfVictimCode.value - 1));
        }
    }
    if (Number.isSafeInteger(parseInt(whiteWerewolfVictimCode.value))) {
        if (parseInt(whiteWerewolfVictimCode.value) - 1 >= 0 || parseInt(whiteWerewolfVictimCode.value) - 1 < playerNo) {
            eliminateCharacter(parseInt(whiteWerewolfVictimCode.value - 1));
        }
    }
}

/*
----------------------------------------------------------------------------------
Buttons
----------------------------------------------------------------------------------
List of buttons and onclick functions
*/

let eliminateButtons = document.querySelectorAll("[id^='btn-eliminate-']");

for (let i = 0; i < eliminateButtons.length; i++) {
    eliminateButtons[i].onclick = function () {
        // console.log(i);
        // console.log(charactersList[i]);
        toggleEliminateCharacter(i);
    }
}

function eliminateCharacter(i) {
    if (eliminateButtons[i].innerHTML == 'ELIMINAR') {
        toggleEliminateCharacter(i);
    }
    return;
}

function toggleEliminateCharacter(i) {
    if (eliminateButtons[i].innerHTML == 'ELIMINAR') {
        playerFigures[i].src = charactersList[i].picture;
        roleNo[charactersList[i].fellows].value--; // update number of characters with this role
        eliminateButtons[i].innerHTML = 'RESTAURAR';

        // If eliminated a lover, eliminate the other one (unless it is already out).
        if (Number.isSafeInteger(parseInt(lover1Code.value)) && Number.isSafeInteger(parseInt(lover2Code.value)) &&
            parseInt(lover1Code.value - 1) == i && eliminateButtons[parseInt(lover2Code.value - 1)].innerHTML == 'ELIMINAR') {
            eliminateCharacter(parseInt(lover2Code.value - 1));
        } else if (Number.isSafeInteger(parseInt(lover1Code.value)) && Number.isSafeInteger(parseInt(lover2Code.value)) &&
            parseInt(lover2Code.value - 1) == i && eliminateButtons[parseInt(lover1Code.value - 1)].innerHTML == 'ELIMINAR') {
            eliminateCharacter(parseInt(lover1Code.value - 1));
        }

        // If eliminated a hunter, also eliminate their target
        if (roleNames[i].innerHTML === 'caçador' && Number.isSafeInteger(parseInt(hunterKilledCode.value))) {
            eliminateCharacter(parseInt(hunterKilledCode.value - 1));
        }
    } else {
        playerFigures[i].src = 'img/question-mark.png';
        roleNo[charactersList[i].fellows].value++; // update number of characters with this role
        eliminateButtons[i].innerHTML = 'ELIMINAR';
    }
}

let startButton = document.querySelector('#btn-start-game');
startButton.onclick = function () {
    sceneNo = 1;
    turnNo.innerHTML = 'Rodada ' + sceneNo;
    for (let i = 0; i < playerNo; i++) {
        playerNames[i].innerHTML = i + 1 + ' - ';
        playerNames[i].innerHTML += playerNamesFromInput[i].value;
    }

    // fecth secret roles to create initial Discord message

    // initial message: created so the discord adm has access to the secret roles.

    function createInitialMessage() {
        var d = new Date();
        let initialMessage = '***************************\nNovo jogo iniciado em ' +
            d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' - ' +
            d.getHours() + ':' + d.getMinutes() + '\n***************************\n';
        for (let i = 0; i < playerNo; i++) {
            initialMessage += playerNames[i].innerHTML + ' - ' + roleNames[i].innerHTML + '\n';
        }
        return initialMessage;
    }

    msgSecretRoles[1] = {
        "content": createInitialMessage()
    }
    sendMessage(msgSecretRoles[0], msgSecretRoles[1]);

    // console.log(charactersList);
    stateMachine(states.GAME_STARTED);
};

let nextSceneButton = document.querySelector('#btn-next-scene');
nextSceneButton.onclick = function () {
    turnNo.innerHTML = 'Rodada ' + sceneNo;
    while (!listOfScenes[sceneStep][0]()) {
        sceneStep++;
        if (sceneStep >= listOfScenes.length) {
            sceneNo++; // proceed to next scene
            sceneStep = 0;
        }
    }
    // console.log(listOfScenes[sceneStep]);
    // console.log(sceneStep);
    boardSkin.style.backgroundImage = 'url(' + listOfScenes[sceneStep][1] + ')';
    gameText.innerHTML = listOfScenes[sceneStep][2];
    if (listOfScenes[sceneStep][3] == 'stop') {
        currentSong.load();
    } else if (listOfScenes[sceneStep][3] != currentSong) {
        currentSong.load();
        currentSong = listOfScenes[sceneStep][3];
        currentSong.play();
        currentSong.volume = volumeSlider.value / 500;
    }

    // Send a message to the Telegram webhook bot.
    if (listOfScenes[sceneStep][4] != null) {
        sendMessage(listOfScenes[sceneStep][4][0], listOfScenes[sceneStep][4][1])
    }

    // Erase all scene inputs, then recover scene specific ones
    eraseSceneInputs();
    var i = 5;
    while (listOfScenes[sceneStep][i] != undefined) {
        listOfScenes[sceneStep][i].style.display = 'inline';
        i++;
    }

    // check if the seer has played and asked for someone's identity
    if (Number.isSafeInteger(parseInt(crystalBallCode.value) - 1)) {
        let msgSeerRevealed =
        {
            "content": "Identidade secreta de " + playerNames[parseInt(crystalBallCode.value) - 1].innerHTML + ": " + roleNames[parseInt(crystalBallCode.value) - 1].innerHTML + '.'
        };
        sendMessage(msgSeer[0], msgSeerRevealed);
        crystalBallCode.value = '';
    }

    // check to see if hunter will be killed to ask for his target., as long as it is his turn
    const SCENESTEP_HUNTER = 10;
    const SCENESTEP_LOVERS = 6;
    const SCENESTEP_WITCH = 9;

    if (sceneStep == SCENESTEP_HUNTER) {
        if (Number.isSafeInteger(parseInt(witchKilledCode.value)) && parseInt(witchKilledCode.value) != 0) {
            if (roleNames[parseInt(witchKilledCode.value) - 1].innerHTML === 'caçador') {
                sendMessage(msgHunter[0], msgHunter[1]);
            }
        }
        if (Number.isSafeInteger(parseInt(werewolfVictimCode.value)) && parseInt(werewolfVictimCode.value) != 0) {
            if (roleNames[parseInt(werewolfVictimCode.value) - 1].innerHTML === 'caçador') {
                sendMessage(msgHunter[0], msgHunter[1]);
            }
        }
    }

    else if (sceneStep == SCENESTEP_LOVERS) {
        if (Number.isSafeInteger(parseInt(lover1Code.value)) && Number.isSafeInteger(parseInt(lover2Code.value))) {
            var loversWarning = {
                "content": playerNames[parseInt(lover1Code.value) - 1].innerHTML + ' e ' + playerNames[parseInt(lover2Code.value) - 1].innerHTML +
                    ', protejam-se. Vocês não podem votar um no outro, seja no voto da matilha ou no voto para a forca, ainda que por blefe.'
            }
            sendMessage(msgLovers[0], loversWarning);
        }
    }

    else if (sceneStep == SCENESTEP_WITCH) {
        if (Number.isSafeInteger(parseInt(werewolfVictimCode.value))) {
            var witchWarning = {
                "content": playerNames[parseInt(werewolfVictimCode.value) - 1].innerHTML + ' é o alvo dos lobos esta noite.'
            }
            sendMessage(msgWitch[0], witchWarning);
        }
    }

    sceneStep++;
    if (sceneStep >= listOfScenes.length) {
        sceneNo++;
        sceneStep = 0;
        resolveScene(); // kill the victims
    }
}

let shuffleCharactersButton = document.querySelector('#btn-shuffle-characters');
shuffleCharactersButton.onclick = function () {

    // if the player chooses more than 10 characters, default values will be used
    let defaultCharacters = [2, 1, 1, 1, 1, 1, 2, 1];

    // count number of players.
    playerNo = 0;
    for (let i = 0; i < roleNo.length; i++) {
        playerNo += Number(roleNo[i].value);
    }

    if (playerNo > 10) {
        playerNo = 10;
        gameText.innerHTML = 'Você escolheu mais de 10 personagens.' +
            'Valores padrão foram colocados no lugar.' + '<br>' +
            'Caso não queira jogar com valores padrão, altere novamente os números de personagens.'
        for (let i = 0; i < roleNo.length; i++) {
            roleNo[i].value = defaultCharacters[i];
        }
    }

    // erase previous shuffling
    for (let i = 0; i < 10; i++) {
        roleNames[i].innerHTML = '(papel)';
    }

    // shuffle by role
    let charsTaken = 0;
    for (let i = 0; i < roleNo.length; i++) {
        for (let k = 0; k < roleNo[i].value; k++) {
            let shuffledNumber = Math.floor(Math.random() * (playerNo - charsTaken));
            // console.log(shuffledNumber);
            // find shuffled number on list.
            for (let j = 0; j < shuffledNumber; j++) {
                if (roleNames[j].innerHTML != '(papel)') {
                    shuffledNumber++;
                }
            }
            while (roleNames[shuffledNumber].innerHTML != '(papel)') {
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
clearPlayersButton.onclick = function () {
    for (let i = 0; i < playerNamesFromInput.length; i++) {
        playerNamesFromInput[i].value = '';
    }
};

let hideButton = document.querySelector('#btn-toggle-characters');
hideButton.onclick = function () {
    for (let i = 0; i < roleNames.length; i++) {
        if (roleNames[i].style.display == 'none') {
            roleNames[i].style.display = 'inline';
        } else {
            roleNames[i].style.display = 'none';
        }
    }
};

let volumeSlider = document.querySelector('#volume-slider');
volumeSlider.oninput = function () {
    currentSong.volume = volumeSlider.value / 1000;
}

var txtRead = [];

const botsButton = document.querySelector('#btn-load-discord-channels');
botsButton.addEventListener('input', function (e) {
    // save channel webhook keys to proper variables
    var fr = new FileReader();
    fr.onload = function () {
        txtRead = (fr.result.split('*'));
        console.log(txtRead);
        msgSecretRoles[0] = txtRead[0];
        msgCupid[0] = txtRead[1];
        msgSeer[0] = txtRead[2];
        msgFox[0] = txtRead[3];
        msgWitch[0] = txtRead[4];
        msgHunter[0] = txtRead[5];
        msgLovers[0] = txtRead[6];
        msgWerewolves[0] = txtRead[7];
        msgWhiteWerewolf[0] = txtRead[8];
    }
    fr.readAsText(this.files[0]);
    // console.log('Texto lido:' + txtRead);
});

/*
----------------------------------------------------------------------------------
Images
----------------------------------------------------------------------------------
Game display and player tokens
*/

// position 0 is for display picture. 1-10 are for players.
let playerFigures = document.querySelectorAll("[id^='display']");
let boardSkin = document.querySelector('#board');
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

let pictures = ['img/villager-tkn.PNG', 'img/witch-tkn.PNG', 'img/hunter-tkn.PNG', 'img/cupid-tkn.PNG',
    'img/seer-tkn.PNG', 'img/fox-tkn.PNG', 'img/werewolf-tkn.PNG', 'img/white-werewolf-tkn.PNG'];

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
    constructor(player, role, picture, fellows) {
        this._player = player;
        this._role = role;
        this._picture = picture;
        this._fellows = fellows; // code to find character's role in array of roles (shows people with the same role as him/her)
    }

    get player() {
        return this._player;
    }

    set player(newPlayer) {
        this._player = newPlayer;
    }

    get role() {
        return this._role;
    }

    set role(newRole) {
        this._role = newRole;
    }

    get picture() {
        return this._picture;
    }

    set picture(newPicture) {
        this._picture = newPicture;
    }

    get fellows() {
        return this._fellows;
    }

    set fellows(newFellows) {
        this._fellows = newFellows;
    }
}

// initialize empty list of characters
for (let i = 0; i < 10; i++) {
    charactersList.push(new character('Player ' + i, 'role', 'picture', 'fellows'));
}

// Configure webhook messages for Discord.
let msgSecretRoles = ['link',
    {
        "content": 'content'
    }];
let msgCupid = ['link',
    {
        "content": "Escolha dois jogadores para serem flechados. Você pode, se quiser, ser um desses jogadores."
    }];
let msgSeer = ['link',
    {
        "content": "Escolha um jogador cuja identidade secreta você deseja descobrir."
    }];
let msgFox = ['link',
    {
        "content": "Você quer usar seus poderes para descobrir se há um lobisomem perto de um jogador a sua escolha? Lembre-se: caso deseje utilizar os seus poderes e não houver um lobisomem entre os três jogadores, você perderá a sua habilidade pelo resto do jogo."
    }];
let msgWitch = ['link',
    {
        "content": "Você deseja usar alguma de suas habilidades (poção de cura ou poção letal)? Lembre-se: você pode usar as duas na mesma rodada, mas só poderá usar cada poção uma vez durante o jogo."
    }];
let msgHunter = ['link',
    {
        "content": "Você será eliminado esta rodada. Escolha um jogador para ser eliminado junto com você."
    }];
let msgLovers = ['link',
    {
        "content": "O cupido escolheu flechar vocês dois. Protejam-se! Lembrem-se: se um dos dois morrer, o outro também morrerá na mesma rodada."
    }];
let msgWerewolves = ['link',
    {
        "content": "Matilha, conversem e decidam entre vocês quem deve ser devorado esta rodada. Lembrem-se: se houver empate, ninguém será eliminado. Vocês não podem votar em outro lobisomem ou em alguém com quem estejam flechados."
    }];
let msgWhiteWerewolf = ['link',
    {
        "content": "Você deseja devorar algum dos lobisomens comuns este turno?"
    }];

// send message specified in the msg*** variables above. 

const sendMessage = function (whurl, msg) {
    fetch(whurl, {
        "method": "POST",
        "headers": {
            "content-type": "application/json"
        },
        "body": JSON.stringify(msg)
    });
}

// list of scenes
// format: condition to play the scene (or otherwise skip it) / image / text / song / Discord message / secret tags to show  x 4

let listOfScenes = [
    [function () { return sceneNo == 1 }, 'img/revelation.PNG', 'REVELAÇÃO. <br>Os habitantes descobrem os seus papéis secretos.',
        mascara, null],
    [function () { return sceneNo == 1 }, 'img/night-cover.PNG', 'A PRIMEIRA NOITE. <br>Uma estranha magia invade Miller\'s Hollow.',
        'stop', null],
    [function () { return sceneNo != 1 }, 'img/night-cover.PNG', 'UMA NOITE NA VILA. <br>Os seres sobrenaturais se preparam para agir.',
        blueMoon, null],
    [function () { return (roleNo[CUPID].value > 0 && sceneNo == 1) }, 'img/cupid-cover.PNG', 'O CUPIDO escolhe dois jogadores para atirar-lhes' +
        ' flechas. Esses jogadores terão que se proteger pelo resto do jogo.',
        estupidoCupido, msgCupid, lover1Label, lover1Code, lover2Label, lover2Code],
    [function () { return (roleNo[SEER].value > 0) }, 'img/seer-cover.PNG', 'A VIDENTE, de posse de sua bola de cristal, descobre a identidade de um jogador à sua escolha.',
        blueMoon, msgSeer, crystalBallLabel, crystalBallCode],
    [function () { return (roleNo[FOX].value > 0) }, 'img/fox-cover.PNG', 'A RAPOSA, se quiser ativar os seus poderes, escolhe um jogador' +
        ' e descobre se, entre ele e seus dois vizinhos, há pelo menos um lobisomem. <br>' +
        ' Caso não haja nenhum lobisomem, ela perde os seus poderes pelo resto do jogo.',
        blueMoon, msgFox, crystalBallLabel, crystalBallCode],
    [function () { return (roleNo[CUPID].value > 0 && sceneNo == 1) }, 'img/lovers-cover.PNG', 'OS AMANTES flechados pelo cupido' +
        ' se reconhecem. <br>Se um dos dois morrer, o outro também morrerá de solidão.',
        jirafalesFlorinda, msgLovers, null],
    [function () { return (roleNo[WEREWOLF].value > 0) }, 'img/werewolf-cover.PNG', 'O encontro da matilha. <br>OS LOBISOMENS se reunem e votam em um jogador para ser devorado.',
        misteriosDaMeiaNoite, msgWerewolves, werewolfVictimLabel, werewolfVictimCode],
    [function () { return (roleNo[WHITE_WEREWOLF].value > 0 && sceneNo % 2 == 1) }, 'img/white-werewolf-cover.PNG', 'O LOBISOMEM BRANCO odeia tanto os humanos ' +
        'quanto os demais lobismonens. <br>Alimenta-se de humanos com o resto da matilha, mas, a cada duas noites, pode devorar outro lobisomem.',
        misteriosDaMeiaNoite, msgWhiteWerewolf, whiteWerewolfVictimLabel, whiteWerewolfVictimCode],
    [function () { return (roleNo[WITCH].value > 0) }, 'img/witch-cover.PNG', 'A BRUXA possui uma poção de cura e outra letal. Cada uma só pode ser usada uma vez,' +
        ' sendo possível utilizar as duas na mesma noite.',
        aCucaTePega, msgWitch, witchSavedLabel, witchSavedCode, witchKilledLabel, witchKilledCode],
    [function () { return true }, 'img/day.PNG', 'UM DIA NA VILA. <br>A vila desperta, todos abrem seus olhos...',
        ira, null, hunterKilledLabel, hunterKilledCode],
    [function () { return true }, 'img/village.PNG', 'OS HABITANTES DISCUTEM. <br>Quem será condenado à forca hoje?',
        vamos, null],
];


// scene functions: hide all inputs, then show scene specific ones
function eraseSceneInputs() {
    // if scene is starting all over again (step=2, erase inputs)
    if (sceneStep < 2) {
        lover1Code.value = "";
        lover2Code.value = "";
    }

    if (sceneStep == 2) {
        crystalBallCode.value = "";
        werewolfVictimCode.value = "";
        whiteWerewolfVictimCode.value = "";
        witchSavedCode.value = "";
        witchKilledCode.value = "";
        hunterKilledCode.value = "";
    }
    lover1Label.style.display = 'none';
    lover1Code.style.display = 'none';
    lover2Label.style.display = 'none';
    lover2Code.style.display = 'none';
    crystalBallLabel.style.display = 'none';
    crystalBallCode.style.display = 'none';
    werewolfVictimLabel.style.display = 'none';
    werewolfVictimCode.style.display = 'none';
    whiteWerewolfVictimLabel.style.display = 'none';
    whiteWerewolfVictimCode.style.display = 'none';
    witchSavedLabel.style.display = 'none';
    witchSavedCode.style.display = 'none';
    witchKilledLabel.style.display = 'none';
    witchKilledCode.style.display = 'none';
    hunterKilledLabel.style.display = 'none';
    hunterKilledCode.style.display = 'none';
}

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

function stateMachine(currentState) {
    if (!currentState) {
        throw new Error('State is not defined');
    }
    switch (currentState) {
        case states.CHARACTER_SELECTION:
            // Input Setup
            gameText.innerHTML = 'Escolha o número de cada personagem a participar do jogo. O número total de personagens não pode exceder 10.';
            setArrayDisabled(playerNamesFromInput, false, 'input', playerNamesFromInput.length); // interface for choosing player names and characters is active during setup.
            setArrayDisabled(roleNo, false, 'input', roleNo.length);

            // Button Setup
            setArrayDisabled(eliminateButtons, true, 'button', eliminateButtons.length); // characters are not eliminated during setup.
            setButtonDisabled(startButton, true); // game must be shuffled before starting.
            setButtonDisabled(nextSceneButton, true);
            setButtonDisabled(shuffleCharactersButton, false);
            setButtonDisabled(clearPlayersButton, false);

            break;
        case states.GAME_READY_TO_START:
            // Input Setup
            gameText.innerHTML = 'O jogo foi sorteado. Você pode fazer novo sorteio ou escrever os nomes dos jogadores e clicar no botão COMEÇAR JOGO.';
            setArrayDisabled(playerNamesFromInput, false, 'input', playerNo); // interface for choosing player names and characters is active during setup.
            setArrayDisabled(roleNo, false, 'input', roleNo.length);

            // Button Setup
            setArrayDisabled(eliminateButtons, true, 'button', eliminateButtons.length); // characters are not eliminated during setup.
            setButtonDisabled(startButton, false); // game must be shuffled before starting.
            setButtonDisabled(nextSceneButton, true);
            setButtonDisabled(shuffleCharactersButton, false);
            setButtonDisabled(clearPlayersButton, false);

            break;
        case states.GAME_STARTED:
            // Input Setup
            gameText.innerHTML = 'O jogo começou. Proceda com o botão PRÓXIMA CENA.';
            setArrayDisabled(playerNamesFromInput, true, 'input', playerNamesFromInput.length); // interface for choosing player names and characters is not active during game.
            setArrayDisabled(roleNo, true, 'input', roleNo.length);

            // Button Setup
            setArrayDisabled(eliminateButtons, false, 'button', playerNo); // characters are eliminated during game.
            setButtonDisabled(startButton, true);
            setButtonDisabled(nextSceneButton, false);
            setButtonDisabled(shuffleCharactersButton, true);
            setButtonDisabled(clearPlayersButton, true);

            break;
    }
}

/* 
----------------------------------------------------------------------------------
Support function to disable an entire array of inputs.
----------------------------------------------------------------------------------
mode is true for disabled and false for not disabled
type is 'button' for buttons (a different function will be called to customize it)
howMany refers to the number of elements that will be abled or disabled. The others will receive the opposite effect.
*/

function setArrayDisabled(arrayToDisable, mode, type, howMany) {
    for (let i = 0; i < arrayToDisable.length; i++) {
        if (type == 'button') {
            if (i < howMany) {
                setButtonDisabled(arrayToDisable[i], mode);
            } else {
                setButtonDisabled(arrayToDisable[i], !mode);
            }
        } else {
            if (i < howMany) {
                arrayToDisable[i].disabled = mode;
            } else {
                arrayToDisable[i].disabled = !mode;
            }

        }
    }
}

function setButtonDisabled(buttonToDisable, mode) {
    buttonToDisable.disabled = mode;
    if (mode == true) {
        buttonToDisable.style.backgroundColor = "#330000";
    } else {
        buttonToDisable.style.backgroundColor = "#FF8200";
    }
}
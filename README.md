# Lobisomens-de-Miller-s-Hollow
Plataforma gráfica para jogar online o jogo de tabuleiro Werewolves of Miller's Hollow.

Este é um tabuleiro virtual para um jogo baseado em clássicos como Máfia e Choisissez Votre Camp (https://loups-garous-en-ligne.com), criado para jogar com meus amigos de forma remota devido à pandemia do COVID-19.
Por se tratar de um tabuleiro virtual, ele deve ser aberto em um navegador HTML e apresentado em um software de conferências, onde será possível visualizar e discutir jogadas com os demais.
Minha opção pessoal para o software de conferências é o Discord, por isso, ele conta com um local onde pode ser inserido um arquivo .txt para utilização de webhooks com mensagens automatizadas avisando sobre os turnos de cada jogaodor.

Os webhooks devem ser configurados no próprio discord e seus links devem ser representados no formato a seguir:

-----------------------------------------------------------------------
exemplo.txt
-----------------------------------------------------------------------
https://discord.com/api/webhooks/codigoNumerico/codigoAlfanumerico* <br/>
https://discord.com/api/webhooks/codigoNumerico/codigoAlfanumerico* <br/>
https://discord.com/api/webhooks/codigoNumerico/codigoAlfanumerico* <br/>
https://discord.com/api/webhooks/codigoNumerico/codigoAlfanumerico* <br/>
https://discord.com/api/webhooks/codigoNumerico/codigoAlfanumerico* <br/>
https://discord.com/api/webhooks/codigoNumerico/codigoAlfanumerico* <br/>
https://discord.com/api/webhooks/codigoNumerico/codigoAlfanumerico* <br/>
https://discord.com/api/webhooks/codigoNumerico/codigoAlfanumerico* <br/>
https://discord.com/api/webhooks/codigoNumerico/codigoAlfanumerico <br/>
-----------------------------------------------------------------------

Nesse arquivo, cada link refere-se ao bot de uma função específica do jogo, a saber: <br/>
Linha 1 - Bot de mensagens secretas <br/> 
Linha 2 - Bot do cupido <br/>
Linha 3 - Bot da vidente <br/>
Linha 4 - Bot da raposa <br/>
Linha 5 - Bot da bruxa <br/>
Linha 6 - Bot do caçador <br/>
Linha 7 - Bot dos amantes <br/>
Linha 8 - Bot dos lobisomens <br/>
Linha 9 - Bot do lobisomem branco <br/>

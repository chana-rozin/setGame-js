let cardsArr = [];
let selectedCards = [];
selectTagId = [];

window.onload = function () {
    ResetPoints();
    buildCardsArr();
}


function ResetPoints() {
    const curentUser = (JSON.parse(localStorage.getItem("curentUser")));
    const users = (JSON.parse(localStorage.getItem("users")));
    curentUser.score = 0;
    users.forEach(e => e.score = 0);
    localStorage.setItem("curentUser", JSON.stringify(curentUser));
    localStorage.setItem("users", JSON.stringify(users));
    const showScore = document.getElementById("showScore");
    showScore.innerText = `${curentUser.name} your score is:`;
    let br = document.createElement('br');
    showScore.appendChild(br);
    const h1 = document.createElement('h1');
    h1.setAttribute('id', "score");
    showScore.appendChild(h1);
    h1.innerText += `${curentUser.score}`;
}


function buildCardsArr() {
    const color = ["pink", "purple", "blue"];
    const shape = ["star", "Glasses", "heart"];
    const count = [3, 2, 1];
    const filling = ["striped", "full", "empty"];
    const feature = ["color", "shape", "filling", "count"];
    let t = 1;
    for (let i = 0; i < 3; i++) //Initializes the image array and adds properties
    {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                for (let n = 0; n < 3; n++) {
                    cardsArr[t - 1] = new card(color[i], filling[j], shape[k], count[n], `../img/cards/${t}.png`, `num${i}${j}${k}${n}`);
                    const myIMg = document.createElement('img');
                    myIMg.src = cardsArr[t - 1].img;
                    t++;
                }
            }
        }
    }
    newBoard();
}


function shuffle(arr) {

    arr.sort(() => Math.random() - 0.5);
}


function newBoard() {
    shuffle(cardsArr);
    const board = document.getElementById("board");
    board.innerHTML = "";
    for (let i = 0; i < 12; i++) {
        const playCard = document.createElement("IMG");
        playCard.src = cardsArr[i].img;
        playCard.style.opacity = "1";
        board.appendChild(playCard);
        playCard.setAttribute('class', "playCard");
        playCard.setAttribute('id', `playCard${i}`);
        playCard.addEventListener('click', () => { emphasis(cardsArr[i], `playCard${i}`) });
    }
    if (!isFoundSetInBoard(cardsArr)) {
        newBoard();
    }
}


function isFoundSetInBoard(cardsArr) {
    for (let i = 0; i < 12; i++) {
        for (let j = i + 1; j < 12 - i; j++) {
            for (let k = j + 1; k < 12 - j; k++) {
                let isFound = isFeatureMatch(cardsArr[i], cardsArr[j], cardsArr[k]);
                if (isFound) {
                    console.log(cardsArr[i]);
                    console.log(cardsArr[j]);
                    console.log(cardsArr[k]);
                    return true;
                }

            }
        }
    }
    return false;
}





function CheckingSet(card) {
    if (selectedCards.length === 3) {

        const curentUser = JSON.parse(localStorage.getItem("curentUser"));
        let card1 = selectedCards[0];
        let card2 = selectedCards[1];
        let card3 = selectedCards[2];
        if (isFeatureMatch(card1, card2, card3)) {
            changeCards();
            updateScore(5);
        }
        else {
            selectTagId.forEach(e => document.getElementById(e).style.opacity = "1");
            updateScore(-5);
            alert("worng, try again!");
        }
    }


}


function emphasis(card, tagId) {
    const tag = document.getElementById(tagId);
    if (tag.style.opacity === "1") {
        tag.style.opacity = "0.5";
        selectedCards.push(card);
        selectTagId.push(tagId);
        CheckingSet(card);
    }
    else {
        tag.style.opacity = "1";
        selectedCards.pop();
        selectTagId.pop();
    }
}


function isFeatureMatch(card1, card2, card3) {
    const color = ["pink", "purple", "blue"];
    const shape = ["star", "Glasses", "heart"];
    const count = [3, 2, 1];
    const filling = ["striped", "full", "empty"];
    const feature = ["color", "shape", "filling", "count"];
    let isMatch = false;
    for (let i = 0; i < 4; i++) {
        isMatch = false;
        if (card1[feature[i]] === card2[feature[i]]) {
            if (card1[feature[i]] === card3[feature[i]]) {
                isMatch = true;
                continue;
            }
            break;
        }
        if (card1[feature[i]] !== card3[feature[i]] && card2[feature[i]] !== card3[feature[i]]) {
            isMatch = true;
            continue;
        }
        break;
    }
    if (isMatch)
        return true;
    selectedCards = [];
    selectTagId.forEach(e => document.getElementById(e).style.opacity = "1");
    selectTagId = [];
    return false;
}


function changeCards() {
    let length = cardsArr.length;
    if (length > 14) {
        for (let i = length - 1, j = 0; i >= length - 3, j < 3; i--, j++) {
            const imgTag = document.getElementById(selectTagId[j]);
            imgTag.src = cardsArr[i].img;
        }
        for (let i = 0; i < 3; i++) {

            let indexSelectedCard = cardsArr.findIndex(e => e.id === selectedCards[i].id);
            swap(indexSelectedCard, --length);
            cardsArr.pop();
        }
        if (!isFoundSetInBoard(cardsArr))
            newBoard();
        selectedCards = [];
        selectTagId = [];
    }
    else {
        winMassage();
    }
}



function swap(index1, index2) {
    let temp = cardsArr[index1];
    cardsArr[index1] = cardsArr[index2];
    cardsArr[index2] = temp;
}


function updateScore(score) {
    const curentUser = (JSON.parse(localStorage.getItem("curentUser")));
    curentUser.score += score;
    curentUser.finalScore += score;
    if (curentUser.score < 0) {
        curentUser.score = 0;
        curentUser.finalScore = 0;
    }
    updateLevel(curentUser);
    localStorage.setItem("curentUser", JSON.stringify(curentUser));
    const usersArr = (JSON.parse(localStorage.getItem('users')));
    usersArr.forEach(e => {
        if (e.email == curentUser.email) {
            e.score = curentUser.score;
            e.finalScore = curentUser.finalScore;
            e.level = curentUser.level;
        }
    })
    localStorage.setItem("users", JSON.stringify(usersArr));
    const showScore1 = document.getElementById("score");
    showScore1.innerText = `${curentUser.score}`;
}


function updateLevel(curentUser) {

    if (curentUser.finalScore < 0) {
        curentUser.finalScore = 0;
    }
    if (curentUser.finalScore < 100) {
        curentUser.level = "cooper";
    }
    else if (curentUser.finalScore < 200) {
        curentUser.level = "silver";
    }
    else if (curentUser.finalScore < 300) {
        curentUser.level = "gold";
    }
    else if (curentUser.finalScore < 400) {
        curentUser.level = "plutonium";
    }
}


function winMassage() {
    const curentUser = JSON.parse(localStorage.getItem("curentUser"));
    const winContainer = document.getElementById('winContainer');
    winContainer.style.display = "flex";
    const winTxt = document.getElementById('winTxt');
    winTxt.innerText = `${curentUser.name}, good job!!!`;
    const br = document.createElement('br');
    winTxt.appendChild(br);
    winTxt.innerText += `your level is: ${curentUser.level}`;
}


function logOut() {
    localStorage.removeItem('curentUser');
    window.location = "form.html";
}


function goHome() {
    window.location = "home.html";
}



function newGame() {
    window.location = "gameBoard.html";
}


function instructions() {
    window.location = "instructions.html";
}

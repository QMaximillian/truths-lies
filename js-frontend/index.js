const nameField = document.getElementById('name')
const playerForm = document.getElementById('playerform')
const dropDown = document.getElementById('nameselect')
const PLAYER_URL = "http://localhost:3000/api/v1/players"
const QUIZ_URL = "http://localhost:3000/api/v1/quiz_cards"
const nameForm = document.getElementById('name-form')
const form = document.getElementById('formDiv')
const optOne = document.getElementById('1')
const optTwo = document.getElementById('2')
const optThree = document.getElementById('3')
const quizCardArea = document.getElementById('quiz-card-area')
const userObject = {}
const signUpText = document.getElementById('sign-up')
const selectPlayerForm = document.getElementById('select-player-form')
const gameOverDiv = document.getElementById('game-over')
let playerId = 0
let currentPlayerHighScore = 0
let counter = 0
nameForm.addEventListener('submit', handleNameSubmit)
signUpText.addEventListener('click', handleSignUp)

//FIRST THINGS TO LAUNCH
loadNames()

function handleSignUp(e){
  selectPlayerForm.className="hidden"
  playerForm.className=""
  signUpText.className="hidden"
}

function loadNames(){
  return fetch(PLAYER_URL).then( res => res.json()).then(renderNames)
}

function renderNames(resp){
  resp.data.forEach(function(player){
    dropDown.innerHTML += `<option value="${player.id}">${player.attributes.name}</option>`
  })
}

function handleNameSubmit(e){
e.preventDefault();
if (nameField.value.length > 0){
    return fetch(PLAYER_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: nameField.value
      })
    }).then(resp => resp.json()).then(showForm)
  }
  else {
    playerId = parseInt(dropDown.value)
    nameForm.className = "hidden"
    fetchCards(playerId)
  }
}

function showForm(resp){
    nameForm.className = "hidden"
    form.className = "visible"
    form.dataset.id = resp.data.id
    playerId = resp.data.id
}

form.addEventListener('submit', handleFormSubmit)

function promptUserForNumber(e){
  form.className = "hidden"
  nameForm.innerHTML = "Which was the lie? Press 1, 2 or 3 on the keyboard"
  nameForm.className = "visible"
  return getNumber()
}


function getNumber(){
  window.addEventListener('keydown', function handleCorrectKey(event) {
    if(event.key === "1" || event.key === "2" || event.key === "3") {
    let false_option_number = event.key
    nameForm.innerText = ""
    handleFormSubmitPartTwo(false_option_number)


  } else {
    window.removeEventListener('keydown', handleCorrectKey)
    window.alert("Only select 1, 2 or 3 on your keyboard.")
    getNumber()
  }
  })
}

  function handleFormSubmit(event){
  event.preventDefault();
  promptUserForNumber();
  }

  function handleFormSubmitPartTwo(fon){
  return fetch(QUIZ_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      player_id: form.dataset.id,
      option1: optOne.value,
      option2: optTwo.value,
      option3: optThree.value,
      false_option: fon
    })
  }).then(resp => resp.json()).then((resp) => {
    let newCardUserId = resp.data.attributes.player.id;
    fetchCards(newCardUserId)
  })
  }

function fetchCards(cardUserId){
    return fetch(QUIZ_URL).then( res => res.json()).then((resp) => formatCards(resp, cardUserId))
}

function formatCards(response, cardUserId){
  response.data.forEach(function(card){
    if (cardUserId !== card.attributes.player.id){
    userObject[card.id]= {
      "falseOption": card.attributes["false-option"],
      "highScore": card.attributes.player.high_score}

    quizCardArea.innerHTML += cardTemplate(card)
  } else {
      currentPlayerHighScore = card.attributes.player.high_score
    }

    // userObject[card.id] ["falseOption"] = card.attributes["false-option"]
    // userObject[card.id]["highScore"] = card.attributes.player["highest-score"]

  })
  counter = 0
  quizCardArea.addEventListener('click', handleNameSelect)
}

function cardTemplate(card){
  return `<div data-card="${card.id}" class="cards">
    <div data-player="${card.attributes.player.id}" class="player-name">
      ${card.attributes.player.name}
    </div>
    <div data-options="${card.id}" class="hidden">
      <ul class="options">
      <li name="1">${card.attributes.option1} </li>
      <li name="2">${card.attributes.option2} </li>
      <li name="3">${card.attributes.option3} </li>
      </ul>
    </div>
  </div> `
}

function handleNameSelect(e){

  if (e.target.className === "player-name"){
  let currentCard = e.target.parentNode.childNodes[3]
  let cardNumber = parseInt(currentCard.dataset.options)
  let currentCardOptions = currentCard.querySelector('ul')
  console.log(currentCardOptions)
  // let allCards = document.querySelectorAll('.player-name')
  currentCard.className = ""
        quizCardArea.removeEventListener('click', handleNameSelect)
        currentCardOptions.addEventListener('click', () => handleAnswerSelect(event, cardNumber))
    }
}

function handleAnswerSelect(e, cardNumber){
  const answerNumber = parseInt(e.target.attributes.name.value)
  if (userObject[cardNumber]["falseOption"] === answerNumber){

    console.log('You\'re right!')
    const currentCard = document.querySelector(`[data-card="${cardNumber}"]`)
    currentCard.className = "hidden"
    counter++
        quizCardArea.addEventListener('click', handleNameSelect)
  } else {
    if(counter > currentPlayerHighScore){
    handlePatchRequest()
  } else {
    displayGameOver()
  }


  }
}

function handlePatchRequest(){
  return fetch(PLAYER_URL +`/${playerId}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
    high_score: counter
    })
  }).then(displayGameOver)

}
function displayGameOver(){
  console.log("you're wrong!")

  fetch(PLAYER_URL).then( res => res.json()).then(function(resp){
    let highScores = []
    let playerName
    let playerHighScore
    resp.data.forEach(function(player){
      let newObj = {}
      playerName = player.attributes.name
      playerHighScore = player.attributes['high-score']
      newObj["name"] = `${playerName}`
      newObj["score"] = playerHighScore
      highScores.push(newObj)
      })
      let sortedScores = highScores.sort(function(a, b){
       return b.score - a.score
      })
      gameOverDiv.innerHTML += `<h1>"LEADERBOARD"</h1>`
      for(let i=0; i<6; i++){
        gameOverDiv.innerHTML += `<ul>
        <li>${sortedScores[i].name} ${sortedScores[i].score}</li>
        </ul>`
      }
    })
  quizCardArea.className = "hidden"

  gameOverDiv.innerHTML += `<div id="player-info">

  </div>`
  gameOverDiv.className = ""
}

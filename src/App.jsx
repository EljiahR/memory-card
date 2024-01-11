import { useState, useEffect } from 'react'
import './App.css'

const pkmnUrl = "https://pokeapi.co/api/v2/pokemon/"

function randomNum(min, max){
  return Math.floor(Math.random() * (max - min) + min)
}

function toProperCase(string){
  return string.slice(0,1).toUpperCase() + string.slice(1)
  
}

function App() {
  const [pkmnArray, setPkmnArray] = useState([])
  const [gameState, setGameState] = useState(0) 
  const [done, setDone] = useState(false)
  const [bestScore, setBestScore] = useState(0)


  const getNewPkmn = async (amount = 12) => {
    let newPkmnArray = [];
    let usedId = [];
    for(let i = 0; i < amount; i++){
      let randomId = randomNum(1,1018)
      while(usedId.includes(randomId)){
        randomId = randomNum(1,1018)
      }
      usedId.push(randomId)
      let response = await fetch(pkmnUrl + randomId)
      let data = await response.json()
      let newPkmn = {
        id:data.id,
        name:data.name,
        sprite: data.sprites["front_default"],
        guessed: false
      }
      newPkmnArray.push(newPkmn)
    }
    setPkmnArray(newPkmnArray)
    setDone(true)
  }

  useEffect(()=>{
    gameState == 1 && getNewPkmn()
  },[gameState])

  let totalGuesses = pkmnArray.reduce((totalSelected, pkmn)=>{
    if(pkmn.guessed){
      return totalSelected + 1
    } else{
      return totalSelected
    }
  },0)

  useEffect(()=>{
    if(totalGuesses === pkmnArray.length){
      setGameState(2)
    }
  },[totalGuesses, pkmnArray])

  useEffect(()=>{
    if(totalGuesses > bestScore){
      setBestScore(totalGuesses)
    }
  },[totalGuesses, bestScore])

  const handleGameState = (newState) => {
    setDone(false)
    setGameState(newState)
  }

  const handleCardSelect = (id) => {
    let selectedPokemon = pkmnArray.find(pkmn=> pkmn.id == id)
    if(!selectedPokemon.guessed){
      randomSort(id)
    } else {
      //for testing purposes
      handleGameState(2)
    }
  }

  const randomSort = (id) => {
    if(pkmnArray.length > 0){
    
      let currentOrder = [...pkmnArray]
      let indexToChange = currentOrder.findIndex(pkmn => pkmn.id == id)
      currentOrder[indexToChange]["guessed"] = true
      let newOrder = []
      let index
      while(currentOrder.length > 0){
        index = randomNum(0,currentOrder.length)
        newOrder.push(...currentOrder.splice(index, 1))
      }
      setPkmnArray(newOrder)
    }
  }

  const resetGame = () => {
    handleGameState(1)
  }

  
  
  

  if(gameState === 1 && done){
    return (
      <div id="game">
        <div id="gameboard">
          
          {pkmnArray.map(pkmn=>{
            return (
              <div key={pkmn.id} className="pkmn-card" onClick={()=>handleCardSelect(pkmn.id)}>
                <img src={pkmn.sprite} alt={pkmn.name} />
                <h2>{toProperCase(pkmn.name)}</h2>
              </div>
            )
          })}
        </div>
        <div id="stats">
          <p>Score: {totalGuesses}/{pkmnArray.length}</p>
          <p>Best Score: {bestScore}</p>
        </div>
      </div>
      
    )
    
  }else if(gameState === 1){
    return (
      <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    )
  }else if(gameState === 0) {
    return (
      <button onClick={()=>handleGameState(1)}>Start</button>
    )
  } else if(gameState === 2){
    if(totalGuesses === pkmnArray.length){
      return (
        <div className="result">
          <h1>You win!</h1>
          <button type="button" onClick={resetGame}>Play again?</button>
        </div>
      )
    } else{
      return (
        <div className="result">
          <h1>You lose!</h1>
          <p>Your Score: {totalGuesses}</p>
          <button type="button" onClick={resetGame}>Try again?</button>
        </div>
      )
    }
  }
}

export default App

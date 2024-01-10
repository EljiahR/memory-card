import { useState, useEffect } from 'react'
import './App.css'

const pkmnUrl = "https://pokeapi.co/api/v2/pokemon/"

function randomNum(min, max){
  return Math.floor(Math.random() * (max - min) + min)
}

function toProperCase(string){
  //return string.slice(0,1).toUpperCase() + string.slice(1)
  return string
  
}

function App() {
  const [pkmnArray, setPkmnArray] = useState([])
  const [gameState, setGameState] = useState(0)
  

  
  

  useEffect(()=>{
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
    }
    gameState && getNewPkmn()
  },[gameState])

  const handleGameState = (newState) => {
    setGameState(newState)
  }

  const handleCardSelect = (id) => {
    let selectedPokemon = pkmnArray.find(pkmn=> pkmn.id == id)
    if(!selectedPokemon.guessed){
      randomSort(id)
    } else {
      //for testing purposes
      alert('lose')
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
  

  if(gameState === 1){
    return (
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
    )
    
  } else if(gameState === 0) {
    return (
      <button onClick={()=>handleGameState(1)}>Start</button>
    )
  }
}

export default App

import { useState, useEffect } from 'react'
import './App.css'

const pkmnUrl = "https://pokeapi.co/api/v2/pokemon/"

function App() {
  const [pkmnArray, setPkmnArray] = useState([])
  const [gameState, setGameState] = useState(false)

  function randomPkmnId(){
    return Math.floor(Math.random() * (1018 - 1) + 1)
  }

  function toProperCase(string){
    return string.slice(0,1).toUpperCase() + string.slice(1)
  }
  

  useEffect(()=>{
    const getNewPkmn = async (amount = 12) => {
      let newPkmnArray = [];
      let usedId = [];
      for(let i = 0; i < amount; i++){
        let randomId = randomPkmnId()
        while(usedId.includes(randomId)){
          randomId = randomPkmnId()
        }
        usedId.push(randomId)
        let response = await fetch(pkmnUrl + randomPkmnId())
        let data = await response.json()
        let newPkmn = {
          id:data.id,
          name:data.name,
          sprite: data.sprites["front_default"]
        }
        newPkmnArray.push(newPkmn)
      }
      setPkmnArray(newPkmnArray)
    }
    gameState && getNewPkmn()
  },[gameState])

  const handleGameState = () => {
    setGameState(!gameState)
  }

  if(gameState){
    return (
      <div id="gameboard">
        {pkmnArray.map(pkmn=>{
          return (
            <div key={pkmn.id} className="pkmn-card">
              <img src={pkmn.sprite} alt={pkmn.name} />
              <h2>{toProperCase(pkmn.name)}</h2>
            </div>
          )
        })}
    </div>
    )
    
  } else {
    return (
      <button onClick={handleGameState}>Start</button>
    )
  }
}

export default App

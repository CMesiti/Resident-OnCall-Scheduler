import { useState } from 'react'
import './App.css'

function App() {

  interface Resident{
    name:String
    role:String
  }


  let [teams, setTeams] = useState<string[]>([]);
  let [timeOff, setTimeOff] = useState <Array<any>>([])
  let [residents, setResidents] = useState<Object[]>([{}])


  function add_resident(res:string){
    setResidents(prev => [...prev, res])
  }
  function add_team(team:string){
    setTeams(prev => [...prev, team])
  }
  function add_timeoff(time:String){
  // complex logic, attribute of resident for a specific week list[[res, week#]]
  }



  return (
    <><h1>Scheduler</h1></>
  )
}

export default App

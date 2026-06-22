import { useState, useEffect } from 'react'
import {Sidebar} from "./components/sidebar.tsx"
import { TopNavBar } from './components/navbar.tsx';
import { InputView } from './views/input.tsx';
import { SummaryView } from './views/residentSummary.tsx';
import { ScheduleView } from './views/schedule.tsx';
import './App.css'


export interface Resident{
  name:string;
  role:Role;
}
export interface TimeOff{
  resident:string;
  week:number;
}
export type Role = 'senior'|'research'|'mid'|'junior';
function App() {
  const [activeView, setActiveView] = useState("input")
  const [teams, setTeams] = useState<string[]>([]);
  const [timeOff, setTimeOff] = useState <TimeOff[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  //assigned through resident form entering name, role
  function add_Resident(res:Resident){
    setResidents(prev=>[...prev, res])
  }
  // will be assigned through team form entering team name
  function add_Team(team:string){
    setTeams(prev => [...prev, team]);
    console.log(teams)
  }
  // Will be Assigned through drag/drop on weekend cards
  function add_Timeoff(timeOff:TimeOff){
      // complex logic, attribute of resident for a specific week list[[res, week#]]
      setTimeOff(prev => [...prev, timeOff]);
      console.log(timeOff)
  }
  //<function>, <dependency> runs on residents change
  useEffect(() =>{
        console.log("Residents :", residents)
    }, [residents])
  // SPA COMPONENTS (RE-STRUCTURE LATER!!)
  return (
  <div className = 'page-shell'>
    <Sidebar
      residentCount={residents.length}
      teamCount={teams.length}
      assignedResidents={0}
      timeOffCount={0}
      />
    <main className='main-content'>
      <TopNavBar onViewChange={setActiveView} currentView={activeView}/>
      {activeView === "input" && <InputView onAddResident={add_Resident} onAddTeam={add_Team} />}
      {activeView === "schedule" && <ScheduleView />}
      {activeView === "summary" && <SummaryView />}
    </main>
  </div>
  )
}
export default App

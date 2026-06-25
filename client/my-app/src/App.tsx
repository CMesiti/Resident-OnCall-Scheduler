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

export interface Team{
  name:string;
  residents:Resident[]
}
export type Role = 'senior'|'research'|'mid'|'junior';
function App() {
  const [activeView, setActiveView] = useState("input")
  const [teams, setTeams] = useState<Team[]>([]);
  const [timeOff, setTimeOff] = useState <TimeOff[]>([]);


  const [residents, setResidents] = useState<Resident[]>([]);
  //assigned through resident form entering name, role

  const add_Resident = (res:Resident)=>{
    setResidents(prev=>(prev.some(r=>r.name===res.name && r.role===res.role) ? prev : [...prev, res]))
  }
  const rem_Resident = (res:Resident)=>{
    setResidents(prev=>(prev.some(r=>r.name===res.name && r.role==res.role)? prev.filter(r=>r.name!==res.name || r.role!==res.role) : prev))
  }

  const add_Team = (team:Team)=>{
    setTeams(prev => (prev.some(t=>t.name===team.name) ? prev : [...prev, team]));
  }
  const rem_Team = (team:Team)=>{
    setTeams(prev =>(prev.some(t=>t.name===team.name)? prev.filter(t => t.name!==team.name):prev))
  }

  const add_Team_Resident = (team:Team, res:Resident) => {

  }
  // will be assigned through team form entering team name

  // // Will be Assigned through drag/drop on weekend cards
  // const add_Timeoff=(timeOff:TimeOff)=>{
  //     // complex logic, attribute of resident for a specific week list[[res, week#]]
  //     setTimeOff(prev => [...prev, timeOff]);
  // }


  //<function>, <dependency> runs on residents change
  useEffect(() =>{
        console.log("Residents :", residents)
    }, [residents])
  
  useEffect(()=>
    console.log("Teams :", teams), 
  [teams])

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
      {activeView === "input" && <InputView 
      team_ls={teams} 
      timeOff_ls={timeOff} 
      resident_ls={residents} 
      onAddResident={add_Resident}
      onRemResident={rem_Resident}
      onAddTeam={add_Team}
      onRemTeam={rem_Team} />} 
      {activeView === "schedule" && <ScheduleView />}
      {activeView === "summary" && <SummaryView />}
    </main>
  </div>
  )
}
export default App

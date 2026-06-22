import { useState } from 'react'
import './App.css'
import {Sidebar} from "./components/sidebar.tsx"
import { TopNavBar } from './components/navbar.tsx';
import { InputView } from './views/input.tsx';
import { SummaryView } from './views/residentSummary.tsx';
import { ScheduleView } from './views/schedule.tsx';


export type Role = 'senior'|'mid'|'junior';

interface Resident{
  name:string;
  role:Role;
}
interface TimeOff{
  resident:string;
  week:number;
}

function App() {
  let [teams, setTeams] = useState<string[]>([]);
  let [timeOff, setTimeOff] = useState <TimeOff[]>([]);
  let [residents, setResidents] = useState<Resident[]>([]);
  let [activeView, setActiveView] = useState("input")
  //assigned through resident form entering name, role
  function add_Resident(res:Resident){
    setResidents(prev => [...prev, res]);
  }

  // will be assigned through team form entering team name
  function add_Team(team:string){
    setTeams(prev => [...prev, team]);
  }

  // Will be Assigned through drag/drop on weekend cards
  function add_Timeoff(timeOff:TimeOff){
    // complex logic, attribute of resident for a specific week list[[res, week#]]
    setTimeOff(prev => [...prev, timeOff]);
  }

  // SPA COMPONENTS (RE-STRUCTURE LATER!!)
  const TeamCard = () =>{
    return <div></div>
  }
  const ResidentPool = ()=>{
    return <div></div>
  }

  const TimeOffForm = () =>{
    return <div></div>
  }

  const ResidentForm = () =>{
    return <div></div>
  }
  
  const TeamForm = () =>{
    return <div></div>
  }

  const ResidentChip = () =>{
    return <div></div>
  }

  const RoleChip = () =>{
    return <div></div>
  }



  return (
  <>
    <h1>Call Scheduler</h1>
    <div className='main'>
      <TopNavBar onViewChange={setActiveView}/>
      <Sidebar
      residentCount={0}
      teamCount={0}
      assignedResidents={0}
      timeOffCount={0}
      />
      {activeView === "input" && <InputView />}
      {activeView === "schedule" && <ScheduleView />}
      {activeView === "summary" && <SummaryView />}
    </div>
  </>
  )
}
export default App

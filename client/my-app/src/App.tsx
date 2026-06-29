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
  teamName?:string
  timeOff:Set<number>
}
export interface Team{
  name:string;
}
export type Role = 'senior'|'research'|'mid'|'junior';
function App() {
  const [activeView, setActiveView] = useState("input")
  const [teams, setTeams] = useState<Team[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  //assigned through resident form entering name, role

  const add_Resident = (res:Resident)=>{
    setResidents(prev =>
      (prev.some(r=>r.name===res.name && r.role===res.role) 
      ? prev 
      : [...prev, res]))
  }
  const rem_Resident = (res:Resident)=>{
    setResidents(prev => 
      (prev.some(r=>r.name===res.name && r.role==res.role)
      ? prev.filter(r=>r.name!==res.name || r.role!==res.role) 
      : prev))
  }

  const add_Team = (team:Team)=>{
    setTeams(prev => 
      (prev.some(t=>t.name===team.name) 
      ? prev 
      : [...prev, team]));
  }
  const rem_Team = (team:Team)=>{
    setTeams(prev => 
      (prev.some(t=>t.name===team.name)
      ? prev.filter(t => t.name!==team.name)
      :prev ))
  }

  const add_Team_Resident = (teamName:string, res:Resident) => {
    setResidents(prev => 
      (prev.map(r => r.name===res.name && r.role===res.role ? {...r, teamName:teamName} : r)))
  }

  const toggle_Time_Off = (res: Resident, weekend: number) => {
      setResidents(prev =>
          prev.map(r => {
              if (r.name !== res.name || r.role !== res.role) return r
              const next = new Set(r.timeOff)
              next.has(weekend) ? next.delete(weekend) : next.add(weekend) //toggle statement
              return { ...r, timeOff: next }
          })
      )
  }

  const get_TimeOff_Sum = () => {
    //counts length of each time off and adds to a total
    let total = 0
    residents.forEach(r => {
      total += r.timeOff.size
    });
    return total
  }
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
      timeOffCount={get_TimeOff_Sum()}
      />
    <main className='main-content'>
      <TopNavBar onViewChange={setActiveView} currentView={activeView}/>
      {activeView === "input" && <InputView 
      team_ls={teams} 
      resident_ls={residents} 
      onAddResident={add_Resident}
      onRemResident={rem_Resident}
      onAddTeamMember={add_Team_Resident}
      onToggleWeekend={toggle_Time_Off}
      onAddTeam={add_Team}
      onRemTeam={rem_Team} />} 
      {activeView === "schedule" && <ScheduleView />}
      {activeView === "summary" && <SummaryView />}
    </main>
  </div>
  )
}
export default App

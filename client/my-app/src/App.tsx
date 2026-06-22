import { useState } from 'react'
import {Sidebar} from "./components/sidebar.tsx"
import { TopNavBar } from './components/navbar.tsx';
import { InputView } from './views/input.tsx';
import { SummaryView } from './views/residentSummary.tsx';
import { ScheduleView } from './views/schedule.tsx';
import './App.css'
export type Role = 'senior'|'research'|'mid'|'junior';
function App() {
  const [activeView, setActiveView] = useState("input")
  //assigned through resident form entering name, role
  // SPA COMPONENTS (RE-STRUCTURE LATER!!)
  return (
  <div className = 'page-shell'>
    <Sidebar
      residentCount={0}
      teamCount={0}
      assignedResidents={0}
      timeOffCount={0}
      />
    <main className='main-content'>
      <TopNavBar onViewChange={setActiveView} currentView={activeView}/>
      {activeView === "input" && <InputView />}
      {activeView === "schedule" && <ScheduleView />}
      {activeView === "summary" && <SummaryView />}
    </main>
  </div>
  )
}
export default App

import { useState} from 'react'
import {Sidebar} from "./components/sidebar.tsx"
import { TopNavBar } from './components/navbar.tsx';
import { InputView } from './views/input.tsx';
import { SummaryView } from './views/residentSummary.tsx';
import { ScheduleView } from './views/schedule.tsx';
import './App.css'
import SchedulerContext from './context/schedulerContext.ts';
import useScheduler from './hooks/scheduler.ts';
// import useResident from './hooks/useResident.ts';

function App() {
  const [activeView, setActiveView] = useState("input")
  //<function>, <dependency> runs on residents change
  const schedulerState = useScheduler()
  return (
  <div className = 'page-shell'>
    <SchedulerContext value={schedulerState}>
      <Sidebar/>
      <main className='main-content'>
        <TopNavBar onViewChange={setActiveView} currentView={activeView}/>
        {activeView === "input" && <InputView/>} 
        {activeView === "schedule" && <ScheduleView />}
        {activeView === "summary" && <SummaryView />}
      </main>
    </SchedulerContext>
  </div>
  )
}
export default App

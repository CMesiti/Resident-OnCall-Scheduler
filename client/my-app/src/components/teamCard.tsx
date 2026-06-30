// Will contain list of resident chips
import { useContext } from "react"
import { ResidentChip } from "./residentChip.tsx"
import "./teamCard.css"
import SchedulerContext from "../context/schedulerContext.ts"

// interface TeamCardProps{
//     team_ls: Team[]
//     resident_ls: Resident[]
//     onRemTeam:(team:Team)=>void
//     onRemResident:(res:Resident) => void
//     onAddTeamMember:(teamName:string, res:Resident) => void
// }


//Mistake, this should be a single card and not a render of all teams (REFORMAT LATER!!!)
const TeamCard = () =>{
    //if the list is empty return empty paragraph
    //else load as a list of card components
    const scheduleContext = useContext(SchedulerContext)
    let resident_ls = scheduleContext?.residents
    let team_ls = scheduleContext?.teams
    if(team_ls?.length === 0){
        return<p className='card-list-empty'>No teams added yet</p>
    }
    return (
    <ul className='card-list'>
        {/* list Here goes the user chips */}
        {team_ls?.map((t, i) => 
        <li key={i} className='card' >
            <div  className="card-header">
                <span className='card-team'>{t.name}</span>
                <button 
                className="card-remove" 
                onClick={() => scheduleContext?.rem_Team(t)}
                aria-label={`Remove ${t.name}`}>
                    ✕
                </button>
            </div>
            <ResidentChip resident_ls={resident_ls?.filter(r => r.teamName===t.name)}/>
        </li>)}
    </ul>)
}


export {TeamCard}
// Will contain list of resident chips
import type {Team, Resident} from "../App.tsx"
import { ResidentChip } from "./residentChip.tsx"
import {useDroppable} from '@dnd-kit/react';

import "./teamCard.css"

interface TeamCardProps{
    team_ls: Team[]
    onRemTeam:(team:Team)=>void
    onRemResident:(res:Resident) => void
}



const TeamCard = ({team_ls, onRemResident, onRemTeam}:TeamCardProps) =>{
    //if the list is empty return empty paragraph
    //else load as a list of card components
    if(team_ls.length === 0){
        return<p className='card-list-empty'>No teams added yet</p>
    }
    return (
    <ul className='card-list'>
        {/* list Here goes the user chips */}
        {team_ls.map((t) => 
        <li className='card' >
            <div  className="card-header">
                <span className='card-team'>{t.name}</span>
                <button 
                className="card-remove" 
                onClick={() => onRemTeam(t)}
                aria-label={`Remove ${t.name}`}>
                    ✕
                </button>
            </div>
            <ResidentChip 
            resident_ls={t.residents} 
            onRemResident={onRemResident}/>
        </li>)}
    </ul>)
}


export {TeamCard}
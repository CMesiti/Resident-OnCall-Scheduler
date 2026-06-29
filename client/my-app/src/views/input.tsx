import {ResidentForm} from "../components/residentForm.tsx"
import { TeamForm } from "../components/teamForm.tsx";
import { ResidentChip } from "../components/residentChip.tsx";
import { TeamCard } from "../components/teamCard.tsx";
import type {Resident, Team} from "../App.tsx"

import "./input.css"

interface InputViewProps{
    onAddResident: (res:Resident) => void
    onRemResident: (res:Resident) => void
    onAddTeamMember:(teamName:string, res:Resident) => void
    onAddTeam:(team:Team) => void
    onRemTeam:(team:Team) => void
    onToggleWeekend: (res: Resident, weekend: number) => void;
    resident_ls:Resident[]
    team_ls:Team[]
}



export function InputView({resident_ls, team_ls, onAddResident, onAddTeam, onRemResident, onRemTeam, onAddTeamMember, onToggleWeekend}:InputViewProps){
    return (
    <div className="input-container">
        <section className="form-container">
            <ResidentForm onResidentSubmit={onAddResident}/>
            <TeamForm onTeamSubmit={onAddTeam}/>
            <div className="pool-container">
                <div id='resident-pool'>
                    <ResidentChip 
                    team_ls={team_ls} 
                    resident_ls={resident_ls} 
                    onRemResident={onRemResident} 
                    onAddTeamMember={onAddTeamMember}
                    onToggleWeekend={onToggleWeekend}/>
                </div>
            </div>
            <div className="pool-container">
                <div id="team-pool">
                    <TeamCard 
                    onAddTeamMember={onAddTeamMember}
                    onRemTeam={onRemTeam} 
                    team_ls={team_ls} 
                    resident_ls={resident_ls}
                    onRemResident={onRemResident}/>
                </div>
            </div>
        </section>
    </div>)
}
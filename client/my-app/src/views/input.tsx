import {ResidentForm} from "../components/residentForm.tsx"
import { TeamForm } from "../components/teamForm.tsx";
import type {Resident} from "../App.tsx"
import "./input.css"

interface InputViewProps{
    onAddResident: (res:Resident) => void
    onAddTeam:(name:string) => void
}
export function InputView({onAddResident, onAddTeam}:InputViewProps){
    return (
    <div className="input-container">
        <section className="form-container">
            <ResidentForm onResidentSubmit={onAddResident}/>
            <TeamForm onTeamSubmit={onAddTeam}/>
        </section>
    </div>)
}
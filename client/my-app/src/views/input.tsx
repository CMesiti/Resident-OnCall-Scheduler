import {ResidentForm} from "../components/residentForm.tsx"
import { TeamForm } from "../components/teamForm.tsx";
import { ResidentChip } from "../components/residentChip.tsx";
import { TeamCard } from "../components/teamCard.tsx";
import "./input.css"
import { useContext } from "react";
import SchedulerContext from "../context/schedulerContext.ts";

// interface InputViewProps{
//     onToggleWeekend: (res: Resident, weekend: number) => void;
//     resident_ls:Resident[]
//     onAddResident: (res:Resident) => void
//     onRemResident: (res:Resident) => void
//     onAddTeamMember:(teamName:string, res:Resident) => void
//     onAddTeam:(team:Team) => void
//     onRemTeam:(team:Team) => void
//     team_ls:Team[]
// }
export function InputView(){
    const scheduleContext=useContext(SchedulerContext)
    let residents = scheduleContext?.residents
    return (
    <div className="input-container">
        <section className="form-container">
            <ResidentForm />
            <TeamForm />
            <div className="pool-container">
                <div id='resident-pool'>
                    <ResidentChip resident_ls={residents} />
                </div>
            </div>
            <div className="pool-container">
                <div id="team-pool">
                    <TeamCard />
                </div>
            </div>
        </section>
    </div>)
}
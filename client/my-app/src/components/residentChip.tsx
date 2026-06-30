import "./residentChip.css"
import type { Resident } from "../types/inputTypes";
import type React from "react";
import { WeekendSelect } from "./weekendSelect";
import { useContext } from "react";
import SchedulerContext from "../context/schedulerContext";
interface ResidentChipProps {
    resident_ls?: Resident[];
}
const roleBadgeClass: Record<string, string> = {
    senior:   "badge-senior",
    research: "badge-research",
    mid:      "badge-mid",
    junior:   "badge-junior",
}
//Same mistake here as team card, this should be a single chip and not a render of the whole list. (REFORMAT LATER!!!)
const ResidentChip = ({resident_ls}:ResidentChipProps) => {
    const schedulerContext = useContext(SchedulerContext)
    let team_ls = schedulerContext?.teams
    if (resident_ls?.length === 0) {
        return <p className="chip-empty">No residents added yet.</p>
    }
    function handleTeamSelect(r:Resident, e:React.ChangeEvent<HTMLSelectElement>){
        //Here I need an add resident to team set function, updating the state of the team_ls.residents list.
        let teamName = e.target.value
        schedulerContext?.add_Team_Resident(teamName, r)
    }
    return (
        <ul className="chip-list">
            {resident_ls?.map((r, i) =>
                <li key={i} className="chip">
                        <span className={`chip-badge ${roleBadgeClass[r.role] ?? ""}`}>
                            {r.role}
                        </span>
                        <span className="chip-name">{r.name}</span>
                        <WeekendSelect
                        resident={r}/>
                        <select 
                        value={r.teamName ?? ''} 
                        onChange={(e) => handleTeamSelect(r, e)}
                        className="chip-team-select">
                            <option value=''>No Team</option>
                            {team_ls?.map(t => 
                                <option key={t.name} value={t.name}>{t.name}</option>
                            )}
                        </select>
                        <button
                            className="chip-remove"
                            onClick={() => schedulerContext?.rem_Resident(r)}
                            aria-label={`Remove ${r.name}`}
                        >
                            ✕
                        </button>
                </li>
            )}
        </ul>
    )
}

export {ResidentChip}
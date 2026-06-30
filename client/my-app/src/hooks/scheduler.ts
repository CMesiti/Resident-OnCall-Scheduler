import {useState} from 'react'
import type { Resident, Team } from '../types/inputTypes';
import create_Schedule from '../API/createSchedule';
const useScheduler=()=>{
    const [teams, setTeams] = useState<Team[]>([]);
    const [residents, setResidents] = useState<Resident[]>([]);
    const [schedule, setSchedule] = useState({})
    
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
    async function generate_Schedule(){
        const payload = {
        residents: residents.map(r => ({
            name: r.name,
            role: r.role,
            team: r.teamName ?? "",
            time_off: [...r.timeOff]})),
        weekends: [0, 1, 2, 3]}
        console.log("Sending Request to API...", payload)
        const response = await create_Schedule(payload)
        setSchedule(response)
    }
    return {schedule, residents, teams, 
        generate_Schedule, 
        get_TimeOff_Sum, 
        toggle_Time_Off, 
        add_Resident, add_Team, 
        add_Team_Resident, 
        rem_Resident,
        rem_Team}
    
}

export default useScheduler
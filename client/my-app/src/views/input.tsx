import {ResidentForm} from "../components/residentForm.tsx"
import { TeamForm } from "../components/teamForm.tsx";
import {useState, useEffect} from "react"
import type {Role} from "../App.tsx"
import "./input.css"
export interface Resident{
  name:string;
  role:Role;
}
export interface TimeOff{
  resident:string;
  week:number;
}
export function InputView(){
    const [teams, setTeams] = useState<string[]>([]);
    const [timeOff, setTimeOff] = useState <TimeOff[]>([]);
    const [residents, setResidents] = useState<Resident[]>([]);
    //<function>, <dependency> runs on residents change
    function add_Resident(res:Resident){
        setResidents(prev=>[...prev, res])
    }
    // will be assigned through team form entering team name
    function add_Team(team:string){
        setTeams(prev => [...prev, team]);
        console.log(teams)
    }

    // Will be Assigned through drag/drop on weekend cards
    function add_Timeoff(timeOff:TimeOff){
        // complex logic, attribute of resident for a specific week list[[res, week#]]
        setTimeOff(prev => [...prev, timeOff]);
        console.log(timeOff)
    }

    useEffect(() =>{
        console.log("Residents :", residents)
    }, [residents])
    return (
    <div className="input-container">
        <section className="form-container">
            <ResidentForm onResidentSubmit={add_Resident}/>
            <TeamForm onTeamSubmit={add_Team}/>
        </section>
    </div>)
}
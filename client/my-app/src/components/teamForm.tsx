import {useState} from "react"
import "./forms.css"
import type { Team } from "../App";
interface TeamFormProps{
    onTeamSubmit: (team:Team) => void;
};

const TeamForm = ({onTeamSubmit}:TeamFormProps) => {
    //variables to handle inputs
    let [teamName, setTeamName] = useState<string>("")

    //submit event handler.
    function handleSubmit(e:React.SubmitEvent<HTMLFormElement>){
        e.preventDefault();
        console.log(teamName)
        let isEmpty = teamName === "";
        !isEmpty && onTeamSubmit({name:teamName})
        setTeamName("")
    }
    return (    
    <div className='form-card'>
        <p className='form-title'>Add Team</p>
        <form onSubmit={handleSubmit}>
            <div className='field'>
                <label>Enter Resident: </label>
                <input 
                    name="team-name" 
                    value={teamName} 
                    placeholder="Team1" 
                    onChange={(e)=>setTeamName(e.currentTarget.value)}/>
            </div>
            <button type="submit">Add Team</button>
        </form>
    </div>)
}

export {TeamForm}
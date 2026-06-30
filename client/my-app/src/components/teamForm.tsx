import {useState} from "react"
import "./forms.css"
import { useContext } from "react"
import SchedulerContext from "../context/schedulerContext"
// interface TeamFormProps{
//     onTeamSubmit: (team:Team) => void;
// };

const TeamForm = () => {
    //variables to handle inputs
    let [teamName, setTeamName] = useState<string>("")
    const schedulerContext = useContext(SchedulerContext)

    //submit event handler.
    function handleSubmit(e:React.SubmitEvent<HTMLFormElement>){
        e.preventDefault();
        console.log(teamName)
        let isEmpty = teamName === "";
        !isEmpty && schedulerContext?.add_Team({name:teamName})
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
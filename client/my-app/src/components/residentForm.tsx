import type {Role, Resident} from "../App.tsx"
import {useState} from "react"
import "./forms.css"
interface ResidentFormProps{
    onResidentSubmit: (res:Resident) => void;
};
//Controlled component
const ResidentForm = ({onResidentSubmit}:ResidentFormProps) => {
    //variables to handle inputs
    let [resName, setResName] = useState<string>("")
    let [resRole, setResRole] = useState<Role>("senior")
    //submit event handler.
    function handleSubmit(e:React.SubmitEvent<HTMLFormElement>){
        e.preventDefault();
        console.log(resName, resRole)
        let isEmpty = resName === "";
        !isEmpty && onResidentSubmit({
            name:resName,
            role:resRole,
            timeOff:new Set()
        })
        setResName("")
    }
    return (    
    <div className='form-card'>
        <p className='form-title'>Add Resident</p>
        <form onSubmit={handleSubmit}>
            <div className='field'>            
                <label>Enter Resident: </label>
                <input 
                    name="resident-name" 
                    value={resName} 
                    placeholder="Jack" 
                    onChange={(e)=>setResName(e.currentTarget.value)}/>
            </div>
            <div className='field'> 
                <label>Select Role: </label>
                <select 
                name="resident-role"
                onChange={(e)=>setResRole(e.currentTarget.value as Role)}>
                    <option value ={"senior" as Role}>Senior</option>
                    <option value ={"research" as Role}>Research</option>
                    <option value ={"mid" as Role}>Mid</option>
                    <option value ={"junior" as Role}>Junior</option>
                </select>
            </div>
            <button type="submit">Add Resident</button>
        </form>
    </div>)
}

export {ResidentForm}
import "./sidebar.css"
import SchedulerContext from "../context/schedulerContext";
import { useContext } from "react";
// interface SidebarProps {
//     residentCount: number;
//     teamCount: number;
//     timeOffCount: number;
//     assignedResidents: number;
// }

const Sidebar = () => {
    const scheduleContext = useContext(SchedulerContext)
    let assignedResidents = scheduleContext?.residents.length
    let residentCount = scheduleContext?.residents.length
    let teamCount = scheduleContext?.teams.length
    let timeOffCount = scheduleContext?.get_TimeOff_Sum()
    let generate_Schedule = scheduleContext?.generate_Schedule
    function download_Json(){
    }
    function upload_Json(e:React.ChangeEvent<HTMLInputElement>){
        const file = e.target.files?.[0] //file metadata
        if(!file) return;

        const reader = new FileReader();
        reader.onload = (e)=>{ //essentially a callback when the read function is done.
            try{
                const data = JSON.parse(e.target?.result as string);
                //set data here.
                
            }catch{
                alert("invalid Json file")
            }
        } //async function to read file in background, run func after read triggers new event
        reader.readAsText(file)

    }
    return (
        <div className="sidebar">
            <button className='run-btn' onClick={generate_Schedule}>Run Constrain-Scheduler</button>
            <div>
                <p className='summary-label'>Overview</p>
                <section className='summary'>
                    <div>Assigned Residents:<strong>{assignedResidents}</strong></div>
                    <div>Residents <strong>{residentCount}</strong></div>
                    <div>Teams <strong>{teamCount}</strong></div>
                    <div>Time Off <strong>{timeOffCount}</strong></div>
                </section>
            <input type='file' accept='.json' onChange={()=>upload_Json}/>
            <button>Download Json</button>
            </div>
        </div>
    )
}
export {Sidebar}
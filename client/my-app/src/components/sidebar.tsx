import "./sidebar.css"
interface SidebarProps {
    residentCount: number;
    teamCount: number;
    timeOffCount: number;
    assignedResidents: number;
    onCreateSchedule: () => void;
}

const Sidebar = (
    {assignedResidents, 
    residentCount, 
    teamCount, 
    timeOffCount,
    onCreateSchedule}:SidebarProps) => {

    return (
        <div className="sidebar">
            <button className='run-btn' onClick={onCreateSchedule}>Run Constrain-Scheduler</button>
            <div>
                <p className='summary-label'>Overview</p>
                <section className='summary'>
                    <div>Assigned Residents:<strong>{assignedResidents}</strong></div>
                    <div>Residents <strong>{residentCount}</strong></div>
                    <div>Teams <strong>{teamCount}</strong></div>
                    <div>Time Off <strong>{timeOffCount}</strong></div>
                </section>
            </div>
        </div>
    )
}
export {Sidebar}
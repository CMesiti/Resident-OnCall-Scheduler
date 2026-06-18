
interface SidebarProps {
    residentCount: number;
    teamCount: number;
    timeOffCount: number;
    assignedResidents: number;
}

const Sidebar = (
    {assignedResidents, 
    residentCount, 
    teamCount, 
    timeOffCount}:SidebarProps) => {
    return (
        <div className="sidebar">
            <button>Run Constrain-Scheduler</button>
            <section className='summary'>
                <div>Assigned Residents:{assignedResidents}</div>
                <div>Residents {residentCount}</div>
                <div>Teams {teamCount}</div>
                <div>Time Off {timeOffCount}</div>
            </section>
        </div>
    )
}
export {Sidebar}
import "./navbar.css"

interface NavProps {
    onViewChange: (view: string) => void
    currentView:string
}
const TopNavBar = ({onViewChange, currentView}:NavProps) =>{
    return (
    <div className="top-nav">
        <button className={currentView === "input" ? "active" : ""} onClick={() => onViewChange("input")}>
        Input
        </button>

        <button className={currentView === "schedule" ? "active" : ""} onClick={() => onViewChange("schedule")}>
        Schedule
        </button>

        <button className={currentView === "summary" ? "active" : ""} onClick={() => onViewChange("summary")}>
        Summary
        </button>

        <button className={currentView === "tables" ? "active" : ""} onClick={() => onViewChange("tables")}>
        Tables
        </button>
    </div>)
}

export {TopNavBar}
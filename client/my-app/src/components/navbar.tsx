import {useState} from "react"

interface NavProps {
    onViewChange: (view: string) => void
}
const TopNavBar = ({onViewChange}:NavProps) =>{
    return (
    <div className="top-nav">
        <button onClick={() => onViewChange("input")}>
        Input
        </button>

        <button onClick={() => onViewChange("schedule")}>
        Schedule
        </button>

        <button onClick={() => onViewChange("summary")}>
        Summary
        </button>

        <button onClick={() => onViewChange("tables")}>
        Tables
        </button>
    </div>)
}

export {TopNavBar}
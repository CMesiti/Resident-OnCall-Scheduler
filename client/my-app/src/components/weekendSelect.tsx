import "./weekendSelect.css"
import type { Resident } from "../types/inputTypes"
import { useContext } from "react"
import SchedulerContext from "../context/schedulerContext"

const WEEKENDS = [1, 2, 3, 4, 5] as const
type Weekend = typeof WEEKENDS[number]

interface WeekendSelectProps {
    resident: Resident
}

const WeekendSelect = ({resident}:WeekendSelectProps) => {
    const selected = resident.timeOff ?? new Set<number>()
    const schedulerContext = useContext(SchedulerContext)

    return (
        <div className="weekend-select">
            <div className='weekend-btns'>
            {WEEKENDS.map(w =>
                <button
                    key={w}
                    type="button"
                    className={`weekend-btn ${selected.has(w) ? "weekend-btn--active" : ""}`}
                    onClick={() => schedulerContext?.toggle_Time_Off(resident, w)}
                    aria-pressed={selected.has(w)}
                    aria-label={`Weekend ${w}`}
                >
                    {w}
                </button>
            )}
            </div>
        </div>
    )
}
export { WeekendSelect }
export type { Weekend }

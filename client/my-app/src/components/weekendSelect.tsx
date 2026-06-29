import "./weekendSelect.css"
import type { Resident } from "../App.tsx"

const WEEKENDS = [1, 2, 3, 4, 5] as const
type Weekend = typeof WEEKENDS[number]

interface WeekendSelectProps {
    resident: Resident
    onWeekendToggle: (resident: Resident, weekend: Weekend) => void
}

const WeekendSelect = ({ resident, onWeekendToggle }: WeekendSelectProps) => {
    const selected = resident.timeOff ?? new Set<number>()

    return (
        <div className="weekend-select">
            <div className='weekend-btns'>
            {WEEKENDS.map(w =>
                <button
                    key={w}
                    type="button"
                    className={`weekend-btn ${selected.has(w) ? "weekend-btn--active" : ""}`}
                    onClick={() => onWeekendToggle(resident, w)}
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

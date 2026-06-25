import "./residentChip.css"
import type { Resident } from "../App";
import { useDraggable, DragDropProvider} from "@dnd-kit/react";


interface ResidentChipProps {
    resident_ls: Resident[];
    onRemResident: (r: Resident) => void;
}

const roleBadgeClass: Record<string, string> = {
    senior:   "badge-senior",
    research: "badge-research",
    mid:      "badge-mid",
    junior:   "badge-junior",
}
 


const ResidentChip = ({ resident_ls, onRemResident }: ResidentChipProps) => {
    if (resident_ls.length === 0) {
        return <p className="chip-empty">No residents added yet.</p>
    }
    return (
        <ul className="chip-list">
            {resident_ls.map((r, i) =>
                <li key={i} className="chip">
                    <DragDropProvider>
                        <span className={`chip-badge ${roleBadgeClass[r.role] ?? ""}`}>
                            {r.role}
                        </span>
                        <span className="chip-name">{r.name}</span>
                        <button
                            className="chip-remove"
                            onClick={() => onRemResident(r)}
                            aria-label={`Remove ${r.name}`}
                        >
                            ✕
                        </button>
                    </DragDropProvider>
                </li>
            )}
        </ul>
    )
}

export {ResidentChip}
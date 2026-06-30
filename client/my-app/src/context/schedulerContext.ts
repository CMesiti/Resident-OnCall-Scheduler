import {createContext} from 'react'
import useScheduler from '../hooks/scheduler'
   //assigned through resident form entering name, role
type contextType = ReturnType<typeof useScheduler>
const SchedulerContext = createContext<contextType | null>(null)
export default SchedulerContext
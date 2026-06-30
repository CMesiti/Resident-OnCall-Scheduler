export interface Resident{
name:string;
role:Role;
teamName?:string
timeOff:Set<number>
}
export interface Team{
name:string;
}

export type Role = 'senior'|'research'|'mid'|'junior';
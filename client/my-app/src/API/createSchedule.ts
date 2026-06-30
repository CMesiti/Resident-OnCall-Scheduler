
async function create_Schedule(payload:any){
    let schedule = {}
    const res = await fetch("http://localhost:8000/scheduler", {
    method: 'POST',
    headers: {"Content-Type": "application/json", "Accept": "application/json"},
    body: JSON.stringify(payload)
    })
    if(res.ok){
        console.log("Successfully retrieved data...")
        schedule = await res.json()
        console.log("data: ", schedule)
    }else{
        throw new Error("Failed to fetch data");
    }
    return schedule
}

export default create_Schedule
    
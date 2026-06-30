from fastapi import FastAPI
from enum import Enum
from scheduler.constraint_scheduler import cp_resident_scheduler, unpack_input
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Role(str, Enum):
    Senior = "senior"
    Research = "research"
    Mid = "mid"
    Junior = "junior"

class Resident(BaseModel):
    name: str
    role: Role
    team: str = ""
    time_off: list[int]

class InputModel(BaseModel):
    residents: list[Resident]
    weekends: list[int]

@app.get("/")
def landing():
    return "API is Running"


@app.post("/scheduler/")
def create_schedule(input: InputModel):
    print(input.residents)
    schedule_package = {}
    feedback = ""
    try:
        schedule_data = unpack_input(input)
        print(schedule_data)
        schedule_package, feedback = cp_resident_scheduler(**schedule_data)
    except Exception as e:
        print("ERROR Processing Data: ", e)
        feedback = f"ERROR Processing Data: {e}"
    return  {"schedule": schedule_package, "feedback": feedback}


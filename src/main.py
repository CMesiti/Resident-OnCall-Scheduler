import json
from scheduler.cp_scheduler import cp_resident_scheduler
def main():
    print("Hello from src!")
    data = {}
    try:
        with open("scheduler/mock_data.json",'r') as file:
            data = json.load(file)
        time_off = data['time_off']
        data['time_off'] = set(tuple(x) for x in time_off)
        schedule = cp_resident_scheduler(**data)

    except FileNotFoundError:
        print("FILE NOT FOUND!")

if __name__ == "__main__":
    main()

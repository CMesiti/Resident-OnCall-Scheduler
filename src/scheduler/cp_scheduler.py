from ortools.sat.python import cp_model

def cp_resident_scheduler(residents, teams, weekends, calls, time_off, roles, seniors):
  model = cp_model.CpModel()
  # 1 set is our 4 week period
  # -----------------------------
  # Variables
  # -----------------------------
  x = {}
  for r in residents:
      for w in weekends:
          for c in calls:
              x[(r,w,c)] = model.new_bool_var(f"x_{r}_{w}_{c}")
  # -----------------------------
  # Constraints
  # -----------------------------
  # 1. call composition
  for w in weekends:
    for c in calls:
      senior_count = sum(x[(r,w,c)] for r in residents if roles[r]=='senior') #how many seniors on call
      mid_count = sum(x[(r,w,c)] for r in residents if roles[r]=='mid')
      junior_count = sum(x[(r,w,c)] for r in residents if roles[r]=='junior')
      total_count = sum(x[(r,w,c)] for r in residents) # how many residents in total

      # Add the constraints, relaxed composition constraints to allow for manual adjustments.
      model.add(senior_count==1) #Hard constraint on seniors only 1 per call
      model.add(mid_count >=1)
      model.add(mid_count <=2)
      model.add(total_count >= 5)
      model.add(total_count <= 7)
      model.add(junior_count >= 2)
      model.add(junior_count <= 4)
      model.add(junior_count + mid_count >= 4)
      model.add(junior_count + mid_count <= 6)

  # 2. Workload constraints
  for r in residents:
      total = sum(x[(r,w,c)] for w in weekends for c in calls)

      if roles[r] == "senior":
        model.add(total <= 1)
      elif roles[r] == 'research':
        model.add(total == 1)
      else:
        # model.Add(total >= 1)
        model.add(total == 2) #enforce mid/junior works 2 calls/set

  # 3. No double-call weekends
  for r in residents:
      for w in weekends:
          model.add(x[(r,w,"A")] + x[(r,w,"B")] <= 1)

  # 4. Time off
  for (r,w) in time_off:
      for c in calls:
          model.add(x[(r,w,c)] == 0)

  # 5. Teams and Rounding
  # rounding variables
  team_seniors = {}
  for team, members in teams.items():
      for r in members:
          if roles[r] == "senior":
              team_seniors[team] = r
              break

  # Choose if the senior rounds the week
  y = {}
  for s in seniors:
      for w in weekends:
          y[(s,w)] = model.new_bool_var(f"round_{s}_{w}")
          if (s,w) in time_off:
            model.add(y[(s,w)] == 0) #senior cannot round when they are off.

  # senior cannot both work and round
  for s in seniors:
      for w in weekends:
          model.add(
              sum(x[(s,w,c)] for c in calls) + y[(s,w)] <= 1
          )

  # limit rounding frequency
  for s in seniors:
      model.add(sum(y[(s,w)] for w in weekends) <= 1)


  # team coverage
  for w in weekends:
      for team, members in teams.items():
          team_has_call = sum(
              x[(r,w,c)]
              for r in members
              for c in calls
          )
          senior_cover = sum(
              y[(s,w)]
              for s in seniors
              if s in members
          )
          model.add(team_has_call + senior_cover >= 1)

  # -----------------------------
  # Solve/Output
  # -----------------------------
  solver = cp_model.CpSolver()
  solver.parameters.linearization_level = 0
  # Enumerate all solutions.
  # solver.parameters.enumerate_all_solutions = True
  solver.parameters.max_time_in_seconds = 45
  result = solver.Solve(model)
  if result == cp_model.FEASIBLE:
    print("Found a solution")
  elif result == cp_model.OPTIMAL:
    print("Optimal solution")
  elif result == cp_model.INFEASIBLE:
    print("No solution exists")
  else:
    print("Unknown (might exist, not found yet)")

  schedule = {}
  if result == cp_model.OPTIMAL or result == cp_model.FEASIBLE:
    for w in weekends:
      print(f"\nWeekend {w+1}")
      schedule[w+1] = {}
      for c in calls:
        assigned = [r for r in residents if solver.Value(x[(r,w,c)]) == 1]
        schedule[w+1][c] = assigned
        print(f"  Call {c}: {assigned}")
      rounding = [s for s in seniors if solver.Value(y[(s,w)]) == 1]
      schedule[w+1]['rounding'] = rounding
      print(f"Rounding: {rounding}")

  """{"1":{
          "callA":[assigned],
          "callB:[assigned]",
          "rounding":[rounding]},
      "2":{...}
      }"""
  return schedule


# schedule = cp_resident_scheduler(residents=residents,
#                                        teams=teams,
#                                        weekends=weekends, 
#                                        calls=calls, 
#                                        time_off=time_off, 
#                                        roles=roles,
#                                        seniors=seniors)
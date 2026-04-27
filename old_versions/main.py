# # import json
# # from scheduler.cp_scheduler import cp_resident_scheduler
# # import streamlit as st

# def main():
#     print("app running...")
#     data = {}
#     if 'schedule' not in st.session_state:
#         try:
#             with open("scheduler/mock_data.json",'r') as file:
#                 data = json.load(file)
#             time_off = data['time_off']
#             data['time_off'] = set(tuple(x) for x in time_off)
#             schedule = cp_resident_scheduler(**data)
#             st.session_state['schedule'] = schedule
#         except FileNotFoundError:
#             print("FILE NOT FOUND!")
#     schedule = st.session_state['schedule']
#     st.title("Resident Scheduling")
#     col1, col2 = st.columns(2) #input col and output col


#     with col1:
#         #Prompt for input data
#         if 'residents' not in st.session_state:
#             st.session_state['residents'] = {
#                 'seniors':[],
#                 'mid_levels':[],
#                 'juniors':[]
#             }

        
#         st.write("Enter Residents: ")
#         # ---Seniors---
#         st.text_input(label="Enter a Senior: ", 
#                                placeholder="Sein", 
#                                key='senior')
#         st.button(label="Add Senior",
#                    on_click=append_and_clear,
#                    args=['senior', 'seniors'])
#         # ---Mid-Levels---
#         st.text_input(label="Enter a Mid-Level: ", 
#                         placeholder="Mark", 
#                         key='mid')
#         st.button(label="Add Mid-Level",
#                    on_click=append_and_clear,
#                    args=['mid', 'mid_levels'])
#         # ---Juniors---
#         st.text_input(label="Enter a Juniors: ", 
#                         placeholder="Jim", 
#                         key='junior')
#         st.button(label="Add Junior",
#                    on_click=append_and_clear,
#                    args=['junior', 'juniors'])
        

#         st.write("Residents: ", st.session_state['residents'])



#     with col2:
#         st.write(schedule)

# def append_and_clear(input_key, output_key):
#     resident = st.session_state[input_key]
#     st.session_state['residents'][output_key].append(resident)
#     st.session_state[input_key] = ""  


# if __name__ == "__main__":
#     main()

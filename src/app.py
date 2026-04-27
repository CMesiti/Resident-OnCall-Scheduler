import streamlit as st
import pandas as pd
from collections import defaultdict
from scheduler.cp_scheduler import cp_resident_scheduler
import json
import copy
# ─── Page Config ─────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Call Schedule",
    page_icon="🔵",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ─── CSS ─────────────────────────────────────────────────────────────────────
def load_css(path):
    with open(path) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)
load_css("styles.css")

# ─── Input Data ───────────────────────────────────────────────────────────────

DEFAULT_DATA = {
    "residents": ["S1: Mesiti","S2: Applegarth","S4: Nageeb","S5: LeMarbe","S6: Sobolic","S7: Baida","S8: Waleizer","S9: Haj Assad","S10: Robbe","S11: Aung","S12: Teitlebaum","M13: Dowding","M14: Hurst","M15: Kowalczyk","M17: Najor","M18: Butler","M19: Davis","J21: Hunyadi","J22: Getzinger","J23: Faraj","J27: Gibbons","J28: Sancraint","J30: Sturtevant","J32: Vadnala","J33: Wolf","J34: Morrison","J35: Rotator 1","J36: Rotator 2","J37: Rotator 3","J38: Rotator 4"],
    "roles": {"S1: Mesiti":"senior","S2: Applegarth":"senior","S4: Nageeb":"senior","S5: LeMarbe":"senior","S6: Sobolic":"senior","S7: Baida":"senior","S8: Waleizer":"senior","S9: Haj Assad":"senior","S10: Robbe":"senior","S11: Aung":"senior","S12: Teitlebaum":"senior","M13: Dowding":"mid","M14: Hurst":"research","M15: Kowalczyk":"mid","M17: Najor":"mid","M18: Butler":"mid","M19: Davis":"research","J21: Hunyadi":"junior","J22: Getzinger":"junior","J23: Faraj":"junior","J27: Gibbons":"junior","J28: Sancraint":"junior","J30: Sturtevant":"junior","J32: Vadnala":"junior","J33: Wolf":"junior","J34: Morrison":"junior","J35: Rotator 1":"junior","J36: Rotator 2":"junior","J37: Rotator 3":"junior","J38: Rotator 4":"junior"},
    "teams": {"Red":["S4: Nageeb","J22: Getzinger","J32: Vadnala"],"Aqua":["M17: Najor","M18: Butler"],"Vascular":["S10: Robbe","J37: Rotator 3"],"Yellow":["S5: LeMarbe","J34: Morrison"],"Orange":["S7: Baida","J23: Faraj"],"Pink":["S1: Mesiti","J27: Gibbons"],"Gold":["S8: Waleizer","M15: Kowalczyk","J35: Rotator 1"],"Thoracic":["S2: Applegarth","J28: Sancraint","J36: Rotator 2"],"Purple":["S9: Haj Assad","J21: Hunyadi"],"Peds":["M13: Dowding","J30: Sturtevant"]},
    "time_off": [["S2: Applegarth",0],["S1: Mesiti",1],["J34: Morrison",0],["J27: Gibbons",0],["M14: Hurst",2],["J22: Getzinger",2],["S2: Applegarth",1],["S12: Teitlebaum",0],["S6: Sobolic",1]],
    "seniors": ["S1: Mesiti","S2: Applegarth","S4: Nageeb","S5: LeMarbe","S6: Sobolic","S7: Baida","S8: Waleizer","S9: Haj Assad","S10: Robbe","S11: Aung","S12: Teitlebaum"],
    "weekends":[0,1,2,3],
    "calls":["A", "B"],
}
# ─── Helpers ──────────────────────────────────────────────────────────────────
ROLE_CHIP = {"senior":"chip-senior","mid":"chip-mid","junior":"chip-junior","research":"chip-research"}
CALL_LABEL = {"A":"call-A","B":"call-B","rounding":"call-R"}
CALL_DISPLAY = {"A":"A-Call","B":"B-Call","rounding":"Rounding"}

def short(r):
    return r.split(": ",1)[1] if ": " in r else r

def role_of(r):
    return get_data()["roles"].get(r,"")

def team_of(r):
    for t, members in get_data()["teams"].items():
        if r in members:
            return t
    return "—"

def chip_html(r):
    role = role_of(r)
    cls = ROLE_CHIP.get(role,"chip-junior")
    return f'<span class="chip {cls}">{short(r)}</span>'

def ready_load_html():
    return """
        <div style="text-align:center; padding:4rem 2rem; color:#7a746e;">
        <div style="font-family:'Syne',sans-serif; font-size:3rem; font-weight:800; color:#cdc7ba; margin-bottom:0.5rem;">→</div>
        <div style="font-family:'Syne',sans-serif; font-size:1.3rem; font-weight:700; color:#1a1814; margin-bottom:0.4rem;">Ready to load schedule</div>
        <div style="font-family:'Syne Mono',monospace; font-size:0.75rem; letter-spacing:0.08em;">Click ▶ Run cp_scheduler in the sidebar</div>
        </div>
        """

def build_counts(schedule):
    """Count assignments per resident across all weekends and call types."""
    counts = defaultdict(lambda: {"A":0,"B":0,"rounding":0,"total":0})
    for wk_data in schedule.values():
        for call_type, residents in wk_data.items():
            for r in residents:
                counts[r][call_type] += 1
                counts[r]["total"] += 1
    return counts

def build_time_off_set():
    return {(r, wk) for r, wk in get_data()["time_off"]}

def get_data():
    return st.session_state['input_data']

# Input Helpers
def add_resident():
    res = st.session_state['resident_input'].strip()
    role = st.session_state['role_input']
    res_ls = get_data()['residents']
    prefix_map = {'senior':'S', 'mid':'M', 'research':'R', 'junior':'J'}
    full_res = prefix_map.get(role, 'J')+f"-{res}"
    if res and full_res not in res_ls:
        res_ls.append(full_res)
        get_data()['roles'][full_res] = role
        if role=='senior':
            get_data()['seniors'].append(full_res)
    st.session_state['schedule'] = None

def add_time_off():
    res = st.session_state['time_off_res']
    #map to our weekend indexes 0-4 (For Algorithm)
    w = int(st.session_state['time_off_w'].split('-')[1]) - 1 
    get_data()['time_off'].append([res,w])
    st.session_state['schedule'] = None

def add_team():
    team = st.session_state['team_input']
    teams = get_data()['teams']
    if team and team not in teams:
        get_data()['teams'][team] = []
    st.session_state['schedule'] = None

def assign_resident():
    team = st.session_state['assign_team']
    res = st.session_state['assign_res']
    teams = get_data()['teams']
    for t in teams:
        if res in teams[t]:
            teams[t].remove(res)
    get_data()['teams'][team].append(res)
    #remove res from any teams they are currently assigned.
    st.session_state['schedule'] = None

def remove_resident(r):
    res_ls = get_data()['residents']
    res_ls.remove(r)
    #remove this use from any teams.
    teams = get_data()['teams']
    for t in teams:
        teams[t].remove(r)
    st.session_state['schedule'] = None

def remove_exception(i):
    time_off_ls = get_data()['time_off']
    time_off_ls.pop(i)
    st.session_state['schedule'] = None

def remove_team(t):
    pass

def serialize_json():
    try:
        json_data = copy.deepcopy(get_data())
        json_data['time_off'] = [x for x in json_data['time_off']]
        json_data = json.dumps(json_data)
    except Exception as e:
        print('Input Error: ', e)
    return json_data

def on_upload():
    json_data = st.session_state['upload_data']
    if json_data:
        try:
            st.session_state['input_data'] = json.loads(json_data.getvalue())
            st.session_state['schedule'] = None
        except Exception as e:
            print('Upload_Error: ', e)
    

# ─── Session state ────────────────────────────────────────────────────────────
if "schedule" not in st.session_state:
    st.session_state.schedule = None
if 'input_data' not in st.session_state:
    st.session_state['input_data'] =  {
        "residents": [],
        "roles": {},
        "teams": {},
        "time_off": [],
        "seniors": [],
        "weekends":[0,1,2,3],
        "calls":["A", "B"],
        }

# ─── Sidebar ──────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("### 🔵 Call Schedule")
    st.markdown("---")
    if st.button("▶  Run cp_scheduler"):
        with st.spinner("Running scheduler…"):
            sched_copy = copy.deepcopy(get_data())
            sched_copy['time_off'] = build_time_off_set()
            st.session_state.schedule, feedback = cp_resident_scheduler(**sched_copy)
            st.write(feedback)


    if st.session_state.schedule:
        st.markdown("---")
        st.markdown("### Summary")
        sched = st.session_state.schedule
        counts = build_counts(sched)
        total_assignments = sum(v["total"] for v in counts.values())
        total_A = sum(v["A"] for v in counts.values())
        total_B = sum(v["B"] for v in counts.values())
        total_R = sum(v["rounding"] for v in counts.values())
        st.metric("Weekends", len(sched))
        st.metric("Total Assignments", total_assignments)
        st.metric("A-Call Slots", total_A)
        st.metric("B-Call Slots", total_B)
        st.metric("Rounding Slots", total_R)

        st.markdown("---")
        st.markdown("### Filters")
        role_filter = st.multiselect(
            "Show roles",
            ["senior","mid","junior","research"],
            default=["senior","mid","junior","research"],
            key="role_filter",
        )
    else:
        st.markdown('<div style="color:#8a8580;font-size:0.78rem;\
                    font-family:Syne Mono,monospace;margin-top:1rem;"\
                    >Click ▶ Run to load the schedule.</div>', 
                    unsafe_allow_html=True)

# ─── Main ─────────────────────────────────────────────────────────────────────

st.markdown('<div class="page-title">Call Schedule</div>', unsafe_allow_html=True)
st.markdown('<div class="page-sub">Surgical Residency · Weekend Coverage · 4 Weeks</div>', unsafe_allow_html=True)
tab_input, tab1, tab2, tab3 = st.tabs(["INPUT","WEEKEND VIEW", "RESIDENT SUMMARY", "FULL TABLE"])
# Manual Input/CSV Import

with tab_input:
    d = get_data()
    header_html = '<div style="font-family:Syne Mono,monospace;\
                    font-size:0.65rem;color:#7a746e;margin-bottom:0.3rem;'
    left, right = st.columns(2, gap="large")
    with left:
        #Header Style
        st.markdown("##### Residents")
        st.markdown(header_html, unsafe_allow_html=True)
        #Add Residents to the pool
        with st.expander("Add Resident", key='res_exp'):
            st.text_input(label="Resident",
                        placeholder="Mark", 
                        key='resident_input')
            st.selectbox(label='Level',
                         options=['junior', 'mid', 'research', 'senior'], 
                         key='role_input')
            st.button(label = "Add Resident", on_click=add_resident)
            #footnote
            st.markdown('<div style="font-family:Syne Mono,monospace;\
                        font-size:0.65rem;color:#7a746e;margin-top:0.3rem;"\
                        >Prefix auto-generated if omitted (e.g. J7: Smith)</div>', 
                        unsafe_allow_html=True)

        #Add time off for selected residents
        st.markdown("##### Time Off")
        st.markdown(header_html,unsafe_allow_html=True)
        with st.expander("Add Exceptions"):
            #select from resident pool
            st.selectbox(label = "Select a Resident",
                            options = d['residents'],
                            key='time_off_res')
            st.selectbox(label="Select a Weekend", 
                            options = [f"Weekend-{w+1}" for w in d['weekends']],
                            key='time_off_w')
            st.button(label="Add Exception", on_click=add_time_off)
            
        #team additions, add team then assign residents.
        #***not every resident must have a team.***
        st.markdown("---")
        st.markdown("##### Teams")
        st.markdown(header_html, unsafe_allow_html=True)
        with st.expander("Add Team"):
            st.text_input(label="Team Name",
                          placeholder="TeamA",
                          key='team_input')
            st.button(label='Add Team', on_click=add_team)

        st.markdown("##### Assign Residents")
        st.markdown(header_html, unsafe_allow_html=True)
        with st.expander("Assign Resident"):
            st.selectbox(label='Team', 
                        options=[team for team in d['teams'].keys()],
                        key='assign_team')
            st.selectbox(label='Resident', 
                        options=d['residents'],
                        key='assign_res')
            st.button(label="Assign Resident", on_click=assign_resident)

    with right:
        st.markdown("##### Resident Pool")
        st.markdown(f'<div style="font-family:Syne Mono,monospace;font-size:0.65rem;color:#7a746e;margin-bottom:0.8rem;"></div>', unsafe_allow_html=True)
        if d["residents"]:
            role_order = {"senior":0,"research":1,"mid":2,"junior":3}
            role_accent = {"senior":"#1a3a5c","mid":"#5c3a1a","junior":"#3a1a5c","research":"#1a5c2e"}
            sorted_res = sorted(d["residents"], key=lambda r: (role_order.get(d["roles"].get(r,"junior"),2), r))
            for r in sorted_res:
                role = d["roles"].get(r,"")
                chip_cls = ROLE_CHIP.get(role,"chip-junior")
                color = role_accent.get(role,"#3a1a5c")
                team = team_of(r)
                card_col, btn_col = st.columns([2,1])
                with card_col:
                    st.markdown(
                        f'<div style="background:var(--surface);border:1px solid var(--border);border-left:3px solid {color};'
                        f'border-radius:6px;padding:0.5rem 0.9rem;margin-bottom:0.3rem;display:flex;align-items:center;gap:8px;">'
                        f'<span class="chip {chip_cls}" style="font-size:0.65rem;">{role}</span>'
                        f'<span style="font-family:Syne,sans-serif;font-weight:700;font-size:0.85rem;color:#1a1814">{short(r)}</span>'
                        f'<span style="font-family:Syne Mono,monospace;font-size:0.65rem;color:#1a1814;margin-right:auto;">{team}</span>'
                        f'</div>',
                        unsafe_allow_html=True,
                    )
                with btn_col:
                    st.button("✕", key=f"del_res_{r}", on_click=remove_resident, args=(r,))
        
        st.markdown("---")
        st.markdown("##### Time Off")
        st.markdown(f'<div style="font-family:Syne Mono,monospace;font-size:0.65rem;color:#7a746e;margin-bottom:0.8rem;"></div>', unsafe_allow_html=True)

        # Time-off list — card style matching teams
        if d["time_off"]:
            for i, req in enumerate(d["time_off"]):
                res_role = d["roles"].get(req[0],"junior")
                color = role_accent.get(res_role,"#3a1a5c")
                card_col, btn_col = st.columns([2,1])
                with card_col:
                    st.markdown(
                        f'<div style="background:var(--surface);border:1px solid var(--border);border-left:3px solid {color};'
                        f'border-radius:6px;padding:0.5rem 0.9rem;margin-bottom:0.3rem;display:flex;align-items:center;gap:8px;">'
                        f'<span style="font-family:Syne,sans-serif;font-weight:700;font-size:0.85rem; color:#1a1814">{short(req[0])}</span>'
                        f'<span style="font-family:Syne Mono,monospace;font-size:0.65rem;color:#7a746e;margin-left:auto;">Weekend {req[1]+1}</span>'
                        f'</div>',
                        unsafe_allow_html=True,
                    )
                with btn_col:
                    st.button("✕", key=f"del_to_{i}", on_click=remove_exception, args=(i,))

        st.markdown("---")
        st.markdown("##### Teams")
        st.markdown(f'<div style="font-family:Syne Mono,monospace;font-size:0.65rem;color:#7a746e;margin-bottom:0.8rem;"></div>', unsafe_allow_html=True)
        # Team cards
        TEAM_COLORS_LIST = ["#1a3a5c","#8b2e0a","#1a5c2e","#5c3a1a","#3a1a5c","#5c1a3a","#1a4a5c","#4a5c1a","#5c4a1a","#1a5c4a"]
        for ti, (team_name, members) in enumerate(d["teams"].items()):
            color = TEAM_COLORS_LIST[ti % len(TEAM_COLORS_LIST)]
            chips_html = "".join(chip_html(r) for r in members) if members else '<span style="font-family:Syne Mono,monospace;font-size:0.68rem;color:#7a746e;">No members</span>'
            st.markdown(f"""
            <div style="background:var(--surface);border:1px solid var(--border);border-left:3px solid {color};
                 border-radius:6px;padding:0.7rem 0.9rem;margin-bottom:0.5rem;">
              <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:0.85rem;margin-bottom:0.4rem;color:#1a1814">{team_name}
                <span style="font-family:'Syne Mono',monospace;font-weight:400;font-size:0.65rem;color:#7a746e;margin-left:6px;">{len(members)} members</span>
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:3px;">{chips_html}</div>
            </div>
            """, unsafe_allow_html=True)


    st.markdown("---")
    if get_data()['residents']:
        st.download_button("Download Input Data", 
                        key='download_data',
                        data=serialize_json(), 
                        file_name='input_data.json')
    json_upload = st.file_uploader("Upload Your input_data.json",
                                   type='json',
                                   key='upload_data',
                                   on_change=on_upload)
    st.markdown("---")
    if not st.session_state.schedule:
        st.markdown("""
        <div style="text-align:center; padding:2rem 1rem; color:#7a746e;">
          <div style="font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:700;
                    color:#1a1814;margin-bottom:0.3rem;">Ready when you are</div>
          <div style="font-family:'Syne Mono',monospace;font-size:0.72rem;
                    letter-spacing:0.06em;">Click ▶ Run cp_scheduler in the sidebar to generate the schedule</div>
        </div>
        """, unsafe_allow_html=True)
    else:
        st.markdown('<div style="font-family:Syne Mono,monospace;\
                    font-size:0.72rem;color:#1a5c2e;text-align:center;padding:1rem;"\
                    >✓ Schedule generated — view results in the other tabs</div>',
                      unsafe_allow_html=True)

            
# Give option to export manual import as CSV for later.

#button not clicked yet
if not st.session_state.schedule:
    ready_html = ready_load_html()
    with tab1:
        st.markdown(ready_html, unsafe_allow_html=True)
    with tab2:
        st.markdown(ready_html, unsafe_allow_html=True)
    with tab3:
        st.markdown(ready_html, unsafe_allow_html=True)
    st.stop()

sched = st.session_state.schedule
counts = build_counts(sched)
role_filter = st.session_state.get("role_filter", ["senior","mid","junior","research"])
time_off_set = build_time_off_set()

# ══════════════════════════════════════════════════════════════════════════════
# TAB 1 — WEEKEND VIEW
# ══════════════════════════════════════════════════════════════════════════════
with tab1:
    wk_keys = list(sched.keys())
    cols = st.columns(len(wk_keys))

    for ci, wk_key in enumerate(wk_keys):
        wk_data = sched[wk_key]
        wk_num = wk_key.replace("weekend","")

        with cols[ci]:
            # Count total for this weekend
            n_total = sum(len(v) for v in wk_data.values())
            n_A = len(wk_data.get("A",[]))
            n_B = len(wk_data.get("B",[]))
            n_R = len(wk_data.get("rounding",[]))

            st.markdown(f'<div class="wk-header">Weekend {wk_num}</div>', unsafe_allow_html=True)
            st.markdown(f'<div class="wk-sub">{n_total} assignments · {n_A}A · {n_B}B · {n_R}R</div>', unsafe_allow_html=True)

            for call_type in ["A","B","rounding"]:
                members = wk_data.get(call_type, [])
                # Apply role filter
                members_filtered = [r for r in members if role_of(r) in role_filter]
                if not members_filtered and not members:
                    continue

                lbl_cls = CALL_LABEL[call_type]
                lbl_txt = CALL_DISPLAY[call_type]
                chips = "".join(chip_html(r) for r in members_filtered)

                # Flag time-off conflicts
                wk_idx = int(wk_num) - 1
                flagged = [r for r in members if (r, wk_idx) in time_off_set]
                flag_html = ""
                if flagged:
                    flag_html = f'<div style="font-family:Syne Mono,monospace;font-size:0.65rem;color:#b05c2a;margin-top:4px;">⚠ Time-off conflict: {", ".join(short(r) for r in flagged)}</div>'

                st.markdown(f"""
                <div class="call-block">
                  <span class="call-label {lbl_cls}">{lbl_txt}</span>
                  <div class="call-block-inner">{chips}</div>
                  {flag_html}
                </div>
                """, unsafe_allow_html=True)

# ══════════════════════════════════════════════════════════════════════════════
# TAB 2 — RESIDENT SUMMARY
# ══════════════════════════════════════════════════════════════════════════════
with tab2:
    st.markdown("##### Assignments Per Resident")

    max_calls = max((v["total"] for v in counts.values()), default=1)

    # Build rows filtered by role
    rows_data = []
    for r in get_data()["residents"]:
        role = role_of(r)
        if role not in role_filter:
            continue
        c = counts.get(r, {"A":0,"B":0,"rounding":0,"total":0})
        to_wks = [str(wk+1) for res, wk in get_data()["time_off"] if res == r]
        rows_data.append({
            "resident": r,
            "name": short(r),
            "role": role,
            "team": team_of(r),
            "A": c["A"],
            "B": c["B"],
            "R": c["rounding"],
            "total": c["total"],
            "time_off": ", ".join(to_wks) if to_wks else "—",
        })

    rows_data.sort(key=lambda x: -x["total"])

    # Render cards in two columns
    left_col, right_col = st.columns(2)
    for i, row in enumerate(rows_data):
        target = left_col if i % 2 == 0 else right_col
        with target:
            role_cls = ROLE_CHIP.get(row["role"],"chip-junior")
            bar_pct = int((row["total"] / max(max_calls,1)) * 100)
            bar_color = {"senior":"#1a3a5c","mid":"#8b5a1a","junior":"#5a1a8b","research":"#1a5c40"}.get(row["role"],"#888")

            a_wks = []
            b_wks = []
            r_wks = []
            for wk_key, wk_data in sched.items():
                wk_num = wk_key.replace("weekend","")
                if row["resident"] in wk_data.get("A",[]):    a_wks.append(f"WK{wk_num}")
                if row["resident"] in wk_data.get("B",[]):    b_wks.append(f"WK{wk_num}")
                if row["resident"] in wk_data.get("rounding",[]): r_wks.append(f"WK{wk_num}")

            a_str = ", ".join(a_wks) if a_wks else "—"
            b_str = ", ".join(b_wks) if b_wks else "—"
            r_str = ", ".join(r_wks) if r_wks else "—"

            st.markdown(f"""
            <div class="resident-card">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <h4>{row['name']}</h4>
                <span class="chip {role_cls}" style="font-size:0.65rem;">{row['role']}</span>
              </div>
              <div class="count-bar-wrap">
                <div style="font-family:'Syne Mono',monospace; font-size:0.65rem; color:#7a746e; margin-bottom:3px;">
                  {row['total']} assignment{'s' if row['total']!=1 else ''}
                </div>
                <div class="count-bar-bg">
                  <div class="count-bar-fill" style="width:{bar_pct}%; background:{bar_color};"></div>
                </div>
              </div>
              <div class="rc-row">
                <div><span style="color:#1a3a5c;">A</span> {a_str}</div>
                <div><span style="color:#8b2e0a;">B</span> {b_str}</div>
                <div><span style="color:#1a5c2e;">R</span> {r_str}</div>
                <div>Team: {row['team']}</div>
                <div>Time-off WK: {row['time_off']}</div>
              </div>
            </div>
            """, unsafe_allow_html=True)

# ══════════════════════════════════════════════════════════════════════════════
# TAB 3 — FULL TABLE
# ══════════════════════════════════════════════════════════════════════════════
with tab3:
    st.markdown("##### Full Assignment Table")

    flat_rows = []
    for wk_key, wk_data in sched.items():
        wk_num = int(wk_key.replace("weekend",""))
        for call_type in ["A","B","rounding"]:
            for r in wk_data.get(call_type, []):
                role = role_of(r)
                if role not in role_filter:
                    continue
                wk_idx = wk_num - 1
                conflict = "⚠" if (r, wk_idx) in time_off_set else ""
                flat_rows.append({
                    "Weekend": f"WK {wk_num}",
                    "Call": CALL_DISPLAY[call_type],
                    "Resident": short(r),
                    "Role": role.capitalize(),
                    "Team": team_of(r),
                    "Time-Off?": conflict,
                })

    df = pd.DataFrame(flat_rows)
    st.dataframe(df, width='stretch', hide_index=True)

    st.markdown("---")
    st.markdown("##### Call Count Summary")

    summary_rows = []
    for r in get_data()["residents"]:
        role = role_of(r)
        if role not in role_filter:
            continue
        c = counts.get(r, {"A":0,"B":0,"rounding":0,"total":0})
        summary_rows.append({
            "Resident": short(r),
            "Role": role.capitalize(),
            "Team": team_of(r),
            "A-Call": c["A"],
            "B-Call": c["B"],
            "Rounding": c["rounding"],
            "Total": c["total"],
        })
    summary_rows.sort(key=lambda x: -x["Total"])
    st.dataframe(pd.DataFrame(summary_rows), width='stretch', hide_index=True)

    st.markdown("---")
    csv = df.to_csv(index=False)
    st.download_button("⬇️ Download CSV", data=csv, file_name="call_schedule.csv", mime="text/csv")
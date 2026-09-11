import json
import zipfile
import xml.etree.ElementTree as ET

with zipfile.ZipFile('Attendance report/instructor-attendance-sheet_total_members.xlsx') as z:
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
            text = ''.join(t.text for t in si.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') if t.text)
            shared_strings.append(text)
    
    tree = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
    cols = ['E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
    
    student_stats = []
    total_p = 0
    total_a = 0
    total_l = 0

    for row in tree.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
        row_idx = row.get('r')
        if row_idx == '1': continue
        name = ''
        roll = ''
        p_cnt = 0
        a_cnt = 0
        l_cnt = 0
        for c in row.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
            ref = c.get('r')
            col_letter = ''.join(ch for ch in ref if ch.isalpha())
            t = c.get('t')
            v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
            val = v.text if v is not None else ''
            if t == 's' and val.isdigit():
                val = shared_strings[int(val)]
            if col_letter == 'B': name = val
            if col_letter == 'C': roll = val
            if col_letter in cols:
                if val == 'P': p_cnt += 1; total_p += 1
                elif val == 'A': a_cnt += 1; total_a += 1
                elif val == 'L': l_cnt += 1; total_l += 1
        
        total_sessions = p_cnt + a_cnt + l_cnt
        # Attendance % = (P + 0.5*L) / total * 100
        pct = round(((p_cnt + 0.5 * l_cnt) / total_sessions * 100), 1) if total_sessions > 0 else 0
        student_stats.append({
            'roll': roll,
            'name': name,
            'present': p_cnt,
            'absent': a_cnt,
            'late': l_cnt,
            'total': total_sessions,
            'pct': pct
        })

print(f"Total attendance entries across 8 sessions: P={total_p}, A={total_a}, L={total_l}, Total={total_p+total_a+total_l}")
cohort_pct = round(((total_p + 0.5 * total_l) / (total_p + total_a + total_l) * 100), 1)
print(f"Overall Cohort Attendance: {cohort_pct}%")
print("\nSample student attendance percentages:")
for s in student_stats[:10]:
    print(f"  {s['roll']}: {s['name']} -> {s['pct']}% (P:{s['present']}, A:{s['absent']}, L:{s['late']})")

print("\nLow attendance students (<75%):")
for s in student_stats:
    if s['pct'] < 75:
        print(f"  ⚠️ {s['roll']}: {s['name']} -> {s['pct']}%")


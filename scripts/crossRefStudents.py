import json
import zipfile
import xml.etree.ElementTree as ET

with open('server/data/seedData.json', 'r', encoding='utf-8') as f:
    seed = json.load(f)

cohort_students = {s['id'].lower(): s['name'] for s in seed['initialStudents']}

excel_students = {}
with zipfile.ZipFile('Attendance report/instructor-attendance-sheet_total_members.xlsx') as z:
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
            text = ''.join(t.text for t in si.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') if t.text)
            shared_strings.append(text)
    
    tree = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
    for row in tree.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
        row_idx = row.get('r')
        if row_idx == '1': continue
        name = ''
        roll = ''
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
        if roll:
            excel_students[roll.lower()] = name

print(f"Cohort students count: {len(cohort_students)}")
print(f"Excel students count: {len(excel_students)}")

in_cohort_not_excel = set(cohort_students.keys()) - set(excel_students.keys())
in_excel_not_cohort = set(excel_students.keys()) - set(cohort_students.keys())

print("In cohort but not in Excel:", [(r, cohort_students[r]) for r in in_cohort_not_excel])
print("In Excel but not in cohort:", [(r, excel_students[r]) for r in in_excel_not_cohort])


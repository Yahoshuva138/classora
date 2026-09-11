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
    header_cells = {}
    row1 = tree.find('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row[@r="1"]')
    for c in row1.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
        ref = c.get('r')
        col_letter = ''.join(ch for ch in ref if ch.isalpha())
        t = c.get('t')
        v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
        val = v.text if v is not None else ''
        if t == 's' and val.isdigit():
            val = shared_strings[int(val)]
        header_cells[col_letter] = val

    students = []
    all_values = set()
    for row in tree.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
        row_idx = row.get('r')
        if row_idx == '1': continue
        r_data = {}
        for c in row.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
            ref = c.get('r')
            col_letter = ''.join(ch for ch in ref if ch.isalpha())
            t = c.get('t')
            v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
            val = v.text if v is not None else ''
            if t == 's' and val.isdigit():
                val = shared_strings[int(val)]
            r_data[col_letter] = val
            if col_letter in ['E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']:
                all_values.add(val)
        students.append(r_data)

    print(f"Total student rows in Excel: {len(students)}")
    print("Unique attendance values:", all_values)
    print("\nFirst 3 students:")
    for s in students[:3]:
        print(s)

    # Let's count non-empty values per column
    print("\nNon-empty attendance counts per column:")
    for col in ['E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']:
        count = sum(1 for s in students if s.get(col, '').strip())
        print(f"Col {col} ({header_cells.get(col)}): {count} entries")


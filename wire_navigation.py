import os
import re

directories = [r"c:\Users\JAYESH\jalsetu\frontend\src\pages"]

tab_mapping = {
    "fhtc-household-status": "overview",
    "survekshan": "survekshan",
    "water-quality-monitoring": "wqmis",
    "schools-and-awcs": "schools",
    "scada-digital-twin": "scada",
    "cag-audit": "cag",
    "contractor-sla-escrow": "contractor"
}

def wire_component(content):
    # 1. Update function signature
    # export default function ScadaTwin({ telemetry, audit, isBurstActive }) {
    content = re.sub(
        r'export default function (\w+)\(\{\s*telemetry,\s*audit,\s*isBurstActive\s*\}\)\s*\{',
        r'export default function \1({ telemetry, audit, isBurstActive, setActiveTab, handleToggleBurst, handleCitizenSubmit }) {',
        content
    )

    # 2. Wire navigation links
    for data_path, tab_name in tab_mapping.items():
        # Find <a ... data-path="data_path" ...>
        # Add onClick={(e) => { e.preventDefault(); setActiveTab('tab_name'); }}
        pattern = rf'(<a[^>]*?data-path="{data_path}"[^>]*?)>'
        replacement = rf'\1 onClick={{(e) => {{ e.preventDefault(); setActiveTab("{tab_name}"); }}}}>'
        content = re.sub(pattern, replacement, content)

    # 3. Wire buttons
    # Simulate Rupture
    content = re.sub(
        r'(<button[^>]*?>)(.*?Simulate(?: Pipe)? Rupture.*?</button>)',
        r'\1 onClick={handleToggleBurst}>\2',
        content,
        flags=re.IGNORECASE
    )
    # Proof-of-Flow
    content = re.sub(
        r'(<button[^>]*?>)(.*?Proof-of-Flow.*?</button>)',
        r'\1 onClick={handleCitizenSubmit}>\2',
        content,
        flags=re.IGNORECASE
    )
    
    # 4. In App.jsx, I'll need to remove the layout, so I'll handle that separately.

    return content

for d in directories:
    if not os.path.exists(d):
        continue
    for filename in os.listdir(d):
        if filename.endswith(".jsx"):
            filepath = os.path.join(d, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = wire_component(content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Wired {filename}")

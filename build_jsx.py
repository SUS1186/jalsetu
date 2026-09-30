import os
import re

html_dir = r"c:\Users\JAYESH\jalsetu\stitch_jalsetu_civic_intelligence_platform"
out_dir = r"c:\Users\JAYESH\jalsetu\frontend\src"

pages_dir = os.path.join(out_dir, "pages")
comp_dir = os.path.join(out_dir, "components")

os.makedirs(pages_dir, exist_ok=True)
os.makedirs(comp_dir, exist_ok=True)

mappings = {
    "national_household_overview_jjm_imis": ("Overview.jsx", pages_dir),
    "jal_jeevan_survekshan_rankings_jjs_2023_24": ("Survekshan.jsx", pages_dir),
    "water_quality_laboratory_ftk_testing_wqmis": ("WaterQuality.jsx", pages_dir),
    "tap_water_in_schools_anganwadis_schools_awc": ("SchoolsAWC.jsx", pages_dir),
    "scada_digital_twin_telemetry": ("ScadaTwin.jsx", pages_dir),
    "cag_discrepancy_ground_reality_audit_cag_audit": ("CagAudit.jsx", pages_dir),
    "contractor_sla_automated_escrow_ledger_contractor_escrow": ("ContractorSLA.jsx", pages_dir),
    "jalsetu_jjm_official_emblem": ("Header.jsx", comp_dir),
}

def html_to_jsx(html_str):
    # Fix class and for
    html_str = re.sub(r'\bclass=', 'className=', html_str)
    html_str = re.sub(r'\bfor=', 'htmlFor=', html_str)
    
    # SVG properties
    svg_props = {
        "stroke-width": "strokeWidth",
        "stroke-linejoin": "strokeLinejoin",
        "stroke-linecap": "strokeLinecap",
        "stroke-dasharray": "strokeDasharray",
        "fill-rule": "fillRule",
        "clip-rule": "clipRule",
        "clip-path": "clipPath",
        "stroke-miterlimit": "strokeMiterlimit",
        "stop-color": "stopColor",
        "stop-opacity": "stopOpacity",
        "viewbox": "viewBox",
        "lineargradient": "linearGradient",
        "radialgradient": "radialGradient",
        "xmlns:xlink": "xmlnsXlink",
    }
    for k, v in svg_props.items():
        html_str = re.sub(rf'\b{k}=', f'{v}=', html_str, flags=re.IGNORECASE)

    # HTML comments
    html_str = re.sub(r'<!--(.*?)-->', r'{/*\1*/}', html_str, flags=re.DOTALL)

    # Remove script tags and their contents
    html_str = re.sub(r'<script\b[^<]*(?:(?!</script>)<[^<]*)*</script>', '', html_str, flags=re.IGNORECASE | re.DOTALL)

    # Convert self closing tags without />
    html_str = re.sub(r'<(img|input|hr|br)([^>]*?)(?<!/)>', r'<\1\2 />', html_str, flags=re.IGNORECASE)

    return html_str

for folder, (filename, dest_dir) in mappings.items():
    src_file = os.path.join(html_dir, folder, "code.html")
    if not os.path.exists(src_file):
        print(f"Missing {src_file}")
        continue
    with open(src_file, 'r', encoding='utf-8') as f:
        html = f.read()

    # Find the main container
    # Usually it's everything inside <body>...</body> or a big div.
    # Let's just take the first div that wraps everything if body exists
    match = re.search(r'<body[^>]*>(.*)</body>', html, re.IGNORECASE | re.DOTALL)
    if match:
        html = match.group(1)
    
    jsx_content = html_to_jsx(html)

    # Some variables like `style="width: 50%"` need manual fixing, let's fix style="width: (\d+)%" 
    jsx_content = re.sub(r'style="width:\s*(\d+)%;?"', r'style={{ width: "\1%" }}', jsx_content)
    jsx_content = re.sub(r'style="([^"]*)"', r'style={{}}', jsx_content) # Blank out complex styles to prevent errors, typically stitch uses tailwind anyway
    
    component_name = filename.replace(".jsx", "")
    
    # Wrap in functional component
    out = f'''import React from "react";\nimport {{ LucideIcon }} from "lucide-react";\n\nexport default function {component_name}({{ telemetry, audit, isBurstActive }}) {{\n  return (\n    <>\n{jsx_content}\n    </>\n  );\n}}\n'''

    with open(os.path.join(dest_dir, filename), 'w', encoding='utf-8') as f:
        f.write(out)
    print(f"Generated {filename}")

print("Done generating JSX components.")

import os
import re

directories = [
    r"c:\Users\JAYESH\jalsetu\frontend\src\pages",
    r"c:\Users\JAYESH\jalsetu\frontend\src\components"
]

def sweep_jsx(content):
    # 1. Fix <style> tags: <style>...</style> -> <style>{`...`}</style>
    # Be careful not to double-wrap if already wrapped.
    def style_repl(match):
        inner = match.group(1)
        if not inner.strip().startswith("{`"):
            return f"<style>{{`{inner}`}}</style>"
        return match.group(0)
    content = re.sub(r'<style>(.*?)</style>', style_repl, content, flags=re.IGNORECASE | re.DOTALL)
    
    # 2. HTML Attributes to JSX
    content = re.sub(r'\bclass=', 'className=', content)
    content = re.sub(r'\bfor=', 'htmlFor=', content)
    content = re.sub(r'\btabindex=', 'tabIndex=', content, flags=re.IGNORECASE)
    # readonly -> readOnly (need to match standalone or readonly="readonly")
    content = re.sub(r'\breadonly\b(?!=)', 'readOnly={true}', content, flags=re.IGNORECASE)
    content = re.sub(r'\breadonly=', 'readOnly=', content, flags=re.IGNORECASE)
    content = re.sub(r'\bautocomplete=', 'autoComplete=', content, flags=re.IGNORECASE)

    # 3. SVG kebab-case to camelCase
    svg_props = {
        "stroke-width": "strokeWidth",
        "stroke-dasharray": "strokeDasharray",
        "stroke-linecap": "strokeLinecap",
        "stroke-linejoin": "strokeLinejoin",
        "fill-rule": "fillRule",
        "clip-rule": "clipRule",
        "stop-color": "stopColor",
        "stop-opacity": "stopOpacity",
        "clip-path": "clipPath",
        "stroke-miterlimit": "strokeMiterlimit",
        "font-family": "fontFamily",
        "font-weight": "fontWeight",
        "font-size": "fontSize",
        "letter-spacing": "letterSpacing",
    }
    for k, v in svg_props.items():
        content = re.sub(rf'\b{k}=', f'{v}=', content, flags=re.IGNORECASE)

    # 4. Void tags strictly self-closing
    # Match <tag ... > where tag is img, input, br, hr and it doesn't end with />
    content = re.sub(r'<(img|input|hr|br)([^>]*?)(?<!/)>', r'<\1\2 />', content, flags=re.IGNORECASE)

    # 5. Convert HTML comments
    # We already did this, but just in case:
    content = re.sub(r'<!--(.*?)-->', r'{/*\1*/}', content, flags=re.DOTALL)

    # Convert inline style string to object if missed: style="width: 50%;" -> style={{width: "50%"}}
    def style_attr_repl(match):
        inner = match.group(1)
        # simplistic conversion for common progress bars etc.
        if "width" in inner:
            val = re.search(r'width:\s*([^;"]+)', inner)
            if val:
                return f'style={{{{ width: "{val.group(1).strip()}" }}}}'
        return 'style={{}}'
    content = re.sub(r'style="([^"]*)"', style_attr_repl, content)

    return content

for d in directories:
    if not os.path.exists(d):
        continue
    for filename in os.listdir(d):
        if filename.endswith(".jsx"):
            filepath = os.path.join(d, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = sweep_jsx(content)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Swept {filename}")

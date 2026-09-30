import os
import re

directories = [
    r"c:\Users\JAYESH\jalsetu\frontend\src\pages",
    r"c:\Users\JAYESH\jalsetu\frontend\src\components"
]

for d in directories:
    if not os.path.exists(d):
        continue
    for filename in os.listdir(d):
        if filename.endswith(".jsx"):
            filepath = os.path.join(d, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content.replace('import { LucideIcon } from "lucide-react";\n', '')
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Removed LucideIcon import from {filename}")

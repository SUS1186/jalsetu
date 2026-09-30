import os
import re

directories = [r"c:\Users\JAYESH\jalsetu\frontend\src\pages"]

for d in directories:
    if not os.path.exists(d):
        continue
    for filename in os.listdir(d):
        if filename.endswith(".jsx"):
            filepath = os.path.join(d, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace literal -> with &rarr;
            content = content.replace('->', '&rarr;')
            
            # Replace literal < and > in text with &lt; and &gt;
            # Safe heuristics:
            # 1. < followed by space or number (e.g., < 500, <15%)
            content = re.sub(r'<(\s*\d)', r'&lt;\1', content)
            
            # 2. > followed by space or number (e.g., > 12h, >1.5 bar)
            content = re.sub(r'>(\s*\d)', r'&gt;\1', content)
            
            # 3. >= and <=
            content = content.replace('>=', '&gt;=')
            content = content.replace('<=', '&lt;=')
            
            # 4. Any other < or > that might be in plain text?
            # It's hard to distinguish safely from tags without a real parser,
            # but the most common cases are < number, > number, and arrows.
            # Let's also check for " < " or " > "
            content = content.replace(' < ', ' &lt; ')
            content = content.replace(' > ', ' &gt; ')

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Sanitized JSX syntax in {filename}")

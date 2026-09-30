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
            
            # Fix duplicate > in button tags
            content = content.replace('> onClick={handleToggleBurst}>', ' onClick={handleToggleBurst}>')
            content = content.replace('> onClick={handleCitizenSubmit}>', ' onClick={handleCitizenSubmit}>')
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed {filename}")

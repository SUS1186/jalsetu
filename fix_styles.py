import os
import re

directories = [
    r"c:\Users\JAYESH\jalsetu\frontend\src\pages",
    r"c:\Users\JAYESH\jalsetu\frontend\src\components"
]

def fix_style_tags(content):
    # Match <style>{`...`}</style>
    def repl(m):
        inner = m.group(1)
        # Using dangerouslySetInnerHTML
        # We need to escape backticks and ${} inside the inner CSS just in case, but they usually don't have it.
        # Actually, using a regular string might be safer if there are no quotes, but CSS has quotes.
        # Let's just use dangerouslySetInnerHTML={{ __html: `...` }}
        return f'<style dangerouslySetInnerHTML={{{{ __html: `{inner}` }}}} />'

    return re.sub(r'<style>\{`(.*?)`\}</style>', repl, content, flags=re.IGNORECASE | re.DOTALL)

for d in directories:
    if not os.path.exists(d):
        continue
    for filename in os.listdir(d):
        if filename.endswith(".jsx"):
            filepath = os.path.join(d, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = fix_style_tags(content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Fixed {filename}")

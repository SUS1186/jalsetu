import os

directories = [r"c:\Users\JAYESH\jalsetu\frontend\src\pages"]

for d in directories:
    if not os.path.exists(d):
        continue
    for filename in os.listdir(d):
        if filename.endswith(".jsx"):
            filepath = os.path.join(d, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 1. Fix the Proof of Flow button
            content = content.replace(
                '"> onClick={handleCitizenSubmit} onClick={handleToggleBurst}><span',
                '" onClick={handleCitizenSubmit}><span'
            )
            
            # 2. Add onClick to Simulate Rupture button
            content = content.replace(
                '<button className="flex items-center gap-1 bg-water-alert hover:opacity-90 text-on-error px-space-sm h-9 rounded font-headline-sm text-[12px] uppercase tracking-wider transition-opacity">',
                '<button className="flex items-center gap-1 bg-water-alert hover:opacity-90 text-on-error px-space-sm h-9 rounded font-headline-sm text-[12px] uppercase tracking-wider transition-opacity" onClick={handleToggleBurst}>'
            )
            
            # Also check for "Simulate Pipe Rupture" button if it exists
            content = content.replace(
                '<button className="flex items-center justify-center gap-1.5 bg-water-alert hover:opacity-90 text-on-error px-4 h-10 rounded font-headline-sm text-[13px] uppercase tracking-wider transition-opacity shadow-sm">',
                '<button className="flex items-center justify-center gap-1.5 bg-water-alert hover:opacity-90 text-on-error px-4 h-10 rounded font-headline-sm text-[13px] uppercase tracking-wider transition-opacity shadow-sm" onClick={handleToggleBurst}>'
            )

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed buttons in {filename}")

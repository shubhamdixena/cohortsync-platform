import re
import json

def parse_object(obj_str):
    # This is a very basic parser, might need adjustment
    # It converts JS object syntax to a dict
    # Remove comments
    obj_str = re.sub(r'//.*', '', obj_str)
    # Quote keys
    obj_str = re.sub(r'(\w+):', r'"\1":', obj_str)
    # Handle single quotes to double quotes
    obj_str = obj_str.replace("'", '"')
    # Handle trailing commas
    obj_str = re.sub(r',\s*([\]}])', r'\1', obj_str)
    return obj_str

def extract_list(content, list_name):
    pattern = f"const {list_name} = (\[.*?\])"
    match = re.search(pattern, content, re.DOTALL)
    if match:
        return match.group(1)
    return "[]"

def clean_js_object(js_obj_str):
    # Remove comments
    js_obj_str = re.sub(r'//.*', '', js_obj_str)
    # Fix keys: name: 'Value' -> "name": 'Value'
    js_obj_str = re.sub(r'(\s)(\w+):', r'\1"\2":', js_obj_str)
    # Fix single quoted strings to double quoted, but be careful about nested quotes
    # This is tricky. Let's try a different approach.
    # We will evaluate the JS object using node if possible, or just use regex to find fields.
    return js_obj_str

# Since parsing JS objects with regex is hard, I will use a simpler approach:
# I will read the file and use regex to find each object's properties.

def generate_sql():
    with open('prisma/seed.ts', 'r') as f:
        content = f.read()

    # Extract memberDataList
    members = []
    member_matches = re.finditer(r"{\s*email:\s*'([^']+)',\s*name:\s*'([^']+)',\s*initials:\s*'([^']+)',\s*title:\s*'([^']+)',\s*bio:\s*'([^']+)',\s*location:\s*'([^']+)',\s*skills:\s*(\[.*?\]),\s*expertise:\s*(\[.*?\]),\s*experience:\s*(\[.*?\]),\s*education:\s*(\[.*?\]),\s*lookingFor:\s*(\[.*?\]),\s*offering:\s*(\[.*?\]),.*?}", content, re.DOTALL)
    
    # The regex above is too brittle. Let's try to extract the whole list string and then split by objects.
    
    # Alternative: Use node to output the data as JSON.
    # I will create a temporary JS script that imports the data (or copies it) and prints it as JSON.
    pass

if __name__ == '__main__':
    generate_sql()

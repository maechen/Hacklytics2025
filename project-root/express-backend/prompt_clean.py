import re
import sys

def clean_response(raw_response):
    # Remove prompt template and query using regex
    cleaned = re.sub(
        r'^.*JSON data:\s*{.*?}\s*Query:.*?$', 
        '', 
        raw_response, 
        flags=re.DOTALL|re.MULTILINE
    ).strip()
    
    # Remove any remaining markdown formatting
    cleaned = re.sub(r'\*\*|\*|_|- ', '', cleaned)
    return cleaned

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: promptclean.py <raw_response_file>")
        sys.exit(1)
    
    with open(sys.argv[1], 'r') as f:
        raw = f.read()
    
    print(clean_response(raw))
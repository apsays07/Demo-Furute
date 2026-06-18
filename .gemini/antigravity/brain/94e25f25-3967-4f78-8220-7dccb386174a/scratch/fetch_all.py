import urllib.request
import re
from html.parser import HTMLParser

class MyHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.recording = False
        self.data = []

    def handle_starttag(self, tag, attrs):
        if tag in ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li']:
            self.recording = True

    def handle_endtag(self, tag):
        if tag in ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li']:
            self.recording = False
            self.data.append('\n')

    def handle_data(self, data):
        if self.recording:
            self.data.append(data)

def fetch_and_clean(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8', errors='ignore')
        parser = MyHTMLParser()
        parser.feed(html)
        text = ''.join(parser.data)
        # Clean up multiple newlines and spaces
        text = re.sub(r'\r\n', '\n', text)
        text = re.sub(r'\n\s*\n', '\n\n', text)
        text = re.sub(r'[ \t]+', ' ', text)
        return text.strip()
    except Exception as e:
        return f"Error: {e}"

urls = {
    'wow-life': 'https://furute.in/wow-life/',
    'why': 'https://furute.in/why/',
    'awards': 'https://furute.in/awards/',
    'insights': 'https://furute.in/programs/business-insights-pune-leadership-development-program/'
}

for name, url in urls.items():
    print(f"=== {name} ===")
    content = fetch_and_clean(url)
    print(content[:4000])
    print("\n" + "="*40 + "\n")
    # Save the output to a text file for inspection
    with open(f"scratch/{name}.txt", "w", encoding="utf-8") as f:
        f.write(content)

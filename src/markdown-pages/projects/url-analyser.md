---
slug: "projects/url-analyzer"
nameOfClass: "projects-items"
title: "URL Analyzer"
added: "2025-08-15"
listName: "🔍 /URLAnalyzer"
video: "false"
popupImageSrc: "https://raw.githubusercontent.com/ROSHAN-Z89/URL_ANALYZER/main/urlanalyser.jpg"
popupImageAlt: "URL Analyzer terminal screenshot"
popupGithubLink: "https://github.com/ROSHAN-Z89/url-analyzer"
popupLiveLink: ""
techIcons: [
        "python",
        "bash",
        "linux",
        "kalilinux",
        "wireshark"
      ]
---

URL Analyzer is a lightweight yet powerful Python tool designed to inspect, validate, and flag potentially malicious or suspicious URLs.  
It’s built for cybersecurity researchers, ethical hackers, bug bounty hunters, and anyone who wants to demystify URLs.  

## Key Features

- ✅ **Subdomain Counter** – Analyze and count subdomains from any URL.  
- 🌐 **Scheme Validation** – Flags dangerous or uncommon schemes (`ftp://`, `file://`, etc.).  
- ⚠️ **SSRF Risk Detection** – Detects access to localhost, internal IPs, or intranet targets.  
- 📦 **.env Integration** – Load API keys and configs securely from environment variables.  
- 🧠 **ISP Lookup (IPInfo)** – Fetch ISP and geo info using IPInfo API.  
- 🎨 **Terminal Styling** – Color-coded terminal output using `termcolor`.  
- 🧹 **Auto Clear** – Clears terminal screen after errors or interruptions.  
- 🧪 **URL Parsing** – Dissects scheme, domain, subdomains, port, etc.  
- 🔎 **Input Validation** – Handles broken or malformed URLs gracefully.  

## What's New in v1.1

- ✅ Graceful fallback for missing IPInfo token — continues processing without crashing when no API key is provided.

---

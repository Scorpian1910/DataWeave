# 🧬 DataWeave – A Visual Web Scraper

> A user-friendly tool to **visually extract data** from any webpage using XPath selectors. Built for efficiency and simplicity.

[![MIT License](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)

---

## ✨ Features

- 🖱 **Visual Element Selection** – Click to select data from a webpage.
- 🧭 **XPath-Based Extraction** – Auto-generates precise XPath selectors.
- 🔄 **Real-time Feedback** – Instantly preview selected elements.
- 📄 **Multi-Page Scraping** – Navigate and scrape paginated content.
- 📊 **Tabular Data Preview** – Clean table display for both selected & scraped data.
- 📤 **CSV Export** – Export selected/scraped data with one click.
- 💾 **State Persistence** – Remembers last used URL and selections in local storage.

---

## ⚙️ Tech Stack

### 🖥 Frontend
- **Framework:** Next.js (React)
- **Language:** TypeScript
- **UI:** [shadcn/ui](https://ui.shadcn.com/), Tailwind CSS
- **Icons:** Lucide React
- **Notifications:** Sonner

### 🧠 Backend
- **Framework:** FastAPI
- **Language:** Python
- **Web Automation:** Selenium
- **Driver Management:** WebDriver Manager

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 🔧 Prerequisites

- Node.js v18+
- Python 3.8+
- Google Chrome browser installed

---

## 🛠️ Installation & Setup

### 1️⃣ Backend (FastAPI)

```bash
# Clone the repository
git clone https://github.com/yourusername/dataweave.git
cd dataweave/backend

# Create and activate virtual environment
python -m venv venv
# On Windows: venv\Scripts\activate
# On macOS/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

---
## 📷 Demo

Here’s how DataWeave works in action:

### 🖼️ Visual Element Selection

![](https://raw.githubusercontent.com/Scorpian1910/DataWeave/main/frontend/public/assets/DataWeave-Img1.png)

### 🔍 Data Preview & Scraping Results

![](https://raw.githubusercontent.com/Scorpian1910/DataWeave/main/frontend/public/assets/DataWeave-Img2.png)





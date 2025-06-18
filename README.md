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

## 🧭 Workflow Preview

![Screenshot 2025-06-18 182244](https://github.com/user-attachments/assets/89347105-b972-45a9-9ca0-3814ee5f7610)

![Screenshot 2025-06-18 182509](https://github.com/user-attachments/assets/eb8fed49-6007-45ae-8950-aea46ba32429)



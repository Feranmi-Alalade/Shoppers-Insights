## Shopper Insights

Shopper Insights is a full-stack application designed to help users manage and analyze their shopping receipts. The platform leverages OCR and data extraction to provide insights into spending habits, budgeting, and more.

### Team
- **Team Lead / Frontend Engineer:** [Temiloluwa Adeoti](https://www.linkedin.com/in/temiadeoti)
- **DevOps / Cloud Engineer:** [Oluwategbe Tobi](https://www.linkedin.com/in/tobi-oluwategbe-01893b1a3/)
- **Data Scientist:** [Alalade Feranmi](https://www.linkedin.com/in/oluwaferanmi-alalade-8b037aa8/)

---

## Features

- **Upload Receipts:** Supports PDF, PNG, JPG, and JPEG formats for receipt uploads.
- **Automated Data Extraction:** Extracts key information such as:
  - Date of purchase
  - Merchant name and location
  - Itemized list of products
  - Prices and totals
- **Budgeting Tools:** Set and track budgets, view spending breakdowns by category, and visualize trends.
- **Analytics Dashboard:** Interactive charts and analytics for spending patterns, category breakdowns, and trends over time.
- **Receipt History:** View, search, and manage past receipts (future enhancements planned).
- **Export Options:** Download extracted data as JSON or Excel files.
- **User Authentication:** Secure login and profile management.
- **Admin & Community Pages:** (Planned) Admin dashboard and community features for sharing insights.

---

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Python (FastAPI/Lambda), OCR & LLM-based data extraction
- **Infrastructure:** Terraform (IaC), AWS Lambda, S3, API Gateway
- **Data Science:** Custom pipelines for OCR and analytics

---

## Project Structure

- `shopper-insights-app/` — Frontend application (Next.js, React)
- `backend/` — Python backend for data processing, OCR, and analytics
- `api/` — Lambda entrypoints and utility scripts
- `iac/` — Infrastructure as Code (Terraform)

---

## Getting Started

You can use Shopper Insights in two ways:

1. **Online Web App:**
   - Visit [shopper-insights.hifeyinc.com](https://shopper-insights.hifeyinc.com) to use the hosted version.

2. **Local Development (Docker Compose):**
   - Clone this repository.
   - Use the provided `docker-compose.yml` and pre-built Docker images to run the app locally.
   - Automation is managed with [Taskfile](https://taskfile.dev/). See below for usage.

---

## Automation with Taskfile

We use [Taskfile](https://taskfile.dev/) for automating common development and deployment tasks, such as building, pushing, and running Docker containers. To use Taskfile, install the `task` CLI from their [installation guide](https://taskfile.dev/installation/).

Example commands:

```sh
# Build images
task build:web
task build:api

# Push images to Docker Hub
task push:web
task push:api

# Start services
task up

# Stop services
task down
```

---

## Python Dependency Management

We recommend using [uv](https://github.com/astral-sh/uv) for fast Python dependency management. See the [uv documentation](https://docs.astral.sh/uv/) for details.

---

See the respective `README.md` files in each folder for more details.
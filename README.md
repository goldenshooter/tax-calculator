# Tax Calculator

A simple React app that calculates income tax using progressive tax bands from local mock data.

## What This App Does

- Lets you enter salary as hourly, weekly, monthly, or yearly
- Calculates tax using progressive tax bands
- Loads tax bands from a local JSON file through a mocked API call

## Tech Stack

- React + TypeScript
- Vite
- Ant Design
- Vitest + Testing Library

## Quick Start

1. Install dependencies

	```bash
	npm install
	```

2. Start development server

	```bash
	npm run dev
	```

3. Build for production

	```bash
	npm run build
	```

4. Run tests

	```bash
	npm test
	```

## Notes

- Tax calculation uses progressive bands, not a flat rate
- Mock API is asynchronous to simulate real network behavior

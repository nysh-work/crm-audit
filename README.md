# Audit Fee Calculator

A multi-step form application to calculate proposed audit fees based on historical data. This application allows users to enter financial data and historical fee information for the past 4 years, then calculates a proposed fee structure for the upcoming audit period.

## Features

- **Multi-Step Form**: Collects data in a structured, step-by-step process
- **Financial Data Entry**: Record revenue, total assets, and other financial metrics
- **Service History**: Track which audit services were provided and their fees
- **Complexity Factors**: Adjust calculations based on client complexity
- **Fee Calculation**: Automatically calculate proposed fees based on historical data
- **Data Persistence**: Save form progress in browser's localStorage
- **Export/Print**: Generate printable summaries and export data as JSON
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone this repository:
   ```
   git clone <repository-url>
   cd audit-fee-calculator
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

The application guides users through 4 steps:

1. **Financial Data Entry**: Enter financial information for each of the past 4 years
2. **Services and Fees**: Select which services were provided and enter fees charged
3. **Additional Questions**: Answer questions about client complexity
4. **Fee Calculation & Summary**: View proposed fees and adjust if necessary

### Data Persistence

The application automatically saves form data to your browser's localStorage, so you can continue where you left off if you close the browser.

### Exporting Data

On the summary page, you can:
- Print the summary using the "Print Summary" button
- Export all data as a JSON file using the "Export Data" button

## Customizing Fee Calculations

You can customize how fees are calculated by modifying the constants and functions in `utils/feeCalculation.js`:

### Base Fees

Adjust the base fees for each service type:

```javascript
export const BASE_FEES = {
  statutoryAudit: 200000,
  ifcTesting: 100000,
  taxAudit: 75000,
  // ... other services
};
```

### Revenue Multipliers

Adjust how client size affects fees:

```javascript
export const REVENUE_MULTIPLIERS = {
  small: { threshold: 100, factor: 0.8 },
  medium: { threshold: 500, factor: 1.0 },
  large: { threshold: 1000, factor: 1.3 },
  veryLarge: { threshold: Infinity, factor: 1.5 }
};
```

### Complexity Factors

Adjust how complexity factors affect fees:

```javascript
export const COMPLEXITY_FACTORS = {
  hasComplexGroupStructure: 0.05,
  hasInternationalTransactions: 0.05,
  // ... other factors
};
```

### Growth Factors

Adjust the default and maximum growth rates:

```javascript
export const GROWTH_FACTORS = {
  defaultAnnualIncrease: 0.05, // 5% default increase
  maxGrowthFactor: 0.15      // maximum 15% increase
};
```

## Project Structure

```
audit-fee-calculator/
├── components/           # React components
│   ├── steps/            # Form step components
│   ├── ui/               # UI components
│   └── AuditFeeWizard.js # Main wizard component
├── context/              # React context
│   └── AuditFormContext.js # Form state management
├── pages/                # Next.js pages
│   ├── _app.js           # Application entry point
│   └── index.js          # Main page
├── public/               # Static assets
├── styles/               # CSS styles
│   ├── globals.css       # Global styles
│   └── print.css         # Print-specific styles
└── utils/                # Utility functions
    ├── feeCalculation.js # Fee calculation logic
    └── localStorage.js   # Local storage helpers
```

## Technologies Used

- **React**: UI library
- **Next.js**: React framework
- **Tailwind CSS**: Utility-first CSS framework
- **localStorage API**: For client-side data persistence

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Built for financial professionals to streamline the audit fee proposal process
- Inspired by real-world audit fee calculation workflows 
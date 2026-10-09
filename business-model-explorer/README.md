# Business Model Explorer

An interactive model of a fictional B2B SaaS business that helps business operators without formal financial training develop an intuitive understanding of how operational decisions influence financial performance. Users can adjust operating assumptions, observe financial outcomes, and explore the relationships connecting them.

Two businesses can produce identical financial outcomes through very different operating mechanisms, requiring different management decisions.

## Problem Definition

### 1. Spreadsheets are powerful, but have limitations

Spreadsheets are quick, flexible, user-friendly, and industry-agnostic tools that allow users to model the effects of inputs on outputs.

The problem is not that spreadsheets cannot model business relationships; it is that understanding those relationships can become difficult as models increase in complexity.

### 2. Financial outcomes don't explain the whole business

A financial model quantifies the relationships between assumptions and outcomes. This differs from a mental model, which represents an intuitive understanding of how those relationships work. Knowing a business's financial results is therefore not equivalent to understanding the underlying business.

### 3. Business decisions involve interconnected relationships

A decision rarely affects only one financial metric. Whether a decision improves EBITDA depends on whether incremental gross profit exceeds incremental operating costs. Good business decisions therefore require understanding how operating inputs affect multiple financial outcomes, including their trade-offs.

### Proposed Approach

When making a complex decision under pressure, a spreadsheet with many links and dependencies can be difficult to interpret.

Rather than presenting financial outputs alone, Business Model Explorer aims to help users:

- Manipulate important operating assumptions.
- Observe the consequences of those changes.
- Progressively explore the relationships connecting operating drivers to financial outcomes.
- Develop commercial intuition about business decisions and their trade-offs.

## What Users Can Do

**User interaction:** Users can change nine operating assumptions: monthly price, monthly churn, sales headcount, sales opportunities per representative, win rate, monthly marketing spend, other employee headcount, fixed operating costs, and gross margin. The application recalculates financial and operational outcomes as assumptions change.

**Visualisation and understanding:** The dashboard displays seven outcomes: Customers, ARR, Year 1 Revenue, Year 1 Gross Profit, Year 1 EBITDA, Ending Cash, and Runway. KPI cards show changes from the baseline, while charts compare the baseline and current scenario across 12 months for customers, revenue, EBITDA, and cash. Users can also click through a predefined hierarchy of formulas and operating drivers in the causal explorer. This explorer explains relationships but does **not** currently show live scenario values or quantify individual drivers' contributions to a scenario's financial changes.

**Scope and controls:** Users can reset their assumptions to the predefined baseline. Sliders enforce preset input ranges, helping limit invalid or extreme values, but they do not guarantee economically realistic scenarios. The application is a simplified simulation, not a fully validated business forecast.

## Architecture

This is a client-side React application built with TypeScript. Application state, financial calculations, and user interface components are separated to keep the system understandable, maintainable, and testable.

### Application State and Data Flow

Operating assumptions are maintained in React state within `App.tsx`, initially populated from a predefined fictional company (the baseline).

When a user adjusts a business driver, an event handler updates the corresponding assumption. React then re-renders the application, and the updated assumptions are passed into a separate TypeScript calculation engine.

The `calculateProjection()` function generates a 12-month financial projection, calculating customer acquisition, churn, revenue, gross profit, operating costs, EBITDA, and cash. The results are derived from the assumptions rather than maintained as separate state variables.

The baseline projection is calculated independently and retained for comparison with the user's current scenario.

### Component Structure

The interface is divided into components with distinct responsibilities:

- **DriverPanel and DriverControl:** Present the operating assumptions and handle user input.
- **KPIGrid:** Displays financial outcomes and their differences from the baseline.
- **ProjectionChart:** Visualises the baseline and scenario over a 12-month period using Recharts.
- **CausalExplorer:** Allows users to navigate a predefined hierarchy of financial relationships and operating drivers.

The causal explorer maintains its own navigation state and uses a separate data structure containing financial formulas and explanations. It does not currently display live scenario values.

### Calculation Engine

The financial model is implemented as a pure TypeScript calculation function, independent of React. The engine normalises input assumptions, performs calculations sequentially across 12 months, and returns monthly projections and summary metrics. It does not modify the input assumptions or rely on external application state.

This separation allows the calculation logic to be tested independently of the user interface and reduces the risk of duplicating financial formulas across components.

### Design Rationale

The application operates entirely in the browser, without a backend, database, or authentication system.

This deliberately simple architecture reflects the scope of the initial product: one fictional B2B SaaS business with locally defined assumptions and deterministic financial calculations.

The design prioritises clear data flow, separation of responsibilities, and testability over additional infrastructure.

## Technology Stack

Business Model Explorer was developed using a lightweight frontend technology stack.

- **React:** Provides the component-based user interface, divided into reusable components for operating assumptions, KPI displays, financial charts, and causal exploration. React manages application state and updates the interface when users change assumptions.
- **TypeScript:** Defines the structure of company assumptions, acquisition inputs, cost assumptions, and financial outputs. It helps identify incompatible data types during development and establishes clear contracts between components and the calculation engine.
- **Vite:** Provides the development environment and production build tooling. It runs the local development server with hot module replacement and bundles the application for deployment. The production build also includes TypeScript compilation checks.
- **CSS:** Controls visual presentation, including layout, typography, sliders, responsive grids, and interaction states. Media queries allow the dashboard to adapt to smaller screens without introducing an additional styling framework.
- **Recharts:** Converts calculated financial projections into interactive line charts.
- **Vitest:** Tests the financial calculation engine independently of the interface. Unit tests verify customer churn, sales and marketing opportunities, pricing effects, gross profit, cash calculations, and the handling of invalid inputs.
- **React Testing Library:** Verifies that controls display and update values, scenarios can be reset to the baseline, and users can navigate the causal explorer.
- **Playwright:** Performs end-to-end testing in a browser.

### Why a Frontend-Only Architecture?

The application does not need a backend, database, or authentication system because it models one fictional B2B SaaS company using predefined operating assumptions. All calculations are performed locally in the browser using a pure TypeScript calculation engine. User inputs are maintained in React state, and financial outputs are recalculated from those inputs.

This reduces unnecessary infrastructure and keeps the application focused on its primary objectives: developing an intuitive user experience, demonstrating business relationships, and learning fundamental frontend engineering principles. The architecture also allows future development without introducing unnecessary infrastructure in the initial version.

## Model Simplifications and Limitations

Business Model Explorer is designed to develop an understanding of the relationships between operating decisions and financial outcomes rather than produce investment-grade financial forecasts.

The model intentionally simplifies aspects of a B2B SaaS business to make the underlying economics easier to understand. These simplifications reduce complexity but also mean that projected financial results may differ materially from those of a real business.

### Key Simplifications

- **EBITDA approximates cash flow:** Monthly cash is calculated as beginning cash plus EBITDA. This is a limitation because EBITDA is not equivalent to cash flow. The model ignores non-cash items, working capital, capital expenditure, and other cash movements, which can materially misstate ending cash and runway.
- **No working capital:** Changes in receivables, payables, and other working-capital balances are not modelled. Revenue is effectively assumed to convert into cash in the same period. Actual collections and payments may occur earlier or later.
- **No taxes:** The model excludes corporation tax and other tax payments. EBITDA is unaffected because it is measured before tax, but projected cash can be overstated when tax payments would otherwise occur.
- **No financing:** Starting cash is predefined, with no subsequent debt or equity funding. The model cannot represent financing strategies that change liquidity or extend runway.
- **No sales representative ramp-up:** Sales representatives are assumed to generate opportunities immediately and consistently. New salespeople generally require onboarding and time to become productive. The model may overestimate early customer acquisition.
- **Simplified customer acquisition:** Sales and marketing opportunities are generated using fixed productivity and cost assumptions, with a common conversion rate. The model excludes sales-cycle delays, channel differences, capacity constraints, and diminishing returns on marketing expenditure.
- **No expansion revenue:** Revenue per customer is determined by a single monthly price. Existing customers cannot purchase additional seats, upgrade plans, or expand contracts independently. This may understate growth opportunities.
- **No contraction revenue:** Customers remain subscribed at the same price or churn entirely. Customers cannot downgrade or reduce their expenditure without cancelling. This may overstate revenue retention.
- **No capital expenditure:** The model excludes investment in fixed assets and other capital expenditure. Cash requirements associated with infrastructure, equipment, and other investments are not reflected.
- **No seasonality:** Operating assumptions remain constant throughout the 12-month projection. Seasonal fluctuations are excluded.
- **No pricing elasticity:** Changing the monthly price affects revenue per customer but does not change customer acquisition or churn. Higher pricing may reduce conversion or increase churn, while lower pricing may stimulate demand.
- **Simplified customer churn:** A fixed monthly churn percentage is applied to beginning customers. The model does not distinguish between cohorts, contract sizes, customer segments, or changes in churn over time.
- **Simplified revenue recognition:** Monthly revenue equals ending customers multiplied by the monthly subscription price. New customers effectively contribute a full month's revenue, regardless of when they join. Billing timing, deferred revenue, and more complex recognition rules are excluded.
- **Fixed gross margin:** Gross profit is calculated using an assumed percentage of revenue. The model does not reflect changes in service delivery costs, economies of scale, or infrastructure capacity requirements.

## Improvements

In addition to addressing the modelling simplifications above, potential improvements to the user experience include:

- Allowing users to enter and save their own baseline assumptions; these are currently predefined.
- Connecting live model results to the causal explorer; currently, they are separate elements of the application.
- Allowing users to enter assumption values directly and adjust input limits; values are currently controlled by sliders with fixed ranges.

## Running Locally

**Prerequisites:** Node.js 22.12+ and npm. The project uses Vite 8 and does not require a backend, database, API keys, or environment variables.

Clone the repository and navigate to the application directory:

```bash
git clone https://github.com/ryanc9615/business_model_explorer.git
cd business_model_explorer/business-model-explorer
```

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the local URL provided by Vite, typically `http://localhost:5173`.

To create and preview a production build:

```bash
npm run build
npm run preview
```

The production build runs TypeScript checks and generates deployable static files in the `dist` directory.

## Testing and Validation

Business Model Explorer uses automated tests at three levels to verify financial calculations, user-interface behaviour, and complete user interactions.

- **Vitest:** Tests the TypeScript calculation engine, including customer churn, sales and marketing opportunities, pricing effects, gross profit, cash movements, and runway calculations. Tests also cover zero-value scenarios and protection against invalid numerical inputs, including division by zero.
- **React Testing Library:** Tests individual components and user interactions, including slider value changes, resetting assumptions to the baseline, and navigating the causal explorer. These tests are executed using Vitest.
- **Playwright:** Tests a complete browser journey in which a user changes customer churn, verifies the impact on ARR, explores the underlying ARR calculation, and resets the scenario.

### Running Tests

Run the unit and component tests:

```bash
npm test
```

Run the end-to-end browser tests:

```bash
npm run test:e2e
```

On a fresh installation, Playwright browser binaries may first need to be installed using `npx playwright install`.

Run code linting and validate the production build:

```bash
npm run lint
npm run build
```

The automated tests cover the principal financial calculations and selected user interactions, but they do not exhaustively test every combination of operating assumptions. Automated responsive-layout and broader accessibility tests are not currently included.

## What I Learned

This was my first practical project focused on developing frontend engineering skills by building a functional application around business and finance. I used ChatGPT as my tutor to assist with the build, syntax, debugging, and conceptual understanding.

### Engineering

This project involved understanding how components, props, state, and event handlers work together. One important architectural principle was separating operating assumptions held in React state from the financial outputs calculated by the TypeScript engine. This is similar to separating schedules from outputs in financial modelling.

Rather than storing every financial result independently, the application derives its projections from the current assumptions. This reduces inconsistencies and keeps the calculation logic separate from the interface.

### Product Design

The key objective was to make financial relationships understandable to someone without a financial background.

Creating mathematically correct outputs is only one part of that objective. The information also needs to be presented in a way that allows users to understand the implications of changing business assumptions.

Baseline comparisons, projection charts, and the causal explorer were designed to make those relationships easier to investigate.

Implementing financial relationships in code required defining the assumptions and calculation rules explicitly. The model illustrates how customer acquisition, churn, pricing, and operating costs combine to influence financial performance. It also demonstrates the distinction between a simplified model that calculates correctly and one that accurately represents the complexity of a real business.

### Development Process

The project introduced different methods of validating software, including unit tests for financial calculations, component tests for user interactions, and end-to-end browser testing.

I created a project in ChatGPT with the context of the build, then divided the work into sections. Each section provided a hand-off to the next as development progressed.
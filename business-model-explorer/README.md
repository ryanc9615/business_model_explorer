
# Business Model Explorer - Overview

An interactive model of a fictional B2B Saas business. This allows Business operators without formal financial training to develop an intuitive understanding of how 
operational decisions influence financial performance. The operator can adjust operating assumptions, observe financial outcomes and explore the relationships connecting them. 

Two business can produce identical financial outcomes through very different operating mechanisms, requiring very different management decisions. 

# Problem definition

1. Spreadsheets are powerful, but have limitations

Spreadsheets = quick, flexibe, user-friendly and industry-agnostic tools that allow users to model the effects of inputs on outputs. 

Problem is not that spreadsheets cannot model business relationships, the challenge often is understnading those relationships can become difficult as models increase in complexity. 

2. Financial outcomes don't explain the whole business

A financial model quantifies the relationshp between assumptions and outcomes. This differs from a mental model which is an intuitive understating of how those relationships work. This means that knowing a businesses financial results is not equivalent to understanding the underlying business. 

3. Business decisions involve interconnected relationships

A decision very rarely affects one financial metric. Whether the decision improves EBITDA depends on whether the incremental Gross Profit exceeds the incremental operating costs. Therefore good business decisions require understanding how operating inputs affect multiple financial outcomes, including their trade-offs. 

## Problem solution
When you are in the heat of a messy decision, sometimes a spreadsheet with all its links and dependencies becomes increasingly difficult to understand. 

Business Model Explorer aims to address the problem by rather than presenting financial outputs alone, the application aims to: 
- manipulate important operating assumptions. 
- observe the consequences of those changes. 
- progressively explore the relationships connecting operating drivers to financial outcomes. 
- develop commercial intuition about business decisions and their trade-offs. 

# What users can do

User interaction: a users can can six operating assumptions which cover pricing, customer acqusition, retention and costs. The application then recalculates the financial and operational outcomes as assumptions change. 

Visusalisation and understanding: There are 5 financial outputs; ARR, Revenue, Gross Profit, EBITDA, Ending Cash and two non-financial outputs customer numbers & Runway which provide a quantitative understanding of the effects the user makes. This is then further strengthend but showing the change to baseline in a graphical format along with a click-through of the underlying causal impact. 

Scope and controls: after the user is done creating a scenario they can reset the assumptions back to baseline through the click of a button. There are restrictions that don't allow the user to create potentially unrealistic business scenarios. And this is a tool to provide a simplified simulatation rather than producing fully validated business forecasts. 

# Architecture 

This is a client-side React application built with TypeScript. Application state, financial calculations and user interface components are seperate to keep the system understandable, maintainable and testable. 

## Applicatin state and data flow

Opperating assumptions are maintained in React state within App.tsx, initially populated with a predefined fictional company (baseline).

When a user adjusts a business driver, an event handler updates the corresponding assumption. Then React re-renders the application, and the updated assumptions are passed into a separate TypeScript calculation engine. 

The calculateProjection() function generates a 12-month financial projection, calculating customer acquisition, churn, revenue, gross profit, operating costs, EBITDA and cash. Results are derived from assumptions rather than maintained as seperate state variables. 

Baseline projection is calculated independently and retained for comparison with the user's current scenario. 

## Component structure

The interface is dividend into components with distinct responsibilities: 
- DriverPanle and DriverControl: present the operating assumptions and handle user input. 
- KPIGrid: displays financial outocmes and their differences from the baseline. 
- ProjectionChart: Visualises the baseline and scenario over a 12-month period using Recharts. 
- CausalExplorer: allows users to navigate a predefined hierarchy of financial relationships and operating drivers. 

Causal explorer maintains its own navigation state and uses a seperate data structure containing financial formulas and explanations. It does not currently display live scenario values. 

## Calculation Engine 

Financial model is implemented as a pure TypeScript calculation function, independent of React. 
Engine normalises input assumptions, performas calculations sequentially across 12 months and return monthly projections and summary metrics. Does not modify the input assumptions or rely on external application state. 

Seperation allows the calculation logic to be tested independently of the user interface and reduces the risk of duplicating financial formulas across components. 


## Design rationale 

Application operates entirely in the browser, without a backend, database or authentication system. 

It is deliberately simple architecture as this reflects the scope of the initial product: one fictional B2B SaaS business with locally defined assumptions and deterministic financial calculations. 

Design prioritises clear data flow, separation of responsibilities and testability over addtional infrastructure. 

# Tech Stack

Business Model Explorer was developed using a lightweight frontend tech stack. 

- React: provides the component-based user interface. This is divided into reusable components - operating assumptions, KPI displays, financial charts, causal exploration. Manages the application state and updates the interface when users change assumptions. 
- TypeScript: define the structure of company assumptions, acquisition inputs, cost assumptions and financial outputs. Helps identify incompatible data types during development and establishes clear contracts between components and the calculation engine. 
- Vite: development environment and production build tooling. runs the local development server with hot module replacement and bundles application for deployment. Production build also includes TypeScript compilation checks. 
- CSS: controls visual presentation, including its layout, typography, sliders, responsive grid and interaction states. Media queries allow the dashboard to adapt to smaller screens without introducting additional styling framework. 
- Recharts: converst the calculated financial projections into interactive line charts. 
- Vitest: tests financial calculation engine independently of the interface. Unit tests verify customer churn, sales and marketing opportunities, pricing effects, gross profit, cash calculations and the handling of invalid inputs. 
- Testing library: verify that controls display and update values, scenarios can be rest to baseline, and users can navigate the causal explorer. 
- Playwright: performs end-to-end testing in browser. 

## Why a front-end only architecture?

No backend, database or authentication system because it currently models one fictional B2B Saas company using predefined operating assumptions. All calculations are performed locally in the browser using a pure TypeScript calculation engine. User inputs are maintained in React state, and financial outputs are recalculated from those inputs. Reducing unnecessary infrastructure and keeps the application focused on its primary objectives: developing an intuitive user experience, demonstrating business relationships and learning fundamental frontend engineering principles. Architecture also supports future development without requiring additional infrastrucutre for the initial version. 

# Model Simplifications & Limitations

Business Model Explorer is designed to develop and understanding of the relationships between operating decisions and financial outcomes, rather than produce investment-grade financial forecasts. 

Model intentioanlly simplifies aspects of a B2B SaaS business to make the underlying economics easier to understand. Simplifications reduce complexity but also mean that projected financial results may differ materially from those of a real business. 

## Key simplifications

- EBITDA approximates cash flow - monthly cash is calculated as beginning cash plus EBITDA. This is limitation as EBITDA is not equivalent to cash flow. This ignores non-cash items, working capital, capital expenditure and other cash movements which can materially misstate ending cash and runway. 
- No working capital - changes in receivables, payables and other working-capital balances are not modelled. revenue effectively assumed to convert into cash in same period. Actual collections and payments may occur earlier or later. 
- No taxes - model excludes coporation tax and other tax payments. EBITDA is unaffected because it is measured before tax, but projected cash can be overstated when tax payemtns would otherwise occur. 
- No financing - Starting cash is predefined with no subsequent debt or equity funding. Model cannot represent financing strategies that change liquidity or extend runway. 
- No sales representative ramp-up - sales reps assumed to generate opportunites immediately & consistently. New salespeople generally require onboarding and time to become productive. Model may overestimate early customer acquistion. 
- Simplified customer acquisition - sales and marketing opportunites are generated using fixed productivity and cost assumptions, with common coversion rate. There are no sales-cycle delays, channel differences, capacity constraints and diminishing returns on marketing expenditure. 
- No expansion revenue - revenue per customer determined by single monthly price. Existing customers cannot purchase additional seats, upgrade plans or expand contract independently. This may understate growth opps. 
- No contraction revenue - customers remain subscribed at same price or churn entirely. Customers unable to downgrade or reduce thier expenditure without cancelling. This may overstate revenue retention. 
- No capital expenditure - model excludes investment in fixed assets and other capital expenditure. cash requirements associated with infrastruture, equipment and other investments not reflected. 
- No seasonality - operating assumptions remain constant throughout 12-month projection.Fluctuations are excluded. 
- No pricing elasticity - changing monthly price affects rev/customer but does not change customer acquisition or churn. Higher pricing may reduce conversionn or increase churn, while lower pricing may stimulate demand. 
- Simplified customer churn - fixed monthly churn % is applied to beginning customers. model does not distinguish between cohorts, contract sizes, customer segments or changes in churn overtime. 
- Simplifieed revenue recognition - monthly rev = ending customers x monthly sub price. new customers effectively contribute a full month's revenue, regardless of when they join. Billing timing, deferred revenue and more complex recognition rules are excluded. 
- Fixed GP% - gross profit is calculated using an assumed % of rev. model doe snot reflect changes in service delivery costs, economies of scale or infrastrucuture capacity requirements. 

# Improvements 

Other than the above which all could be integrated as improvements to provide a more robust model there are some other key changes to user experience that could occur: 
- User to be able to enter and store the baseline - currently this is set with no way for the user to change. 
- Build interactivity between the model and the causal explorer - currrently these are two independent elements in the build. 
- Allow the user to input assumption values and set thresholds - this is currently fixed and only controller through the slider. 

# Running Locally

Prerequisities: Node.js 22.12+ and npm. the project uses Vite 8 and does not require backend, database, API keys or environment variables. 

Clone the repo and navigate to the application directory: 

git clone https://github.com/ryanc9615/business_model_explorer.git
cd business_model_explorer/business-model-explorer

Install dependencies and start the development server: 

npm install
npm run dev

Open the local URL provided by Vite, typically http://localhost:5173.

To create and preview a production build: 

npm run build
npm run preview

Production build runs TS checks and generates deployable static files in the dist directory. 

# Testing and Validation

Business model explorer uses automated tests at three levels to verify financial calculations, user-interface behaviour and complete user interactions. Testing frameworks:

- Vitest - test the typescript calculation engine, including customer churn, sales and marketing opps, pricing effects, gross profit, cash movements and runway calculations. tests also cover zero-value scenarios and protection against invalid numberical inputs, including div by zero. 
- React testing library - tests individual components and user interactions, including slider value changes, resetting assumptions to baseline and navigating the causal explorer. tests are executed using Vitest. 
- Playwrit - test a complete browser journey in which a user changes customer churn, verifies the impact on ARR, explores the underlyng revenue calculation and reset the scenario. 

## Running tests
Run the unit and component tests: 
npm test 
Run the end-to-end browser tests: 
npm run test:e2e

On fresh installation, Playwright browser binaries may first need to be instlled using npx playright install. 

Run code linting and validate the production build: 
npm run lint
npm run build 

The automated tests cover the principal financial calculations and selected user interactions, but they do not exhaustively test every combination of operating assumptions. Automated responsive-layout and broader accessibility tests are not currently included. 

# What I learned 

This was my first practical projected focused on developing practical frontend engineering skills by building a functional application around business and finance. I did use ChatGPT as my tutor to assist with the build, syntax, debugging and concept understanding. 

## Engineering

This project involved understanding how components, props, state and event handlers work together. One important architectural principle was seperating operating assumptions held in a reach state from the financial outputs calculated by the TypeScript engine. This is similar to seperating schedules from outputs in financial modelling. 

Rather than storing every financial result independently, the application derives its projections from the current assumptions. This reduces inconsistencies and keeps the calculation logic separate from the interface. 

## Product Design 

Key objective was to make financial relationships understandable to someone without a financial background. 

Creating mathematically correct outputs is only one part of that objective - the information also needs to be presented in a way that allows users to understand the implicatioons of changing business assumptions. 

Baseline comparision, projection charts and causal explorer were designed to make those relationships easier to investigate. 

Implementing financial relationships in code required defining the assumptions and calculation rules explicitly. The model illustrates how customer acquisition, churn, pricing and operating costs combine to influence financial performance. It also demonstrates the distinction between a simplified model that calculates correctly and one that accurately represents the complexity of a real business. 

# Development Process

The project introduced different methods of validating software, including unit tests for financial calculations, component tests for user interactions and end-to-end browser testing. 

A project was created in ChatGPT with context of the build and then the build was constructed into sections each providing hand-offs to the new section as the build continued. 


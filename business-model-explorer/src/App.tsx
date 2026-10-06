import { useState } from "react";

import Header from "./components/Header";
import CompanySummary from "./components/CompanySummary";
import DriverPanel from "./components/DriverPanel";
import KPIGrid from "./components/KPIGrid";
import { ProjectionChart } from "./components/ProjectionChart";
import { CausalExplorer } from "./components/CausalExplorer/CausalExplorer";

import { baselineCompany } from "./data/baselineCompany";
import { calculateProjection } from "./model/calculateProjection";

const baselineProjection = calculateProjection(baselineCompany);

function App() {
  const [assumptions, setAssumptions] = useState(() =>
    structuredClone(baselineCompany)
  );

  const projection = calculateProjection(assumptions);

  function handleResetScenario() {
    setAssumptions(structuredClone(baselineCompany));
  }

  function handleMonthlyPriceChange(value: number) {
    setAssumptions((current) => ({
      ...current,
      monthlyPrice: value,
    }));
  }

  function handleChurnChange(monthlyChurnRate: number) {
    setAssumptions((current) => ({
      ...current,
      monthlyChurnRate,
    }));
  }

  function handleSalesRepsChange(salesReps: number) {
    setAssumptions((current) => ({
      ...current,
      acquisition: {
        ...current.acquisition,
        salesReps,
      },
    }));
  }

  function handleSalesProductivityChange(
    opportunitiesPerRepPerMonth: number
  ) {
    setAssumptions((current) => ({
      ...current,
      acquisition: {
        ...current.acquisition,
        opportunitiesPerRepPerMonth,
      },
    }));
  }

  function handleWinRateChange(winRate: number) {
    setAssumptions((current) => ({
      ...current,
      acquisition: {
        ...current.acquisition,
        winRate,
      },
    }));
  }

  function handleMarketingSpendChange(
    marketingSpendPerMonth: number
  ) {
    setAssumptions((current) => ({
      ...current,
      acquisition: {
        ...current.acquisition,
        marketingSpendPerMonth,
      },
    }));
  }

  function handleOtherHeadcountChange(
    otherHeadcount: number
  ) {
    setAssumptions((current) => ({
      ...current,
      costs: {
        ...current.costs,
        otherHeadcount,
      },
    }));
  }

  function handleFixedOperatingCostsChange(
    otherFixedOpexPerMonth: number
  ) {
    setAssumptions((current) => ({
      ...current,
      costs: {
        ...current.costs,
        otherFixedOpexPerMonth,
      },
    }));
  }

  function handleGrossMarginChange(grossMargin: number) {
    setAssumptions((current) => ({
      ...current,
      costs: {
        ...current.costs,
        grossMargin,
      },
    }));
  }

  return (
    <>
      <Header />

      <main className="app-shell">
        <CompanySummary
          companyName="Northstar Ops"
          description="B2B workflow software"
        />

        <div className="dashboard">
          <div className="driver-section">
            <div className="driver-section__header">
              <h2>Business Drivers</h2>

              <button
                type="button"
                className="reset-button"
                onClick={handleResetScenario}
              >
                Reset scenario
              </button>
            </div>
            <DriverPanel
              monthlyPricePerCustomer={
                assumptions.monthlyPrice
              }
              monthlyChurnRate={
                assumptions.monthlyChurnRate
              }
              salesReps={
                assumptions.acquisition.salesReps
              }
              opportunitiesPerRepPerMonth={
                assumptions.acquisition
                  .opportunitiesPerRepPerMonth
              }
              winRate={
                assumptions.acquisition.winRate
              }
              marketingSpendPerMonth={
                assumptions.acquisition
                  .marketingSpendPerMonth
              }
              otherHeadcount={
                assumptions.costs.otherHeadcount
              }
              fixedOperatingCostsPerMonth={
                assumptions.costs.otherFixedOpexPerMonth
              }
              grossMargin={
                assumptions.costs.grossMargin
              }
              onMonthlyPriceChange={
                handleMonthlyPriceChange
              }
              onMonthlyChurnRateChange={
                handleChurnChange
              }
              onSalesRepsChange={
                handleSalesRepsChange
              }
              onSalesProductivityChange={
                handleSalesProductivityChange
              }
              onWinRateChange={
                handleWinRateChange
              }
              onMarketingSpendChange={
                handleMarketingSpendChange
              }
              onOtherHeadcountChange={
                handleOtherHeadcountChange
              }
              onFixedOperatingCostsChange={
                handleFixedOperatingCostsChange
              }
              onGrossMarginChange={
                handleGrossMarginChange
              }
            />

          
          </div>

          <KPIGrid
            projection={projection}
            baselineProjection={baselineProjection}
          />

          <ProjectionChart
            projection={projection}
            baselineProjection={baselineProjection}
          />

          <CausalExplorer />
        </div>
      </main>
    </>
  );
}

export default App;
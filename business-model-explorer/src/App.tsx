import Header from "./components/Header";
import CompanySummary from "./components/CompanySummary";
import DriverPanel from "./components/DriverPanel";
import KPIGrid from "./components/KPIGrid";
import { baselineCompany } from "./data/baselineCompany";
import { calculateProjection } from "./model/calculateProjection";
import { useState } from "react";
import { ProjectionChart } from "./components/ProjectionChart";
import { CausalExplorer } from "./components/CausalExplorer/CausalExplorer";

const baselineProjection = calculateProjection(baselineCompany);

function App() {
  const [assumptions, setAssumptions] = useState(() =>
    structuredClone(baselineCompany)
  );

  const projection = calculateProjection(assumptions);

  function handleResetScenario() {
    setAssumptions(structuredClone(baselineCompany));
  }

  const handleMonthlyPriceChange = (value: number) => {
    setAssumptions((current) => ({
      ...current,
      monthlyPrice: value,
    }));
  };

  const handleSalesRepsChange = (salesReps: number) => {
    setAssumptions((current) => ({
      ...current,
      acquisition: {
        ...current.acquisition,
        salesReps,
      },
    }));
  };

  const handleSalesProductivityChange = (
    opportunitiesPerRepPerMonth: number
  ) => {
    setAssumptions((current) => ({
      ...current,
      acquisition: {
        ...current.acquisition,
        opportunitiesPerRepPerMonth,
      },
    }));
  };

  const handleWinRateChange = (winRate: number) => {
    setAssumptions((current) => ({
      ...current,
      acquisition: {
        ...current.acquisition,
        winRate,
      },
    }));
  };

  const handleMarketingSpendChange = (
    marketingSpendPerMonth: number
  ) => {
    setAssumptions((current) => ({
      ...current,
      acquisition: {
        ...current.acquisition,
        marketingSpendPerMonth,
      },
    }));
  };

  const handleOtherHeadcountChange = (
    otherHeadcount: number
  ) => {
    setAssumptions((current) => ({
      ...current,
      costs: {
        ...current.costs,
        otherHeadcount,
      },
    }));
  };

  const handleGrossMarginChange = (
    grossMargin: number
  ) => {
    setAssumptions((current) => ({
      ...current,
      costs: {
        ...current.costs,
        grossMargin,
      },
    }));
  };

  const handleChurnChange = (monthlyChurnRate: number) => {
    setAssumptions((current) => ({
      ...current,
      monthlyChurnRate,
    }));
  };

  console.log(projection);

  return (
    <>
      <Header />

      <main>
        <CompanySummary
          companyName="Northstar Ops"
          description="B2B workflow software"
        />

        <div className="dashboard">
          <div className="driver-section">
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
                assumptions.acquisition.opportunitiesPerRepPerMonth
              }
              winRate={
                assumptions.acquisition.winRate
              }
              marketingSpendPerMonth={
                assumptions.acquisition.marketingSpendPerMonth
              }
              otherHeadcount={
                assumptions.costs.otherHeadcount
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
              onGrossMarginChange={
                handleGrossMarginChange
              }
            />

            <button
              className="reset-button"
              onClick={handleResetScenario}
            >
              Reset scenario
            </button>
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
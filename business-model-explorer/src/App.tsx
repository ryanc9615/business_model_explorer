import Header from "./components/Header"
import CompanySummary from "./components/CompanySummary"
import DriverPanel from "./components/DriverPanel"
import KPIGrid from "./components/KPIGrid"
import { baselineCompany } from "./data/baselineCompany"
import { calculateProjection } from "./model/calculateProjection"

function App() {
  const projection = calculateProjection(baselineCompany);

  console.log(projection)

  return (
    <>
      <Header />

      <main>
        <CompanySummary 
          companyName="Northstar Ops"
          description="B2B workflow software"
        />
        <div className="dashboard">
          <DriverPanel />
          <KPIGrid projection={projection} />
        </div>
      </main>
    </>  
  )
}

export default App
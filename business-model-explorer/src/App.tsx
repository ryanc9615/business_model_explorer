import Header from "./components/Header"
import CompanySummary from "./components/CompanySummary"
import DriverPanel from "./components/DriverPanel"
import KPIGrid from "./components/KPIGrid"

function App() {
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
          <KPIGrid />
        </div>
      </main>
    </>  
  )
}

export default App
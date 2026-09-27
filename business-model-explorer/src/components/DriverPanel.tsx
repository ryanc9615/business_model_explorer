import DriverControl from "./DriverControl";

function DriverPanel() {
    return (
        <section>
            <h2>Business Drivers</h2>
            <DriverControl label = "Monthly price" value="£1,500" />
            <DriverControl label = "Monthly chrun" value="1.5%" />
            <DriverControl label = "Sales reps" value="4" />
            <DriverControl label = "Win rate" value="10%" />
            <DriverControl label = "Marketing spend" value="£20,000" />
            <DriverControl label = "Employees" value="30" />
            <DriverControl label = "Gross margin" value="80%" />
            <DriverControl label = "Payment terms" value="30 days" />
        </section>
    )
}

export default DriverPanel
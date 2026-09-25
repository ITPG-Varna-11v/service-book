import CarsList from "./components/CarsList"
import CreateCarForm from "./components/CreateCarForm"

function App() {
  return (
    <main>
      <h1 className="font-semibold text-4xl text-center my-10">Car Service Book</h1>
      <div className="py-4 px-8 flex flex-col gap-4">
        <CreateCarForm />
        <CarsList />
      </div>
    </main>
  )
}

export default App
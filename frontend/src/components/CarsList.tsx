import { useEffect, useState } from "react"
import CarCard from "./CarCard"
import type { Car } from "./CarCard"

const CarsList = () => {
  const [cars, setCars] = useState<Car[]>([])

  useEffect(() => {
    fetch("http://localhost:8000/cars")
      .then(res => res.json())
      .then(data => setCars(data))
  }, [])

  const handleDelete = (carId: string) => {
    setCars(cars => cars.filter(car => car.id !== carId))
  }

  const handleUpdate = (updatedCar: Car) => {
    setCars(cars => cars.map(car => car.id === updatedCar.id ? updatedCar : car))
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {cars.map(car => (
        <CarCard
          key={car.id}
          car={car}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  )
}

export default CarsList
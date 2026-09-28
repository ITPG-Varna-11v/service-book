import { useState } from "react"
import { Edit, Trash, Wrench } from "lucide-react"
import EditCarDialog from "./EditDialog"
import ConfirmDeleteDialog from "./ConfirmDeleteDialog"

export interface Car {
  id: string
  title: string
  brand: string
  model: string
  year: number
  kilometrage: number
  vin: string | null
}

interface CarCardProps {
  car: Car
  onDelete: (carId: string) => void
  onUpdate: (car: Car) => void
}

const excluded = ["brand", "title", "model", "id"]

const CarCard = ({ car, onDelete, onUpdate }: CarCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDeleteCar = async (carId: string) => {
    const response = await fetch(
      `http://localhost:8000/cars/delete/${carId}`,
      {
        method: "DELETE",
      }
    )

    if (!response.ok) {
      throw new Error("Failed to delete car")
    }

    onDelete(carId)
  }

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md">
      <div className="mb-8 flex flex-row items-start justify-between">
        <div className="flex flex-col">
          <h2 className="mb-1 text-xl font-semibold text-gray-900">
            {car.title}
          </h2>

          <p className="text-sm text-gray-500">
            {car.brand} {car.model}
          </p>
        </div>

        <div className="flex flex-row gap-2">
          <button
            className="ml-auto rounded-full bg-red-500/10 p-2 text-red-500 hover:bg-red-500/20"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </button>

          <button
            className="ml-auto rounded-full bg-orange-500/15 p-2 text-orange-500 hover:bg-orange-500/25"
            onClick={() => setIsDialogOpen(true)}
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 rounded-lg bg-gray-50 p-4">
        {Object.entries(car)
          .filter(([key]) => !excluded.includes(key))
          .map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between border-b border-gray-200 pb-2 last:border-0 last:pb-0"
            >
              <span className="text-sm font-medium capitalize text-gray-500">
                {key}
              </span>

              <span className="text-sm text-gray-900">
                {String(value)}
              </span>
            </div>
          ))}
      </div>

      <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-sky-600 active:scale-[0.98]">
        <Wrench className="h-4 w-4" />
        Add a repair
      </button>

      <EditCarDialog
        car={car}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onUpdate={onUpdate}
      />

      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={() => handleDeleteCar(car.id)}
        itemName={car.title}
      />
    </div>
  )
}

export default CarCard
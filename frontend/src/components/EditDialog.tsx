import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { Car } from "./CarCard"

interface EditCarDialogProps {
  car: Car
  isOpen: boolean
  onClose: () => void
  onUpdate: (car: Car) => void
}

const EditCarDialog = ({ car, isOpen, onClose, onUpdate }: EditCarDialogProps) => {
  const [formData, setFormData] = useState<Car>(car)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setFormData(car)
      setError(null)
    }
  }, [isOpen, car])

  const handleFieldChange = (field: keyof Car, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "year" || field === "kilometrage"
          ? Number(value)
          : value === "" && field === "vin"
          ? null
          : value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    try {
      const response = await fetch(
        `http://localhost:8000/cars/edit/${car.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to update car")
      }

      onUpdate(formData)
      onClose()
    } catch (err) {
      console.error(err)
      setError("Failed to update car. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    if (isSaving) return
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Edit car</h3>
          <button
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              value={formData.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Brand
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              value={formData.brand}
              onChange={(e) => handleFieldChange("brand", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Model
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              value={formData.model}
              onChange={(e) => handleFieldChange("model", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Year
              </label>
              <input
                type="number"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                value={formData.year}
                onChange={(e) => handleFieldChange("year", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Kilometrage
              </label>
              <input
                type="number"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                value={formData.kilometrage}
                onChange={(e) =>
                  handleFieldChange("kilometrage", e.target.value)
                }
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              VIN
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              value={formData.vin ?? ""}
              onChange={(e) => handleFieldChange("vin", e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={handleClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-50"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditCarDialog
import { useState } from "react"

const CreateCarForm = () => {
  const [form, setForm] = useState({
    vin: "",
    title: "",
    brand: "",
    model: "",
    year: "",
    kilometrage: "",
  })

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    console.log("Submitting...", form)

    try {
      const response = await fetch("http://localhost:8000/cars/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          year: Number(form.year),
          kilometrage: Number(form.kilometrage),
        }),
      })

      console.log("Response:", response.status)

      if (response.ok) {
        alert("Car created!")
      } else {
        const error = await response.text()
        console.log("Backend error:", error)
        alert("Failed to create car")
      }
    } catch (error) {
      console.error("Request failed:", error)
      alert("Could not connect to backend")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col items-stretch gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end"
    >
      <div className="sm:flex-[2]">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          name="title"
          placeholder="Title"
          maxLength={50}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>

      <div className="sm:flex-[1.5]">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Brand
        </label>
        <input
          name="brand"
          placeholder="Brand"
          maxLength={50}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>

      <div className="sm:flex-[1.5]">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Model
        </label>
        <input
          name="model"
          placeholder="Model"
          maxLength={50}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>

      <div className="sm:flex-1">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Year
        </label>
        <input
          name="year"
          type="number"
          placeholder="Year"
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>

      <div className="sm:flex-1">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Kilometrage
        </label>
        <input
          name="kilometrage"
          type="number"
          placeholder="Kilometrage"
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>

      <div className="sm:flex-[1.5]">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          VIN
        </label>
        <input
          name="vin"
          placeholder="VIN"
          maxLength={17}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-50"
      >
        Create car
      </button>
    </form>
  )
}

export default CreateCarForm
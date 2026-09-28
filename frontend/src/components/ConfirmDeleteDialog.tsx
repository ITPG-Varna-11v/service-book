import { useState } from "react"
import { X } from "lucide-react"

interface ConfirmDeleteDialogProps {
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
  itemName?: string
}

const ConfirmDeleteDialog = ({
  isOpen,
  onClose,
  onDelete,
  itemName,
}: ConfirmDeleteDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      await onDelete()
      onClose()
    } catch (err) {
      console.error(err)
      setError("Failed to delete. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (isDeleting) return
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Delete {itemName || "item"}
          </h3>

          <button
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
            onClick={handleClose}
            disabled={isDeleting}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-medium text-gray-900">
              {itemName || "this item"}
            </span>
            ?
          </p>

          <p className="text-sm text-red-500">
            This action cannot be undone.
          </p>

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteDialog
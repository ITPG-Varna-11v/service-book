## 1. Project overview

This project is a small car service-book app for storing and managing cars. The app is aimed at a user who wants to keep a list of vehicles, edit their details, and eventually track repairs against a car record.

The backend is a FastAPI service with a SQLite database; the frontend is a React + TypeScript app that renders a list of cars and lets the user create, update, and delete records. There is no authentication, no routing library, and no external API integration in the current codebase.

## 2. Backend architecture

### Technologies used

- Framework: FastAPI 0.141.1
- API validation: Pydantic 2.13.5
- Database: SQLite via Peewee 4.5.1 (`SqliteDatabase("database.db")` in `backend/app/database.py`)
- ASGI server: Uvicorn 0.53.0
- HTTP stack: Starlette 1.6.0 (bundled with FastAPI)
- Auth: not used in this project
- External APIs: not used in this project

The app config is in `backend/app/main.py`:

- `app = FastAPI()`
- `CORSMiddleware` allows only `http://localhost:5173`
- `db.connect()` connects the Peewee database
- `db.create_tables([Car, CarPart, Repair])` creates the tables on startup

### Backend folder structure

```text
backend/
├── app/
│   ├── database.py          # Creates the Peewee SQLite database connection: `db = SqliteDatabase("database.db")`
│   ├── main.py              # FastAPI app setup, CORS config, and all CRUD routes for cars
│   ├── models.py            # Peewee model definitions for `Car`, `Repair`, and `CarPart`
│   └── schemas.py           # Pydantic request/validation models: `CarCreate` and `CarUpdate`
├── requirements.txt         # Python package versions for the backend
├── database.db              # SQLite database created by the app at runtime
└── .venv/                   # Local virtual environment; generated tooling, not application code
```

### Data model

The real models in `backend/app/models.py` are:

- `Car`
  - `id`: `UUIDField(primary_key=True, default=uuid.uuid4)`
  - `vin`: `TextField(unique=True)`
  - `title`: `TextField()`
  - `brand`: `TextField()`
  - `model`: `TextField()`
  - `year`: `IntegerField()`
  - `kilometrage`: `IntegerField()`

- `Repair`
  - `id`: `UUIDField(primary_key=True, default=uuid.uuid4)`
  - `price`: `FloatField()`
  - `title`: `TextField()`
  - `date`: `DateField()`
  - `kilometrage`: `IntegerField()`
  - `description`: `TextField()`

- `CarPart`
  - `id`: `UUIDField(primary_key=True, default=uuid.uuid4)`
  - `repair`: `ForeignKeyField(Repair, backref="parts")`
  - `title`: `TextField()`
  - `price`: `FloatField()`

Important detail: there is no `car_id` or `car` foreign key on `Repair`, and no endpoint currently creates a repair record. The repair data exists as a model, but it is not yet connected to a specific car in the current project.

### API endpoints

| Function / handler name | HTTP method | Route | Required params (query/path) | Request body (JSON shape) | Response shape |
| --- | --- | --- | --- | --- | --- |
| `get_cars` | GET | `/cars` | None | None | JSON array of car objects; each object matches the `Car` model shape: `{ "id": "<uuid>", "vin": "string", "title": "string", "brand": "string", "model": "string", "year": 2020, "kilometrage": 12345 }` |
| `get_car` | GET | `/cars/{car_id}` | Path param: `car_id` (string) | None | A single car object, returned by `Car.get(Car.id == car_id)`. The function does not catch a missing record; a nonexistent ID will raise an error. |
| `create_car` | POST | `/cars/create` | None | JSON body matching `CarCreate`: `{ "vin": "string", "title": "string", "brand": "string", "model": "string", "year": 2020, "kilometrage": 12345 }` | The created row from `Car.create(**car.model_dump())` |
| `delete_car` | DELETE | `/cars/delete/{car_id}` | Path param: `car_id` (string) | None | `{ "message": "Car deleted" }` |
| `edit_car` | PUT | `/cars/edit/{car_id}` | Path param: `car_id` (string) | JSON body matching `CarUpdate`: `{ "vin": "string", "title": "string", "brand": "string", "model": "string", "year": 2020, "kilometrage": 12345 }` | `{ "message": "Car updated" }` |

Notes on how the API is structured:

- All routes live in `backend/app/main.py`; there are no routers or modules split by resource.
- Route naming uses a resource-first pattern: `/cars`, `/cars/{car_id}`, `/cars/create`, `/cars/delete/{car_id}`, `/cars/edit/{car_id}`.
- The backend does not have a separate `routers/` folder or a `/repairs` route today.

## 3. Frontend architecture

### Technologies used

- Framework: React 19.2.8 with TypeScript (`typescript ~6.0.2`)
- Build tool: Vite 8.3.0
- Styling: Tailwind CSS 4.3.3 plus the Vite plugin `@tailwindcss/vite`
- State management: local React state only (`useState`); no Redux, Zustand, Context API, or other global store is used
- Routing: not used in this project
- UI library: `lucide-react` 1.48.0 is used for icons (`Trash`, `Edit`, `Wrench`, `X`)
- Data fetching library: not used in this project; the app calls `fetch()` directly inside component code

### Frontend folder structure

```text
frontend/
├── public/                   # Static public assets; no app-specific usage is present in the current codebase
├── src/
│   ├── App.tsx              # Main screen composition: renders `<CreateCarForm />` and `<CarsList />`
│   ├── index.css            # Global CSS; currently minimal and mostly not used for the app logic
│   ├── main.tsx             # `ReactDOM.createRoot(...).render(<App />)` bootstraps the React app
│   ├── assets/              # Local image/icon asset folder; no imported asset usage is evident in the app
│   └── components/
│       ├── CarCard.tsx      # Card for an individual car; includes delete, edit, and a placeholder “Add a repair” button
│       ├── CarsList.tsx     # Fetches the list of cars and renders `CarCard` items
│       ├── CreateCarForm.tsx # Form for submitting a new car to the backend
│       └── EditDialog.tsx    # Modal dialog for editing an existing car
├── README.md                # Project notes; not part of runtime behavior
├── eslint.config.js         # ESLint configuration
├── index.html               # Vite HTML shell
├── package.json             # Frontend dependencies and scripts (`dev`, `build`, `lint`, `preview`)
├── tsconfig.json            # Base TypeScript config
├── tsconfig.app.json        # App TS config for Vite/React
├── tsconfig.node.json       # Node-side TS config
├── vite.config.ts           # Vite config with React plugin and Tailwind plugin
└── public/                  # Also present as a static folder; no runtime page routing is configured here
```

### React basics as used in this project

- Components are written as function components in `.tsx` files (for example, `App`, `CarsList`, `CarCard`, `CreateCarForm`, `EditDialog`).
- Props are passed directly from parent to child components, such as `car={car}` and `onUpdate={handleUpdate}` in `CarsList` and `CarCard`.
- Component state is managed locally with `useState`, not through a store or a custom provider. Examples:
  - `CarsList` has `const [cars, setCars] = useState<Car[]>([])`
  - `CarCard` has `const [isDialogOpen, setIsDialogOpen] = useState(false)`
  - `EditCarDialog` has `const [formData, setFormData] = useState<Car>(car)`, `const [isSaving, setIsSaving] = useState(false)`, `const [error, setError] = useState<string | null>(null)`
- Side effects and remote fetching are done with `useEffect` and direct `fetch()` calls. There are no custom hooks and no data-fetching library such as React Query or SWR.
- The app uses plain JSX + Tailwind class names; there are no CSS modules or styled-components.

### Major component and page summaries

#### `App` (`frontend/src/App.tsx`)

- What it does: top-level app shell; renders the page title and the form/list layout.
- Hooks used: none.
- Functions defined or called: `App()` returns a `main` layout with `CreateCarForm` and `CarsList`.
- Data flow: no local state; it simply composes child components.

#### `CreateCarForm` (`frontend/src/components/CreateCarForm.tsx`)

- What it does: collects car fields and posts them to `POST http://localhost:8000/cars/create`.
- Hooks used: `useState` for form values.
- Functions defined or called:
  - `handleChange(e)` updates the form object by input name
  - `handleSubmit(e)` prevents default form submission, converts `year` and `kilometrage` to numbers, and calls `fetch()`
- Data flow: form values live in local state as `{ vin, title, brand, model, year, kilometrage }`; on submit they are serialized into JSON and sent to the backend. The component does not update the list of cars after success; it shows `alert()` messages instead.

#### `CarsList` (`frontend/src/components/CarsList.tsx`)

- What it does: fetches all cars on mount and renders a grid of `CarCard` components.
- Hooks used: `useEffect`, `useState`.
- Functions defined or called:
  - `useEffect(() => { fetch("http://localhost:8000/cars") ... }, [])` fetches all cars
  - `handleDelete(carId)` removes a car from the local `cars` array
  - `handleUpdate(updatedCar)` maps the updated car into the list
- Data flow: `cars` state is loaded from the API and passed to `CarCard` as props. `onDelete` and `onUpdate` are callback props that keep the list in sync without a global store.

#### `CarCard` (`frontend/src/components/CarCard.tsx`)

- What it does: displays one car in a card with its main fields, a delete button, an edit button, and an “Add a repair” button.
- Hooks used: `useState`.
- Functions defined or called:
  - `handleDeleteCar(carId)` calls `DELETE http://localhost:8000/cars/delete/${carId}`
  - `setIsDialogOpen(true)` opens the edit modal
  - `EditCarDialog` is mounted inside the card with props `car`, `isOpen`, `onClose`, and `onUpdate`
- Data flow: it receives `car`, `onDelete`, and `onUpdate` from `CarsList`. It does not fetch its own data. The card displays every field except `brand`, `title`, `model`, and `id` in the summary block via `Object.entries(car).filter(...)`.

#### `EditDialog` (`frontend/src/components/EditDialog.tsx`)

- What it does: modal form for editing a car record.
- Hooks used: `useState`, `useEffect`.
- Functions defined or called:
  - `handleFieldChange(field, value)` updates the current form object
  - `handleSave()` sends `PUT http://localhost:8000/cars/edit/${car.id}`
  - `handleClose()` stops saving and closes the dialog
- Data flow: `formData` starts from the current `car` object and is reset whenever the dialog opens with `useEffect([isOpen, car])`. On save, it sends JSON to the backend and calls `onUpdate(formData)` before closing. The parent list updates its state through the callback.

## 4. New task for the onboarding student

### Backend task: add a repair record for a car

The project currently has a `Repair` model in `backend/app/models.py`, but no route that creates one and no foreign key from `Repair` to `Car`. The current database design is therefore incomplete for “repairs by car.” A clean fix following the existing conventions would be:

1. Update `backend/app/models.py` to add a `car` foreign key to `Repair` or add a dedicated join model if the team wants multiple repairs per car.
2. Add a new route in `backend/app/main.py` following the project’s existing pattern:
   - Method: `POST`
   - Route: `/cars/{car_id}/repairs` or `/cars/{car_id}/repair/create` (choose one and keep it consistent with the style already used in the app)
   - Where it should live: in `backend/app/main.py` alongside the existing car routes; there is no router folder in this project

Suggested request body for the repair creation route, based on `Repair` fields already defined in `models.py`:

```json
{
  "title": "Oil change",
  "date": "2026-09-26",
  "price": 120.5,
  "kilometrage": 45600,
  "description": "Changed engine oil and filter"
}
```

A good backend implementation would also return the created repair record, for example:

```json
{
  "id": "<uuid>",
  "title": "Oil change",
  "date": "2026-09-26",
  "price": 120.5,
  "kilometrage": 45600,
  "description": "Changed engine oil and filter",
  "car": "<car_id>"
}
```

Important design note: the current `Repair` model does not have a `car` field, so this is not just an endpoint change; the data model itself must be updated before a repair can be tied to a car.

### Frontend task: add a repair form in the UI

Use a custom dialog/modal or a dedicated page. Since the project currently does not use `react-router`, the easiest fit is a modal dialog opened from `CarCard` next to the existing edit button. This matches the current project style because the car edit flow already uses `EditCarDialog` from the card.

The modal should contain a form with fields like:

- description
- date
- cost
- mileage

Because the existing repair model is `title`, `price`, `date`, `kilometrage`, and `description`, the form should map to those values. A sensible field list is:

- `title` (repair name)
- `date`
- `price`
- `kilometrage`
- `description`

The form should submit to the new backend endpoint, for example `POST http://localhost:8000/cars/{car_id}/repairs` with JSON matching the body above.

### Files to create or edit for this task

- [ ] `backend/app/models.py` — add the car-to-repair relationship if needed, based on the current `Repair`/`CarPart` pattern
- [ ] `backend/app/main.py` — add the new repair creation endpoint and keep it alongside the existing car routes
- [ ] `backend/app/schemas.py` — add a Pydantic model for the repair creation request (for example, `RepairCreate`)
- [ ] `frontend/src/components/CarCard.tsx` — add a UI trigger to open the new repair modal or page
- [ ] `frontend/src/components/RepairDialog.tsx` — create the new modal form for entering repair data
- [ ] `frontend/src/components/CarsList.tsx` — update state if the UI needs to refresh the list after a repair is added
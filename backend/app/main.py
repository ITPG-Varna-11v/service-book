from fastapi import FastAPI
from database import db
from models import Car, CarPart, Repair
from schemas import CarCreate, CarUpdate

# инициализаия на backend и database слой
app = FastAPI()

# свързване на база данни
db.connect()

# създаване на таблици
db.create_tables([Car, CarPart, Repair])

# ===== CRUD АВТОМОБИЛИ =====

# четене на всички автомобили
@app.get("/cars")
def get_cars():
    cars = []
    for car in Car.select():
        cars.append(car)

    return cars


# взимане на един автомобил
@app.get("/cars/{car_id}")
def get_car(car_id: str):
    car = Car.get(Car.id == car_id)
    return car


# създаване на автомобил
@app.post("/cars/create")
def create_car(car: CarCreate):
    return Car.create(**car.model_dump())

# изтриване на автомобил
@app.delete("/cars/{car_id}")
def delete_car(car_id: str):
    car = Car.get(Car.id == car_id)
    car.delete_instance()

    return {"message": "Car deleted"}

# редактиране на автомобил
@app.put("/cars/edit/{car_id}")
def edit_car(car_id: str, car: CarUpdate):
    Car.update(**car.model_dump()).where(Car.id == car_id).execute()

    return {"message": "Car updated"}
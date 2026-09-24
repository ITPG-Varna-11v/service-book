from models import BaseModel

class CarCreate(BaseModel):
    vin: str
    title: str
    brand: str
    model: str
    year: int
    kilometrage: int

class CarUpdate(BaseModel):
    vin: str
    title: str
    brand: str
    model: str
    year: int
    kilometrage: int
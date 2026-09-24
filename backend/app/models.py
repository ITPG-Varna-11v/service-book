from peewee import *
from database import db
import uuid


class BaseModel(Model):
    class Meta:
        database = db


class Car(BaseModel):
    id = UUIDField(primary_key=True, default=uuid.uuid4)

    vin = TextField(unique=True)
    title = TextField()

    brand = TextField()
    model = TextField()
    year = IntegerField()
    kilometrage = IntegerField()


class Repair(BaseModel):
    id = UUIDField(primary_key=True, default=uuid.uuid4)

    price = FloatField()
    title = TextField()
    date = DateField()
    kilometrage = IntegerField()
    description = TextField()


class CarPart(BaseModel):
    id = UUIDField(primary_key=True, default=uuid.uuid4)

    repair = ForeignKeyField(Repair, backref="parts")
    title = TextField()
    price = FloatField()

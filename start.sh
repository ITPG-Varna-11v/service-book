#!/bin/bash

cd backend
source .venv/bin/activate

cd app
uvicorn main:app --reload &

cd ../../frontend
npm run dev
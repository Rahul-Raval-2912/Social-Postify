@echo off
echo Starting Social Postify Backend...

cd backend\server

echo Installing requirements...
pip install -r ..\requirements.txt

echo Creating media directory...
if not exist "media\posts" mkdir media\posts

echo Running migrations...
python manage.py makemigrations
python manage.py migrate

echo Starting server...
python manage.py runserver

pause
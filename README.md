# Issue Board Real

Egy saját készítésű Ruby on Rails backend projekt, amely egy egyszerű issue tracking rendszert valósít meg.  
A cél egy bemutatható, valós backend referencia összeállítása volt Rails, PostgreSQL, JWT autentikáció és REST API használatával.

## Fő funkciók

- felhasználó regisztráció
- bejelentkezés JWT tokennel
- védett endpoint az aktuális felhasználó lekérdezésére
- projektek és issue-k kezelése
- issue létrehozás bejelentkezett felhasználóval
- issue státusz módosítása
- ownership check: a user csak a saját issue-ját módosíthatja
- minimál React frontend a backend kipróbálásához

## Használt technológiák

### Backend
- Ruby 3.2.11
- Rails 7.1.6
- PostgreSQL
- Puma
- bcrypt
- JWT
- rack-cors

### Frontend
- React
- Vite

### Egyéb
- Docker
- docker-compose

## Projekt célja

A projekt célja egy olyan Rails referenciaalkalmazás elkészítése, amely jól bemutatja a backend fejlesztési alapokat:

- autentikáció
- adatbázis modellezés
- REST API tervezés
- jogosultságkezelés
- Docker alapú futtatás
- frontend-backend integráció

A projektet tovább szeretném fejleszteni GraphQL, RSpec tesztek és bővebb CRUD funkcionalitás irányába.

## Adatmodell

### User
- email
- password_digest

### Project
- name

### Issue
- title
- description
- status
- project_id
- user_id

## Jelenlegi endpointok

### Auth
- `POST /register`
- `POST /login`
- `GET /me`

### Issues
- `GET /issues`
- `POST /issues`
- `PATCH /issues/:id`

## Autentikáció

A rendszer JWT alapú autentikációt használ.

Sikeres login után a backend tokent ad vissza, amelyet az `Authorization` headerben kell küldeni:

```bash
Authorization: Bearer <token>

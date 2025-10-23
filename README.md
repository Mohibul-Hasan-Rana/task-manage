# Task Management (Laravel + Inertia + React)

A small task-management app built with Laravel, Inertia.js and React. The project includes:

- Laravel backend (controllers, policies, service layer, resource, request, jobs, queue, mail)
- Inertia + React frontend components and layouts
- Unit and Feature tests (PHPUnit)
- Vite + TypeScript frontend build with generated route helpers (wayfinder)

## Quick setup

Requirements:
- PHP 8.1+
- Composer
- Node 22 (for Vite and frontend build)
- A database (e.g. MySQL, Postgres, Sqlite)

1. Install backend dependencies

```powershell
composer install
```

2. Install frontend dependencies

```powershell
npm install
```

3. Copy the environment file and generate an app key

```powershell
copy .env.example .env
php artisan key:generate
```

4. Update database and email information in env file. Provide database name, passsword, username.


5. Configure your database in `.env`, then run migrations and seeders

```powershell
php artisan migrate --seed
```

6. Build assets (dev or prod)

Dev (hot-reload):

```powershell
npm run dev
```
## Credentials

Admin Email : admin@example.com
Password : password

User Email : user@example.com
Password : password

User2 Email : user2@example.com
Password : password



## Running tests

Run the test suite with Laravel's test runner:

```powershell
php artisan test
```


## Useful commands

- Install PHP deps: `composer install`
- Install JS deps: `npm install`
- Run tests: `php artisan test`


## API Endpoints

This project exposes a small JSON API under `/api` for authentication and task management. The API uses Laravel Sanctum for token authentication.

Authentication

- POST /api/login
	- Body: { "email": string, "password": string }
	- Response: { "token": "<sanctum-token>", "user": { "name": string, "email": string } }

- POST /api/logout
	- Headers: Authorization: Bearer <token>
	- Response: { "message": "Logged out" }

Tasks (protected)

- GET /api/tasks
	- Returns list of tasks for the authenticated user (or all tasks for admin users depending on policy)

- POST /api/tasks
	- Body: { title, description, status }
	- Creates a new task belonging to the authenticated user.

- GET /api/tasks/{task}
	- Show a single task (authorization applied)

- PUT /api/tasks/{task}
	- Update a task (authorization applied)

- DELETE /api/tasks/{task}
	- Deletes a task (authorization applied)


## Scability and Future Updates

To improve scalability, we can integrate Redis to cache frequently used data like task lists, user sessions, and dashboard stats. This will help reduce database queries and speed up response times as the system grows. For better user experience, we can also add pagination and infinite scrolling, so tasks load gradually instead of all at once. Looking ahead, features like lazy loading, background jobs, and API rate limiting can further enhance performance and keep the application running smoothly even with heavy traffic.




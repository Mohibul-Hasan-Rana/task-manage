# Task Management (Laravel + Inertia + React)

A small task-management app built with Laravel, Inertia.js and React. The project includes:

- Laravel backend (controllers, policies, service layer)
- Inertia + React frontend components and layouts
- Unit and Feature tests (PHPUnit)
- Vite + TypeScript frontend build with generated route helpers (wayfinder)

## Quick setup

Requirements:
- PHP 8.1+
- Composer
- Node 18+ (for Vite and frontend build)
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

Production build:

```powershell
npm run build
```


## Running tests

Run the test suite with Laravel's test runner:

```powershell
php artisan test
```


## Useful commands

- Install PHP deps: `composer install`
- Install JS deps: `npm install`
- Build frontend (prod): `npm run build`
- Run tests: `php artisan test`
- Run only task tests: `php artisan test --group task`


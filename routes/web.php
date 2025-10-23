<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::controller(TaskController::class)->group(function () {
        Route::get('tasks', 'index')->name('tasks');
        Route::post('tasks', 'store')->name('tasks.store');
        Route::put('tasks/{task}', 'update')->name('tasks.update');
        Route::delete('tasks/{task}', 'destroy')->name('tasks.delete');
    });
});

require __DIR__ . '/settings.php';

<?php

use App\Http\Controllers\BasketballMatchDetailsController;
use App\Models\BasketballBracket;
use App\Models\BasketballPlayers;
use App\Http\Controllers\BasketballPlayersController;
use App\Http\Controllers\BasketballTeamController;
use App\Models\BasketballTeam;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BasketballBracketController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home'); // This renders Home.jsx in `Pages`
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/basketballteams', function () {
    return Inertia::render('BasketballTeams', [
        'teams' =>BasketballTeam::all()
    ]);
})->name('basketballteams.index');

// Resource routes for basketballteams (CRUD operations)
Route::resource('basketballteams', BasketballTeamController::class)->only(['index', 'store', 'edit', 'update', 'destroy']);

Route::get('/basketballplayers', function () {
    return Inertia::render('BasketballPlayers', [
        'players' => BasketballPlayers::all(),
        'teams' => BasketballTeam::all(), // If you need the teams for a dropdown in the form
    ]);
})->name('basketballplayers.index');

// Resource routes for basketballplayers (CRUD operations)
Route::resource('basketballplayers', BasketballPlayersController::class)->only(['index', 'store', 'edit', 'update', 'destroy']) 
->middleware(['auth', 'verified']);

Route::get('/basketballbracket', function () {
    return Inertia::render('BasketballBracket', [
        'teams' => BasketballTeam::all(),  // Passing teams to the Inertia component
        'brackets' => BasketballBracket::all(), // If you want to show the bracket
    ]);
})->name('basketballbracket.index');

// Resource routes for basketballbracket (CRUD operations)
Route::resource('basketballbracket', BasketballBracketController::class)->only(['index', 'store', 'edit', 'update', 'destroy']);

Route::get('/basketballschedule', [BasketballTeamController::class, 'schedule'])->name('basketballschedule');

Route::get('/basketballscoreboard', [BasketballPlayersController::class, 'showScoreboard'])->name('basketballscoreboard');

Route::post('/basketballmatchdetails', [BasketballMatchDetailsController::class, 'store'])->name('basketballmatchdetails.store');


require __DIR__.'/auth.php';

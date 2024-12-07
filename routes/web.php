<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Basketball\{
    BasketballTeamController, 
    BasketballPlayersController,
    BasketballMatchDetailsController,
    BasketballMatchScoreController,
    BasketballBracketController
    
};

use App\Http\Controllers\Volleyball\{
    VolleyballTeamController,
    VolleyballPlayersController,
    VolleyballMatchDetailsController,
    VolleyballMatchScoreController,
    VolleyballBracketController
};

use App\Http\Controllers\Baseball\{
    BaseballTeamController,
    BaseballPlayersController,
    BaseballMatchDetailsController,
    BaseballMatchScoreController,
    BaseballBracketController
};

use App\Http\Controllers\SepakTakraw\{
    SepakTakrawTeamController,
    SepakTakrawPlayersController,
    SepakTakrawMatchDetailsController,
    SepakTakrawMatchScoreController,
    SepakTakrawBracketController
};

use App\Http\Controllers\Football\{
    FootballTeamController, 
    FootballPlayersController,
    FootballMatchDetailsController,
    FootballMatchScoreController,
    FootballBracketController
};


use App\Http\Controllers\{
    ProfileController,
    LeagueController,
    AdminController,
    UserController,
    BasketballScheduleController,
    BaseballScheduleController,
    FootballScheduleController,
    SepakTakrawScheduleController,
    VolleyballScheduleController,

};



use App\Models\{
    BasketballTeam,
    BasketballBracket,
    VolleyballTeam,
    VolleyballBracket,
    BaseballTeam,
    BaseballBracket,
    SepakTakrawTeam,
    SepakTakrawBracket,
    FootballTeam,
    FootballBracket
};

// Home Route
Route::get('/', function () {
    return Inertia::render('Home'); 
});
Route::get('/register', function () {
    return Inertia::render('Register'); 
});





// USER BRACKET

Route::get('/UserBasketballBracket', [BasketballBracketController::class, 'userIndex'])->name('userbasketballbracket.index');
Route::get('/basketballbracket', function () {
    return Inertia::render('User-View/UserBasketballBracket'); 
});


Route::get('/UserBaseballBracket', [BaseballBracketController::class, 'userIndex'])->name('userbaseballbracket.index');
Route::get('/baseballbracket', function () {
    return Inertia::render('User-View/UserBaseballBracket'); 
});


Route::get('/UserFootballBracket', [FootballBracketController::class, 'userIndex'])->name('userfootballbracket.index');
Route::get('/footballbracket', function () {
    return Inertia::render('User=View/UserFootballBracket'); 
});


Route::get('/UserVolleyballBracket', [VolleyballBracketController::class, 'userIndex'])->name('uservolleyballbracket.index');
Route::get('/volleyballracket', function () {
    return Inertia::render('UserView/UserVolleyballBracket'); 
});


Route::get('/UserSepakTakrawBracket', [SepakTakrawBracketController::class, 'userIndex'])->name('usersepaktakrawballbracket.index');
Route::get('/sepaktakrawbracket', function () {
    return Inertia::render('User-View/UserSepakTakrawBracket'); 
});

// USER SCHEDULE

Route::get('/UserBasketballSchedule', function () {
    return Inertia::render('User-View/UserBasketballSchedule'); 
});

Route::get('/UserBaseballSchedule', function () {
    return Inertia::render('User-View/UserBaseballSchedule'); 
});

Route::get('/UserFootballSchedule', function () {
    return Inertia::render('User-View/UserFootballSchedule'); 
});

Route::get('/UserSepakTakrawSchedule', function () {
    return Inertia::render('User-View/UserSepakTakrawSchedule'); 
});

Route::get('/UserVolleyballSchedule', function () {
    return Inertia::render('User-View/UserVolleyballSchedule'); 
});

// USER SCOREBOARD

Route::get('/UserBasketballScoreboard', [BasketballPlayersController::class, 'UserShowScoreboard'])->name('basketballscoreboard');

Route::get('/UserVolleyballScoreboard', [VolleyballPlayersController::class, 'UserShowScoreboard'])->name('volleyballscoreboard');

Route::get('/UserSepakTakrawScoreboard', [SepakTakrawPlayersController::class, 'UserShowScoreboard'])->name('sepaktakrawscoreboard');

Route::get('/UserBaseballScoreboard', [BaseballPlayersController::class, 'UserShowScoreboard'])->name('baseballscoreboard');

Route::get('/UserFootballScoreboard', [FootballPlayersController::class, 'UserShowScoreboard'])->name('footballscoreboard');

// USER ADMIN


Route::get('basketball_match_score', [BasketballMatchScoreController::class, 'index']);



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

});






Route::middleware('auth')->group(function () {
    // Display the dashboard (which includes the form)
    Route::get('/leagues', [LeagueController::class, 'index']);
    // Handle form submissions for creating a new league
    Route::post('/leagues', [LeagueController::class, 'store'])->name('leagues.store');
    // In your routes/web.php or routes/api.php
    Route::post('/leagues/{id}/set-active', [LeagueController::class, 'setActiveLeague']);
    // Handle ending the active league
    Route::post('/leagues/end', [LeagueController::class, 'endActiveLeague']);
    
});

Route::post('/volleyballschedule', [VolleyballScheduleController::class, 'store']);
Route::post('/sepaktakrawballschedule', [SepakTakrawScheduleController::class, 'store']);

Route::post('/footballschedule', [FootballScheduleController::class, 'store']);

Route::post('/baseballschedule', [BaseballScheduleController::class, 'store']);

Route::post('/basketballschedule', [BasketballScheduleController::class, 'store']);

// Basketball Teams Routes (Authenticated and Verified Users Only)
Route::resource('basketballteams', BasketballTeamController::class)
    ->only(['index', 'store', 'update', 'destroy'])
    ->middleware(['auth', 'verified']);

Route::resource('basketballplayers', BasketballPlayersController::class)
    ->only(['index', 'store', 'update', 'destroy'])
    ->middleware(['auth', 'verified']);

Route::post('basketballmatchdetails', [BasketballMatchDetailsController::class, 'store'])
    ->middleware('auth');

Route::get('basketballmatchdetails', [BasketballMatchDetailsController::class, 'index']);

Route::post('basketballmatchscore', [BasketballMatchScoreController::class, 'store'])->name('basketballmatchscore.store')
    ->middleware('auth');

Route::get('basketball_match_score', [BasketballMatchScoreController::class, 'index']);


Route::get('/basketballbracket', function () {
    return Inertia::render('Basketball/BasketballBracket', [
        'teams' => BasketballTeam::all(),  // Passing teams to Inertia component
        'brackets' => BasketballBracket::all(),
    ]);
})->name('basketballbracket.index');

// Basketball Schedule Route
Route::get('/basketballschedule', [BasketballTeamController::class, 'schedule'])->name('basketballschedule')
->middleware(['auth', 'verified']);

// Basketball Scoreboard Route
Route::get('/basketballscoreboard', [BasketballPlayersController::class, 'showScoreboard'])->name('basketballscoreboard');


Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});


Route::resource('volleyballteams', VolleyballTeamController::class)
    ->only(['index', 'store', 'update', 'destroy'])
    ->middleware(['auth', 'verified']);

    Route::resource('volleyballplayers', VolleyballPlayersController::class)
    ->only(['index', 'store', 'update', 'destroy'])
    ->middleware(['auth', 'verified']);

Route::post('volleyballmatchdetails', [VolleyballMatchDetailsController::class, 'store'])
    ->middleware('auth');

Route::get('volleyballmatchdetails', [VolleyballMatchDetailsController::class, 'index']);

Route::post('volleyballmatchscore', [VolleyballMatchScoreController::class, 'store'])->name('volleyballmatchscore.store')
    ->middleware('auth');

Route::get('volleyball_match_score', [VolleyballMatchScoreController::class, 'index']);


Route::get('/volleyballbracket', function () {
    return Inertia::render('Volleyball/VolleyballBracket', [
        'teams' => VolleyballTeam::all(),  // Passing teams to Inertia component
        'brackets' => VolleyballBracket::all(),
    ]);
})->name('volleyballbracket.index');

Route::get('/volleyballschedule', [VolleyballTeamController::class, 'schedule'])->name('volleyballschedule');

Route::get('/volleyballscoreboard', [VolleyballPlayersController::class, 'showScoreboard'])->name('volleyballscoreboard');



Route::resource('baseballteams', BaseballTeamController::class)
    ->only(['index', 'store', 'update', 'destroy'])
    ->middleware(['auth', 'verified']);

Route::resource('baseballplayers', BaseballPlayersController::class)
    ->only(['index', 'store', 'update', 'destroy'])
    ->middleware(['auth', 'verified']);

Route::post('baseballmatchdetails', [BaseballMatchDetailsController::class, 'store'])
    ->middleware('auth');

Route::get('baseballmatchdetails', [BaseballMatchDetailsController::class, 'index']);

Route::post('baseballmatchscore', [BaseballMatchScoreController::class, 'store'])->name('baseballmatchscore.store')
    ->middleware('auth');

Route::get('baseball_match_score', [BaseballMatchScoreController::class, 'index']);


Route::get('/baseballbracket', function () {
    return Inertia::render('Baseball/BaseballBracket', [
        'teams' => BaseballTeam::all(),  // Passing teams to Inertia component
        'brackets' => BaseballBracket::all(),
    ]);
})->name('baseballbracket.index');

// baseball Schedule Route
Route::get('/baseballschedule', [BaseballTeamController::class, 'schedule'])->name('baseballschedule');

// baseball Scoreboard Route
Route::get('/baseballscoreboard', [BaseballPlayersController::class, 'showScoreboard'])->name('baseballscoreboard');


Route::resource('sepaktakrawteams', SepakTakrawTeamController::class)
    ->only(['index', 'store', 'update', 'destroy'])
    ->middleware(['auth', 'verified']);

    Route::resource('sepaktakrawplayers', SepakTakrawPlayersController::class)
    ->only(['index', 'store', 'update', 'destroy'])
    ->middleware(['auth', 'verified']);

Route::post('sepaktakrawmatchdetails', [SepakTakrawMatchDetailsController::class, 'store'])
    ->middleware('auth');

Route::get('sepaktakrawmatchdetails', [SepakTakrawMatchDetailsController::class, 'index']);

Route::post('sepaktakrawmatchscore', [SepakTakrawMatchScoreController::class, 'store'])->name('sepaktakrawmatchscore.store')
    ->middleware('auth');

Route::get('sepaktakraw_match_score', [SepakTakrawMatchScoreController::class, 'index']);


Route::get('/sepaktakrawbracket', function () {
    return Inertia::render('SepakTakraw/SepakTakrawBracket', [
        'teams' => SepakTakrawTeam::all(),  // Passing teams to Inertia component
        'brackets' => SepakTakrawBracket::all(),
    ]);
})->name('sepaktakrawbracket.index');

Route::get('/sepaktakrawschedule', [SepakTakrawTeamController::class, 'schedule'])->name('sepaktakrawschedule');

Route::get('/sepaktakrawscoreboard', [SepakTakrawPlayersController::class, 'showScoreboard'])->name('sepaktakrawscoreboard');


Route::resource('footballteams', FootballTeamController::class)
    ->only(['index', 'store', 'update', 'destroy'])
    ->middleware(['auth', 'verified']);

Route::resource('footballplayers', FootballPlayersController::class)
    ->only(['index', 'store', 'update', 'destroy'])
    ->middleware(['auth', 'verified']);

Route::post('footballmatchdetails', [FootballMatchDetailsController::class, 'store'])
    ->middleware('auth');

Route::get('footballmatchdetails', [FootballMatchDetailsController::class, 'index']);

Route::post('footballmatchscore', [FootballMatchScoreController::class, 'store'])->name('footballmatchscore.store')
    ->middleware('auth');

Route::get('football_match_score', [FootballMatchScoreController::class, 'index']);


Route::get('/footballbracket', function () {
    return Inertia::render('Football/FootballBracket', [
        'teams' => FootballTeam::all(),  // Passing teams to Inertia component
        'brackets' => FootballBracket::all(),
    ]);
})->name('footballbracket.index');

// football Schedule Route
Route::get('/footballschedule', [FootballTeamController::class, 'schedule'])->name('footballschedule');

// football Scoreboard Route
Route::get('/footballscoreboard', [FootballPlayersController::class, 'showScoreboard'])->name('footballscoreboard');


Route::get('/user-bracket', function () {
    return Inertia::render('UserBasketballBracket');
})->name('user.bracket');

Route::get('/users', [UserController::class, 'index']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);


// Include Auth Routes
require __DIR__.'/auth.php';




Route::middleware('auth')->group(function () {
    // User-specific routes
    Route::middleware('role:user')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Dashboard');
        })->name('dashboard');
    });

    // Admin-specific routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
        Route::delete('/admin/users/{id}', [AdminController::class, 'destroy'])->name('admin.users.destroy');
    });
});

// Fallback Route
Route::fallback(function () {
    return redirect()->route('dashboard')->with('error', 'Unauthorized access!');
});






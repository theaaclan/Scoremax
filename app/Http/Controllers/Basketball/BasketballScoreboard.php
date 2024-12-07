<?php

namespace App\Http\Controllers\Basketball;
use App\Http\Controllers\Controller;

use App\Models\BasketballTeam;
use App\Models\BasketballMatchDetails;
use Inertia\Inertia;
use Illuminate\Http\Request;

class BasketballScoreboard extends Controller
{
    public function index()
    {
        $teams = BasketballTeam::all(); // Get all teams
        $matchDetails = BasketballMatchDetails::with(['player', 'team'])->get(); // Include player and team details

        return Inertia::render('BasketballScoreboard', [
            'teams' => $teams,
            'matchDetails' => $matchDetails,
        ]);
    }

    public function userIndex()
{
    $teams = BasketballTeam::all(); // Get all teams
    $matchDetails = BasketballMatchDetails::with(['player', 'team'])->get(); 


    return Inertia::render('User-View/UserBasketballScoreboard', [
        'teams' => $teams,
       'matchDetails' => $matchDetails,
    ]);
}
// Save scoreboard state
public function saveScoreboard(Request $request)
{
    $user = auth()->user();
    $state = $request->input('state');

    // Save state to database (e.g., a JSON column in the user's table)
    $user->scoreboard_state = json_encode($state);
    $user->save();

    return response()->json(['message' => 'Scoreboard state saved.']);
}

// Get scoreboard state
public function getScoreboard()
{
    $user = auth()->user();

    return response()->json([
        'state' => json_decode($user->scoreboard_state, true),
    ]);
}

}

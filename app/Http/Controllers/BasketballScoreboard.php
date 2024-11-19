<?php

namespace App\Http\Controllers;

use App\Models\BasketballTeam;
use App\Models\BasketballMatchDetails;
use Inertia\Inertia;

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
}

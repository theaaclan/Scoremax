<?php

// app/Http/Controllers/BasketballPlayerController.php

namespace App\Http\Controllers;

use App\Models\BasketballTeam;
use App\Models\BasketballPlayers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class BasketballPlayersController extends Controller
{
    public function index()
    {
        // Fetch players associated with the currently authenticated user
        $players = Auth::user()->basketballPlayers;
        $teams = Auth::user()->basketballTeams;

        return Inertia::render('BasketballPlayers', [
            'players' => $players,
            'teams' => $teams  // Pass the teams to the view
        ]);
    }

    public function store(Request $request)
    {
        // Validate the incoming data
        $validatedData = $request->validate([
            'FullName' => 'required|string|max:50',
            'Height' => 'required|string|max:50',
            'Weight' => 'required|string|max:50',
            'Position' => 'required|string|max:50',
            'Jersey_num' => 'required|integer',
            'TeamID' => 'nullable|exists:basketballteams,TeamID', // TeamID can be nullable
        ]);

        $teamName = null;
    if ($validatedData['TeamID']) {
        $team = BasketballTeam::find($validatedData['TeamID']);
        $teamName = $team ? $team->TeamName : null;
    }


        // Create a new basketball player for the authenticated user
        $player = new BasketballPlayers($validatedData);
        $player->TeamName = $teamName; // Set the TeamName
        $player->user_id = Auth::id();  // Assign the player to the authenticated user
        $player->save();

        // Redirect back to the basketball players index page
        return redirect()->route('basketballplayers.index')->with('success', 'Player added successfully');
    }

    public function edit($id)
    {
        // Fetch the player by its ID and make sure it belongs to the authenticated user
        $player = BasketballPlayers::where('PlayerID', $id)->where('user_id', Auth::id())->firstOrFail();
        $teams = Auth::user()->basketballTeams;

        // Pass the player and teams data to the edit view
        return Inertia::render('BasketballPlayerEdit', [
            'player' => $player,
            'teams' => $teams  // Pass the teams to the view
        ]);
    }

    public function update(Request $request, $id)
    {
        $player = BasketballPlayers::where('PlayerID', $id)->where('user_id', Auth::id())->firstOrFail();
    
        $validatedData = $request->validate([
            'FullName' => 'required|string|max:50',
            'Height' => 'required|string|max:50',
            'Weight' => 'required|string|max:50',
            'Position' => 'required|string|max:50',
            'Jersey_num' => 'required|integer',
            'TeamID' => 'nullable|exists:basketballteams,TeamID',
        ]);
    
        $teamName = null;
        if ($validatedData['TeamID']) {
            $team = BasketballTeam::find($validatedData['TeamID']);
            $teamName = $team ? $team->TeamName : null;
        }
    
        $player->update(array_merge($validatedData, ['TeamName' => $teamName]));
    
        return redirect()->route('basketballplayers.index')->with('success', 'Player updated successfully');
    }
    

    public function destroy($id)
    {
        // Fetch the player by its ID and make sure it belongs to the authenticated user
        $player = BasketballPlayers::where('PlayerID', $id)->where('user_id', Auth::id())->firstOrFail();

        $player->delete();

        return redirect()->route('basketballplayers.index')->with('success', 'Player deleted successfully');
    }

    public function showScoreboard()
    {
        $teams = BasketballTeam::all();  // Fetch all basketball teams
        $basketballPlayers = BasketballPlayers::all();  // Fetch all basketball players

        return Inertia::render('BasketballScoreboard', [
            'teams' => $teams,
            'basketballPlayers' => $basketballPlayers,  // Pass players to the view
        ]);
    }
}

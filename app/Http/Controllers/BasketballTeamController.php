<?php

namespace App\Http\Controllers;

use App\Models\BasketballTeam;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class BasketballTeamController extends Controller
{
    public function index()
    {
        // Get the authenticated user's basketball teams
        $teams = Auth::user()->basketballTeams;

        // Pass the teams data to the view
        return Inertia::render('BasketballTeams', [
            'teams' => $teams,
            'auth' => [
                'user' => Auth::user()
            ],
        ]);
    }

    public function store(Request $request)
    {
        // Validate the incoming data
        $validatedData = $request->validate([
            'TeamName' => 'required|string|max:50',
            'CoachName' => 'required|string|max:50',
            'PlayerCount' => 'required|integer',
        ]);

        // Create a new basketball team for the authenticated user
        $team = new BasketballTeam($validatedData);
        $team->user_id = Auth::id();  // Assign the team to the authenticated user
        $team->save();

        return redirect()->route('basketballteams.index')->with('success', 'Team added successfully');
    }

    public function edit($id)
    {
        // Fetch the team by its ID and ensure it belongs to the authenticated user
        $team = BasketballTeam::where('TeamID', $id)->where('user_id', Auth::id())->firstOrFail();

        return Inertia::render('BasketballTeamEdit', [
            'team' => $team
        ]);
    }

    public function update(Request $request, $id)
    {
        // Fetch the team by its ID and ensure it belongs to the authenticated user
        $team = BasketballTeam::where('TeamID', $id)->where('user_id', Auth::id())->firstOrFail();

        // Validate and update the team
        $validatedData = $request->validate([
            'TeamName' => 'required|string|max:50',
            'CoachName' => 'required|string|max:50',
            'PlayerCount' => 'required|integer',
        ]);

        $team->update($validatedData);

        return redirect()->route('basketballteams.index')->with('success', 'Team updated successfully');
    }

    public function destroy($id)
    {
        // Fetch the team by its ID and ensure it belongs to the authenticated user
        $team = BasketballTeam::where('TeamID', $id)->where('user_id', Auth::id())->firstOrFail();

        $team->delete();

        return redirect()->route('basketballteams.index')->with('success', 'Team deleted successfully');
    }

    public function schedule()
    {
        // Fetch teams and ensure they are passed as an array to the component
        $teams = BasketballTeam::where('user_id', Auth::id())->get();

        return Inertia::render('BasketballSchedule', [
            'initialTeams' => $teams->toArray(),
        ]);
    }

    public function scoreboard()
{
    // Fetch all teams with their players
    $teams = BasketballTeam::with('players')->where('user_id', Auth::id())->get();

    return Inertia::render('BasketballScoreboard', [
        'teams' => $teams,
    ]);
}
}

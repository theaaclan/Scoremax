<?php

namespace App\Http\Controllers;

use App\Models\BasketballTeam;
use App\Models\BasketballMatchDetails;
use Illuminate\Http\Request;

use Inertia\Inertia;

class BasketballMatchDetailsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // In BasketballMatchDetailsController.php
public function index()
{
    // Get teams with players and match details with the associated player
   
}


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
       // Ensure that matchDetails is an array of stats
       $matchDetails = $request->input('matchDetails');
        
       foreach ($matchDetails as $detail) {
           BasketballMatchDetails::create([
               'team_id' => $detail['team_id'],
               'player_id' => $detail['player_id'],
               'user_id' => $detail['user_id'],
               'Points' => $detail['Points'],
               'Assists' => $detail['Assists'],
               'Rebounds' => $detail['Rebounds'],
               'Blocks' => $detail['Blocks'],
               'Fouls' => $detail['Fouls'],
           ]);
       }

       return redirect()->back()->with('success', 'Stats saved successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(BasketballMatchDetails $basketballMatchDetails)
    {
        
}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BasketballMatchDetails $basketballMatchDetails)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BasketballMatchDetails $basketballMatchDetails)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BasketballMatchDetails $basketballMatchDetails)
    {
        //
    }
    
}

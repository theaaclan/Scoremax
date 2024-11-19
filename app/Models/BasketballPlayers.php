<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BasketballPlayers extends Model
{
    use HasFactory;

    protected $table = 'basketballplayers';
    protected $primaryKey = 'PlayerID';

    protected $fillable = [
        'FullName',
        'Height',
        'Weight',
        'Position',
        'Jersey_num',
        'TeamID',
        'TeamName',
        'user_id',
    ];

    public function team()
    {
        return $this->belongsTo(BasketballTeam::class, 'TeamID', 'TeamID');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function matchDetails()
    {
        return $this->hasMany(BasketballMatchDetails::class, 'player_id', 'PlayerID');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BasketballTeam extends Model
{
    use HasFactory;

    protected $table = 'basketballteams';
    protected $primaryKey = 'TeamID';

    protected $fillable = [
        'TeamName',
        'CoachName',
        'PlayerCount',
        'user_id',  // Foreign key column
    ];

    // Define relationship with User
    // app/Models/BasketballTeam.php

public function user()
{
    return $this->belongsTo(User::class, 'user_id');
}

public function players()
{
    return $this->hasMany(BasketballPlayers::class, 'TeamID');
}
public function basketballPlayers()
{
    return $this->hasMany(BasketballPlayers::class,'team_id', 'TeamID');
}



    
}


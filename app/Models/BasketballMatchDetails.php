<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BasketballMatchDetails extends Model
{
    use HasFactory;
    protected $fillable = [
        'team_id',
        'player_id',
        'user_id',
        'Points',
        'Assists',
        'Rebounds',
        'Blocks',
        'Fouls',
    ];
}

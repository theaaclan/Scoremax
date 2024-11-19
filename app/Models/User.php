<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Define relationship with BasketballTeam
    public function basketballTeams()
    {
        return $this->hasMany(BasketballTeam::class, 'user_id');
    }

    public function basketballPlayers()
{
    return $this->hasMany(BasketballPlayers::class, 'user_id');
}

public function basketballBrackets()
    {
        return $this->hasMany(BasketballBracket::class, 'user_id');
    }
    public function matchDetails()
{
    return $this->hasMany(BasketballMatchDetails::class, 'user_id');
}

}

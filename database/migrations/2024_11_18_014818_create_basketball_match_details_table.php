<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('basketball_match_details', function (Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->id('MatchDetailID'); // Primary key
            $table->unsignedBigInteger('team_id'); // Foreign key to basketballteams
            $table->unsignedBigInteger('player_id'); // Foreign key to basketballplayers
            $table->unsignedBigInteger('user_id'); // Foreign key to users
            $table->integer('Points');
            $table->integer('Assists');
            $table->integer('Rebounds');
            $table->integer('Blocks');
            $table->integer('Fouls');
            $table->timestamps();

            // Define foreign key relationships
            $table->foreign('team_id')
                ->references('TeamID')
                ->on('basketballteams')
                ->onDelete('cascade');

            $table->foreign('player_id')
                ->references('PlayerID')
                ->on('basketballplayers')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('basketball_match_details');
    }
};

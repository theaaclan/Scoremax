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
        Schema::create('basketballplayers', function (Blueprint $table) {
            $table->engine = 'InnoDB';  // Set the engine to InnoDB

            $table->id('PlayerID');  // Primary key for the basketballplayers table
            $table->string('FullName');
            $table->string('Height');
            $table->string('Weight');
            $table->string('Position');
            $table->integer('Jersey_num');
            $table->unsignedBigInteger('TeamID')->nullable();  // Make TeamID nullable
            $table->string('TeamName')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();  // Make user_id nullable

            // Define the foreign key relationship for TeamID
            $table->foreign('TeamID')
                ->references('TeamID')  // Reference the TeamID column in basketballteams
                ->on('basketballteams')  // Specify the basketballteams table
                ->onDelete('cascade');  // Cascade delete behavior when the team is deleted

            // Define the foreign key relationship for user_id
            $table->foreign('user_id')
                ->references('id')  // Reference the id column in users table
                ->on('users')  // Specify the users table
                ->onDelete('cascade');  // Cascade delete behavior when the user is deleted

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('basketballplayers');
    }
};


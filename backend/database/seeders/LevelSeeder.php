<?php

namespace Database\Seeders;

use App\Models\Level;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Level::factory()->create([
            "name" => "Beginner",
            'status' => 1,
            'created_at' => now()->subSeconds(10)
        ]);
        Level::factory()->create([
            "name" => "Fresher",
            'status' => 1,
            'created_at' => now()->subSeconds(1)
        ]);
        Level::factory()->create([
            "name" => "Inter",
            'status' => 1,
            'created_at' => now()->subSeconds(5)
        ]);
    }
}

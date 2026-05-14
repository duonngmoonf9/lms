<?php

namespace Database\Seeders;

use App\Models\Languages;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('languages')->insert([
            "name" => "VN",
            'status' => 1,
            'created_at' => now()->subSeconds(10)
        ]);
        DB::table('languages')->insert([
            "name" => "Tàu khựa",
            'status' => 1,
            'created_at' => now()->subSeconds(1)
        ]);
        DB::table('languages')->insert([
            "name" => "Mẽo",
            'status' => 1,
            'created_at' => now()->subSeconds(5)
        ]);
    }
}

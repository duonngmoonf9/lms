<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('categories')->insert([
            "name" => "Web",
            "slug" => "web",
            'status' => 1,
            'created_at' => now()->subSeconds(10)
        ]);
        DB::table('categories')->insert([
            "name" => "Marketing",
            "slug" => "marketing",
            'status' => 1,
            'created_at' => now()->subSeconds(1)
        ]);
        DB::table('categories')->insert([
            "name" => "Sale",
            "slug" => "sale",
            'status' => 1,
            'created_at' => now()->subSeconds(5)
        ]);
    }
}

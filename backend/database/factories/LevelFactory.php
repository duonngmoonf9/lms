<?php

namespace Database\Factories;

use App\Models\Level;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Level>
 */
class LevelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     *
     *
     * php artisan make:factory RoleFactory (lệnh này)
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->name(),
            'status' => rand(0, 1),
        ];
    }
}

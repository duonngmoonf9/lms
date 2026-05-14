<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * php artisan make:seeder DatabaseSeeder (tạo ra bảng dữ liệu mẫu cần nạp vào db kiểu như là tôi muốn tạo ra user có name như này và pass mail như này trong db)
     * php artisan db:seed --class=DatabaseSeeder (chạy lệnh này nó sẽ tạo ra dữ liệu nạp vào bảng tương ứng)
     * Seed the application's database.
     * php artisan make:seeder DatabaseSeeder (lệnh này)
     */
    public function run(): void
    {
        //kiểu setup nạp dữ liệu thủ công
        /*DB::table('users')->insert([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'), // Mã hóa mật khẩu
            'role' => 1, // Vai trò admin
        ]);*/


        //Kiểu setup nạp dữ liệu thông qua fake
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('123'),
            'remember_token' => '',
            'created_at' => now()->subSeconds(2)
        ]);
        User::factory()->create([
            'name' => 'duong',
            'email' => 'duongtrinh1012@gmail.com',
            'password' => bcrypt('123'),
            'remember_token' => '',
            'created_at' => now()->subSeconds(1)
        ]);
        User::factory()->count(3)->create();
        $this->call([
            LanguageSeeder::class,
            CategorySeeder::class,
            LevelSeeder::class,
        ]);
    }
}

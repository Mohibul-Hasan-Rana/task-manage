<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleAndUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        $adminRole = Role::firstOrCreate(
            ['name' => 'Admin']
        );

        $userRole = Role::firstOrCreate(
            ['name' => 'User']
        );

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role_id' => $adminRole->id,
        ]);

        User::factory()->create([
            'name' => 'Normal User',
            'email' => 'user@example.com',
            'role_id' => $userRole->id,
        ]);

        User::factory()->create([
            'name' => 'Normal User',
            'email' => 'user2@example.com',
            'role_id' => $userRole->id,
        ]);
    }
}

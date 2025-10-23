<?php

namespace Tests\Unit;

use App\Models\Role;
use App\Models\Task;
use App\Models\User;
use App\Policies\TaskPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_update_own_incomplete_task()
    {
        $user = User::factory()->create();
        $task = Task::factory()->for($user)->create(['status' => 'incomplete']);

        $policy = new TaskPolicy();

        $this->assertTrue($policy->update($user, $task));
    }

    public function test_owner_cannot_update_completed_task()
    {
        $user = User::factory()->create();
        $task = Task::factory()->for($user)->create(['status' => 'complete']);

        $policy = new TaskPolicy();

        $this->assertFalse($policy->update($user, $task));
    }

    public function test_admin_can_update_any_task()
    {
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $admin = User::factory()->create(['role_id' => $adminRole->id]);

        $other = User::factory()->create();
        $task = Task::factory()->for($other)->create(['status' => 'complete']);

        $policy = new TaskPolicy();

        $this->assertTrue($policy->update($admin, $task));
    }

    public function test_delete_uses_same_logic_as_update()
    {
        $user = User::factory()->create();
        $task = Task::factory()->for($user)->create(['status' => 'incomplete']);

        $policy = new TaskPolicy();

        $this->assertEquals($policy->update($user, $task), $policy->delete($user, $task));
    }

    public function test_view_any_is_allowed_for_authenticated()
    {
        $user = User::factory()->create();
        $policy = new TaskPolicy();

        $this->assertTrue($policy->viewAny($user));
    }
}

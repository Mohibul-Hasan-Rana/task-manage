<?php

namespace Tests\Unit;

use App\Models\Task;
use App\Models\User;
use App\Services\TaskService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_task_sets_user_and_fields()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $service = new TaskService();

        $data = [
            'title' => 'Service Task',
            'description' => 'Created by service',
            'status' => 'incomplete',
        ];

        $task = $service->createTask($data);

        $this->assertInstanceOf(Task::class, $task);
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Service Task',
            'user_id' => $user->id,
        ]);
    }

    public function test_update_task_changes_fields()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $task = Task::factory()->for($user)->create([
            'title' => 'Old Title',
            'description' => 'Old',
            'status' => 'incomplete',
        ]);

        $service = new TaskService();

        $service->updateTask($task, [
            'title' => 'New Title',
            'description' => 'Updated',
            'status' => 'inprogress',
        ]);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'New Title',
            'status' => 'inprogress',
        ]);
    }

    public function test_delete_task_removes_it()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $task = Task::factory()->for($user)->create();

        $service = new TaskService();

        $service->deleteTask($task);

        $this->assertDatabaseMissing('tasks', [
            'id' => $task->id,
        ]);
    }

    public function test_get_tasks_for_user_returns_only_their_tasks()
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        Task::factory()->count(2)->for($user)->create();
        Task::factory()->count(3)->for($other)->create();

        $service = new TaskService();

        $tasks = $service->getTasksForUser($user->id);

        $this->assertCount(2, $tasks);
        foreach ($tasks as $task) {
            $this->assertEquals($user->id, $task->user_id);
        }
    }

    public function test_get_all_tasks_returns_with_user_relation()
    {
        $user = User::factory()->create();
        Task::factory()->count(2)->for($user)->create();

        $service = new TaskService();

        $all = $service->getAllTasks();

        $this->assertGreaterThanOrEqual(2, $all->count());
        $this->assertTrue($all->first()->relationLoaded('user') || isset($all->first()->user));
    }
}

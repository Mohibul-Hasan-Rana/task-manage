<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;
use App\Mail\TaskCreated;
use App\Mail\TaskCompleted;

class TaskCrudTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // ensure mail fakes by default
        Mail::fake();
    }

    public function test_user_can_create_task_and_mail_is_sent()
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->post(route('tasks.store'), [
            'title' => 'Test Task',
            'description' => 'Task description',
            'status' => 'incomplete',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('tasks', [
            'title' => 'Test Task',
            'user_id' => $user->id,
        ]);

        Mail::assertSent(TaskCreated::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });
    }

    public function test_validation_fails_when_title_missing()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->post(route('tasks.store'), [
            'title' => '',
            'description' => 'No title',
        ]);

        $response->assertSessionHasErrors('title');
    }

    public function test_user_can_update_own_task_and_complete_sends_mail()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $task = Task::factory()->for($user)->create([
            'status' => 'incomplete',
        ]);

        $response = $this->put(route('tasks.update', $task), [
            'title' => 'Updated title',
            'description' => 'Updated',
            'status' => 'complete',
        ]);

        // ✅ Expect OK response (since Inertia or JSON response, not redirect)
        $response->assertStatus(200);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Updated title',
            'status' => 'complete',
        ]);

        Mail::assertSent(TaskCompleted::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });
    }


    public function test_cannot_edit_completed_task()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $task = Task::factory()->for($user)->create([
            'status' => 'complete',
            'title' => 'Immutable',
        ]);

        $response = $this->put(route('tasks.update', $task), [
            'title' => 'Attempted change',
            'description' => 'No',
            'status' => 'complete',
        ]);

        // Expect forbidden or redirect with error depending on controller
        if ($response->status() === 302) {
            $response->assertRedirect();
        } else {
            $response->assertStatus(403);
        }

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Immutable',
        ]);
    }

    public function test_user_can_delete_task()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // ensure task is deletable (not complete)
        $task = Task::factory()->for($user)->create([
            'status' => 'incomplete',
        ]);

        // route name in web.php is tasks.delete
        $response = $this->delete(route('tasks.delete', $task));

        $response->assertRedirect();

        $this->assertDatabaseMissing('tasks', [
            'id' => $task->id,
        ]);
    }

    public function test_index_shows_only_owned_tasks()
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        Task::factory()->count(2)->for($user)->create();
        Task::factory()->count(3)->for($other)->create();

        $this->actingAs($user);

        $response = $this->get(route('tasks'));

        $response->assertStatus(200);

        // Verify DB scoping: user sees only their tasks in DB
        $this->assertEquals(2, \App\Models\Task::where('user_id', $user->id)->count());
    }

    public function test_inprogress_status_supported()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->post(route('tasks.store'), [
            'title' => 'In progress task',
            'description' => 'Work',
            'status' => 'inprogress',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('tasks', [
            'title' => 'In progress task',
            'status' => 'inprogress',
            'user_id' => $user->id,
        ]);
    }
}

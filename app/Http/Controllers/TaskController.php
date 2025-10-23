<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class TaskController extends Controller
{
    use AuthorizesRequests;
    protected $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }
    public function index()
    {
        $this->authorize('viewAny', Task::class);

        $userId = Auth::id();
        $cacheKey = "tasks_user_{$userId}";

        $tasks = Cache::remember($cacheKey, now()->addMinutes(5), function () {
            return $this->taskService->getAllTasks();
        });

        return Inertia::render('tasks', [
            'tasks' => $tasks
        ]);
    }

    public function store(CreateTaskRequest $request)
    {
        $task = $this->taskService->createTask($request->validated());

        // Clear the tasks cache for the current user
        $this->clearTasksCache();

        return redirect()->back()->with('success', 'Task created successfully.');
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $this->authorize('update', $task);
        $oldStatus = $task->status;

        $task = $this->taskService->updateTask($task, $request->validated());

        // Clear the tasks cache for all users who can see this task
        $this->clearTasksCache();

        return redirect()->back()->with('success', 'Task updated successfully.');
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        
        $task->delete();

        // Clear the tasks cache for all users who could see this task
        $this->clearTasksCache();

        return redirect()->back()->with('success', 'Task deleted successfully.');
    }

    /**
     * Clear the tasks cache for the current user
     */
    protected function clearTasksCache()
    {
        $userId = Auth::id();
        Cache::forget("tasks_user_{$userId}");
    }
}

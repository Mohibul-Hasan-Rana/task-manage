<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use App\Services\TaskService;
use Exception;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Illuminate\Auth\Access\AuthorizationException;

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
        try {

            $task = $this->taskService->createTask($request->validated());
            $this->clearTasksCache();

            return redirect()->back()->with('success', 'Task created successfully.');
        } catch (Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }

    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
       try {
            $this->authorize('update', $task);

            $this->taskService->updateTask($task, $request->validated());
            $this->clearTasksCache();

            return redirect()->back()->with('success', 'Task updated successfully.');
        } catch (AuthorizationException $e) {
             return redirect()->back()->with('error', 'You are not authorized to update this task.');
        } catch (Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function destroy(Task $task)
    {
        try {
            $this->authorize('delete', $task);

            $task->delete();
            $this->clearTasksCache();

            return redirect()->back()->with('success', 'Task deleted successfully.');
        } catch (AuthorizationException $e) {
             return redirect()->back()->with('error', 'You are not authorized to delete this task.');
        } catch (Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
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

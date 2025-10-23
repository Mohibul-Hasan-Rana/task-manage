<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Requests\CreateTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use App\Services\TaskService;
use App\Http\Resources\TaskResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class TaskController extends Controller
{
    use AuthorizesRequests;

    protected $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $cacheKey = "tasks_user_{$user->id}";

        $tasks = Cache::remember($cacheKey, now()->addMinutes(5), function () use ($user) {
            return $this->taskService->getTasksForUser($user->id);
        });

        return TaskResource::collection($tasks);
    }

    public function store(CreateTaskRequest $request)
    {
        $task = $this->taskService->createTask($request->validated());

        // clear cache for the user
        $userId = $request->user()->id;
        Cache::forget("tasks_user_{$userId}");

        return new TaskResource($task);
    }

    public function show(Task $task)
    {
        $this->authorize('view', $task);
        return new TaskResource($task);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $this->authorize('update', $task);
        $task = $this->taskService->updateTask($task, $request->validated());

        // clear cache for the user
        $userId = $task->user_id;
        Cache::forget("tasks_user_{$userId}");

        return new TaskResource($task);
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        $userId = $task->user_id;
        $this->taskService->deleteTask($task);

        // clear cache for the user
        Cache::forget("tasks_user_{$userId}");
        return response()->noContent();
    }
}

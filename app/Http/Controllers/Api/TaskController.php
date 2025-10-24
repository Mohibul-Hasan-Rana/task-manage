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
use Exception;
use Illuminate\Auth\Access\AuthorizationException;

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
        try {
            $user = $request->user();
            $cacheKey = "tasks_user_{$user->id}";

            $tasks = Cache::remember($cacheKey, now()->addMinutes(5), function () use ($user) {
                return $this->taskService->getTasksForUser($user->id);
            });

            return TaskResource::collection($tasks);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch tasks.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(CreateTaskRequest $request)
    {
        try {
            $task = $this->taskService->createTask($request->validated());

            Cache::forget("tasks_user_{$request->user()->id}");

            return (new TaskResource($task))
                ->additional(['message' => 'Task created successfully.']);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to create task.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Task $task)
    {
        try {
            $this->authorize('view', $task);
            return new TaskResource($task);
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => 'You are not authorized to view this task.',
            ], 403);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch task details.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        try {
            $this->authorize('update', $task);
            $task = $this->taskService->updateTask($task, $request->validated());

            Cache::forget("tasks_user_{$task->user_id}");

            return (new TaskResource($task))
                ->additional(['message' => 'Task updated successfully.']);
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => 'You are not authorized to update this task.',
            ], 403);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to update task.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Task $task)
    {
        try {
            $this->authorize('delete', $task);

            $userId = $task->user_id;
            $this->taskService->deleteTask($task);
            Cache::forget("tasks_user_{$userId}");

            return response()->json([
                'message' => 'Task deleted successfully.',
            ], 200);
        } catch (AuthorizationException $e) {
            return response()->json([
                'message' => 'You are not authorized to delete this task.',
            ], 403);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to delete task.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

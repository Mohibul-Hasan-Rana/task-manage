<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
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
        $tasks = $this->taskService->getAllTasks();

        return Inertia::render('tasks', [
            'tasks' => $tasks
        ]);
    }

    public function store(CreateTaskRequest $request)
    {
        $task = $this->taskService->createTask($request->validated());

        return redirect()->back()->with('success', 'Task created successfully.');
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $this->authorize('update', $task);
        $oldStatus = $task->status;


        $task = $this->taskService->updateTask($task, $request->validated());

        // if ($oldStatus !== $task->status && $task->status === 'complete') {
        //     // Observer handles dispatch
        // }

        // Observer handles dispatch code in observer

        return redirect()->back()->with('success', 'Task updated successfully.');
    }

    public function destroy(Task $task)
    {
        $task->delete();

        return redirect()->back()->with('success', 'Task deleted successfully.');
    }
}

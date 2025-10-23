<?php

namespace App\Services;

use App\Models\Task;
use Illuminate\Support\Facades\Auth;

class TaskService
{
    public function createTask(array $validatedData)
    {
        return Task::create([
            'title' => $validatedData['title'],
            'description' => $validatedData['description'],
            'status' => $validatedData['status'],
            'user_id' => Auth::id(),
        ]);
    }

    public function updateTask(Task $task, array $validatedData)
    {
        $task->update([
            'title' => $validatedData['title'],
            'description' => $validatedData['description'],
            'status' => $validatedData['status'],
            // user_id remains unchanged
        ]);

        return $task;
    }

    public function deleteTask(Task $task)
    {
        return $task->delete();
    }

    public function getAllTasks()
    {
        return Task::with('user')->latest()->get();
    }

    /**
     * Get tasks for a specific user
     *
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getTasksForUser(int $userId)
    {
        return Task::with('user')->where('user_id', $userId)->latest()->get();
    }
}

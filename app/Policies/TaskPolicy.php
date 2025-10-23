<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    public function update(User $user, Task $task): bool
    {
        // Admin can update any task
        if ($user->role?->name === 'Admin') {
            return true;
        }

        // Users can only update their own tasks
        return $user->id === $task->user_id;
    }

    public function delete(User $user, Task $task): bool
    {
        // Use same logic as update
        return $this->update($user, $task);
    }

    public function viewAny(User $user): bool
    {
        // All authenticated users can view tasks
        return true;
    }
}

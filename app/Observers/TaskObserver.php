<?php

namespace App\Observers;

use App\Jobs\SendTaskNotification;
use App\Models\Task;

class TaskObserver
{
    public function created(Task $task): void
    {
        SendTaskNotification::dispatch($task, 'created');
    }

    public function updated(Task $task): void
    {
        if ($task->wasChanged('status') && $task->status === 'complete') {
            SendTaskNotification::dispatch($task, 'completed');
        }
    }
}

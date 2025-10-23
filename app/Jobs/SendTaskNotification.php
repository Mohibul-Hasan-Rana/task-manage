<?php

namespace App\Jobs;

use App\Mail\TaskCompleted;
use App\Mail\TaskCreated;
use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendTaskNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected Task $task;
    protected string $action;

    /**
     * Create a new job instance.
     */
    public function __construct(Task $task, string $action)
    {
        $this->task = $task;
        $this->action = $action;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $mailClass = match ($this->action) {
            'created' => TaskCreated::class,
            'completed' => TaskCompleted::class,
            default => throw new \InvalidArgumentException('Invalid action'),
        };

        Mail::to($this->task->user)->send(new $mailClass($this->task));
    }
}


import AppLayout from '@/layouts/app-layout';
import { tasks } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import UpdateTaskModal from '../components/tasks/UpdateTaskModal';
import Notification from '../components/Notification';
import { Task } from '@/types/task';

interface Props {
    tasks: Task[];
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tasks', href: tasks().url },
];

const Tasks: React.FC<Props> = ({ tasks: tasksList, flash }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    type TaskFilter = 'all' | 'incomplete' | 'inprogress' | 'complete';
    const [filter, setFilter] = useState<TaskFilter>('all');

    // Handle flash messages from Laravel
    useEffect(() => {
        if (flash?.success || flash?.error) {
            queueMicrotask(() => {
                if (flash.success) setNotification({ message: flash.success, type: 'success' });
                else if (flash.error) setNotification({ message: flash.error, type: 'error' });
            });
        }
    }, [flash]);

    // Auto-hide notification after 3s
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // Filter logic
    const filteredTasks =
        filter === 'all' ? tasksList : tasksList.filter((task) => task.status === filter);

    // Group filtered tasks by status
    const groupedTasks = {
        todo: filteredTasks.filter((task) => task.status === 'incomplete'),
        inprogress: filteredTasks.filter((task) => task.status === 'inprogress'),
        done: filteredTasks.filter((task) => task.status === 'complete'),
    };

    const columnStyles = {
        todo: 'bg-blue-50 border-blue-200',
        inprogress: 'bg-amber-50 border-amber-200',
        done: 'bg-green-50 border-green-200',
    };

    const columnTitles = {
        todo: 'To Do',
        inprogress: 'In Progress',
        done: 'Done',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="flex flex-col h-full gap-6 p-4">
                <div className="flex flex-wrap justify-between items-center gap-3">
                    <h2 className="text-2xl font-semibold text-gray-900">Tasks</h2>

                    <div className="flex items-center gap-3">
                        Filter :
                        {/* Filter Dropdown */}
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as TaskFilter)}
                            className="border-gray-300 rounded-md text-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="all">All</option>
                            <option value="incomplete">To DO</option>
                            <option value="inprogress">In Progress</option>
                            <option value="complete">Done</option>
                        </select>

                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 cursor-pointer"
                            title="Create New Task"
                        >
                            New Task
                        </button>
                    </div>
                </div>


                {/* Kanban Board */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(['todo', 'inprogress', 'done'] as const).map((key) => (
                        <div key={key} className={`border rounded-xl p-4 ${columnStyles[key]}`}>
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                {columnTitles[key]}
                            </h3>

                            <div className="flex flex-col gap-3">
                                {groupedTasks[key].length > 0 ? (
                                    groupedTasks[key].map((task) => (
                                        <div
                                            key={task.id}
                                            className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
                                        >
                                            <div className="flex items-start justify-between">
                                                <h4 className="font-medium text-gray-900 mb-1">
                                                    {task.title}
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    {/* View Task */}
                                                    {task.status === 'complete' ? (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedTask(task);
                                                                setIsUpdateModalOpen(true);
                                                            }}
                                                            className="text-gray-600 hover:text-gray-900 p-1 rounded-md cursor-pointer relative"
                                                            title="View Task"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                                                                <circle cx="12" cy="12" r="3" />
                                                            </svg>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedTask(task);
                                                                setIsUpdateModalOpen(true);
                                                            }}
                                                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md cursor-pointer"
                                                            title="Edit Task"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                                                                <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                                            </svg>
                                                        </button>
                                                    )}

                                                    {/* Delete Task */}
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to delete this task?')) {
                                                                router.delete(`/tasks/${task.id}`, {
                                                                    preserveScroll: true,
                                                                    onSuccess: () => setNotification({ message: 'Task deleted', type: 'success' }),
                                                                    onError: () => setNotification({ message: 'Error deleting task', type: 'error' }),
                                                                });
                                                            }
                                                        }}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded-md cursor-pointer"
                                                        title="Delete Task"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                            <polyline points="3 6 5 6 21 6" />
                                                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                            <path d="M10 11v6" />
                                                            <path d="M14 11v6" />
                                                            <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                                                        </svg>
                                                    </button>
                                                </div>

                                            </div>
                                            <p className="text-sm text-gray-600">{task.description}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No tasks</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
            <UpdateTaskModal
                isOpen={isUpdateModalOpen}
                onClose={() => {
                    setIsUpdateModalOpen(false);
                    setSelectedTask(null);
                }}
                task={selectedTask}
            />
        </AppLayout>
    );
};

export default Tasks;

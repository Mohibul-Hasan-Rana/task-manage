import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { router } from '@inertiajs/react';
import { Task, TaskStatus } from '@/types/task';
import Notification from '@/components/Notification';

interface UpdateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
}

interface InertiaErrors {
    [field: string]: string | string[];
}

// Wrapper to force re-render when task changes
const UpdateTaskModal: React.FC<UpdateTaskModalProps> = (props) => {
    if (!props.task) return null;
    return <UpdateTaskModalContent key={props.task.id} {...props} />;
};

const UpdateTaskModalContent: React.FC<UpdateTaskModalProps> = ({ isOpen, onClose, task }) => {
    const [formData, setFormData] = useState({
        title: task?.title ?? '',
        description: task?.description ?? '',
        status: (task?.status ?? 'incomplete') as TaskStatus,
    });

    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Auto-hide notification after 3 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);


    if (!task) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!task || task.status === 'complete') return;

        router.put(`/tasks/${task.id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                setNotification({ message: 'Task updated successfully', type: 'success' });
                onClose();
            },
            onError: (errors: InertiaErrors) => {
                const firstErrorValue = Object.values(errors)[0];
                const firstError = Array.isArray(firstErrorValue) ? firstErrorValue[0] : firstErrorValue;
                setNotification({ message: firstError || 'Something went wrong', type: 'error' });
            },
        });
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md relative z-50">
                    <Dialog.Title className="text-lg font-medium mb-4">Update Task</Dialog.Title>

                    {notification && (
                        <Notification
                            message={notification.message}
                            type={notification.type}
                            onClose={() => setNotification(null)}
                        />
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${task.status === 'complete' ? 'bg-gray-50' : 'focus:border-indigo-500 focus:ring-indigo-500'}`}
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                readOnly={task.status === 'complete'}
                                disabled={task.status === 'complete'}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${task.status === 'complete' ? 'bg-gray-50' : 'focus:border-indigo-500 focus:ring-indigo-500'}`}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                readOnly={task.status === 'complete'}
                                disabled={task.status === 'complete'}
                                rows={3}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            {task.status === 'complete' ? (
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                                    value={formData.status}
                                    readOnly
                                    disabled
                                />
                            ) : (
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                                >
                                    <option value="incomplete">To do</option>
                                    <option value="inprogress">In progress</option>
                                    <option value="complete">Done</option>
                                </select>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                onClick={onClose}
                            >
                                {task.status === 'complete' ? 'Close' : 'Cancel'}
                            </button>
                            {task.status !== 'complete' && (
                                <button
                                    type="submit"
                                    className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 cursor-pointer"
                                >
                                    Update Task
                                </button>
                            )}
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default UpdateTaskModal;

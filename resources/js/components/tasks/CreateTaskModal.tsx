import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { TaskStatus } from '@/types/task';
import Notification from '@/components/Notification';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface InertiaErrors {
  [field: string]: string | string[];
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose }) => {
    const { data, setData, post, processing, reset } = useForm({
        title: '',
        description: '',
        status: 'incomplete' as TaskStatus,
    });

    const [notification, setNotification] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

    // Reset form and notification when modal opens
    useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/tasks', {
            preserveScroll: true,
            onSuccess: () => {
                setNotification({ message: 'Task created successfully.', type: 'success' });
                onClose();
                reset();
            },
            onError: (errors: InertiaErrors) => {
                const firstErrorValue = Object.values(errors)[0];
                const firstError = Array.isArray(firstErrorValue)
                    ? firstErrorValue[0]
                    : firstErrorValue;
                setNotification({ message: firstError || 'Something went wrong', type: 'error' });
            },
        });
    };

    // Auto-hide notification after 3 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
                    <Dialog.Title className="text-lg font-medium mb-4">Create New Task</Dialog.Title>

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
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                required
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value as TaskStatus)}
                            >
                                <option value="incomplete">To do</option>
                                <option value="inprogress">In progress</option>
                                <option value="complete">Done</option>
                            </select>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                onClick={() => { onClose(); reset(); setNotification(null); }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
                            >
                                Create Task
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default CreateTaskModal;

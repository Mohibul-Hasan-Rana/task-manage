import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { router } from '@inertiajs/react';
import { TaskFormData, TaskStatus } from '@/types/task';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<TaskFormData>({
        title: '',
        description: '',
        status: 'incomplete' as TaskStatus
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/tasks', formData, {
            onSuccess: () => {
                onClose();
                setFormData({ title: '', description: '', status: 'incomplete' });
            },
        });
    };

    const renderStatusLabel = (status: TaskStatus) => {
        switch (status) {
            case 'inprogress':
                return 'In Progress';
            default:
                return status.charAt(0).toUpperCase() + status.slice(1);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
                    <Dialog.Title className="text-lg font-medium mb-4">Create New Task</Dialog.Title>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <div className="mt-1 flex items-center gap-3">
                                    <select
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={formData.status}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                            setFormData({ ...formData, status: e.target.value as TaskStatus })}
                                    >
                                        <option value="incomplete">Incomplete</option>
                                        <option value="inprogress">In Progress</option>
                                        <option value="complete">Complete</option>
                                    </select>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                        {renderStatusLabel(formData.status)}
                                    </span>
                                </div>
                            </div>


                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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

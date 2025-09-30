import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserForm } from '@/components/forms/UserForm';
import { userController } from '@/controllers/userController';
import { CreateUserFormData } from '@/models/auth';

export const UserCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateUserFormData) => {
    try {
      setIsLoading(true);
      await userController.createUser(data);
      navigate('/users');
    } catch (error) {
      console.error('Failed to create user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create User</h1>
        <p className="text-muted-foreground">
          Add a new user to the system
        </p>
      </div>

      {/* Form */}
      <UserForm
        mode="create"
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      {/* Cancel Button */}
      <div className="flex justify-end">
        <button
          onClick={handleCancel}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

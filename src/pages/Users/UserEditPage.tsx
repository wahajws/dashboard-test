import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserForm } from '@/components/forms/UserForm';
import { Skeleton } from '@/components/ui/skeleton';
import { userController } from '@/controllers/userController';
import { CreateUserFormData, UpdateUserFormData } from '@/models/auth';

export const UserEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userData, setUserData] = useState<Partial<CreateUserFormData> | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      try {
        setIsLoadingUser(true);
        const user = await userController.getUser(parseInt(id));
        setUserData({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: '', // Don't pre-fill password
          icNumber: user.icNumber || 0,
          icTypeId: user.icTypeId || 1,
          genderId: user.genderId,
          isVerified: user.isVerified,
          recordStatusId: user.recordStatusId || 1,
        });
      } catch (error) {
        console.error('Failed to fetch user:', error);
        navigate('/users');
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleSubmit = async (data: UpdateUserFormData) => {
    if (!id) return;

    try {
      setIsLoading(true);
      await userController.updateUser(parseInt(id), data);
      navigate('/users');
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };

  if (isLoadingUser) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">User not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
        <p className="text-muted-foreground">
          Update user information
        </p>
      </div>

      {/* Form */}
      <UserForm
        mode="edit"
        initialData={userData}
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

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GENDER_OPTIONS, IC_TYPE_OPTIONS, RECORD_STATUS_OPTIONS } from '@/models/user';

const createUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  icNumber: z.number().min(1, 'IC number must be greater than 0'),
  icTypeId: z.number().min(1, 'IC type is required'),
  genderId: z.number().min(1, 'Gender is required'),
  isVerified: z.boolean(),
  recordStatusId: z.number().min(1, 'Record status is required'),
});

const updateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  icNumber: z.number().min(1, 'IC number must be greater than 0').optional(),
  icTypeId: z.number().min(1, 'IC type is required').optional(),
  genderId: z.number().min(1, 'Gender is required').optional(),
  isVerified: z.boolean().optional(),
  recordStatusId: z.number().min(1, 'Record status is required').optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;
type UpdateUserFormData = z.infer<typeof updateUserSchema>;

interface UserFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<CreateUserFormData>;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  mode,
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const schema = mode === 'create' ? createUserSchema : updateUserSchema;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      icNumber: 0,
      icTypeId: 1,
      genderId: 1,
      isVerified: false,
      recordStatusId: 1,
    },
  });

  const watchedValues = watch();

  const handleFormSubmit = (data: CreateUserFormData | UpdateUserFormData) => {
    // Remove empty password field for updates
    if (mode === 'edit' && !data.password) {
      delete data.password;
    }
    onSubmit(data);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Create New User' : 'Edit User'}
        </CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? 'Fill in the details to create a new user account.'
            : 'Update the user information below.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                {...register('firstName')}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password {mode === 'create' ? '*' : '(leave empty to keep current)'}
            </Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              placeholder={mode === 'create' ? 'Enter password' : 'Enter new password'}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* IC Number */}
            <div className="space-y-2">
              <Label htmlFor="icNumber">IC Number *</Label>
              <Input
                id="icNumber"
                type="number"
                {...register('icNumber', { valueAsNumber: true })}
                placeholder="Enter IC number"
              />
              {errors.icNumber && (
                <p className="text-sm text-destructive">{errors.icNumber.message}</p>
              )}
            </div>

            {/* IC Type */}
            <div className="space-y-2">
              <Label htmlFor="icTypeId">IC Type *</Label>
              <Select
                value={watchedValues.icTypeId?.toString()}
                onValueChange={(value) => setValue('icTypeId', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select IC type" />
                </SelectTrigger>
                <SelectContent>
                  {IC_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.icTypeId && (
                <p className="text-sm text-destructive">{errors.icTypeId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="genderId">Gender *</Label>
              <Select
                value={watchedValues.genderId?.toString()}
                onValueChange={(value) => setValue('genderId', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.genderId && (
                <p className="text-sm text-destructive">{errors.genderId.message}</p>
              )}
            </div>

            {/* Record Status */}
            <div className="space-y-2">
              <Label htmlFor="recordStatusId">Record Status *</Label>
              <Select
                value={watchedValues.recordStatusId?.toString()}
                onValueChange={(value) => setValue('recordStatusId', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {RECORD_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.recordStatusId && (
                <p className="text-sm text-destructive">{errors.recordStatusId.message}</p>
              )}
            </div>
          </div>

          {/* Verified Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isVerified"
              checked={watchedValues.isVerified || false}
              onCheckedChange={(checked) => setValue('isVerified', checked)}
            />
            <Label htmlFor="isVerified">Verified User</Label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : mode === 'create' ? 'Create User' : 'Update User'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

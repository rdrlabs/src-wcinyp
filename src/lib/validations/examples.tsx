/**
 * Example usage of Zod validation schemas with react-hook-form
 * This file demonstrates how to integrate the validation schemas
 * with forms in your React components.
 */

import { useForm } from 'react-hook-form';
import { logger } from '@/lib/logger';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from './auth';
import { createContactSchema, type CreateContactInput } from './contact';

// Example 1: Login Form
export function LoginFormExample() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    logger.debug('Valid login data', data, 'ValidationExamples');
    // Handle login logic here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          type="email"
          placeholder="Email"
          {...register('email')}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          {...register('password')}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <div>
        <label>
          <input type="checkbox" {...register('rememberMe')} />
          Remember me
        </label>
      </div>

      <button type="submit" disabled={isSubmitting}>
        Login
      </button>
    </form>
  );
}

// Example 2: Create Contact Form
export function CreateContactFormExample() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateContactInput>({
    resolver: zodResolver(createContactSchema),
  });

  const onSubmit = async (data: CreateContactInput) => {
    logger.debug('Valid contact data', data, 'ValidationExamples');
    // Handle contact creation here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Name" />
      {errors.name && <span>{errors.name.message}</span>}

      <select {...register('type')}>
        <option value="">Select type</option>
        <option value="Provider">Provider</option>
        <option value="Facility">Facility</option>
        <option value="Insurance">Insurance</option>
        <option value="Lab">Lab</option>
        <option value="Vendor">Vendor</option>
        <option value="Government">Government</option>
        <option value="Location">Location</option>
      </select>
      {errors.type && <span>{errors.type.message}</span>}

      <input {...register('department')} placeholder="Department" />
      {errors.department && <span>{errors.department.message}</span>}

      <input {...register('phone')} placeholder="Phone" />
      {errors.phone && <span>{errors.phone.message}</span>}

      <input {...register('email')} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('location')} placeholder="Location" />
      {errors.location && <span>{errors.location.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        Create Contact
      </button>
    </form>
  );
}

// Example 3: Runtime validation without forms
import { documentSchema } from './document';

export function validateDocumentExample() {
  // Valid document
  const validDoc = {
    name: 'Patient Consent Form.pdf',
    size: '2.5 MB',
    path: '/documents/forms/consent.pdf',
    category: 'Consent Forms',
  };

  try {
    const validated = documentSchema.parse(validDoc);
    logger.debug('Valid document', validated, 'ValidationExamples');
  } catch (error) {
    logger.error('Validation error', error, 'ValidationExamples');
  }

  // Invalid document (will throw)
  const invalidDoc = {
    name: '', // Empty name
    size: 'invalid size', // Invalid format
    path: '/documents/test.pdf',
  };

  const result = documentSchema.safeParse(invalidDoc);
  if (!result.success) {
    logger.error('Validation errors', result.error.errors, 'ValidationExamples');
  }
}

// Example 4: API endpoint validation
import { NextApiRequest, NextApiResponse } from 'next';

export async function apiHandlerExample(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Validate request body
  const validation = createContactSchema.safeParse(req.body);
  
  if (!validation.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: validation.error.errors,
    });
  }

  // Use validated data
  const contact = validation.data;
  
  // Process the contact...
  
  return res.status(200).json({ success: true, contact });
}
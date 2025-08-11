import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { useForm } from '@tanstack/react-form';
import { useEffect } from 'react';
import { api } from '../../convex/_generated/api';
import { 
  FormField, 
  TextInput, 
  Textarea, 
  Select, 
  NumberInput 
} from '../components/TanStackFormComponents';

const CreateSpacePage = () => {
  const navigate = useNavigate();
  
  // Fetch facilities from Convex
  const facilities = useQuery(api.facilities.list) || [];
  
  // Convex mutations
  const createSpace = useMutation(api.spaces.create);
  const createPricing = useMutation(api.pricing.create);

  const spaceTypes = [
    { value: 'sports_pitch', label: 'Sports Pitch' },
    { value: 'meeting_room', label: 'Meeting Room' },
    { value: 'hot_desk', label: 'Hot Desk' },
    { value: 'event_hall', label: 'Event Hall' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'other', label: 'Other' },
  ];

  const sportTypes = [
    'football', 'tennis', 'basketball', 'cricket', 'rugby', 'hockey', 'badminton', 'volleyball', 'squash', 'golf'
  ];

  // Form setup with TanStack Form
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      type: 'sports_pitch' as const,
      sportType: '',
      capacity: 1,
      images: [] as string[],
      amenities: [] as string[],
      facilityId: '',
      basePrice: 0,
      peakPrice: 0,
      offPeakPrice: 0,
      weekendPrice: 0,
      depositPercentage: 25,
      minBookingDuration: 1,
      maxBookingDuration: 24,
      schedule: {
        monday: { 
          isOpen: true, 
          openTime: '09:00', 
          closeTime: '22:00',
          isPeak: true, 
          peakStartTime: '17:00', 
          peakEndTime: '21:00' 
        },
        tuesday: { 
          isOpen: true, 
          openTime: '09:00', 
          closeTime: '22:00',
          isPeak: true, 
          peakStartTime: '17:00', 
          peakEndTime: '21:00' 
        },
        wednesday: { 
          isOpen: true, 
          openTime: '09:00', 
          closeTime: '22:00',
          isPeak: true, 
          peakStartTime: '17:00', 
          peakEndTime: '21:00' 
        },
        thursday: { 
          isOpen: true, 
          openTime: '09:00', 
          closeTime: '22:00',
          isPeak: true, 
          peakStartTime: '17:00', 
          peakEndTime: '21:00' 
        },
        friday: { 
          isOpen: true, 
          openTime: '09:00', 
          closeTime: '22:00',
          isPeak: true, 
          peakStartTime: '17:00', 
          peakEndTime: '21:00' 
        },
        saturday: { 
          isOpen: true, 
          openTime: '09:00', 
          closeTime: '22:00',
          isPeak: false, 
          peakStartTime: '14:00', 
          peakEndTime: '18:00' 
        },
        sunday: { 
          isOpen: true, 
          openTime: '09:00', 
          closeTime: '22:00',
          isPeak: false, 
          peakStartTime: '14:00', 
          peakEndTime: '18:00' 
        },
      }
    },
    onSubmit: async ({ value }) => {
      try {
        console.log('🚀 Form submission started!');
        console.log('Form value:', value);
        
        // Check for validation errors and focus on first error if any exist
        const hasVisibleErrors = document.querySelector('.text-red-600');
        if (hasVisibleErrors) {
          console.log('❌ Validation errors found, focusing first error');
          setTimeout(focusFirstError, 100);
          return;
        }
        
        // Additional validation checks
        if (!value.name || value.name.length < 3) {
          alert('Space name must be at least 3 characters');
          setTimeout(focusFirstError, 100);
          return;
        }
        if (!value.facilityId) {
          alert('Please select a facility');
          setTimeout(focusFirstError, 100);
          return;
        }
        if (!value.description || value.description.length < 10) {
          alert('Description must be at least 10 characters');
          setTimeout(focusFirstError, 100);
          return;
        }
        if (!value.basePrice || value.basePrice <= 0) {
          alert('Base price must be greater than 0');
          setTimeout(focusFirstError, 100);
          return;
        }
        if (value.capacity < 1) {
          alert('Capacity must be at least 1');
          setTimeout(focusFirstError, 100);
          return;
        }
        
        // Create the space
        const spaceId = await createSpace({
          facilityId: value.facilityId as any,
          name: value.name,
          description: value.description,
          type: value.type as any,
          sportType: value.sportType || undefined,
          capacity: value.capacity,
          images: value.images,
          amenities: value.amenities,
        });

        // Create pricing rules
        await createPricing({
          spaceId,
          name: `${value.name} Pricing`,
          basePrice: value.basePrice,
          peakPrice: value.peakPrice || undefined,
          offPeakPrice: value.offPeakPrice || undefined,
          weekendPrice: value.weekendPrice || undefined,
          depositPercentage: value.depositPercentage,
          minBookingDuration: value.minBookingDuration,
          maxBookingDuration: value.maxBookingDuration || undefined,
        });

        console.log('Space created successfully!');
        alert('Space created successfully!');
        navigate({ to: '/spaces' });
      } catch (error) {
        console.error('Error creating space:', error);
        alert('Failed to create space. Please try again.');
      }
    },
  });

  // Focus management - focus on first field with error
  const focusFirstError = () => {
    console.log('🎯 Attempting to focus first error field');
    const fieldOrder = ['name', 'facilityId', 'type', 'capacity', 'description', 'basePrice', 'depositPercentage'];
    
    for (const fieldName of fieldOrder) {
      const inputElement = document.querySelector(`[name="${fieldName}"]`) as HTMLInputElement;
      if (inputElement) {
        // Check if this field's parent container has an error message
        const fieldContainer = inputElement.closest('.space-y-2') || inputElement.parentElement;
        const hasError = fieldContainer?.querySelector('.text-red-600');
        
        console.log(`Checking field ${fieldName}:`, { hasError: !!hasError });
        
        if (hasError) {
          console.log(`🎯 Focusing on field: ${fieldName}`);
          
          // Focus the input
          inputElement.focus();
          
          // Scroll to view
          inputElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
          
          // Add a visual highlight to make it more obvious
          inputElement.style.outline = '2px solid #ef4444';
          inputElement.style.outlineOffset = '2px';
          inputElement.style.transition = 'outline 0.3s ease-in-out';
          
          // Remove the highlight after a moment
          setTimeout(() => {
            inputElement.style.outline = '';
            inputElement.style.outlineOffset = '';
          }, 3000);
          
          // Also add a subtle shake animation
          inputElement.style.animation = 'shake 0.5s ease-in-out';
          setTimeout(() => {
            inputElement.style.animation = '';
          }, 500);
          
          return true; // Found and focused an error
        }
      }
    }
    
    console.log('🎯 No error fields found to focus');
    return false;
  };

  // Trigger focus on submission attempts
  useEffect(() => {
    if (form.state.submissionAttempts > 0) {
      setTimeout(focusFirstError, 100);
    }
  }, [form.state.submissionAttempts]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-4 pt-safe">
        <div className="flex items-center">
          <button
            onClick={() => navigate({ to: '/spaces' })}
            className="mr-4 p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Create Space</h1>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center">
            <button
              onClick={() => navigate({ to: '/spaces' })}
              className="mr-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Create New Space</h1>
              <p className="text-blue-100 mt-2">Add a new bookable space to your facility</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-4 lg:py-8 px-4 lg:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Mobile Form Container */}
          <div className="lg:hidden bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('📝 Form HTML submit triggered');
                
                // Trigger validation display on all fields before submission
                const fieldNames = ['name', 'facilityId', 'type', 'capacity', 'description', 'basePrice', 'depositPercentage'];
                fieldNames.forEach(fieldName => {
                  const inputElement = document.querySelector(`[name="${fieldName}"]`) as HTMLInputElement;
                  if (inputElement) {
                    // Trigger blur event to show validation errors
                    const blurEvent = new FocusEvent('blur', { bubbles: true });
                    inputElement.dispatchEvent(blurEvent);
                  }
                });
                
                // Give a moment for validation to process, then submit
                setTimeout(() => {
                  form.handleSubmit();
                }, 50);
              }}
              className="p-6 space-y-6"
            >
              {/* Basic Information */}
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                
                <div className="space-y-5">
                  <form.Field 
                    name="name"
                    validators={{
                      onBlur: ({ value }) => 
                        !value || value.length < 3 ? 'Space name must be at least 3 characters' : undefined,
                    }}
                  >
                    {(field) => (
                      <FormField
                        label="Space Name"
                        required
                        errors={field.state.meta.errors}
                      >
                        <TextInput field={field} placeholder="e.g., Premium Football Pitch" />
                      </FormField>
                    )}
                  </form.Field>

                  <form.Field 
                    name="facilityId"
                    validators={{
                      onBlur: ({ value }) => 
                        !value ? 'Please select a facility' : undefined,
                    }}
                  >
                    {(field) => (
                      <FormField
                        label="Facility"
                        required
                        errors={field.state.meta.errors}
                      >
                        <Select 
                          field={field} 
                          placeholder="Select a facility"
                          options={[
                            { value: '', label: 'Select a facility' },
                            ...facilities.map((facility) => ({
                              value: facility._id,
                              label: facility.name
                            }))
                          ]} 
                        />
                      </FormField>
                    )}
                  </form.Field>

                  <form.Field 
                    name="type"
                    validators={{
                      onBlur: ({ value }) => 
                        !value ? 'Please select a space type' : undefined,
                    }}
                  >
                    {(field) => (
                      <FormField
                        label="Space Type"
                        required
                        errors={field.state.meta.errors}
                      >
                        <Select field={field} options={spaceTypes} />
                      </FormField>
                    )}
                  </form.Field>

                  {form.getFieldValue('type') === 'sports_pitch' && (
                    <form.Field name="sportType">
                      {(field) => (
                        <FormField
                          label="Sport Type"
                          errors={field.state.meta.errors}
                        >
                          <Select 
                            field={field} 
                            placeholder="Select sport type"
                            options={[
                              { value: '', label: 'Select sport type' },
                              ...sportTypes.map((sport) => ({
                                value: sport,
                                label: sport.charAt(0).toUpperCase() + sport.slice(1)
                              }))
                            ]} 
                          />
                        </FormField>
                      )}
                    </form.Field>
                  )}

                  <form.Field 
                    name="capacity"
                    validators={{
                      onBlur: ({ value }) => 
                        !value || value < 1 ? 'Capacity must be at least 1' : undefined,
                    }}
                  >
                    {(field) => (
                      <FormField
                        label="Capacity"
                        required
                        errors={field.state.meta.errors}
                      >
                        <NumberInput field={field} min={1} placeholder="Maximum number of people" />
                      </FormField>
                    )}
                  </form.Field>

                  <form.Field 
                    name="description"
                    validators={{
                      onBlur: ({ value }) => 
                        !value || value.length < 10 ? 'Description must be at least 10 characters' : undefined,
                    }}
                  >
                    {(field) => (
                      <FormField
                        label="Description"
                        required
                        errors={field.state.meta.errors}
                      >
                        <Textarea 
                          field={field} 
                          rows={4}
                          placeholder="Describe the space, its features, and what makes it special..."
                        />
                      </FormField>
                    )}
                  </form.Field>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>
                
                <div className="space-y-5">
                  <form.Field 
                    name="basePrice"
                    validators={{
                      onBlur: ({ value }) => 
                        !value || value <= 0 ? 'Base price must be greater than 0' : undefined,
                    }}
                  >
                    {(field) => (
                      <FormField
                        label="Base Price (per hour)"
                        required
                        errors={field.state.meta.errors}
                      >
                        <NumberInput field={field} min={0} step={0.01} placeholder="0.00" />
                      </FormField>
                    )}
                  </form.Field>

                  <form.Field name="peakPrice">
                    {(field) => (
                      <FormField
                        label="Peak Price (per hour)"
                        errors={field.state.meta.errors}
                      >
                        <NumberInput field={field} min={0} step={0.01} placeholder="0.00" />
                      </FormField>
                    )}
                  </form.Field>

                  <form.Field name="offPeakPrice">
                    {(field) => (
                      <FormField
                        label="Off-Peak Price (per hour)"
                        errors={field.state.meta.errors}
                      >
                        <NumberInput field={field} min={0} step={0.01} placeholder="0.00" />
                      </FormField>
                    )}
                  </form.Field>

                  <form.Field name="weekendPrice">
                    {(field) => (
                      <FormField
                        label="Weekend Price (per hour)"
                        errors={field.state.meta.errors}
                      >
                        <NumberInput field={field} min={0} step={0.01} placeholder="0.00" />
                      </FormField>
                    )}
                  </form.Field>

                  <form.Field 
                    name="depositPercentage"
                    validators={{
                      onBlur: ({ value }) => 
                        value < 0 || value > 100 ? 'Deposit percentage must be between 0 and 100' : undefined,
                    }}
                  >
                    {(field) => (
                      <FormField
                        label="Deposit Percentage"
                        required
                        errors={field.state.meta.errors}
                      >
                        <NumberInput field={field} min={0} max={100} placeholder="25" />
                      </FormField>
                    )}
                  </form.Field>

                  <form.Field name="minBookingDuration">
                    {(field) => (
                      <FormField
                        label="Min Booking Duration (hours)"
                        errors={field.state.meta.errors}
                      >
                        <NumberInput field={field} min={1} placeholder="1" />
                      </FormField>
                    )}
                  </form.Field>

                  <form.Field name="maxBookingDuration">
                    {(field) => (
                      <FormField
                        label="Max Booking Duration (hours)"
                        errors={field.state.meta.errors}
                      >
                        <NumberInput field={field} min={1} placeholder="24" />
                      </FormField>
                    )}
                  </form.Field>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col space-y-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={form.state.isSubmitting}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-base hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {form.state.isSubmitting ? 'Creating...' : 'Create Space'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ to: '/spaces' })}
                  className="w-full px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-base hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Form Container */}
          <div className="hidden lg:block bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('📝 Form HTML submit triggered');
                
                // Trigger validation display on all fields before submission
                const fieldNames = ['name', 'facilityId', 'type', 'capacity', 'description', 'basePrice', 'depositPercentage'];
                fieldNames.forEach(fieldName => {
                  const inputElement = document.querySelector(`[name="${fieldName}"]`) as HTMLInputElement;
                  if (inputElement) {
                    // Trigger blur event to show validation errors
                    const blurEvent = new FocusEvent('blur', { bubbles: true });
                    inputElement.dispatchEvent(blurEvent);
                  }
                });
                
                // Give a moment for validation to process, then submit
                setTimeout(() => {
                  form.handleSubmit();
                }, 50);
              }}
              className="p-6 space-y-8"
            >
              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                
                <div className="grid grid-cols-2 gap-6">
                  <form.Field 
                    name="name"
                    validators={{
                      onBlur: ({ value }) => 
                        !value || value.length < 3 ? 'Space name must be at least 3 characters' : undefined,
                    }}
                  >
                    {(field) => (
                      <FormField
                        label="Space Name"
                        required
                        errors={field.state.meta.errors}
                      >
                        <TextInput field={field} placeholder="e.g., Premium Football Pitch" />
                      </FormField>
                    )}
                  </form.Field>

                  <form.Field 
                    name="facilityId"
                    validators={{
                      onBlur: ({ value }) => 
                        !value ? 'Please select a facility' : undefined,
                    }}
                  >
                    {(field) => (
                      <FormField
                        label="Facility"
                        required
                        errors={field.state.meta.errors}
                      >
                        <Select 
                          field={field} 
                          placeholder="Select a facility"
                          options={[
                            { value: '', label: 'Select a facility' },
                            ...facilities.map((facility) => ({
                              value: facility._id,
                              label: facility.name
                            }))
                          ]} 
                        />
                      </FormField>
                    )}
                  </form.Field>

                  <form.Field 
                    name="type"
                    validators={{
                      onBlur: ({ value }) => 
                        !value ? 'Please select a space type' : undefined,
                    }}
                  >
                    {(field) => (
                      <FormField
                        label="Space Type"
                        required
                        errors={field.state.meta.errors}
                      >
                        <Select field={field} options={spaceTypes} />
                      </FormField>
                    )}
                  </form.Field>

                  {form.getFieldValue('type') === 'sports_pitch' && (
                    <form.Field name="sportType">
                      {(field) => (
                        <FormField
                          label="Sport Type"
                          errors={field.state.meta.errors}
                        >
                          <Select 
                            field={field} 
                            placeholder="Select sport type"
                            options={[
                              { value: '', label: 'Select sport type' },
                              ...sportTypes.map((sport) => ({
                                value: sport,
                                label: sport.charAt(0).toUpperCase() + sport.slice(1)
                              }))
                            ]} 
                          />
                        </FormField>
                      )}
                    </form.Field>
                  )}

                  <form.Field 
                    name="capacity"
                    validators={{
                      onBlur: ({ value }) => 
                        !value || value < 1 ? 'Capacity must be at least 1' : undefined,
                    }}
                  >
                    {(field) => (
                      <FormField
                        label="Capacity"
                        required
                        errors={field.state.meta.errors}
                      >
                        <NumberInput field={field} min={1} placeholder="Maximum number of people" />
                      </FormField>
                    )}
                  </form.Field>
                </div>

                <form.Field 
                  name="description"
                  validators={{
                    onBlur: ({ value }) => 
                      !value || value.length < 10 ? 'Description must be at least 10 characters' : undefined,
                  }}
                >
                  {(field) => (
                    <FormField
                      label="Description"
                      required
                      errors={field.state.meta.errors}
                    >
                      <Textarea 
                        field={field} 
                        rows={4}
                        placeholder="Describe the space, its features, and what makes it special..."
                      />
                    </FormField>
                  )}
                </form.Field>
              </div>

              {/* Pricing */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Pricing</h2>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <form.Field 
                    name="basePrice"
                    validators={{
                      onBlur: ({ value }) => 
                        !value || value <= 0 ? 'Base price must be greater than 0' : undefined,
                    }}
                  >
                    {(field) => (
                      <FormField
                        label="Base Price (per hour)"
                        required
                        errors={field.state.meta.errors}
                      >
                        <NumberInput field={field} min={0} step={0.01} placeholder="0.00" />
                      </FormField>
                    )}
                  </form.Field>

                  <form.Field name="peakPrice">
                    {(field) => (
                      <FormField
                        label="Peak Price (per hour)"
                        errors={field.state.meta.errors}
                      >
                        <NumberInput field={field} min={0} step={0.01} placeholder="0.00" />
                      </FormField>
                    )}
                  </form.Field>

                  <form.Field name="offPeakPrice">
                    {(field) => (
                      <FormField
                        label="Off-Peak Price (per hour)"
                        errors={field.state.meta.errors}
                      >
                        <NumberInput field={field} min={0} step={0.01} placeholder="0.00" />
                      </FormField>
                    )}
                  </form.Field>

                  <form.Field name="weekendPrice">
                    {(field) => (
                      <FormField
                        label="Weekend Price (per hour)"
                        errors={field.state.meta.errors}
                      >
                        <NumberInput field={field} min={0} step={0.01} placeholder="0.00" />
                      </FormField>
                    )}
                  </form.Field>

                  <form.Field 
                    name="depositPercentage"
                    validators={{
                      onBlur: ({ value }) => 
                        value < 0 || value > 100 ? 'Deposit percentage must be between 0 and 100' : undefined,
                    }}
                  >
                    {(field) => (
                      <FormField
                        label="Deposit Percentage"
                        required
                        errors={field.state.meta.errors}
                      >
                        <NumberInput field={field} min={0} max={100} placeholder="25" />
                      </FormField>
                    )}
                  </form.Field>

                  <form.Field name="minBookingDuration">
                    {(field) => (
                      <FormField
                        label="Min Booking Duration (hours)"
                        errors={field.state.meta.errors}
                      >
                        <NumberInput field={field} min={1} placeholder="1" />
                      </FormField>
                    )}
                  </form.Field>

                  <form.Field name="maxBookingDuration">
                    {(field) => (
                      <FormField
                        label="Max Booking Duration (hours)"
                        errors={field.state.meta.errors}
                      >
                        <NumberInput field={field} min={1} placeholder="24" />
                      </FormField>
                    )}
                  </form.Field>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate({ to: '/spaces' })}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={form.state.isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {form.state.isSubmitting ? 'Creating...' : 'Create Space'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSpacePage;
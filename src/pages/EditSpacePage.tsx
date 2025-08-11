import { useNavigate, useParams } from '@tanstack/react-router';
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

const EditSpacePage = () => {
  const navigate = useNavigate();
  const { spaceId } = useParams({ from: '/spaces/$spaceId/edit' });
  
  // Fetch space data and facilities from Convex
  const space = useQuery(api.spaces.get, { id: spaceId as any });
  const facilities = useQuery(api.facilities.list) || [];
  
  // Convex mutations
  const updateSpace = useMutation(api.spaces.update);

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
        console.log('🚀 Updating space!');
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
        
        // Update the space
        await updateSpace({
          id: spaceId as any,
          name: value.name,
          description: value.description,
          type: value.type as any,
          sportType: value.sportType || undefined,
          capacity: value.capacity,
          images: value.images,
          amenities: value.amenities,
        });

        console.log('Space updated successfully!');
        alert('Space updated successfully!');
        navigate({ to: '/spaces/$spaceId', params: { spaceId } });
      } catch (error) {
        console.error('Error updating space:', error);
        alert('Failed to update space. Please try again.');
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
        const fieldContainer = inputElement.closest('.space-y-2') || inputElement.parentElement;
        const hasError = fieldContainer?.querySelector('.text-red-600');
        
        if (hasError) {
          console.log(`🎯 Focusing on field: ${fieldName}`);
          inputElement.focus();
          inputElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
          return true;
        }
      }
    }
    return false;
  };

  // Trigger focus on submission attempts
  useEffect(() => {
    if (form.state.submissionAttempts > 0) {
      setTimeout(focusFirstError, 100);
    }
  }, [form.state.submissionAttempts]);

  // Pre-populate form when space data loads
  useEffect(() => {
    if (space) {
      console.log('📝 Pre-populating form with space data:', space);
      form.setFieldValue('name', space.name || '');
      form.setFieldValue('description', space.description || '');
      form.setFieldValue('type', space.type as any || 'sports_pitch');
      form.setFieldValue('sportType', space.sportType || '');
      form.setFieldValue('capacity', space.capacity || 1);
      form.setFieldValue('images', space.images || []);
      form.setFieldValue('amenities', space.amenities || []);
      form.setFieldValue('facilityId', space.facilityId || '');
      
      // Set pricing fields (default to 0 if not available)
      form.setFieldValue('basePrice', (space as any).basePrice || 0);
      form.setFieldValue('peakPrice', (space as any).peakPrice || 0);
      form.setFieldValue('offPeakPrice', (space as any).offPeakPrice || 0);
      form.setFieldValue('weekendPrice', (space as any).weekendPrice || 0);
      form.setFieldValue('depositPercentage', (space as any).depositPercentage || 25);
      form.setFieldValue('minBookingDuration', (space as any).minBookingDuration || 1);
      form.setFieldValue('maxBookingDuration', (space as any).maxBookingDuration || 24);

      // Set schedule data if available
      if ((space as any).schedule) {
        form.setFieldValue('schedule', (space as any).schedule);
      }
    }
  }, [space, form]);

  // Show loading state while fetching space data
  if (!space) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading space data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 sm:p-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate({ to: '/spaces/$spaceId', params: { spaceId } })}
                className="mr-3 sm:mr-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Edit Space</h1>
                <p className="text-green-100 mt-1 sm:mt-2 text-sm sm:text-base">Modify space details and settings</p>
              </div>
            </div>
          </div>

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
                  const blurEvent = new FocusEvent('blur', { bubbles: true });
                  inputElement.dispatchEvent(blurEvent);
                }
              });
              
              setTimeout(() => {
                form.handleSubmit();
              }, 50);
            }}
            className="p-4 sm:p-6 space-y-6 sm:space-y-8"
          >
            {/* Basic Information */}
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Basic Information</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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

                <form.Field name="facilityId">
                  {(field) => (
                    <FormField
                      label="Facility"
                      errors={field.state.meta.errors}
                    >
                      <Select 
                        field={field} 
                        placeholder="Facility cannot be changed"
                        disabled={true}
                        options={[
                          { value: '', label: 'Facility cannot be changed' },
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

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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

            {/* Schedule & Peak Times */}
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Schedule & Peak Times</h2>
              <p className="text-gray-600 text-sm">Define opening hours and peak times for each day of the week.</p>
              
              <div className="space-y-4">
                {([
                  { day: 'monday', label: 'Monday' },
                  { day: 'tuesday', label: 'Tuesday' },
                  { day: 'wednesday', label: 'Wednesday' },
                  { day: 'thursday', label: 'Thursday' },
                  { day: 'friday', label: 'Friday' },
                  { day: 'saturday', label: 'Saturday' },
                  { day: 'sunday', label: 'Sunday' }
                ] as const).map(({ day, label }) => (
                  <div key={day} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Day name and open/closed toggle */}
                      <div className="flex items-center space-x-4 sm:w-40">
                        <h3 className="font-medium text-gray-900 min-w-0 flex-shrink-0">
                          {label}
                        </h3>
                        <form.Field name={`schedule.${day}.isOpen` as any}>
                          {(openField) => {
                            console.log(`Edit - Open checkbox for ${day}:`, { 
                              value: openField.state.value, 
                              checked: Boolean(openField.state.value) 
                            });
                            
                            return (
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={Boolean(openField.state.value)}
                                  onChange={(e) => {
                                    const newValue = e.target.checked;
                                    console.log(`Edit - Changing open for ${day} to:`, newValue);
                                    openField.handleChange(newValue as any);
                                  }}
                                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                                <span className="text-sm text-gray-600">Open</span>
                              </label>
                            );
                          }}
                        </form.Field>
                      </div>

                      {/* Opening hours and peak times */}
                      <form.Field name={`schedule.${day}.isOpen` as any}>
                        {(openField) => {
                          const isOpen = Boolean(openField.state.value);
                          console.log(`Edit - Open field for ${day}:`, { value: openField.state.value, isOpen });
                          
                          if (!isOpen) {
                            console.log(`Edit - Hiding all fields for ${day} - isOpen is false`);
                            return null;
                          }
                          
                          console.log(`Edit - Showing fields for ${day} - isOpen is true`);
                          return (
                            <div className="flex-1 grid grid-cols-2 sm:grid-cols-6 gap-3">
                              {/* Opening hours */}
                              <div className="col-span-2 space-y-1">
                                <label className="block text-xs font-medium text-gray-700">Opening Hours</label>
                                <div className="flex space-x-2">
                                  <form.Field name={`schedule.${day}.openTime` as any}>
                                    {(field) => (
                                      <input
                                        type="time"
                                        value={field.state.value as string}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                      />
                                    )}
                                  </form.Field>
                                  <span className="text-gray-500 text-xs flex items-center">to</span>
                                  <form.Field name={`schedule.${day}.closeTime` as any}>
                                    {(field) => (
                                      <input
                                        type="time"
                                        value={field.state.value as string}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                      />
                                    )}
                                  </form.Field>
                                </div>
                              </div>

                              {/* Peak time toggle */}
                              <div className="space-y-1">
                                <label className="block text-xs font-medium text-gray-700">Peak Hours</label>
                                <form.Field name={`schedule.${day}.isPeak` as any}>
                                  {(field) => {
                                    console.log(`Edit - Peak checkbox for ${day}:`, { 
                                      value: field.state.value, 
                                      checked: Boolean(field.state.value) 
                                    });
                                    
                                    return (
                                      <label className="flex items-center space-x-2">
                                        <input
                                          type="checkbox"
                                          checked={Boolean(field.state.value)}
                                          onChange={(e) => {
                                            const newValue = e.target.checked;
                                            console.log(`Edit - Changing peak for ${day} to:`, newValue);
                                            field.handleChange(newValue as any);
                                          }}
                                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="text-xs text-gray-500 text-xs flex items-center">to</span>
                                      </label>
                                    );
                                  }}
                                </form.Field>
                              </div>

                              {/* Peak time hours */}
                              <form.Field name={`schedule.${day}.isPeak` as any}>
                                {(peakField) => {
                                  const isPeakEnabled = Boolean(peakField.state.value);
                                  console.log(`Edit - Peak field for ${day}:`, { value: peakField.state.value, isEnabled: isPeakEnabled });
                                  
                                  if (!isPeakEnabled) {
                                    console.log(`Edit - Hiding peak time fields for ${day} - isPeak is false`);
                                    return null;
                                  }
                                  
                                  console.log(`Edit - Showing peak time fields for ${day} - isPeak is true`);
                                  return (
                                    <div className="col-span-3 space-y-1">
                                      <label className="block text-xs font-medium text-gray-700">Peak Time Period</label>
                                      <div className="flex space-x-2">
                                        <form.Field name={`schedule.${day}.peakStartTime` as any}>
                                          {(field) => (
                                            <input
                                              type="time"
                                              value={field.state.value as string}
                                              onChange={(e) => field.handleChange(e.target.value)}
                                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                            />
                                          )}
                                        </form.Field>
                                        <span className="text-xs text-gray-600">Enable</span>
                                        <form.Field name={`schedule.${day}.peakEndTime` as any}>
                                          {(field) => (
                                            <input
                                              type="time"
                                              value={field.state.value as string}
                                              onChange={(e) => field.handleChange(e.target.value)}
                                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                            />
                                          )}
                                        </form.Field>
                                      </div>
                                    </div>
                                  );
                                }}
                              </form.Field>
                            </div>
                          );
                        }}
                      </form.Field>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate({ to: '/spaces/$spaceId', params: { spaceId } })}
                className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={form.state.isSubmitting}
                className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {form.state.isSubmitting ? 'Updating...' : 'Update Space'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSpacePage;

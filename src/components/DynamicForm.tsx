import React, { useEffect, useState } from 'react';
import { FormField, FormResponse, FormData, Errors, SubmittedData } from '../types';
import { getFormData } from '../api';

const DynamicForm = () => {
  const [formType, setFormType] = useState<string>('User Information');
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<Errors>({});
  const [submittedData, setSubmittedData] = useState<SubmittedData>([]);
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [showSuccessMessage, setShowSuccessMessage] = useState<{ message: string; type: string }>({ message: '', type: '' });
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Fetch the form fields based on the selected form type
  useEffect(() => {
    const fetchFormData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response: FormResponse = await getFormData(formType);
        setFormFields(response.fields);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setIsError(true);
        setErrorMessage('Failed to load the form structure. Please try again later.');
        console.error('Error fetching form data:', error);
      }
    };

    fetchFormData();
  }, [formType]);

  const handleFormTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormType(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    let isValid = true;

    formFields.forEach((field) => {
      const value = formData[field.name];
      if (field.required && !value) {
        isValid = false;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field.name]: `${field.label} is required`,
        }));
      }
    });

    if (isValid) {
      if (isEditMode && editIndex !== null) {
        // Update existing entry
        const updatedData = [...submittedData];
        updatedData[editIndex] = formData; // Replace the existing entry with updated data
        setSubmittedData(updatedData);
        setShowSuccessMessage({ message: 'Entry updated successfully!', type: 'edit' });
      } else {
        // Add new entry
        setSubmittedData((prevData) => [...prevData, formData]);
        setShowSuccessMessage({ message: 'Form Submitted Successfully!', type: 'success' });
      }
      setFormData({});
      setErrors({});
      setIsEditMode(false);
      setEditIndex(null);

      setTimeout(() => {
        setShowSuccessMessage({ message: '', type: '' });
      }, 3000);
    }
  };

  const handleDelete = (index: number) => {
    setSubmittedData((prevData) => prevData.filter((_, i) => i !== index));
    setShowSuccessMessage({ message: 'Entry deleted successfully!', type: 'delete' });
    setTimeout(() => {
      setShowSuccessMessage({ message: '', type: '' });
    }, 3000);
  };

  const handleEdit = (index: number) => {
    const dataToEdit = submittedData[index];
    setFormData(dataToEdit);
    setIsEditMode(true);
    setEditIndex(index);
  };

  const validateField = (name: string, value: any) => {
    if (!value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `${name} is required`,
      }));
    } else {
      setErrors((prevErrors) => {
        const { [name]: _, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const calculateProgress = () => {
    const totalFields = formFields.length;
    const filledFields = formFields.filter((field) => formData[field.name] !== undefined).length;
    setProgress((filledFields / totalFields) * 100);
  };

  useEffect(() => {
    calculateProgress();
  }, [formData]);

  const getMessageBackground = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'edit':
        return 'bg-yellow-500';
      case 'delete':
        return 'bg-red-500';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <label htmlFor="formType" className="mr-2">Select Form Type:</label>
        <select
          id="formType"
          className="border p-2"
          value={formType}
          onChange={handleFormTypeChange}
        >
          <option value="User Information">User Information</option>
          <option value="Address Information">Address Information</option>
          <option value="Payment Information">Payment Information</option>
        </select>
      </div>

      {isLoading && (
        <div className="p-4 bg-blue-500 text-white rounded-md mb-4">
          <p>Loading form structure...</p>
        </div>
      )}

      {isError && (
        <div className="p-4 bg-red-500 text-white rounded-md mb-4">
          <p>{errorMessage}</p>
        </div>
      )}

      {!isLoading && !isError && formFields.length > 0 && (
        <form onSubmit={handleSubmit}>
          {formFields.map((field) => (
            <div key={field.name} className="mb-4">
              <label htmlFor={field.name} className="block">{field.label}</label>
              {field.type === 'dropdown' ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                >
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                />
              )}
              {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name]}</p>}
            </div>
          ))}

          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
            {isEditMode ? 'Update' : 'Submit'}
          </button>
        </form>
      )}

      <div className="my-4">
        <div className="mb-2">
          <label className="block">Progress:</label>
          <div className="h-2 bg-gray-300 rounded">
            <div
              className="h-2 bg-blue-500 rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {submittedData.length > 0 && (
          <table className="table-auto w-full mt-4">
            <thead>
              <tr>
                <th className="border px-4 py-2">Form Type</th>
                {formFields.map((field) => (
                  <th key={field.name} className="border px-4 py-2">{field.label}</th>
                ))}
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedData.map((data, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{formType}</td>
                  {formFields.map((field) => (
                    <td key={field.name} className="border px-4 py-2">{data[field.name]}</td>
                  ))}
                  <td className="border px-4 py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="bg-yellow-500 text-white py-1 px-2 rounded"
                        onClick={() => handleEdit(index)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white py-1 px-2 rounded"
                        onClick={() => handleDelete(index)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Success Message Popup (Centered Top) */}
      {showSuccessMessage.message && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 ${getMessageBackground(showSuccessMessage.type)} text-white rounded-lg shadow-lg opacity-100 transition-all duration-300 ease-in-out`}
        >
          <p>{showSuccessMessage.message}</p>
        </div>
      )}
    </div>
  );
};

export default DynamicForm;

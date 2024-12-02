// src/components/DynamicForm.tsx
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

  // Fetch the form fields based on the selected form type
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response: FormResponse = await getFormData(formType);
        setFormFields(response.fields);
      } catch (error) {
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
      setSubmittedData((prevData) => [...prevData, formData]);
      setFormData({});
      setErrors({});
    }
  };

  const handleDelete = (index: number) => {
    setSubmittedData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number) => {
    const dataToEdit = submittedData[index];
    setFormData(dataToEdit);
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
          Submit
        </button>
      </form>

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
                    <button
                      className="bg-yellow-500 text-white py-1 px-2 rounded"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-2 rounded ml-2"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DynamicForm;

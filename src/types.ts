// src/types.ts
export interface FormField {
    name: string;
    type: string;
    label: string;
    required: boolean;
    options?: string[]; // For dropdown type fields
  }
  
  export interface FormResponse {
    fields: FormField[];
  }
  
  // Form data type is an object where keys are field names (string), and values are any type (string, number, etc.)
  export interface FormData {
    [key: string]: string | number | undefined;
  }
  
  // Errors type is an object with field names as keys and error messages as values (string)
  export interface Errors {
    [key: string]: string;
  }
  
  // Type for submitted data (an array of form data objects)
  export type SubmittedData = FormData[];
  
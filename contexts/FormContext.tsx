// src/contexts/FormContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface FormContextType {
  formData: any;
  setFormData: (data: any) => void;
}

export const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState({});

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};

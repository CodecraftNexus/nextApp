import React, { useState } from 'react';

interface UseFormDataProps<T> {
  initialState: T;
}

function useFormData<T>(initialState: T) {
  const [formData, setFormData] = useState<T>(initialState);

  const updateField = (field: keyof T, value: T[keyof T]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialState);
  };

  return {
    formData,
    updateField,
    resetForm,
    setFormData,
  };
}

export default useFormData;
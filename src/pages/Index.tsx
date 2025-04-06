
import React from 'react';
import { FormBuilderProvider } from '@/context/FormBuilderContext';
import { FormBuilder } from '@/components/FormBuilder/FormBuilder';

const Index = () => {
  return (
    <FormBuilderProvider>
      <FormBuilder />
    </FormBuilderProvider>
  );
};

export default Index;

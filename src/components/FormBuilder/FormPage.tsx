import React, { useState } from 'react';
import { FormElement } from './FormElement';
import { useFormBuilder } from '@/context/FormBuilderContext';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { PublishRoute } from '@/apis';

interface FormPageProps {
  pageIndex: number;
}

export const FormPage: React.FC<FormPageProps> = ({ pageIndex }) => {
  const { pages, currentPageIndex, previewMode, fieldConditions } = useFormBuilder();
  const page = pages[pageIndex];

  const { user, isAuthenticated } = useAuth0();

  const [formTitle, setFormTitle] = useState("Sample Form Title");
  const [formDescription, setFormDescription] = useState("This is a sample description.");

  if (pageIndex !== currentPageIndex) {
    return null;
  }

  const handleSubmit = async () => {
    const formTemplate = {
      title: formTitle,
      description: formDescription,
      ownerId: user?.sub,
      fields: page.elements.map((element) => {
        const label = element.content?.title || 'Untitled';
        const type = element.type;

        return {
          id: element.id,
          label: label,
          type: type,
          required: false,
          options: ['single_choice', 'multiple_choice'].includes(type)
            ? element.content?.options || []
            : undefined,
        };
      }),
      fieldConditions: fieldConditions,
    };

    try {
      const response = await axios.post(PublishRoute, formTemplate);
      console.log('Form submitted:', response.data);
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Submission failed');
    }
  };

  return (
    <div className={`bg-white shadow-md rounded-md w-full max-w-3xl mx-auto mb-8 relative ${previewMode ? 'p-0' : ''}`}>
      {pageIndex > 0 && !previewMode && (
        <div className="absolute -top-8 right-0 text-sm text-gray-500">
          Page {pageIndex + 1}
        </div>
      )}

      {!previewMode && (
        <div className="p-6 border-b border-gray-200 space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Form Title</label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Enter form title"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Form Description</label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Enter form description"
            />
          </div>
        </div>
      )}

      <div className="p-6">
        {page.elements.length > 0 ? (
          page.elements.map((element) => (
            <FormElement key={element.id} element={element} />
          ))
        ) : (
          !previewMode && (
            <div className="border-2 border-dashed border-gray-300 rounded-md p-8 flex flex-col items-center justify-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-center">Drag your first question here from the left.</p>
            </div>
          )
        )}
      </div>

      {page.elements.length > 0 && (
        <div className="p-6 flex justify-center">
          <button
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-md"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

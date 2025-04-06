import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';


const FillFormPage = () => {
  const { ownerId, formId } = useParams();
  const [form, setForm] = useState(null);
  const isValidDate = (dateStr: string): boolean => {
    return !isNaN(Date.parse(dateStr));
  };
  const [responses, setResponses] = useState({});
  const [visibleFields, setVisibleFields] = useState({});
  const { user } = useAuth0();

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.get(`http://localhost:5002/public/forms/id/${formId}`);
        setForm(res.data);

        // Make all fields visible initially
        const initialVisibility = {};
        res.data.fields.forEach((f) => {
          initialVisibility[f.id] = true;
        });
        setVisibleFields(initialVisibility);
      } catch (err) {
        console.error('Error fetching form:', err);
      }
    };

    fetchForm();
  }, [ownerId, formId]);
  console.log("Current responses:", responses);
  useEffect(() => {
    if (!form || !form.fieldConditions) return;

    const updatedVisibility = {};
    form.fields.forEach((field) => {
      updatedVisibility[field.id] = true; // default visible
    });
    const toISODate = (str) => {
      const parts = str.split('-');
      if (parts.length !== 3) return null;
    
      // Check if format is DD-MM-YYYY
      if (parseInt(parts[0]) > 12) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    
      // Assume already in ISO or MM-DD-YYYY fallback
      return str;
    };
    
    
    const fieldVisibilityActions = {}; // map of targetFieldId => [true, false, ...]
    
    form.fieldConditions.forEach((condition) => {
      const triggerValue = responses[condition.triggerFieldId];
      let conditionMet = false;
      console.log("Checking condition.operator:", condition.operator);
      console.log("Checking condition:", condition);
      console.log("Trigger value:", triggerValue);

      switch (condition.state) {
        case 'equals':
          conditionMet = triggerValue && condition.value && String(triggerValue).toLowerCase() === String(condition.value).toLowerCase();
          break;
          case 'not equals':
            conditionMet = triggerValue && condition.value && String(triggerValue).toLowerCase() !== String(condition.value).toLowerCase();
            break;
            case 'is after':
              if (isValidDate(triggerValue) && isValidDate(condition.value)) {
                conditionMet = new Date(triggerValue) > new Date(condition.value);
              }
              break;
              case 'is before':
                const userDate = new Date(toISODate(triggerValue));
                const conditionDate = new Date(toISODate(condition.value));
                console.log("User Date:", new Date(toISODate(triggerValue)));
                console.log("in before than")
                console.log("Condition Date:", new Date(toISODate(condition.value)));
                
                if (!isNaN(userDate.getTime()) && !isNaN(conditionDate.getTime())) {
                  conditionMet = userDate < conditionDate;
            }
            break;
        default:
          break;
        }
        
        const target = condition.targetFieldId;
        if (!fieldVisibilityActions[target]) fieldVisibilityActions[target] = [];
        
        if (condition.action === 'hide') {
          fieldVisibilityActions[target].push(!conditionMet); // push `false` if conditionMet is true (i.e., hide)
        } else if (condition.action === 'show') {
          fieldVisibilityActions[target].push(conditionMet); // push true if should be shown
        }
      });
      
      // Final visibility resolution
      Object.keys(fieldVisibilityActions).forEach((fieldId) => {
        // If any value in the list is false, field should be hidden
        updatedVisibility[fieldId] = fieldVisibilityActions[fieldId].every((v) => v === true);
      });
      
      setVisibleFields(updatedVisibility);    
    }, [responses, form]);
    
    const handleChange = (fieldId, value) => {
      setResponses((prev) => ({
        ...prev,
        [fieldId]: value,
      }));
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
        const formattedAnswers = {};
        form.fields.forEach((field) => {
          const value = responses[field.id];
          if (value !== undefined) {
            formattedAnswers[field.label] = Array.isArray(value) ? value : [value];
          }
        });
        
        const payload = {
          formTemplateId: formId,
          responderId: user.sub,
          answers: formattedAnswers,
        };
        
        const response = await axios.post('http://localhost:5002/public/form-responses', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log("Response from backend:", response.data);
      alert('Form submitted successfully!');
    } catch (err) {
      console.error("Error submitting form:", err);
      alert('Error submitting form! Check console.');
    }
  };
  
  if (!form) {
    return <div className="text-center mt-10">Loading form...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6 mt-8">
      <h1 className="text-3xl font-bold text-violet-700 mb-2">{form.title}</h1>
      <p className="text-gray-600 mb-6">{form.description}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {form.fields.map((field) => {
          if (!visibleFields[field.id]) return null;
          console.log("Rendering field", field.id, "Visible:", visibleFields[field.id]);
          return (
            <div key={`${field.id}-${visibleFields[field.id]}`}>
              {field.type === 'heading' && (
                <h2 className="text-2xl font-bold text-gray-800 my-4">{field.label}</h2>
              )}

              {field.type === 'paragraph' && (
                <p className="text-gray-600 italic mb-2">{field.label}</p>
              )}

              {!['heading', 'paragraph'].includes(field.type) && (
                <>
                  <label className="block text-md font-semibold text-gray-800 mb-1">
                    {field.label}
                  </label>

                  {['full_name', 'email', 'phone', 'address', 'short_text'].includes(field.type) && (
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      onChange={(e) => handleChange(field.id, e.target.value)}
                    />
                  )}

                  {['long_text', 'paragraph'].includes(field.type) && (
                    <textarea
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      onChange={(e) => handleChange(field.id, e.target.value)}
                    />
                  )}

                  {field.type === 'date_picker' && (
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      onChange={(e) => handleChange(field.id, e.target.value)}
                    />
                  )}

                  {['time', 'appointment'].includes(field.type) && (
                    <input
                      type="time"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      onChange={(e) => handleChange(field.id, e.target.value)}
                    />
                  )}

                  {field.type === 'file_upload' && (
                    <input
                      type="file"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      onChange={(e) => handleChange(field.id, e.target.files[0])}
                    />
                  )}

                  {field.type === 'single_choice' && field.options && (
                    <div className="space-y-1 ml-2">
                      {field.options.map((option, idx) => (
                        <label key={idx} className="block">
                          <input
                            type="radio"
                            name={field.id}
                            value={option}
                            onChange={() => handleChange(field.id, option)}
                            className="mr-2"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === 'multiple_choice' && field.options && (
                    <div className="space-y-1 ml-2">
                      {field.options.map((option, idx) => (
                        <label key={idx} className="block">
                          <input
                            type="checkbox"
                            value={option}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setResponses((prev) => {
                                const prevValues = prev[field.id] || [];
                                return {
                                  ...prev,
                                  [field.id]: checked
                                    ? [...prevValues, option]
                                    : prevValues.filter((val) => val !== option),
                                };
                              });
                            }}
                            className="mr-2"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}

                  {['star_rating', 'scale_rating', 'spinner', 'input_table'].includes(field.type) && (
                    <div className="text-gray-500 italic">
                      Placeholder for {field.type} (to be implemented)
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}

        <button
          type="submit"
          className="bg-violet-600 text-white px-6 py-2 rounded hover:bg-violet-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FillFormPage;

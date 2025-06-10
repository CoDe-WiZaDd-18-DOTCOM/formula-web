import React, { useEffect, useState } from 'react';
import { Plus, EyeOff, Trash, ArrowLeft } from 'lucide-react';
import { useFormBuilder } from '@/context/FormBuilderContext';
import { ElementsSidebar } from './ElementsSidebar';
import { FormPage } from './FormPage';
import { ShowHideField } from '../Conditions/ShowHideField';
import { SkipToHidePage } from '../Conditions/SkipToHidePage';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import {PublishRoute,DownloadRoute, CLIENT_BASE, CLIENT_BASE_2} from '../../apis'

export const FormBuilder: React.FC = () => {
  const { 
    toggleSidebar, 
    pages, 
    currentPageIndex, 
    addPage, 
    goToPage, 
    previewMode, 
    togglePreviewMode,
    deletePage,
    currentTab,
    setCurrentTab,
    currentConditionTab,
    setCurrentConditionTab
  } = useFormBuilder();

  const [forms, setForms] = useState([]);
  const {user} = useAuth0();

  useEffect(() => {
    if (currentTab === 'publish') {
      axios.get(`${PublishRoute}/${user.sub}`)
        .then(res => {
          if (Array.isArray(res.data)) {
            setForms(res.data);
          } else {
            console.error('Expected array but got:', res.data);
            setForms([]);
          }
        })
        .catch(err => console.error(err));
    }
  }, [currentTab]);
  

  const copyToClipboard = (formId: string) => {
    const link = `${window.location.origin}/form/id/${formId}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  const downloadResponses = (formId: string) => {
    window.open(`${DownloadRoute}/${formId}/csv`, '_blank');
  };

  const renderTabContent = () => {
    if (currentTab === 'build') {
      return (
        <div className={`${previewMode ? '' : 'py-6'}`}>
          <div className="flex">
            {!previewMode && (
              <div className="mr-8">
                <button
                  className="flex items-center px-4 py-2 bg-violet-800 text-white rounded-md hover:bg-violet-700"
                  onClick={toggleSidebar}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Element
                </button>
              </div>
            )}

            <div className={`flex-1 relative ${previewMode ? 'max-w-3xl mx-auto' : ''}`}>
              {!previewMode && (
                <div className="mb-8 text-center text-gray-500 border-b border-dashed pb-4">
                  + ADD YOUR LOGO
                </div>
              )}

              {pages.map((_, index) => (
                <FormPage key={index} pageIndex={index} />
              ))}

              {!previewMode && (
                <button 
                  className="w-full py-3 border border-dashed border-gray-300 text-gray-500 hover:bg-gray-50 rounded-md mb-8"
                  onClick={addPage}
                >
                  + ADD NEW PAGE HERE
                </button>
              )}

              {pages.length > 1 && (
                <div className="flex justify-between items-center">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded-md"
                    onClick={() => goToPage(currentPageIndex - 1)}
                    disabled={currentPageIndex === 0}
                  >
                    Back
                  </button>
                  <div className="text-sm text-gray-500">
                    Page {currentPageIndex + 1} of {pages.length}
                  </div>
                  <div className="flex">
                    {!previewMode && (
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md mr-2"
                        onClick={() => deletePage(currentPageIndex)}
                        title="Delete current page"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      className="px-4 py-2 bg-violet-600 text-white rounded-md"
                      onClick={() => goToPage(currentPageIndex + 1)}
                      disabled={currentPageIndex === pages.length - 1}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else if (currentTab === 'conditions') {
      return (
        <div className="py-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center">
              <button 
                onClick={() => setCurrentTab('build')}
                className="text-violet-600 hover:text-violet-800 flex items-center"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Builder
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="flex">
                <button 
                  className={`py-3 px-6 ${currentConditionTab === 'field' ? 'bg-violet-100 text-violet-800 font-medium' : 'text-gray-600'}`}
                  onClick={() => setCurrentConditionTab('field')}
                >
                  SHOW/HIDE FIELD
                </button>
                <button 
                  className={`py-3 px-6 ${currentConditionTab === 'page' ? 'bg-violet-100 text-violet-800 font-medium' : 'text-gray-600'}`}
                  onClick={() => setCurrentConditionTab('page')}
                >
                  SKIP TO/HIDE A PAGE
                </button>
              </div>
            </div>
            {currentConditionTab === 'field' ? <ShowHideField /> : <SkipToHidePage />}
          </div>
        </div>
      );
    } else if (currentTab === 'publish') {
      return (
        <div className="py-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Your Published Forms</h2>
            {forms.length === 0 ? (
              <p className="text-gray-500 text-center">You have no published forms.</p>
            ) : (
              <div className="space-y-4">
                {forms.map((form) => (
                  <div key={form._id} className="bg-white p-4 rounded-md shadow-sm flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">{form.title || 'Untitled Form'}</h3>
                      <p className="text-gray-500 text-sm">ID: {form._id}</p>
                    </div>
                    <div className="space-x-2">
                      <button 
                        onClick={() => copyToClipboard(form.id)}
                        className="px-4 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                      >
                        Copy Link
                      </button>
                      <button 
                        onClick={() => downloadResponses(form.id)}
                        className="px-4 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                      >
                        Download Responses
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className={`min-h-screen ${previewMode ? 'bg-gray-50' : 'bg-gray-100'}`}>
      {!previewMode && (
        <header className="bg-violet-600 shadow-sm">
          <div className="flex justify-between items-center px-4 py-3 container mx-auto">
            <div className="flex items-center space-x-4">
              <a href={CLIENT_BASE_2}>
                <div className="text-xl font-bold text-white cursor-pointer">Formula</div>
              </a>
              <div className="text-sm font-semibold px-2 py-1 border border-violet-300 text-white rounded-md">Form Builder</div>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="text-violet-100">All changes saved at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
              <button className="px-3 py-1 border border-violet-400 text-white rounded-md hover:bg-violet-500">Add Collaborators</button>
              <button className="px-3 py-1 border border-violet-400 text-white rounded-md hover:bg-violet-500">Help</button>
            </div>
          </div>
        </header>
      )}

      {!previewMode && (
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
          <div className="container mx-auto flex">
            {['build', 'conditions', 'publish'].map(tab => (
              <div
                key={tab}
                className={`px-6 py-3 font-medium cursor-pointer ${currentTab === tab ? 'bg-purple-600' : ''}`}
                onClick={() => setCurrentTab(tab)}
              >
                {tab.toUpperCase()}
              </div>
            ))}
            <div className="ml-auto flex items-center px-6">
              <span className="mr-2">Preview Form</span>
              <button 
                onClick={togglePreviewMode}
                className={`w-12 h-6 ${previewMode ? 'bg-violet-300' : 'bg-white'} rounded-full p-1 flex items-center ${previewMode ? 'justify-end' : 'justify-start'}`}
              >
                <div className="w-4 h-4 bg-violet-600 rounded-full"></div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`container mx-auto ${previewMode ? 'py-4' : ''}`}>
        {previewMode && (
          <div className="flex justify-end mb-4">
            <button
              onClick={togglePreviewMode}
              className="flex items-center px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
            >
              <EyeOff className="h-4 w-4 mr-2" />
              Exit Preview
            </button>
          </div>
        )}


        {renderTabContent()}
      </div>

      {!previewMode && currentTab === 'build' && <ElementsSidebar />}
    </div>
  );
};

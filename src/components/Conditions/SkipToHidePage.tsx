import React, { useState } from 'react';
import { Plus, Save, Trash } from 'lucide-react';
import { useFormBuilder, type FieldState } from '@/context/FormBuilderContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export const SkipToHidePage: React.FC = () => {
  const { pages, pageConditions, addPageCondition, removePageCondition } = useFormBuilder();
  
  const [newCondition, setNewCondition] = useState({
    triggerFieldId: '',
    state: '' as FieldState,
    value: '',
    targetPageId: '',
    action: 'skip to' as 'skip to' | 'hide page',
  });
  
  // Extract all form elements across all pages
  const allElements = pages.flatMap(page => page.elements);
  const hasElements = allElements.length > 0;
  
  // Get field states based on the selected trigger field type
  const getFieldStates = () => {
    const triggerField = allElements.find(el => el.id === newCondition.triggerFieldId);
    
    if (!triggerField) return [];
    
    switch (triggerField.type) {
      case 'dropdown':
      case 'single_choice':
      case 'multiple_choice':
      case 'short_text':
      case 'long_text':
        return ['is equal to', 'is not equal to', 'contains', 'does not contain'];
      case 'appointment':
        return ['is before', 'is after', 'is equal to'];
      default:
        return ['is equal to', 'is not equal to'];
    }
  };
  
  const handleAddCondition = () => {
    if (newCondition.triggerFieldId && newCondition.state && newCondition.targetPageId) {
      addPageCondition(newCondition);
      setNewCondition({
        triggerFieldId: '',
        state: '' as FieldState,
        value: '',
        targetPageId: '',
        action: 'skip to',
      });
    }
  };

  if (!hasElements) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-medium mb-4">No Form Elements Available</h3>
        <p className="text-gray-600 mb-4">
          You need to add at least one form element before creating conditions.
        </p>
        <Button variant="default" onClick={() => {}} className="bg-violet-600 hover:bg-violet-700">
          Go to Build and Add Elements
        </Button>
      </Card>
    );
  }
  
  if (pages.length < 2) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-medium mb-4">At Least 2 Pages Required</h3>
        <p className="text-gray-600 mb-4">
          You need to have at least two pages in your form to create page conditions.
        </p>
        <Button variant="default" onClick={() => {}} className="bg-violet-600 hover:bg-violet-700">
          Go to Build and Add Pages
        </Button>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="bg-green-500 text-white p-3 rounded-md mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">SKIP TO/HIDE A PAGE</h2>
          <p className="text-gray-600">Skip to or hide a specific page</p>
        </div>
      </div>

      {/* Existing conditions */}
      {pageConditions.map(condition => {
        const triggerField = allElements.find(el => el.id === condition.triggerFieldId);
        const targetPage = pages.find(page => page.id === condition.targetPageId);
        const targetPageIndex = pages.findIndex(page => page.id === condition.targetPageId) + 1;
        
        return (
          <Card key={condition.id} className="mb-4 p-4 border-l-4 border-l-green-500">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-gray-800 mb-2">
                  {condition.action === 'skip to' ? 'Skip to' : 'Hide'} Page {targetPageIndex}
                </div>
                <div className="text-sm text-gray-600">
                  IF "{triggerField?.content.title}" {condition.state} "{condition.value}"
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removePageCondition(condition.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        );
      })}

      {/* New condition form */}
      <Card className="overflow-hidden mt-6">
        <div className="border-l-4 border-l-green-500 p-4">
          <div className="grid gap-6">
            <div className="grid gap-4">
              <div className="flex items-center">
                <div className="w-16 font-semibold">IF</div>
                <Select 
                  value={newCondition.triggerFieldId} 
                  onValueChange={(value) => setNewCondition({...newCondition, triggerFieldId: value})}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {allElements.map(element => (
                      <SelectItem key={element.id} value={element.id}>
                        {element.content.title || 'Untitled field'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center">
                <div className="w-16 font-semibold">STATE</div>
                <Select 
                  value={newCondition.state} 
                  onValueChange={(value) => setNewCondition({...newCondition, state: value as FieldState})}
                  disabled={!newCondition.triggerFieldId}
                >
                  <SelectTrigger className="w-full bg-gray-100">
                    <SelectValue placeholder="Select field state" />
                  </SelectTrigger>
                  <SelectContent>
                    {getFieldStates().map(state => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center">
                <div className="w-16 font-semibold">VALUE</div>
                <Input 
                  className="w-full bg-gray-100" 
                  placeholder="Please type a value here" 
                  value={newCondition.value}
                  onChange={(e) => setNewCondition({...newCondition, value: e.target.value})}
                  disabled={!newCondition.state}
                />
              </div>
            </div>
            
            <div className="grid gap-4 border-t pt-4 mt-2">
              <div className="flex items-center">
                <div className="w-16 font-semibold">DO</div>
                <Select 
                  value={newCondition.action} 
                  onValueChange={(value) => setNewCondition({...newCondition, action: value as 'skip to' | 'hide page'})}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="skip to">Skip to</SelectItem>
                    <SelectItem value="hide page">Hide page</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center">
                <div className="w-16 font-semibold">PAGE</div>
                <Select 
                  value={newCondition.targetPageId} 
                  onValueChange={(value) => setNewCondition({...newCondition, targetPageId: value})}
                >
                  <SelectTrigger className="w-full bg-gray-100">
                    <SelectValue placeholder="Select page" />
                  </SelectTrigger>
                  <SelectContent>
                    {pages.map((page, index) => (
                      <SelectItem key={page.id} value={page.id}>
                        Page {index + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end p-4 bg-gray-50">
          <Button 
            variant="default" 
            onClick={handleAddCondition}
            disabled={!newCondition.triggerFieldId || !newCondition.state || !newCondition.value || !newCondition.targetPageId}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            SAVE
          </Button>
        </div>
      </Card>
    </div>
  );
};

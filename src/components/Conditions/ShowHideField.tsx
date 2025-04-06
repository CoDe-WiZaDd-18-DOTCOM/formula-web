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

export const ShowHideField: React.FC = () => {
  const { pages, fieldConditions, addFieldCondition, removeFieldCondition } = useFormBuilder();
  
  const [newCondition, setNewCondition] = useState({
    triggerFieldId: '',
    state: '' as FieldState,
    value: '',
    targetFieldId: '',
    action: 'show' as 'show' | 'hide',
  });
  
  // Extract all form elements across all pages
  const allElements = pages.flatMap(page => page.elements);
  const hasElements = allElements.length > 0;
  
  const getFieldStates = () => {
    const triggerField = allElements.find(el => el.id === newCondition.triggerFieldId);
    if (!triggerField) return [];
  
    if (triggerField.type === 'date_picker') {
      return ['is before', 'is after', 'is equal to'];
    }
  
    return ['equals', 'not equals'];
  };
  
  const handleAddCondition = () => {
    if (newCondition.triggerFieldId && newCondition.state && newCondition.targetFieldId) {
      addFieldCondition(newCondition);
      setNewCondition({
        triggerFieldId: '',
        state: '' as FieldState,
        value: '',
        targetFieldId: '',
        action: 'show',
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

  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="bg-blue-500 text-white p-3 rounded-md mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12s3-5.5 10-5.5 10 5.5 10 5.5-3 5.5-10 5.5S2 12 2 12z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">SHOW/HIDE FIELD</h2>
          <p className="text-gray-600">Change visibility of specific form fields</p>
        </div>
      </div>

      {/* Existing conditions */}
      {fieldConditions.map(condition => {
        const triggerField = allElements.find(el => el.id === condition.triggerFieldId);
        const targetField = allElements.find(el => el.id === condition.targetFieldId);
        
        return (
          <Card key={condition.id} className="mb-4 p-4 border-l-4 border-l-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-gray-800 mb-2">
                  {condition.action === 'show' ? 'Show' : 'Hide'} "{targetField?.content.title}" 
                </div>
                <div className="text-sm text-gray-600">
                  IF "{triggerField?.content.title}" {condition.state} "{condition.value}"
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removeFieldCondition(condition.id)}
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
        <div className="border-l-4 border-l-blue-500 p-4">
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
                {(() => {
  const triggerField = allElements.find(el => el.id === newCondition.triggerFieldId);

  if (
    triggerField &&
    ['single_choice', 'multiple_choice', 'dropdown'].includes(triggerField.type) &&
    triggerField.content.options?.length
  ) {
    return (
      <Select
        value={newCondition.value}
        onValueChange={(value) => setNewCondition({ ...newCondition, value })}
        disabled={!newCondition.state}
      >
        <SelectTrigger className="w-full bg-gray-100">
          <SelectValue placeholder="Select value" />
        </SelectTrigger>
        <SelectContent>
          {triggerField.content.options.map((opt: string, idx: number) => (
            <SelectItem key={idx} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Default text input for all others
  return (
    <Input
      className="w-full bg-gray-100"
      placeholder="Please type a value here"
      value={newCondition.value}
      onChange={(e) => setNewCondition({ ...newCondition, value: e.target.value })}
      disabled={!newCondition.state}
    />
  );
})()}

              </div>
            </div>
            
            <div className="grid gap-4 border-t pt-4 mt-2">
              <div className="flex items-center">
                <div className="w-16 font-semibold">DO</div>
                <Select 
                  value={newCondition.action} 
                  onValueChange={(value) => setNewCondition({...newCondition, action: value as 'show' | 'hide'})}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="show">Show</SelectItem>
                    <SelectItem value="hide">Hide</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center">
                <div className="w-16 font-semibold">FIELD</div>
                <Select 
                  value={newCondition.targetFieldId} 
                  onValueChange={(value) => setNewCondition({...newCondition, targetFieldId: value})}
                >
                  <SelectTrigger className="w-full bg-gray-100">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {allElements
                      .filter(el => el.id !== newCondition.triggerFieldId)
                      .map(element => (
                        <SelectItem key={element.id} value={element.id}>
                          {element.content.title || 'Untitled field'}
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
            disabled={!newCondition.triggerFieldId || !newCondition.state || !newCondition.value || !newCondition.targetFieldId}
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


import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formElementTypes } from '../FormElements/ElementTypes';
import { useFormBuilder } from '@/context/FormBuilderContext';

export const ElementsSidebar = () => {
  const { sidebarOpen, toggleSidebar, addElement } = useFormBuilder();
  const [activeTab, setActiveTab] = useState('basic');

  if (!sidebarOpen) return null;

  // Filter out number and submit elements from formElementTypes
  const filteredElementTypes = formElementTypes.filter(el => 
    el.name !== 'number' && el.name !== 'submit'
  );
  
  // Get elements for the active tab
  const filteredElements = filteredElementTypes.filter(el => el.category === activeTab);

  return (
    <div className="fixed left-0 top-0 h-full w-80 bg-violet-900 text-white shadow-lg z-50">
      <div className="flex justify-between items-center px-4 py-3 bg-violet-950">
        <h2 className="text-lg font-medium">Form Elements</h2>
        <button 
          onClick={toggleSidebar}
          className="text-violet-300 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-violet-950">
          <TabsTrigger value="basic" className="data-[state=active]:bg-violet-800 text-white">BASIC</TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-violet-800 text-white">PAYMENTS</TabsTrigger>
          <TabsTrigger value="widgets" className="data-[state=active]:bg-violet-800 text-white">WIDGETS</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <ScrollArea className="h-[calc(100vh-100px)]">
            <div className="px-2 py-2">
              {filteredElements.map((element) => (
                <button
                  key={element.name}
                  className="flex items-center w-full px-3 py-4 hover:bg-violet-800 transition-colors rounded-md mb-1"
                  onClick={() => addElement(element.name)}
                >
                  <div className="mr-3 text-violet-300">{element.icon}</div>
                  <span className="text-sm font-medium capitalize">
                    {element.name.replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};


import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface TableColumn {
  id: string;
  header: string;
}


export interface TableRow {
  id: string;
  label: string;
}

export interface FormElement {
  id: string;
  type: string;
  content: {
    title?: string;
    subheader?: string;
    placeholder?: string;
    options?: string[];
    columns?: TableColumn[];
    rows?: TableRow[];
    imageUrl?: string;
    fileUrl?: string;
    rating?: number;
    expanded?: boolean;
    selectedDate?: Date;
    selectedTime?: string;
  };
  required?: boolean;
}

export interface FormPage {
  id: string;
  elements: FormElement[];
}

export type FieldState = 'is equal to' | 'is not equal to' | 'contains' | 'does not contain' | 'is greater than' | 'is less than' | 'is before' | 'is after';
export type ConditionAction = 'show' | 'hide' | 'skip to' | 'hide page';

export interface FieldCondition {
  id: string;
  triggerFieldId: string;
  state: FieldState;
  value: string;
  targetFieldId: string;
  action: 'show' | 'hide';
}

export interface PageCondition {
  id: string;
  triggerFieldId: string;
  state: FieldState;
  value: string;
  targetPageId: string;
  action: 'skip to' | 'hide page';
}

interface FormBuilderContextType {
  pages: FormPage[];
  currentPageIndex: number;
  sidebarOpen: boolean;
  selectedElement: FormElement | null;
  previewMode: boolean;
  currentTab: 'build' | 'conditions' | 'publish';
  currentConditionTab: 'field' | 'page';
  fieldConditions: FieldCondition[];
  pageConditions: PageCondition[];
  addElement: (type: string) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<FormElement>) => void;
  addPage: () => void;
  deletePage: (index: number) => void;
  goToPage: (index: number) => void;
  toggleSidebar: () => void;
  selectElement: (element: FormElement | null) => void;
  togglePreviewMode: () => void;
  setCurrentTab: (tab: 'build' | 'conditions' | 'publish') => void;
  setCurrentConditionTab: (tab: 'field' | 'page') => void;
  addFieldCondition: (condition: Omit<FieldCondition, 'id'>) => void;
  removeFieldCondition: (id: string) => void;
  addPageCondition: (condition: Omit<PageCondition, 'id'>) => void;
  removePageCondition: (id: string) => void;
}

const FormBuilderContext = createContext<FormBuilderContextType | undefined>(undefined);

export const useFormBuilder = () => {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error('useFormBuilder must be used within a FormBuilderProvider');
  }
  return context;
};

export const FormBuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<FormPage[]>([
    {
      id: uuidv4(),
      elements: [],
    },
  ]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<FormElement | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [currentTab, setCurrentTab] = useState<'build' | 'conditions' | 'publish'>('build');
  const [currentConditionTab, setCurrentConditionTab] = useState<'field' | 'page'>('field');
  const [fieldConditions, setFieldConditions] = useState<FieldCondition[]>([]);
  const [pageConditions, setPageConditions] = useState<PageCondition[]>([]);

  const addElement = (type: string) => {
    const newElement: FormElement = {
      id: uuidv4(),
      type,
      content: {},
    };

    if (type === 'heading') {
      newElement.content = {
        title: 'Heading',
        subheader: 'Type a subheader',
      };
    }
    
    if (type === 'short_text') {
      newElement.content = {
        title: 'Short Text',
        placeholder: 'Enter text here',
      };
    }
    
    if (type === 'long_text') {
      newElement.content = {
        title: 'Long Text',
        placeholder: 'Enter detailed text here',
      };
    }
    
    if (type === 'paragraph') {
      newElement.content = {
        title: 'Paragraph Heading',
        subheader: 'This is a paragraph text block where you can add longer text content. Edit this to provide instructions or information to your form users.',
      };
    }
    
    if (type === 'dropdown' || type === 'single_choice' || type === 'multiple_choice') {
      newElement.content = {
        title: type === 'dropdown' ? 'Select an option' : 
               type === 'single_choice' ? 'Select one option' : 'Select multiple options',
        options: ['Option 1', 'Option 2', 'Option 3'],
      };
    }
    
    if (type === 'file_upload') {
      newElement.content = {
        title: 'File Upload',
      };
    }
    
    if (type === 'image') {
      newElement.content = {
        title: 'Image',
      };
    }
    
    if (type === 'star_rating') {
      newElement.content = {
        title: 'Rate your experience',
        rating: 0,
      };
    }
    
    if (type === 'input_table') {
      newElement.content = {
        title: 'Type a question',
        columns: [
          { id: uuidv4(), header: 'Not Satisfied' },
          { id: uuidv4(), header: 'Somewhat Satisfied' },
          { id: uuidv4(), header: 'Satisfied' },
          { id: uuidv4(), header: 'Any thoughts?' }
        ],
        rows: [
          { id: uuidv4(), label: 'Service Quality' },
          { id: uuidv4(), label: 'Cleanliness' },
          { id: uuidv4(), label: 'Responsiveness' },
          { id: uuidv4(), label: 'Friendliness' }
        ]
      };
    }
    
    if (type === 'section_collapse') {
      newElement.content = {
        title: 'Collapsible Section',
        subheader: 'Click to expand or collapse this section',
        expanded: false
      };
    }
    
    if (type === 'appointment') {
      newElement.content = {
        title: 'Appointment',
      };
    }

    if (type === 'divider') {
      newElement.content = {
        title: 'Divider',
      };
    }

    setPages(prevPages => {
      const updatedPages = [...prevPages];
      updatedPages[currentPageIndex] = {
        ...updatedPages[currentPageIndex],
        elements: [...updatedPages[currentPageIndex].elements, newElement],
      };
      return updatedPages;
    });

    setSelectedElement(newElement);
    // setSidebarOpen(false);
  };

  const removeElement = (id: string) => {
    setPages(prevPages => {
      const updatedPages = [...prevPages];
      updatedPages[currentPageIndex] = {
        ...updatedPages[currentPageIndex],
        elements: updatedPages[currentPageIndex].elements.filter(element => element.id !== id),
      };
      return updatedPages;
    });

    if (selectedElement && selectedElement.id === id) {
      setSelectedElement(null);
    }
  };

  const updateElement = (id: string, updates: Partial<FormElement>) => {
    setPages(prevPages => {
      const updatedPages = [...prevPages];
      updatedPages[currentPageIndex] = {
        ...updatedPages[currentPageIndex],
        elements: updatedPages[currentPageIndex].elements.map(element => 
          element.id === id ? { ...element, ...updates } : element
        ),
      };
      return updatedPages;
    });

    if (selectedElement && selectedElement.id === id) {
      setSelectedElement(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const addPage = () => {
    const newPage: FormPage = {
      id: uuidv4(),
      elements: [],
    };
    setPages(prevPages => [...prevPages, newPage]);
    setCurrentPageIndex(prevPages => prevPages + 1);
  };
  
  const deletePage = (index: number) => {
    if (pages.length <= 1) {
      return; // Don't delete the last page
    }
    
    const newPages = [...pages];
    newPages.splice(index, 1);
    setPages(newPages);
    
    if (currentPageIndex >= newPages.length) {
      setCurrentPageIndex(newPages.length - 1);
    } else if (currentPageIndex === index) {
      setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
    }
    
    setSelectedElement(null);
  };

  const goToPage = (index: number) => {
    if (index >= 0 && index < pages.length) {
      setCurrentPageIndex(index);
      setSelectedElement(null);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const selectElement = (element: FormElement | null) => {
    if (previewMode) return; // Don't select elements in preview mode
    setSelectedElement(element);
  };
  
  const togglePreviewMode = () => {
    setPreviewMode(prev => !prev);
    if (!previewMode) {
      setSelectedElement(null);  // Clear selection when entering preview mode
      setSidebarOpen(false);     // Close sidebar when entering preview mode
    }
  };

  const addFieldCondition = (condition: Omit<FieldCondition, 'id'>) => {
    const newCondition: FieldCondition = {
      ...condition,
      id: uuidv4()
    };
    setFieldConditions(prev => [...prev, newCondition]);
  };

  const removeFieldCondition = (id: string) => {
    setFieldConditions(prev => prev.filter(condition => condition.id !== id));
  };

  const addPageCondition = (condition: Omit<PageCondition, 'id'>) => {
    const newCondition: PageCondition = {
      ...condition,
      id: uuidv4()
    };
    setPageConditions(prev => [...prev, newCondition]);
  };

  const removePageCondition = (id: string) => {
    setPageConditions(prev => prev.filter(condition => condition.id !== id));
  };

  const value = {
    pages,
    currentPageIndex,
    sidebarOpen,
    selectedElement,
    previewMode,
    currentTab,
    currentConditionTab,
    fieldConditions,
    pageConditions,
    addElement,
    removeElement,
    updateElement,
    addPage,
    deletePage,
    goToPage,
    toggleSidebar,
    selectElement,
    togglePreviewMode,
    setCurrentTab,
    setCurrentConditionTab,
    addFieldCondition,
    removeFieldCondition,
    addPageCondition,
    removePageCondition
  };

  return (
    <FormBuilderContext.Provider value={value}>
      {children}
    </FormBuilderContext.Provider>
  );
};

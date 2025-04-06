
import React, { useState } from 'react';
import { Settings, Trash2, GripVertical, Plus, Upload, Image as ImageIcon, X, Star, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { FormElement as FormElementType } from '@/context/FormBuilderContext';
import { useFormBuilder } from '@/context/FormBuilderContext';
import { getElementIcon } from '../FormElements/ElementTypes';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface FormElementProps {
  element: FormElementType;
}

export const FormElement: React.FC<FormElementProps> = ({ element }) => {
  const { selectElement, selectedElement, removeElement, updateElement, previewMode } = useFormBuilder();
  const isSelected = selectedElement?.id === element.id;
  
  // Local state for editable content
  const [options, setOptions] = useState<string[]>(
    element.content?.options || ['Option 1', 'Option 2', 'Option 3']
  );
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [starRating, setStarRating] = useState(element.content?.rating || 0);
  
  const handleAddOption = () => {
    const newOptions = [...options, `Option ${options.length + 1}`];
    setOptions(newOptions);
    updateElement(element.id, { 
      content: { 
        ...element.content, 
        options: newOptions 
      } 
    });
  };
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    updateElement(element.id, { 
      content: { 
        ...element.content, 
        options: newOptions 
      } 
    });
  };
  
  const handleRemoveOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
    updateElement(element.id, { 
      content: { 
        ...element.content, 
        options: newOptions 
      } 
    });
  };
  
  const handleTitleChange = (value: string) => {
    updateElement(element.id, { 
      content: { 
        ...element.content, 
        title: value 
      } 
    });
  };
  
  const handleSubheaderChange = (value: string) => {
    updateElement(element.id, { 
      content: { 
        ...element.content, 
        subheader: value 
      } 
    });
  };
  
  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        // In a real application, you would handle the file upload here
        const fileName = target.files[0].name;
        console.log('File selected:', fileName);
        
        // Update element with file info
        if (element.type === 'image') {
          updateElement(element.id, {
            content: {
              ...element.content,
              imageUrl: `https://via.placeholder.com/800x400?text=${encodeURIComponent(fileName)}`,
              title: fileName,
            }
          });
        } else if (element.type === 'file_upload') {
          updateElement(element.id, {
            content: {
              ...element.content,
              fileUrl: fileName,
            }
          });
        }
      }
    };
    input.click();
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    
    // Update time slots based on selected date
    if (element.type === 'appointment' && date) {
      updateElement(element.id, {
        content: {
          ...element.content,
          selectedDate: date,
        }
      });
    }
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    
    // Update selected time
    if (element.type === 'appointment') {
      updateElement(element.id, {
        content: {
          ...element.content,
          selectedTime: time,
        }
      });
    }
  };
  
  const handleStarRating = (rating: number) => {
    setStarRating(rating);
    updateElement(element.id, {
      content: {
        ...element.content,
        rating,
      }
    });
  };
  
  const toggleSectionCollapse = () => {
    const expanded = element.content?.expanded ?? false;
    updateElement(element.id, {
      content: {
        ...element.content,
        expanded: !expanded,
      }
    });
  };
  
  // Table operations
  const handleAddColumn = () => {
    const columns = element.content?.columns || [];
    const newColumn = { id: uuidv4(), header: `Column ${columns.length + 1}` };
    
    updateElement(element.id, {
      content: {
        ...element.content,
        columns: [...columns, newColumn],
      }
    });
  };
  
  const handleRemoveColumn = (columnId: string) => {
    const columns = element.content?.columns || [];
    updateElement(element.id, {
      content: {
        ...element.content,
        columns: columns.filter(col => col.id !== columnId),
      }
    });
  };
  
  const handleAddRow = () => {
    const rows = element.content?.rows || [];
    const newRow = { id: uuidv4(), label: `Row ${rows.length + 1}` };
    
    updateElement(element.id, {
      content: {
        ...element.content,
        rows: [...rows, newRow],
      }
    });
  };
  
  const handleRemoveRow = (rowId: string) => {
    const rows = element.content?.rows || [];
    updateElement(element.id, {
      content: {
        ...element.content,
        rows: rows.filter(row => row.id !== rowId),
      }
    });
  };
  
  const handleUpdateColumnHeader = (columnId: string, header: string) => {
    const columns = element.content?.columns || [];
    updateElement(element.id, {
      content: {
        ...element.content,
        columns: columns.map(col => col.id === columnId ? { ...col, header } : col),
      }
    });
  };
  
  const handleUpdateRowLabel = (rowId: string, label: string) => {
    const rows = element.content?.rows || [];
    updateElement(element.id, {
      content: {
        ...element.content,
        rows: rows.map(row => row.id === rowId ? { ...row, label } : row),
      }
    });
  };
  
  const renderElementContent = () => {
    switch (element.type) {
      case 'heading':
        return (
          <div className="p-4">
            {isSelected ? (
              <>
                <Input 
                  type="text" 
                  value={element.content.title || 'Heading'} 
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="text-2xl font-bold text-blue-600 mb-2"
                />
                <Input 
                  type="text" 
                  value={element.content.subheader || 'Type a subheader'} 
                  onChange={(e) => handleSubheaderChange(e.target.value)}
                  className="text-gray-500"
                />
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-blue-600">{element.content.title || 'Heading'}</h2>
                <p className="text-gray-500">{element.content.subheader || 'Type a subheader'}</p>
              </>
            )}
          </div>
        );
        
      case 'appointment':
        return (
          <div className="p-4 border rounded-lg">
            <div className="text-blue-600 font-bold text-lg mb-4">
              {isSelected ? (
                <Input 
                  type="text" 
                  value={element.content.title || 'Appointment'} 
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="font-bold text-blue-600"
                />
              ) : (
                element.content.title || 'Appointment'
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <Input 
                        type="text" 
                        value={selectedDate ? format(selectedDate, 'MM/dd/yyyy') : ''}
                        placeholder="Select date"
                        readOnly 
                        className="pl-10" 
                      />
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                        <Calendar className="h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                {selectedDate && (
                  <div className="text-violet-700 text-center font-medium mb-2">
                    {format(selectedDate, 'EEEE, MMMM dd')}
                  </div>
                )}
              </div>
            </div>
            
            {selectedDate && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"].map((time) => (
                  <div 
                    key={time}
                    className={`border rounded-lg p-4 text-center ${
                      selectedTime === time 
                        ? 'bg-blue-100 border-blue-500 text-blue-700' 
                        : 'text-blue-600 hover:bg-blue-50'
                    } cursor-pointer`}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 text-sm flex items-center gap-2 text-gray-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path d="M12 6V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              America/New York ({new Date().toLocaleTimeString()})
            </div>
          </div>
        );
        
      case 'short_text':
        return (
          <div className="p-4">
            {isSelected ? (
              <Input 
                type="text" 
                value={element.content.title || 'Short Text'} 
                onChange={(e) => handleTitleChange(e.target.value)}
                className="font-medium mb-2"
              />
            ) : (
              <label className="block mb-2 font-medium">{element.content.title || 'Short Text'}</label>
            )}
            <Input 
              type="text" 
              placeholder={element.content.placeholder || "Enter text here"} 
              className="w-full"
            />
          </div>
        );
        
      case 'long_text':
        return (
          <div className="p-4">
            {isSelected ? (
              <Input 
                type="text" 
                value={element.content.title || 'Long Text'} 
                onChange={(e) => handleTitleChange(e.target.value)}
                className="font-medium mb-2"
              />
            ) : (
              <label className="block mb-2 font-medium">{element.content.title || 'Long Text'}</label>
            )}
            <Textarea 
              placeholder={element.content.placeholder || "Enter detailed text here"} 
              className="w-full min-h-[100px]"
            />
          </div>
        );
        
      case 'paragraph':
        return (
          <div className="p-4">
            {isSelected ? (
              <>
                <Input 
                  type="text" 
                  value={element.content.title || 'Paragraph Heading'} 
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="font-medium mb-2"
                />
                <Textarea 
                  value={element.content.subheader || 'This is a paragraph text block where you can add longer text content. Edit this to provide instructions or information to your form users.'}
                  onChange={(e) => handleSubheaderChange(e.target.value)}
                  className="w-full min-h-[100px]"
                />
              </>
            ) : (
              <>
                <h3 className="font-medium mb-2">{element.content.title || 'Paragraph Heading'}</h3>
                <p className="text-gray-600">
                  {element.content.subheader || 'This is a paragraph text block where you can add longer text content. Edit this to provide instructions or information to your form users.'}
                </p>
              </>
            )}
          </div>
        );
        
      case 'dropdown':
        return (
          <div className="p-4">
            {isSelected ? (
              <>
                <Input 
                  type="text" 
                  value={element.content.title || 'Select an option'} 
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="font-medium mb-2"
                />
                <div className="border rounded-md p-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <Input 
                        type="text" 
                        value={option} 
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 mr-2"
                      />
                      <button 
                        onClick={() => handleRemoveOption(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={handleAddOption}
                    className="mt-2 flex items-center text-blue-600 text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Option
                  </button>
                </div>
              </>
            ) : (
              <>
                <label className="block mb-2 font-medium">{element.content.title || 'Select an option'}</label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose an option..." />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option, index) => (
                      <SelectItem key={index} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        );
        
      case 'single_choice':
        return (
          <div className="p-4">
            {isSelected ? (
              <>
                <Input 
                  type="text" 
                  value={element.content.title || 'Select one option'} 
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="font-medium mb-2"
                />
                <div className="border rounded-md p-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <div className="mr-2 flex items-center justify-center h-5 w-5 rounded-full border border-gray-300">
                        <div className="h-2.5 w-2.5 rounded-full bg-gray-300"></div>
                      </div>
                      <Input 
                        type="text" 
                        value={option} 
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 mr-2"
                      />
                      <button 
                        onClick={() => handleRemoveOption(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={handleAddOption}
                    className="mt-2 flex items-center text-blue-600 text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Option
                  </button>
                </div>
              </>
            ) : (
              <>
                <label className="block mb-2 font-medium">{element.content.title || 'Select one option'}</label>
                <RadioGroup>
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value={`option-${index + 1}`} id={`option-${element.id}-${index}`} />
                      <label htmlFor={`option-${element.id}-${index}`} className="text-sm font-normal">
                        {option}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </>
            )}
          </div>
        );
        
      case 'multiple_choice':
        return (
          <div className="p-4">
            {isSelected ? (
              <>
                <Input 
                  type="text" 
                  value={element.content.title || 'Select multiple options'} 
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="font-medium mb-2"
                />
                <div className="border rounded-md p-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <div className="mr-2 flex items-center justify-center h-5 w-5 rounded border border-gray-300">
                        <div className="h-2.5 w-2.5 bg-gray-300"></div>
                      </div>
                      <Input 
                        type="text" 
                        value={option} 
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 mr-2"
                      />
                      <button 
                        onClick={() => handleRemoveOption(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={handleAddOption}
                    className="mt-2 flex items-center text-blue-600 text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Option
                  </button>
                </div>
              </>
            ) : (
              <>
                <label className="block mb-2 font-medium">{element.content.title || 'Select multiple options'}</label>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox id={`checkbox-${element.id}-${index}`} />
                      <label htmlFor={`checkbox-${element.id}-${index}`} className="text-sm font-normal">{option}</label>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
        
      case 'image':
        return (
          <div className="p-4">
            {element.content.imageUrl ? (
              <div className="relative">
                <img 
                  src={element.content.imageUrl} 
                  alt={element.content.title || "Uploaded image"} 
                  className="w-full rounded-md"
                />
                {isSelected && (
                  <button
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    onClick={() => updateElement(element.id, {
                      content: { ...element.content, imageUrl: undefined }
                    })}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ) : (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-md p-8 flex flex-col items-center cursor-pointer hover:border-blue-500"
                onClick={handleFileUpload}
              >
                <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-center text-gray-500">
                  Click to upload an image
                </p>
                <p className="text-center text-gray-400 text-sm mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            )}
          </div>
        );
        
      case 'file_upload':
        return (
          <div className="p-4">
            <label className="block mb-2 font-medium">
              {isSelected ? (
                <Input 
                  type="text" 
                  value={element.content.title || 'File Upload'} 
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="font-medium mb-2"
                />
              ) : (
                element.content.title || 'File Upload'
              )}
            </label>
            {element.content.fileUrl ? (
              <div className="border rounded-md p-4 flex items-center">
                <div className="flex-1">
                  <p className="font-medium">{element.content.fileUrl}</p>
                  <p className="text-xs text-gray-500">Uploaded successfully</p>
                </div>
                {isSelected && (
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => updateElement(element.id, {
                      content: { ...element.content, fileUrl: undefined }
                    })}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ) : (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-md p-8 flex flex-col items-center cursor-pointer hover:border-blue-500"
                onClick={handleFileUpload}
              >
                <Upload className="h-12 w-12 text-gray-400 mb-2" />
                <p className="font-medium text-blue-600">Browse Files</p>
                <p className="text-center text-gray-500 mt-1">
                  Drag and drop files here or click to browse
                </p>
                <p className="text-center text-gray-400 text-sm mt-1">
                  PDF, DOCX, XLS up to 10MB
                </p>
              </div>
            )}
          </div>
        );
        
      case 'divider':
        return (
          <div className="py-2 px-4">
            <Separator className="h-[2px] bg-gray-200" />
          </div>
        );
        
      case 'star_rating':
        return (
          <div className="p-4">
            {isSelected ? (
              <Input 
                type="text" 
                value={element.content.title || 'Rate your experience'} 
                onChange={(e) => handleTitleChange(e.target.value)}
                className="font-medium mb-2"
              />
            ) : (
              <label className="block mb-2 font-medium">{element.content.title || 'Rate your experience'}</label>
            )}
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleStarRating(rating)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      rating <= starRating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        );
        
      case 'section_collapse':
        const isExpanded = element.content?.expanded ?? false;
        return (
          <div className="p-4 border rounded-md">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={toggleSectionCollapse}
            >
              {isSelected ? (
                <Input 
                  type="text" 
                  value={element.content.title || 'Collapsible Section'} 
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="font-medium flex-1 mr-2"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <h3 className="font-medium">{element.content.title || 'Collapsible Section'}</h3>
              )}
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
            
            {isExpanded && (
              <div className="mt-4 pt-4 border-t">
                {isSelected ? (
                  <Textarea 
                    value={element.content.subheader || 'Section content goes here. You can add any information that should be collapsed by default.'}
                    onChange={(e) => handleSubheaderChange(e.target.value)}
                    className="w-full min-h-[100px]"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <p className="text-gray-600">
                    {element.content.subheader || 'Section content goes here. You can add any information that should be collapsed by default.'}
                  </p>
                )}
              </div>
            )}
          </div>
        );
        
      case 'input_table':
        const columns = element.content?.columns || [];
        const rows = element.content?.rows || [];
        
        return (
          <div className="p-4">
            {isSelected ? (
              <Input 
                type="text" 
                value={element.content.title || 'Type a question'} 
                onChange={(e) => handleTitleChange(e.target.value)}
                className="font-medium mb-4"
              />
            ) : (
              <h3 className="font-medium mb-4">{element.content.title || 'Type a question'}</h3>
            )}
            
            <div className="overflow-x-auto">
              <Table className="border rounded-md w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-40 bg-gray-100"></TableHead>
                    {columns.map((column, colIndex) => (
                      <TableHead key={column.id} className="bg-gray-100">
                        {isSelected ? (
                          <div className="flex items-center">
                            <Input 
                              type="text" 
                              value={column.header} 
                              onChange={(e) => handleUpdateColumnHeader(column.id, e.target.value)}
                              className="text-sm"
                            />
                            <button 
                              onClick={() => handleRemoveColumn(column.id)}
                              className="ml-1 text-red-500 hover:text-red-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center">{column.header}</div>
                        )}
                      </TableHead>
                    ))}
                    {isSelected && (
                      <TableHead className="bg-gray-100 w-12 text-center">
                        <button 
                          onClick={handleAddColumn}
                          className="text-blue-600 font-normal text-sm whitespace-pre-wrap"
                        >
                          <span className="block text-xs -rotate-90 whitespace-nowrap">+ add column</span>
                        </button>
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="bg-gray-100 font-medium">
                        {isSelected ? (
                          <div className="flex items-center">
                            <Input 
                              type="text" 
                              value={row.label} 
                              onChange={(e) => handleUpdateRowLabel(row.id, e.target.value)}
                              className="text-sm"
                            />
                            <button 
                              onClick={() => handleRemoveRow(row.id)}
                              className="ml-1 text-red-500 hover:text-red-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          row.label
                        )}
                      </TableCell>
                      {columns.map((column) => (
                        <TableCell key={column.id} className="text-center">
                          <div className="flex justify-center">
                            <div className="h-5 w-5 rounded-full border border-gray-300"></div>
                          </div>
                        </TableCell>
                      ))}
                      {isSelected && <TableCell />}
                    </TableRow>
                  ))}
                  {isSelected && (
                    <TableRow>
                      <TableCell colSpan={columns.length + 2}>
                        <button 
                          onClick={handleAddRow}
                          className="text-blue-600 font-normal text-sm"
                        >
                          +add row
                        </button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        );
        
      case 'full_name':
        return (
          <div className="p-4">
            <label className="block mb-2 font-medium">
              {isSelected ? (
                <Input 
                  type="text" 
                  value={element.content.title || 'Full Name'} 
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="font-medium mb-2"
                />
              ) : (
                element.content.title || 'Full Name'
              )}
            </label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your full name"
            />
          </div>
        );
      case 'email':
        return (
          <div className="p-4">
            <label className="block mb-2 font-medium">
              {isSelected ? (
                <Input 
                  type="text" 
                  value={element.content.title || 'Email'} 
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="font-medium mb-2"
                />
              ) : (
                element.content.title || 'Email'
              )}
            </label>
            <input 
              type="email" 
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
            />
          </div>
        );
      case 'address':
        return (
          <div className="p-4">
            <label className="block mb-2 font-medium">
              {isSelected ? (
                <Input 
                  type="text" 
                  value={element.content.title || 'Address'} 
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="font-medium mb-2"
                />
              ) : (
                element.content.title || 'Address'
              )}
            </label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
              placeholder="Street Address"
            />
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="City"
              />
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="State / Province"
              />
            </div>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md mt-2"
              placeholder="Postal / Zip Code"
            />
          </div>
        );
      case 'phone':
        return (
          <div className="p-4">
            <label className="block mb-2 font-medium">
              {isSelected ? (
                <Input 
                  type="text" 
                  value={element.content.title || 'Phone Number'} 
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="font-medium mb-2"
                />
              ) : (
                element.content.title || 'Phone Number'
              )}
            </label>
            <input 
              type="tel" 
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="(000) 000-0000"
            />
            <p className="text-sm text-gray-500 mt-1">Please enter a valid phone number.</p>
          </div>
        );
      case 'date_picker':
        return (
          <div className="p-4">
            <label className="block mb-2 font-medium">
              {isSelected ? (
                <Input 
                  type="text" 
                  value={element.content.title || 'Date'} 
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="font-medium mb-2"
                />
              ) : (
                element.content.title || 'Date'
              )}
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Input 
                    type="text" 
                    value={selectedDate ? format(selectedDate, 'MM/dd/yyyy') : ''}
                    placeholder="Select date"
                    readOnly 
                    className="pl-10" 
                  />
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        );
        
      default:
        return (
          <div className="p-4 flex items-center text-gray-500">
            {getElementIcon(element.type)}
            <span className="ml-2 capitalize">{element.type.replace('_', ' ')} Element</span>
          </div>
        );
    }
  };

  return (
    <div 
      className={`border-2 rounded-md mb-4 bg-white ${
        isSelected ? 'border-blue-500' : 'border-gray-300'
      } relative`}
      onClick={() => selectElement(element)}
    >
      {renderElementContent()}
      
      {isSelected && !previewMode && (
        <div className="absolute top-2 right-2 flex items-center space-x-1">
          <button
            className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              // Settings logic would go here
            }}
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            className="p-1 bg-red-100 text-red-500 rounded-full hover:bg-red-200"
            onClick={(e) => {
              e.stopPropagation();
              removeElement(element.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <div className="p-1 bg-gray-200 rounded-full cursor-move">
            <GripVertical className="h-4 w-4" />
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import * as widget from '../models/Widget'

interface WidgetItemProps {
    widget: widget.Widget
  }
  
  const WidgetItem: React.FC<WidgetItemProps> = ({ widget }) => {

    return (
      <div
        className="bg-blue-200 p-4 cursor-pointer w-48 h-48"
      >
        Sample Widget
      </div>
    );
  };
  
export default WidgetItem;
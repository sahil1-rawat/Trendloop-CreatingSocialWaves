import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
} from '@radix-ui/react-tooltip';
import React from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ToolTips = ({ icon, content }) => {
  const navigate = useNavigate();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{icon}</TooltipTrigger>
        <TooltipContent className='bg-[#1c1b1e] border-none text-white mb-2 p-3'>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ToolTips;

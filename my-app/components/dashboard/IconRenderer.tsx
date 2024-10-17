import React from 'react';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { MdOutlineErrorOutline } from 'react-icons/md';
import { FaUserTie } from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';

// Define the valid task types as a union of string literals
export type TaskType = 'closeDeadline' | 'passedDeadline' | 'activeManagers' | 'dropTask' | 'coloredTagCards' | undefined;

// Create a function to return the appropriate icon based on the taskType prop
export const renderIcon = (taskType: TaskType): JSX.Element | null => {
  switch (taskType) {
    case 'closeDeadline':
      return <AiOutlineClockCircle size={24} />;
    case 'passedDeadline':
      return <MdOutlineErrorOutline size={24} />;
    case 'activeManagers':
      return <FaUserTie size={24} />;
    case 'dropTask':
      return <FiTrash2 size={24} />;
    default:
      return null; // No icon if no matching taskType is provided
  }
};

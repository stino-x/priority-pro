import React from 'react';
import classNames from 'classnames';
import { renderIcon, TaskType } from './IconRenderer';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IoArrowForwardCircleOutline, IoEllipsisVertical } from 'react-icons/io5';
import AvatarGroup from './AvatarGroup';

// Define the interface for props
interface CardComponentProps {
  taskType: TaskType; // Define taskType prop as the TaskType type
}

const CardComponent: React.FC<CardComponentProps> = ({ taskType }) => {
  // Card class names based on the task type
  const cardClassNames = classNames(
    'w-full h-full flex rounded-lg shadow-md pl-2',
    {
      'bg-[#007BFF] text-white': taskType === 'coloredTagCards',
      'bg-white text-black': taskType === 'closeDeadline' || taskType === 'passedDeadline' || taskType === 'activeManagers' || taskType === 'dropTask',
    },
  );

  // CardHeader class names based on the task type
  const cardHeaderClassNames = classNames('flex-1 w-[30%] px-4 py-2', {
    'bg-[#000000]': taskType === 'coloredTagCards',
    'space-y-[15%]': taskType === 'closeDeadline' || taskType === 'passedDeadline',
  });

  // CardFooter class names based on the task type
  const cardFooterClassNames = classNames('flex justify-end items-center px-4 py-3', {
    'w-full': taskType === 'closeDeadline',
    'px-2': taskType === 'passedDeadline',
  });

  return (
    <Card className={cardClassNames}>
      {/* Card Header */}
      <CardHeader className={cardHeaderClassNames}>
        <div className="flex flex-col">
          {renderIcon(taskType)} {/* Render the icon based on taskType */}
          <CardTitle className="text-[1rem]">{`${taskType}`}</CardTitle>
        </div>
        <CardDescription>10 tasks.</CardDescription>
      </CardHeader>

      {/* Conditional Card Content for dropTask version */}
      {taskType === 'dropTask' && (
        <CardContent>
          <div className="p-4 text-center">Drop your task here</div>
        </CardContent>
      )}

      {/* Card Footer - Close Deadline */}
      {taskType === 'closeDeadline' && (
        <CardFooter className={cardFooterClassNames}>
          <IoArrowForwardCircleOutline
            size={30}
            style={{ transform: 'rotate(-45deg)' }}
          />
        </CardFooter>
      )}

      {/* Card Footer - Passed Deadline and Active Managers */}
      {(taskType === 'passedDeadline' || taskType === 'activeManagers') && (
        <CardFooter className={cardFooterClassNames}>
          <IoArrowForwardCircleOutline
            size={50}
            style={{ transform: 'rotate(-45deg)' }}
          />
        </CardFooter>
      )}

      {/* Colored Tag Cards */}
      {taskType === 'coloredTagCards' && (
        <>
          <CardContent className="pt-4">
            {/* Add any specific content you want here */}
          </CardContent>
          <CardFooter className="flex justify-between items-center space-x-2">
            <IoEllipsisVertical className="text-gray-400 flex-1" />
            <AvatarGroup /> {/* Render avatars here */}
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default CardComponent;

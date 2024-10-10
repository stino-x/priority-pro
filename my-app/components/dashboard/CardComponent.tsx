import React from 'react';
import { Card, CardHeader, CardDescription, CardTitle, CardContent, CardFooter } from '../ui/card';
import { renderIcon, TaskType } from './IconRenderer';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

// Import the renderIcon function and the TaskType type from iconRenderer.tsx
// import { renderIcon, TaskType } from './iconRenderer';

interface CardComponentProps {
  taskType: TaskType;  // Define taskType prop as the TaskType type
}

const CardComponent: React.FC<CardComponentProps> = ({ taskType }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          {renderIcon(taskType)} {/* Render the icon based on taskType */}
          <CardTitle className="ml-2">Account</CardTitle>
        </div>
        <CardDescription>
          Make changes to your account here. Click save when you&apos;re done.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue="Pedro Duarte" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <Input id="username" defaultValue="@peduarte" />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save changes</Button>
      </CardFooter>
    </Card>
  );
};

export default CardComponent;

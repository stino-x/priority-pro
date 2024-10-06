export interface Restaurant {
    name: string;
    location: string;
    users: string[];
}

export interface Comment {
  comment_id: string;            // Required, string
  task: Task;                    // Relationship with Task (assuming one-to-one or many-to-one)
  user: User;                    // Relationship with User (many-to-one or one-to-one)
  comment_text: string;          // Required, string
  created_at: Date;              // Required, datetime (using JS Date object)
}

export interface Subtask {
  subtask_id: string;             // Required, string
  task_id: string;                // Required, string (foreign key to Task)
  title: string;                  // Required, string
  description: string;            // Required, string
  status: string;                 // Required, string (status of the subtask)
  
  // Relationship
  task: Task;                     // Relationship with Task (the parent task)
}


export interface User {
  userid: string;                // Required, string
  name: string;                  // Required, string
  email: string;                 // Required, must be an email
  can_assign_tasks: boolean;     // Required, boolean
  assigned_tasks: string[];      // Required, array of strings
  created_at: Date;              // Required, datetime (using JS Date object)
  updated_at?: Date;             // Optional, datetime (using JS Date object)
  
  // Relationships
  comment: Comment[];            // Assuming a one-to-many relationship with comments
  restaurant: Restaurant;        // Assuming a one-to-one or one-to-many relationship with a restaurant
}

export interface Task {
  task_id: string;                    // Required, string
  title: string;                      // Required, string
  description: string;                // Required, string
  priority: number;                   // Required, integer
  
  // Relationships
  restaurant: Restaurant;             // Relationship with Restaurant
  user: User;                         // Relationship with User (the current assignee)
  
  due_date: Date;                     // Required, datetime
  created_at: Date;                   // Required, datetime
  updated_at?: Date;                  // Optional, datetime
  
  is_verified: boolean;               // Required, boolean, default is false
  verified_by?: string;               // Optional, string (userId of the verifier)
  verified_at?: Date;
  completed: boolean;                 // Optional, datetime (when the task was verified)
  
  is_reassigned: boolean;             // Required, boolean
  previous_assignee_id?: string;      // Optional, string (userId of the previous assignee)
  previous_assignee_name?: string;    // Optional, string (name of the previous assignee)
  new_assignee_id?: string;           // Optional, string (userId of the new assignee)
  new_assignee_name?: string;         // Optional, string (name of the new assignee)
  reassigned_at?: Date;               // Optional, datetime (when reassignment occurred)
  
  // Subtasks relationship
  subtasks: Subtask[];                // Relationship with subtasks (array of Subtask entities)
  
  // Comments relationship
  comment: Comment[];                 // Relationship with comments (array of Comment entities)
  
  // Assigned by relationship
  assigned_by: User;                  // Relationship with User (the user who assigned the task)
}
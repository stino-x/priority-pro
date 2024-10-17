// import { Payment } from "@/components/table/columns";
import { getMyTasks } from "@/lib/actions/task.action";
import useTabState from "@/lib/hooks/useTabState";
import { Task } from "@/lib/interfaces/interface";


export async function getData(): Promise<Task[]> {
  try {
    const tasksResponse = await getMyTasks();
    console.log("Fetched tasks:", tasksResponse);
    

    const tasks = tasksResponse?.documents || [
      {
        task_id: '1',
        title: 'Complete Backend API',
        description: 'Implement REST API endpoints for user management',
        priority: 1,
        restaurant: {
          name: 'Golden Grill',
          location: '1234 Elm St, Cityville',
          users: ['1', '2']
        },
        user: {
          userid: '1',
          name: 'John Doe',
          email: 'johndoe@example.com',
          can_assign_tasks: true,
          assigned_tasks: ['1', '2'],
          created_at: new Date('2023-01-01'),
          updated_at: new Date('2023-06-01'),
          comment: [],
          restaurant: {
            name: 'Golden Grill',
            location: '1234 Elm St, Cityville',
            users: ['1', '2']
          }
        },
        due_date: new Date('2024-10-15'),
        created_at: new Date('2024-10-04'),
        updated_at: new Date('2024-10-05'),
        is_verified: false,
        verified_by: null,
        verified_at: null,
        completed: false,
        is_reassigned: false,
        previous_assignee_id: null,
        previous_assignee_name: null,
        new_assignee_id: null,
        new_assignee_name: null,
        reassigned_at: null,
        subtasks: [
          {
            subtask_id: '1',
            task_id: '1',
            title: 'Design API Schema',
            description: 'Define the structure for the API endpoints and data models',
            status: 'in-progress',
            task: null // Normally it would reference the parent task, but keeping it null here for simplicity
          },
          {
            subtask_id: '2',
            task_id: '1',
            title: 'Create Endpoints',
            description: 'Develop the user and task management API endpoints',
            status: 'pending',
            task: null
          }
        ],
        comment: [
          {
            comment_id: '1',
            task: null, // Placeholder for parent task reference
            user: {
              userid: '2',
              name: 'Jane Smith',
              email: 'janesmith@example.com',
              can_assign_tasks: true,
              assigned_tasks: ['3'],
              created_at: new Date('2023-02-15'),
              comment: [],
              restaurant: {
                name: 'Golden Grill',
                location: '1234 Elm St, Cityville',
                users: ['1', '2']
              }
            },
            comment_text: 'Make sure to use proper validation in the API.',
            created_at: new Date('2024-10-04')
          }
        ],
        assigned_by: {
          userid: '2',
          name: 'Jane Smith',
          email: 'janesmith@example.com',
          can_assign_tasks: true,
          assigned_tasks: ['3'],
          created_at: new Date('2023-02-15'),
          comment: [],
          restaurant: {
            name: 'Golden Grill',
            location: '1234 Elm St, Cityville',
            users: ['1', '2']
          }
        }
      },
      {
        task_id: '2',
        title: 'Design UI Components',
        description: 'Create reusable UI components for the dashboard',
        priority: 2,
        restaurant: {
          name: 'Silver Spoon',
          location: '5678 Oak St, Townsville',
          users: ['3']
        },
        user: {
          userid: '3',
          name: 'Michael Brown',
          email: 'michaelbrown@example.com',
          can_assign_tasks: false,
          assigned_tasks: ['2'],
          created_at: new Date('2023-03-10'),
          updated_at: null,
          comment: [],
          restaurant: {
            name: 'Silver Spoon',
            location: '5678 Oak St, Townsville',
            users: ['3']
          }
        },
        due_date: new Date('2024-10-20'),
        created_at: new Date('2024-10-03'),
        updated_at: null,
        is_verified: false,
        verified_by: null,
        verified_at: null,
        completed: false,
        is_reassigned: true,
        previous_assignee_id: '1',
        previous_assignee_name: 'John Doe',
        new_assignee_id: '3',
        new_assignee_name: 'Michael Brown',
        reassigned_at: new Date('2024-10-04'),
        subtasks: [
          {
            subtask_id: '3',
            task_id: '2',
            title: 'Design Dashboard',
            description: 'Create wireframes and mockups for the dashboard layout',
            status: 'completed',
            task: null
          }
        ],
        comment: [
          {
            comment_id: '2',
            task: null, // Placeholder for parent task reference
            user: {
              userid: '1',
              name: 'John Doe',
              email: 'johndoe@example.com',
              can_assign_tasks: true,
              assigned_tasks: ['1', '2'],
              created_at: new Date('2023-01-01'),
              updated_at: new Date('2023-06-01'),
              comment: [],
              restaurant: {
                name: 'Golden Grill',
                location: '1234 Elm St, Cityville',
                users: ['1', '2']
              }
            },
            comment_text: 'Great progress on the UI! Keep up the good work.',
            created_at: new Date('2024-10-04')
          }
        ],
        assigned_by: {
          userid: '2',
          name: 'Jane Smith',
          email: 'janesmith@example.com',
          can_assign_tasks: true,
          assigned_tasks: ['3'],
          created_at: new Date('2023-02-15'),
          comment: [],
          restaurant: {
            name: 'Golden Grill',
            location: '1234 Elm St, Cityville',
            users: ['1', '2']
          }
        }
      }
    ];
    
    if (!Array.isArray(tasks)) {
      console.log('Expected tasks to be an array, but got:', typeof tasks);
      return [];
    }

    return tasks
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

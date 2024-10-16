declare type Task = {
  $id: string;
  task_id: string;
  title: string;
  status: string;
  due_date: string;
  priority: string;
};

declare interface TasksProps {
  tasks: Task[],
}

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare interface PaginationProps {
  page: number;
  totalPages: number;
}
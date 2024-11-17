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

declare type User = {
  userid: string;
  name: string;
  picture: string;
};

declare type Chat = {
  chat_id: string;
  title: string;
  user1_id: string;
  user2_id: string;
};

declare type MessageProps = {
  $id: string;
  message_id: string;
  chat_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  time_sent: Date;
};

declare type Message = {
  chat_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  time_sent: Date;
};

declare type ChatPageProps =  {
  params: { chat_id: string };
}
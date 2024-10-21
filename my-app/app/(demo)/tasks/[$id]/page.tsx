
import Link from "next/link";

import PlaceholderContent from "@/components/demo/placeholder-content";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { getTaskById } from "@/lib/actions/task.action";
import { Dot } from 'lucide-react';
import { CiCalendarDate } from "react-icons/ci";

export default async function TaskPage({ params: { $id } }: { params: { $id: string } }) {
  const fetchTask = await getTaskById($id);
  const task = fetchTask;

  console.log(task)
  return (
    <ContentLayout title="Task Page">
      
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              Task detail
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section>
        <div>
        <h1 className="font-semibold text-lg text-zinc-900"> Restaurant Details</h1>
          <ul className="flex flex-col sm:flex-row mb-4  sm:justify-around list-disc">
            <li className="flex flex-row my-2">
              <Dot className="w-8 h-8 mr-1" />
              <div className="flex flex-col">
                <h2 className="font-semibold text-xs text-zinc-900">Name</h2>
                <p className="font-semibold text-xs text-zinc-500">{task.restaurant.name}</p>
              </div>
            </li>
            <li className="flex flex-row my-2">
              <Dot className="w-8 h-8 mr-1" />
              <div className="flex flex-col">
                <h2 className="font-semibold text-xs text-zinc-900">Location</h2>
                <p className="font-semibold text-xs text-zinc-500">{task.restaurant.location}</p>
              </div>
              
            </li>
            <li className="flex flex-row my-2">
              <Dot className="w-8 h-8 mr-1" />
              <div className="flex flex-col">
                <h2 className="font-semibold text-xs text-zinc-900">Manager</h2>
                <p className="font-semibold text-xs text-zinc-500">{task.completed_at ? new Date(task.verified_at).toLocaleDateString() : 'N/A'}</p>

              </div>
            </li>
          </ul>
        </div>
        <div>
          <h1 className="font-semibold text-lg text-zinc-900">Task Details</h1>
          <ul className="flex flex-col list-disc">
            <li className="flex flex-row my-2">
              <Dot className="w-8 h-8 mr-1" />
              <div className="flex flex-col">
                <h2 className="font-semibold text-xs text-zinc-900">Task Created</h2>
                <p className="font-semibold text-xs text-zinc-500">{task.created_at}</p>
              </div>
            </li>
            <li className="flex flex-row my-2">
              <Dot className="w-8 h-8 mr-1" />
              <div className="flex flex-col">
                <h2 className="font-semibold text-xs text-zinc-900">Task Verified</h2>
                <p className="font-semibold text-xs text-zinc-500">{task.verified_at ? new Date(task.verified_at).toLocaleDateString() : 'N/A'}</p>
              </div>
              
            </li>
            <li className="flex flex-row my-2">
              <Dot className="w-8 h-8 mr-1" />
              <div className="flex flex-col">
                <h2 className="font-semibold text-xs text-zinc-900">Task Completed</h2>
                <p className="font-semibold text-xs text-zinc-500">{task.completed_at ? new Date(task.verified_at).toLocaleDateString() : 'N/A'}</p>

              </div>
            </li>
          </ul>
          <p className="font-semibold text-xs text-zinc-500 mt-2">Due date: {task.due_date}</p>

        </div>
        <div className="mt-4">
          <div className="flex flex-row mt-4">
            <div className=" mr-4 items-center justify-center">
              <p className="font-semibold text-xs text-zinc-500">Title: </p>
            </div>
            <div className="flex flex-col">
              <h2 className="font-semibold text-xs text-zinc-900">{task.title}</h2>
            </div>
          </div>
          <div className="flex flex-row mt-4">
            <div className=" mr-4 items-center justify-center">
              <p className="font-semibold text-xs text-zinc-500">Description: </p>
            </div>
            <div className="flex flex-col">
              <h2 className="font-semibold text-xs text-zinc-900">{task.description}</h2>
            </div>
          </div>
          <div className="flex flex-row mt-4">
            <div className=" mr-4 items-center justify-center">
              <p className="font-semibold text-xs text-zinc-500">Task Priority: </p>
            </div>
            <div className="flex flex-col">
              <h2 className="font-semibold text-xs text-zinc-900">{task.priority}</h2>
            </div>
          </div>
          <div className="flex flex-row mt-4">
            <h2 className=" bg-gray-100 h-[1.5rem] rounded font-semibold text-xs text-zinc-900">{task.completed ? "Completed" : "Not Started"}</h2>
            <h2 className="bg-gray-100 h-[1.5rem] rounded font-semibold text-xs text-zinc-900 ml-4">{task.is_verified ? "Verified" : "Not Verified"}</h2>
          </div>
          <h1 className="font-semibold text-lg text-zinc-900">Subtasks</h1>
          {task.subtasks.map((subTask) => {
            <h2>subTask.title</h2>
          })}
          <h1 className="font-semibold text-lg text-zinc-900">Chats</h1>
          {task.comment.map((comment) => {
            <h2>comment.title</h2>
          })}
        </div>
        <button type="button">Complete Task</button>
      </section>
    </ContentLayout>
  );
}
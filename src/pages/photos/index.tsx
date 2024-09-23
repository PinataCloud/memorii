import useUser from "@/hooks/useUser";
import { useState, useEffect } from "react"

type File = {
  size: number;
  name: string;
  source: string;
}

export default function Photos() {
  // const [files, setFiles] = useState<File[]>([]);

  const files = [
    {
      name: 'IMG_4985.HEIC',
      size: '3.9 MB',
      source:
        'https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80',
    },
    // More files...
  ]

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadFiles()
    }
  }, []);

  const loadFiles = async () => {

  }

  return (
    <div className="w-3/4 m-auto max-w-[1220px]">
      <div className="py-6 flex items-center justify-between w-full">
        <h1 className="text-2xl font-bold">Your Locker</h1>
        <button>Upload photo</button>
      </div>      
      <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        {files.map((file) => (
          <li key={file.source} className="relative">
            <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
              <img alt="" src={file.source} className="pointer-events-none object-cover group-hover:opacity-75" />
              <button type="button" className="absolute inset-0 focus:outline-none">
                <span className="sr-only">View details for {file.name}</span>
              </button>
            </div>
            <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">{file.name}</p>
            <p className="pointer-events-none block text-sm font-medium text-gray-500">{file.size}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

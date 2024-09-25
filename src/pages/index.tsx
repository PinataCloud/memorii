import { SignOutButton } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react"
import { useUser } from '@clerk/nextjs'
import { pinata } from "@/pinata";
import { FileListItem } from "pinata";

type File = {
  id: string,
  size: number;
  name: string;
  source: string;
}

export default function Photos() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [uploading, setUploading] = useState(false);
  const { user } = useUser()
  const fileRef: any = useRef()

  useEffect(() => {
    loadFiles()
  }, []);

  const loadFiles = async () => {
    const res = await fetch(`/api/photos`)
    const data = await res.json()
    setFiles(data)
  }

  const handleFileChange = async (e: any) => {
    try {
      const files = e.target.files;
      //  Get the limited use key
      const keyData = await fetch("/api/key")
      const key = await keyData.json()

      const JWT = key.key;
      const groupId = key.groupId;

      await pinata.upload.file(files[0]).key(JWT).group(groupId).addMetadata({
        name: files[0].name,
      })
      setUploading(false);
    } catch (error: any) {
      console.log(error)
      alert(error.message)
      setUploading(false);
    }
    loadFiles();
  }

  const handleFileSelect = () => {
    fileRef?.current?.click()
  }

  return (
    <div className="w-3/4 m-auto max-w-[1220px]">
      <div className="py-6 flex items-center justify-between w-full">
        <h1 className="text-3xl font-bold flex items-center">Memorii</h1>
        <SignOutButton />
      </div>
      <div className="py-6 flex items-center w-full">
        <h1 className="text-2xl font-bold">Your Locker</h1>
        <button onClick={handleFileSelect} className="ml-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
        </button>
        <input value={selectedFile} onChange={handleFileChange} className="hidden" type="file" accept="image/*" ref={fileRef} />
      </div>
      <ul
        role="list"
        className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
      >
        {files?.map((file) => (
          <li key={file.id} className="relative">
            <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
              {file.source ? (
                <img
                  alt={file.name}
                  src={file.source}
                  className="pointer-events-none object-cover group-hover:opacity-75"
                />
              ) : (
                <div className="pointer-events-none object-cover group-hover:opacity-75 bg-gray-200 flex items-center justify-center">
                  Loading...
                </div>
              )}
              <button type="button" className="absolute inset-0 focus:outline-none">
                <span className="sr-only">View details for {file.name}</span>
              </button>
            </div>
            <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">{file.name}</p>
            <p className="pointer-events-none block text-sm font-medium text-gray-500">{(file.size / 1000).toFixed(2)} kb</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

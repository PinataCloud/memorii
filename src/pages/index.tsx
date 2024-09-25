import { SignOutButton } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react"
import { useUser } from '@clerk/nextjs'
import { pinata } from "@/pinata";
import { FileListItem } from "pinata";
import PhotoModal from "@/components/PhotoModal";
import Head from "next/head";

export type File = {
  id: string,
  size: number;
  name: string;
  source: string;
  cid: string;
}

export default function Photos() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [uploading, setUploading] = useState(false);
  const [fileToOpen, setFileToOpen] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
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

  const handleClose = () => {
    setFileToOpen(null)
    setOpen(false);
  }

  const handleFileSelect = () => {
    fileRef?.current?.click()
  }

  const openPhoto = (file: File) => {
    setFileToOpen(file);
    setOpen(true);
  }

  return (
    <div className="w-3/4 m-auto max-w-[1220px]">
      <Head>
        <title>Memorii</title>
        <meta property="og:title" content="Memorii" key="title" />
        <meta property="og:description" content="Your photos are your memories. Keep them safe." key="title" />
        <link rel="icon" href="/fav-cloud.png" type="image/png" />
      </Head>
      <div className="py-6 flex items-center justify-between w-full font-sfBold">
        <h1 className="text-3xl font-bold font-sfSemi flex items-center"><img src="/clouds.svg" alt="3D clouds" /></h1>
        <SignOutButton />
      </div>
      <div className="py-6 flex items-center w-full justify-between">
        <h1 className="text-3xl md:text-6xl xl:text-8xl font-sans gradient-text italic">Your Memoriis</h1>
        <button onClick={handleFileSelect} className="plus -mt-6 p-2 md:p-4 rounded-full border border-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>

        </button>
        <input value={selectedFile} onChange={handleFileChange} className="hidden" type="file" accept="image/*" ref={fileRef} />
      </div>
      <ul
        role="list"
        className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
      >
        {files?.map((file) => (
          <li key={file.id} className="relative font-sfSemi" onClick={() => openPhoto(file)}>
            <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100">
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
      <PhotoModal open={open} handleClose={handleClose} file={fileToOpen} />
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { File } from '@/pages'

type PhotoModalProps = { 
  file: File | null, 
  open: boolean, 
  handleClose: Function
}

export default function PhotoModal(props: PhotoModalProps) {
  const { file, open, handleClose } = props;
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    if(file) {
      loadFile()
    }
  }, [file]);

  const loadFile = async () => {
    const res = await fetch(`/api/photos/${file?.cid}`)
    const url = await res.text();
    setFileUrl(url)
  }

  const close = () => {
    setFileUrl("");
    handleClose();
  }

  return (
    <Dialog open={open} onClose={() => close()} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="font-sfSemi flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 w-3/4 sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              {
                fileUrl ? 
                <img src={fileUrl} alt={file?.name} /> : 
                <div>
                  <h3 className="text-2xl">Loading...</h3>
                </div>
              }              
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                onClick={() => close()}
                className="inline-flex w-full justify-center rounded-md bg-[#A8EAFF] px-3 py-2 text-sm font-semibold text-black shadow-sm"
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

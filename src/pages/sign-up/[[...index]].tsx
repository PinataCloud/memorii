import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex w-screen h-screen flex-col justify-center m-auto items-center">
      <SignUp />
    </div>    
  )
}
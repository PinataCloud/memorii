import { SignUp } from '@clerk/nextjs'
import Head from 'next/head'

export default function Page() {
  return (
    <div className="font-sfSemi flex w-screen h-screen flex-col justify-center m-auto items-center">
      <Head>
        <title>Memorii</title>
        <meta property="og:title" content="Memorii" key="title" />
        <meta property="og:description" content="Your photos are your memories. Keep them safe." key="title" />
        <link rel="icon" href="/clouds.png" type="image/png" />
      </Head>
      <SignUp />
    </div>
  )
}
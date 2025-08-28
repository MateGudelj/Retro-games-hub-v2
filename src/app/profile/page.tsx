import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Image from "next/image"; 
import { authOptions } from "@/lib/authOptions";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Profile</h1>
      <p>Welcome, {session.user?.name}!</p>
      <p>Your email is: {session.user?.email}</p>

      {session.user?.image && (
        <Image 
          src={session.user.image} 
          alt="Profile Picture" 
          className="rounded-full w-24 h-24 mt-4" 
          width={96}
          height={96}
        />
      )}
    </div>
  )
}
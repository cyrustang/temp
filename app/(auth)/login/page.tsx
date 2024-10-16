import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
          Sign in to your account
        </h2>
        <form className="mt-8 space-y-6">
          <Input type="email" placeholder="Email address" required />
          <Input type="password" placeholder="Password" required />
          <Button className="w-full" type="submit">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  )
}

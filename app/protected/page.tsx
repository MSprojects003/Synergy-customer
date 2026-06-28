import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function Page() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8">
        <h1 className="mb-6 text-2xl font-bold">Welcome!</h1>

        <div className="mb-6 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>

          {user?.user_metadata?.first_name && (
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">
                {user.user_metadata.first_name}{' '}
                {user.user_metadata.last_name || ''}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="break-all font-mono text-sm">{user?.id}</p>
          </div>
        </div>

        <form action={handleSignOut}>
          <Button type="submit" className="w-full">
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

type AuthMode = 'signin' | 'signup'

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      setMessage(null)

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      setMessage('Signed in successfully!')
      setEmail('')
      setPassword('')
      // Redirect or update UI here
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      setMessage(null)

      // First check if user exists with this email
      const { data: existingUser } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy', // This will fail if user doesn't exist
      }).catch(() => ({ data: null }))

      if (existingUser) {
        setError('This email is already registered. Please sign in instead.')
        return
      }

      // Sign up new user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      })

      if (signUpError) throw signUpError

      if (data?.user?.id) {
        // Insert user profile in public.users table
        const { error: insertError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          created_at: new Date(),
        })

        if (insertError) throw insertError

        setMessage('Sign up successful! Please check your email to confirm.')
        setEmail('')
        setPassword('')
        setFirstName('')
        setLastName('')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-border p-6">
      <h1 className="mb-6 text-center text-2xl font-bold">
        {mode === 'signin' ? 'Sign In' : 'Sign Up'}
      </h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {/* Google Sign In */}
      <Button
        onClick={handleGoogleSignIn}
        disabled={loading}
        variant="outline"
        className="mb-4 w-full"
      >
        {loading ? 'Loading...' : 'Continue with Google'}
      </Button>

      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      {/* Email/Password Form */}
      <form
        onSubmit={mode === 'signin' ? handleEmailSignIn : handleSignUp}
        className="space-y-4"
      >
        {mode === 'signup' && (
          <>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />

        <Button disabled={loading} className="w-full">
          {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>

      {/* Toggle between modes */}
      <p className="mt-4 text-center text-sm text-muted-foreground">
        {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setError(null)
            setMessage(null)
          }}
          className="text-primary hover:underline"
        >
          {mode === 'signin' ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </div>
  )
}

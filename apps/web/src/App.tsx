import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/auth.store'
import { ProtectedRoute } from './components/ProtectedRoute'

// Pages
import { LoginPage } from './pages/loginPage'
import { Signup } from './pages/signupPage'
import { AuthCallbackPage } from './pages/authCallbackPage'


// placeholder pages 
function OnboardingPage() {
  return <div style={{ padding: '2rem' }}>Onboarding — coming Day 3</div>
}
function FeedPage() {
  return <div style={{ padding: '2rem' }}>Feed — coming Day 4</div>
}

export default function App() {

  const setUser = useAuthStore(state => state.setUser)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({ id: session.user.id, email: session.user.email! }, session.access_token)
      } else {
        setUser(null, null)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({ id: session.user.id, email: session.user.email! }, session.access_token)
      } else {
        setUser(null, null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes — anyone can access */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Protected routes — must be logged in */}
        <Route path="/onboarding" element={
          <ProtectedRoute><OnboardingPage /></ProtectedRoute>
        } />
        <Route path="/feed" element={
          <ProtectedRoute><FeedPage /></ProtectedRoute>
        } />

        {/* Default — redirect to feed, ProtectedRoute handles the rest */}
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </BrowserRouter>
  )

}






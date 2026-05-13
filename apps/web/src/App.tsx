import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/auth.store'
import { ProtectedRoute } from './components/ProtectedRoute'


// Pages
import { LoginPage } from './pages/loginPage'
import { SignupPage } from './pages/signupPage'
import { AuthCallbackPage } from './pages/authCallbackPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { SettingsPage } from './pages/SettingsPage'
import { FeedPage } from './pages/FeedPage'
import { LandingPage } from './pages/LandingPage'



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
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Protected routes — must be logged in */}
        <Route path="/onboarding" element={
          <ProtectedRoute><OnboardingPage /></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute><SettingsPage /></ProtectedRoute>
        } />
        <Route path="/feed" element={
          <ProtectedRoute><FeedPage /></ProtectedRoute>
        } />

        <Route path="/" element={<LandingPage />} />

        {/* Default — redirect to feed, ProtectedRoute handles the rest */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )

}






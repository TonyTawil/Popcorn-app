import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const VerificationPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [error, setError] = useState('')
  
  const handleVerification = useCallback(async (token: string) => {
    try {
      const response = await fetch(`/api/auth/verify-email?token=${token}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      console.log('Verification response:', data)
      
      if (response.ok || data.message?.includes('already verified')) {
        setVerificationStatus('success')
        if (data.user && data.user.verified) {
          login(data.user)
          setTimeout(() => {
            navigate('/')
          }, 2000)
        }
      } else {
        setVerificationStatus('error')
        setError(data.error || 'Verification failed')
      }
    } catch (err) {
      console.error('Verification error:', err)
      setVerificationStatus('error')
      setError('Failed to verify email. Please try again.')
    }
  }, [login, navigate])

  useEffect(() => {
    const token = searchParams.get('token')
    const isFromSignup = location.state?.fromSignup
    
    if (!token && isFromSignup) {
      setVerificationStatus('success')
      return
    }

    if (!token && !isFromSignup) {
      setVerificationStatus('error')
      setError('Verification token is missing')
      return
    }

    if (token) {
      handleVerification(token)
    }
  }, [searchParams, location.state?.fromSignup, handleVerification])

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-800">
        {verificationStatus === 'pending' && (
          <>
            <h1 className="text-2xl font-bold text-white text-center mb-4">
              {searchParams.get('token') ? 'Verifying Your Email' : 'Preparing Verification...'}
            </h1>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </>
        )}

        {verificationStatus === 'success' && !searchParams.get('token') && (
          <>
            <h1 className="text-2xl font-bold text-white text-center mb-4">
              Verification Email Sent! 📧
            </h1>
            <p className="text-center text-gray-300 mb-4">
              Please check your email inbox and click the verification link to complete your registration.
            </p>
          </>
        )}

        {verificationStatus === 'success' && searchParams.get('token') && (
          <>
            <h1 className="text-2xl font-bold text-white text-center mb-4">
              Email Verified Successfully! 🎉
            </h1>
            <p className="text-center text-gray-300 mb-4">
              You will be redirected to the home page in a few seconds...
            </p>
          </>
        )}

        {verificationStatus === 'error' && (
          <>
            <h1 className="text-2xl font-bold text-white text-center mb-4">
              Verification Failed
            </h1>
            <p className="text-center text-red-400 mb-6">
              {error}
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-lg transition-all"
            >
              Back to Signup
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default VerificationPage 
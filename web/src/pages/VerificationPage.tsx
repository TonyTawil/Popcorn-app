import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const VerificationPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, refreshUser } = useAuth()
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [error, setError] = useState('')
  
  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token')
      
      if (token) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/verify-email?token=${token}`, {
            credentials: 'include',
            headers: {
              'Accept': 'application/json'
            }
          })
          
          const data = await response.json()
          console.log('Verification response:', data)
          
          if (response.ok) {
            setVerificationStatus('success')
            if (data.user) {
              await refreshUser()
              setTimeout(() => navigate('/'), 3000)
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
      }
    }

    verifyEmail()
  }, [searchParams])

  const handleResendVerification = async () => {
    if (!user?.email) return
    
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: user.email })
      })
      
      if (!response.ok) {
        throw new Error('Failed to resend verification email')
      }
      
      alert('Verification email has been resent. Please check your inbox.')
    } catch (err) {
      alert('Failed to resend verification email. Please try again.')
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-800">
        {verificationStatus === 'pending' && (
          <>
            <h1 className="text-2xl font-bold text-white text-center mb-4">
              Verifying Your Email
            </h1>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </>
        )}

        {verificationStatus === 'success' && (
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
              onClick={handleResendVerification}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-lg transition-all"
            >
              Resend Verification Email
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default VerificationPage 
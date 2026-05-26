import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { auth, db } from '../firebase/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import '../styles/Auth.css'

function Register() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Validation Schema with age and gender
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    age: Yup.number()
      .min(18, 'You must be at least 18 years old')
      .max(100, 'Age cannot exceed 100')
      .required('Age is required'),
    gender: Yup.string()
      .oneOf(['male', 'female', 'other'], 'Please select gender')
      .required('Gender is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10,15}$/, 'Please enter a valid phone number')
      .required('Phone number is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password')
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      age: '',
      gender: '',
      phone: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setError('')
      setSuccess('')
      setLoading(true)
      
      try {
        console.log('📝 Starting registration for:', values.email)
        
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          values.email, 
          values.password
        )
        
        console.log('✅ User created in Auth:', userCredential.user.uid)
        
        // Update user profile with name
        await updateProfile(userCredential.user, {
          displayName: values.name
        })
        
        // Save user data to Firestore with age, gender, phone
        const userData = {
          name: values.name,
          email: values.email,
          age: parseInt(values.age),
          gender: values.gender,
          phone: values.phone,
          uid: userCredential.user.uid,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          loginCount: 1,
          role: 'user',
          status: 'active'
        }
        
        await setDoc(doc(db, "users", userCredential.user.uid), userData)
        
        console.log('✅ User saved to Firestore with age & gender!')
        
        setSuccess('Account created successfully! Redirecting...')
        
        setTimeout(() => {
          navigate('/')
        }, 2000)
        
      } catch (err) {
        console.error('❌ Registration error:', err)
        
        if (err.code === 'auth/email-already-in-use') {
          setError('Email already in use. Please login instead.')
        } else if (err.code === 'auth/weak-password') {
          setError('Password is too weak. Please use a stronger password.')
        } else {
          setError('Failed to create account: ' + err.message)
        }
      } finally {
        setLoading(false)
      }
    }
  })

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p>Join EstateHub today</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && <div className="field-error">{formik.errors.name}</div>}
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && <div className="field-error">{formik.errors.email}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age *</label>
              <input
                type="number"
                name="age"
                placeholder="Your age"
                value={formik.values.age}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.age && formik.errors.age && <div className="field-error">{formik.errors.age}</div>}
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {formik.touched.gender && formik.errors.gender && <div className="field-error">{formik.errors.gender}</div>}
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              placeholder="e.g., 08012345678"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.phone && formik.errors.phone && <div className="field-error">{formik.errors.phone}</div>}
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && <div className="field-error">{formik.errors.password}</div>}
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && <div className="field-error">{formik.errors.confirmPassword}</div>}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
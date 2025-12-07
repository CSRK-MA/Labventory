import { useState, useEffect } from "react";
import { Beaker, Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "sonner";
import { createUserProfile, getUserProfile } from "../services/userService";

interface SignInProps {
  onSignIn: (role: 'admin' | 'teacher' | 'lab-assistant' | 'student') => void; // ✅ ADD student
  onBack?: () => void;
}

export function SignIn({ onSignIn, onBack }: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'teacher' | 'lab-assistant' | 'student'>('admin'); // ✅ ADD student
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user profile exists
      let userProfile = await getUserProfile(userCredential.user.uid);
      
      // If no profile, create one with selected role
      if (!userProfile) {
        const result = await createUserProfile(
          userCredential.user.uid,
          userCredential.user.email || email,
          selectedRole
        );
        userProfile = result.profile || null;
      }
      
      toast.success(`Welcome back! Signed in as ${userProfile?.role || selectedRole}`);
      console.log("User profile:", userProfile);
      
      // Pass the actual role from database
      onSignIn(userProfile?.role || selectedRole);
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      if (error.code === 'auth/user-not-found') {
        toast.error("No account found. Please check your email.");
      } else if (error.code === 'auth/wrong-password') {
        toast.error("Incorrect password.");
      } else if (error.code === 'auth/invalid-email') {
        toast.error("Invalid email address.");
      } else if (error.code === 'auth/too-many-requests') {
        toast.error("Too many failed attempts. Please try again later.");
      } else {
        toast.error("Failed to sign in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center px-4">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative">

        {/* Sign In Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl">
              <Beaker className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Labventory
            </span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your lab management dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Your Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  disabled={isLoading}
                  className={`px-6 py-3 rounded-lg border-2 transition-all font-medium ${
                    selectedRole === 'admin'
                      ? 'border-blue-700 bg-white text-blue-700 shadow-md shadow-blue-50'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  👨‍💼 Admin
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('teacher')}
                  disabled={isLoading}
                  className={`px-6 py-3 rounded-lg border-2 transition-all font-medium ${
                    selectedRole === 'teacher'
                      ? 'border-blue-700 bg-white text-blue-700 shadow-md shadow-blue-50'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  👨‍🏫 Teacher
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('lab-assistant')}
                  disabled={isLoading}
                  className={`px-6 py-3 rounded-lg border-2 transition-all font-medium ${
                    selectedRole === 'lab-assistant'
                      ? 'border-blue-700 bg-white text-blue-700 shadow-md shadow-blue-50'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  🔬 Lab Assistant
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('student')}
                  disabled={isLoading}
                  className={`px-6 py-3 rounded-lg border-2 transition-all font-medium ${
                    selectedRole === 'student'
                      ? 'border-blue-700 bg-white text-blue-700 shadow-md shadow-blue-50'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  🎓 Student
                </button>
              </div>
            </div>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors disabled:opacity-50"
                  placeholder="you@institution.edu"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-11 pr-11 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors disabled:opacity-50"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" disabled={isLoading} />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button 
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Request Access
            </a>
          </p>
          {/* Back Button */}
          {onBack && (
            <>
              <br></br>
              <div className="flex justify-center mb-6">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Home
                </button>
              </div>
            </>
          )}
        </div>
        
      </div>
    </div>
  );
}
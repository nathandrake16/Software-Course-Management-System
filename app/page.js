import Link from 'next/link'
import NavBar from '@/components/NavBar'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Software Course Management System
          </h1>
          <p className="text-xl text-gray-600">
            Streamline your academic journey with our comprehensive course management platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">For Students</h2>
            <ul className="space-y-2">
              <li>✓ Access course materials</li>
              <li>✓ View announcements</li>
              <li>✓ Track assignments</li>
              <li>✓ Collaborate with peers</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">For Faculty</h2>
            <ul className="space-y-2">
              <li>✓ Manage course sections</li>
              <li>✓ Post announcements</li>
              <li>✓ Track student progress</li>
              <li>✓ Share resources</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Quick Access</h2>
            <div className="space-y-4">
              <Link href="/users/login" className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Login
              </Link>
              <Link href="/users/signup" className="block w-full text-center bg-green-600 text-white py-2 rounded hover:bg-green-700">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center py-4 mt-12">
        <p>© 2024 Software Course Management System - BRACU</p>
      </footer>
    </div>
  )
}

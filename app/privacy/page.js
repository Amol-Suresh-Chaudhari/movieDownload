import { Shield, Eye, Lock, Database } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy - AllMoviesHub',
  description: 'Privacy policy and data protection information for AllMoviesHub users.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gray-800 rounded-lg p-8">
          <div className="flex items-center space-x-3 mb-8">
            <Shield className="w-8 h-8 text-green-500" />
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="bg-blue-900 border border-blue-600 rounded-lg p-4 mb-8">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-blue-200 m-0">Your Privacy Matters</h2>
              </div>
              <p className="text-blue-100 mt-2 mb-0">
                We are committed to protecting your privacy and ensuring the security of your personal information.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
            <p className="text-gray-300 mb-4">
              We collect information to provide better services to our users. The types of information we collect include:
            </p>
            
            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-400" />
                Automatically Collected Information
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>• IP address and browser information</li>
                <li>• Pages visited and time spent on site</li>
                <li>• Device type and operating system</li>
                <li>• Referral source (how you found our site)</li>
              </ul>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-green-400" />
                Information You Provide
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Contact form submissions</li>
                <li>• Email addresses for notifications</li>
                <li>• Comments and feedback</li>
                <li>• Search queries and preferences</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
            <p className="text-gray-300 mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="text-gray-300 mb-6 space-y-2">
              <li>• To provide and improve our services</li>
              <li>• To respond to your inquiries and support requests</li>
              <li>• To analyze website usage and optimize performance</li>
              <li>• To prevent fraud and ensure security</li>
              <li>• To comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mb-4">Cookies and Tracking</h2>
            <p className="text-gray-300 mb-6">
              We use cookies and similar technologies to enhance your browsing experience. These help us remember your preferences, analyze site traffic, and provide personalized content. You can control cookie settings through your browser preferences.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Services</h2>
            <p className="text-gray-300 mb-4">
              Our website may contain links to third-party services and advertisements. We are not responsible for the privacy practices of these external sites. We recommend reviewing their privacy policies before providing any personal information.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
            <p className="text-gray-300 mb-6">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
            <p className="text-gray-300 mb-4">
              You have the right to:
            </p>
            <ul className="text-gray-300 mb-6 space-y-2">
              <li>• Access your personal information</li>
              <li>• Correct inaccurate data</li>
              <li>• Request deletion of your data</li>
              <li>• Opt-out of communications</li>
              <li>• Data portability</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mb-4">Children's Privacy</h2>
            <p className="text-gray-300 mb-6">
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">Changes to This Policy</h2>
            <p className="text-gray-300 mb-6">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
            <p className="text-gray-300 mb-6">
              If you have any questions about this privacy policy, please contact us at privacy@allmovieshub.com or through our <a href="/contact" className="text-blue-400 hover:text-blue-300">contact page</a>.
            </p>

            <div className="bg-gray-700 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-white mb-2">Last Updated</h3>
              <p className="text-gray-300">This privacy policy was last updated on January 1, 2024.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Shield, Mail, AlertTriangle } from 'lucide-react'

export const metadata = {
  title: 'DMCA Policy - AllMoviesHub',
  description: 'Digital Millennium Copyright Act (DMCA) policy and copyright infringement procedures for AllMoviesHub.',
}

export default function DMCAPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gray-800 rounded-lg p-8">
          <div className="flex items-center space-x-3 mb-8">
            <Shield className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-white">DMCA Policy</h1>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4 mb-8">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h2 className="text-lg font-semibold text-yellow-200 m-0">Important Notice</h2>
              </div>
              <p className="text-yellow-100 mt-2 mb-0">
                AllMoviesHub respects the intellectual property rights of others and expects our users to do the same.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-white mb-4">Copyright Infringement Policy</h2>
            <p className="text-gray-300 mb-6">
              It is our policy to respond to clear notices of alleged copyright infringement. This page describes the information that should be present in these notices. It is designed to make submitting notices of alleged infringement to AllMoviesHub as straightforward as possible while reducing the number of notices that we receive that are not actionable under the Digital Millennium Copyright Act (DMCA).
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">Filing a DMCA Notice</h2>
            <p className="text-gray-300 mb-4">
              If you believe that content available on or through our website infringes your copyright, please send a notice of copyright infringement containing the following information to our designated agent:
            </p>

            <ul className="text-gray-300 mb-6 space-y-2">
              <li>• A physical or electronic signature of the copyright owner or authorized agent</li>
              <li>• Identification of the copyrighted work claimed to have been infringed</li>
              <li>• Identification of the material that is claimed to be infringing and information reasonably sufficient to permit us to locate the material</li>
              <li>• Your contact information, including address, telephone number, and email address</li>
              <li>• A statement that you have a good faith belief that use of the material is not authorized by the copyright owner</li>
              <li>• A statement that the information in the notification is accurate and that you are authorized to act on behalf of the copyright owner</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Mail className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">DMCA Agent</h3>
              </div>
              <div className="text-gray-300 space-y-1">
                <p><strong>Email:</strong> dmca@allmovieshub.com</p>
                <p><strong>Subject Line:</strong> DMCA Takedown Request</p>
                <p><strong>Response Time:</strong> 24-48 hours</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-white mb-4">Counter-Notification</h2>
            <p className="text-gray-300 mb-6">
              If you believe that material you posted was removed or access to it was disabled by mistake or misidentification, you may file a counter-notification with us by providing the following information:
            </p>

            <ul className="text-gray-300 mb-6 space-y-2">
              <li>• Your physical or electronic signature</li>
              <li>• Identification of the material and its location before removal</li>
              <li>• A statement under penalty of perjury that the material was removed by mistake or misidentification</li>
              <li>• Your name, address, and telephone number</li>
              <li>• A statement that you consent to jurisdiction of the federal district court</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mb-4">Repeat Infringers</h2>
            <p className="text-gray-300 mb-6">
              It is our policy to terminate the accounts of users who are repeat infringers of copyright in appropriate circumstances.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">Disclaimer</h2>
            <p className="text-gray-300 mb-6">
              AllMoviesHub does not host any files on its servers. All content is provided by third-party services. We act as a search engine and directory service, similar to Google or Yahoo. If you have any legal issues, please contact the appropriate media file owners or host sites.
            </p>

            <div className="bg-gray-700 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-white mb-2">Last Updated</h3>
              <p className="text-gray-300">This DMCA policy was last updated on January 1, 2024.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

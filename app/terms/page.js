import { FileText, AlertCircle, Scale, Users } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service - AllMoviesHub',
  description: 'Terms of service and user agreement for AllMoviesHub platform.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gray-800 rounded-lg p-8">
          <div className="flex items-center space-x-3 mb-8">
            <FileText className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="bg-purple-900 border border-purple-600 rounded-lg p-4 mb-8">
              <div className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-semibold text-purple-200 m-0">Legal Agreement</h2>
              </div>
              <p className="text-purple-100 mt-2 mb-0">
                By using AllMoviesHub, you agree to be bound by these terms and conditions.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-white mb-4">Acceptance of Terms</h2>
            <p className="text-gray-300 mb-6">
              By accessing and using AllMoviesHub ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">Description of Service</h2>
            <p className="text-gray-300 mb-6">
              AllMoviesHub is a movie information and entertainment platform that provides users with access to movie details, reviews, and related content. We act as an aggregator and do not host any copyrighted content on our servers.
            </p>

            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-400" />
                User Responsibilities
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>• You must be at least 13 years old to use this service</li>
                <li>• Provide accurate and complete information when required</li>
                <li>• Use the service only for lawful purposes</li>
                <li>• Respect intellectual property rights</li>
                <li>• Not attempt to harm or disrupt the service</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-white mb-4">Prohibited Uses</h2>
            <p className="text-gray-300 mb-4">
              You may not use our service:
            </p>
            <ul className="text-gray-300 mb-6 space-y-2">
              <li>• For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>• To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>• To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>• To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>• To submit false or misleading information</li>
              <li>• To upload or transmit viruses or any other type of malicious code</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mb-4">Content Disclaimer</h2>
            <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-yellow-200 m-0">Important Notice</h3>
              </div>
              <p className="text-yellow-100 mb-0">
                AllMoviesHub does not host, upload, or store any video files. All content is sourced from publicly available third-party services. We are not responsible for the content, accuracy, or legality of external links.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-white mb-4">Intellectual Property</h2>
            <p className="text-gray-300 mb-6">
              The service and its original content, features, and functionality are and will remain the exclusive property of AllMoviesHub and its licensors. The service is protected by copyright, trademark, and other laws.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">Privacy Policy</h2>
            <p className="text-gray-300 mb-6">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">Termination</h2>
            <p className="text-gray-300 mb-6">
              We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
            <p className="text-gray-300 mb-6">
              In no event shall AllMoviesHub, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">Disclaimer</h2>
            <p className="text-gray-300 mb-6">
              The information on this service is provided on an "as is" basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">Governing Law</h2>
            <p className="text-gray-300 mb-6">
              These Terms shall be interpreted and governed by the laws of the jurisdiction in which the service operates, without regard to its conflict of law provisions.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">Changes to Terms</h2>
            <p className="text-gray-300 mb-6">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
            <p className="text-gray-300 mb-6">
              If you have any questions about these Terms of Service, please contact us at legal@allmovieshub.com or through our <a href="/contact" className="text-blue-400 hover:text-blue-300">contact page</a>.
            </p>

            <div className="bg-gray-700 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-white mb-2">Last Updated</h3>
              <p className="text-gray-300">These terms of service were last updated on January 1, 2024.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

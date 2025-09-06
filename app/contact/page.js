'use client'
import { useState } from 'react'
import { Mail, MessageSquare, Send, MapPin, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-gray-300">
            Have questions or need support? We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-800 rounded-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <MessageSquare className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-semibold text-white">Send us a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="content">Content Request</option>
                  <option value="dmca">DMCA / Copyright</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter your message here..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Mail className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-semibold text-white">Get in Touch</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="w-5 h-5 text-blue-400 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">Email Support</h3>
                    <p className="text-gray-300 mb-2">For general inquiries and support</p>
                    <a href="mailto:support@allmovieshub.com" className="text-blue-400 hover:text-blue-300">
                      support@allmovieshub.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MessageSquare className="w-5 h-5 text-green-400 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">Telegram Channel</h3>
                    <p className="text-gray-300 mb-2">Join our community for updates</p>
                    <a href="https://t.me/allmovieshub" className="text-blue-400 hover:text-blue-300">
                      @allmovieshub
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">Response Time</h3>
                    <p className="text-gray-300">We typically respond within 24-48 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">How do I request a movie?</h4>
                  <p className="text-gray-300 text-sm">
                    Use the contact form above with "Content Request" as the subject and include the movie title and year.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Download links not working?</h4>
                  <p className="text-gray-300 text-sm">
                    Please report broken links using the "Technical Support" option in the contact form.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Copyright concerns?</h4>
                  <p className="text-gray-300 text-sm">
                    For DMCA or copyright issues, please visit our <a href="/dmca" className="text-blue-400 hover:text-blue-300">DMCA page</a> or select "DMCA / Copyright" in the form.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

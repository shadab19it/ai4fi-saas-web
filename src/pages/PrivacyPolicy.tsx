import { useEffect } from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = "January 10, 2026";

  return (
    <section className='bg-gradient-to-br from-sky-950 to-gray-950 min-h-screen'>
      {/* Hero Section */}
      <div className='relative bg-gradient-to-br min-h-[200px] from-sky-950 to-gray-800 flex items-center justify-center py-[120px]'>
        <div className='text-center px-4'>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
            Privacy Policy
          </h1>
          <p className='text-gray-300 text-lg'>Last Updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className='container mx-auto px-6 py-12 lg:py-16 max-w-4xl'>
        <div className='bg-gradient-to-r from-cyan-900/20 to-sky-900/20 rounded-2xl p-8 md:p-12 shadow-xl'>
          
          {/* Introduction */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>1. Introduction</h2>
            <p className='text-gray-300 leading-relaxed mb-4'>
              AI4FI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered fashion visualization platform and services.
            </p>
            <p className='text-gray-300 leading-relaxed'>
              By using AI4FI, you consent to the data practices described in this policy. If you do not agree with these practices, please do not use our Services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>2. Information We Collect</h2>
            
            <h3 className='text-xl font-semibold text-sky-400 mb-3'>2.1 Information You Provide</h3>
            <ul className='list-disc list-inside text-gray-300 space-y-2 ml-4 mb-6'>
              <li><strong>Account Information:</strong> Name, email address, password, and contact details when you create an account</li>
              <li><strong>Profile Information:</strong> Business name, company details, and preferences</li>
              <li><strong>Uploaded Content:</strong> Garment images, product photos, and other media you upload for AI processing</li>
              <li><strong>Payment Information:</strong> Billing address and payment method details (processed securely through third-party payment processors)</li>
              <li><strong>Communications:</strong> Messages, feedback, and support inquiries you send to us</li>
            </ul>

            <h3 className='text-xl font-semibold text-sky-400 mb-3'>2.2 Automatically Collected Information</h3>
            <ul className='list-disc list-inside text-gray-300 space-y-2 ml-4 mb-6'>
              <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the platform</li>
              <li><strong>Log Data:</strong> IP address, access times, referring URLs</li>
              <li><strong>Cookies:</strong> Session and preference cookies to enhance your experience</li>
            </ul>

            <h3 className='text-xl font-semibold text-sky-400 mb-3'>2.3 AI Processing Data</h3>
            <p className='text-gray-300 leading-relaxed'>
              When you use our AI features (model generation, virtual try-on, ads generation), we process your uploaded images and configuration preferences to generate outputs. This data is used solely to provide the requested Services.
            </p>
          </section>

          {/* How We Use Your Information */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>3. How We Use Your Information</h2>
            <p className='text-gray-300 leading-relaxed mb-4'>
              We use the collected information for the following purposes:
            </p>
            <ul className='list-disc list-inside text-gray-300 space-y-2 ml-4'>
              <li><strong className='text-sky-400'>Service Delivery:</strong> To provide, operate, and maintain our AI-powered features including model generation, virtual try-on, and advertisement creation</li>
              <li><strong className='text-sky-400'>Account Management:</strong> To create, manage, and secure your account</li>
              <li><strong className='text-sky-400'>Communication:</strong> To send service updates, security alerts, and respond to your inquiries</li>
              <li><strong className='text-sky-400'>Improvement:</strong> To analyze usage patterns and improve our Services, AI models, and user experience</li>
              <li><strong className='text-sky-400'>Personalization:</strong> To customize your experience and provide relevant content</li>
              <li><strong className='text-sky-400'>Billing:</strong> To process payments and manage subscriptions</li>
              <li><strong className='text-sky-400'>Legal Compliance:</strong> To comply with legal obligations and protect our rights</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>4. Data Sharing and Disclosure</h2>
            <p className='text-gray-300 leading-relaxed mb-4'>
              We do not sell your personal information. We may share your data in the following circumstances:
            </p>
            <ul className='list-disc list-inside text-gray-300 space-y-2 ml-4'>
              <li><strong className='text-sky-400'>Service Providers:</strong> Trusted third parties who assist in operating our platform (hosting, payment processing, analytics)</li>
              <li><strong className='text-sky-400'>AI Processing Partners:</strong> Cloud computing providers that help process AI workloads (subject to strict data protection agreements)</li>
              <li><strong className='text-sky-400'>Legal Requirements:</strong> When required by law, court order, or to protect our legal rights</li>
              <li><strong className='text-sky-400'>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
              <li><strong className='text-sky-400'>With Your Consent:</strong> When you explicitly authorize sharing</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>5. Data Security</h2>
            <p className='text-gray-300 leading-relaxed mb-4'>
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className='list-disc list-inside text-gray-300 space-y-2 ml-4'>
              <li>Encryption of data in transit (SSL/TLS) and at rest</li>
              <li>Secure authentication mechanisms</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and employee training</li>
              <li>Secure cloud infrastructure</li>
            </ul>
            <p className='text-gray-300 leading-relaxed mt-4'>
              While we strive to protect your data, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          {/* Data Retention */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>6. Data Retention</h2>
            <p className='text-gray-300 leading-relaxed mb-4'>
              We retain your information for as long as necessary to provide our Services and fulfill the purposes outlined in this policy:
            </p>
            <ul className='list-disc list-inside text-gray-300 space-y-2 ml-4'>
              <li><strong>Account Data:</strong> Retained while your account is active and for a reasonable period after deletion</li>
              <li><strong>Generated Content:</strong> Stored according to your subscription plan; you may delete your generated content at any time</li>
              <li><strong>Uploaded Images:</strong> Processed for AI generation and may be retained temporarily for service optimization</li>
              <li><strong>Usage Logs:</strong> Generally retained for up to 12 months for analytics and security purposes</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>7. Your Rights and Choices</h2>
            <p className='text-gray-300 leading-relaxed mb-4'>
              Depending on your jurisdiction, you may have the following rights:
            </p>
            <ul className='list-disc list-inside text-gray-300 space-y-2 ml-4'>
              <li><strong className='text-sky-400'>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong className='text-sky-400'>Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong className='text-sky-400'>Deletion:</strong> Request deletion of your personal data (subject to legal retention requirements)</li>
              <li><strong className='text-sky-400'>Portability:</strong> Request your data in a portable format</li>
              <li><strong className='text-sky-400'>Opt-Out:</strong> Unsubscribe from marketing communications</li>
              <li><strong className='text-sky-400'>Withdraw Consent:</strong> Withdraw consent for data processing where applicable</li>
            </ul>
            <p className='text-gray-300 leading-relaxed mt-4'>
              To exercise these rights, please contact us using the information provided below.
            </p>
          </section>

          {/* Cookies */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>8. Cookies and Tracking</h2>
            <p className='text-gray-300 leading-relaxed mb-4'>
              We use cookies and similar technologies to:
            </p>
            <ul className='list-disc list-inside text-gray-300 space-y-2 ml-4'>
              <li>Keep you logged in and remember your preferences</li>
              <li>Analyze platform usage and performance</li>
              <li>Enhance security and prevent fraud</li>
            </ul>
            <p className='text-gray-300 leading-relaxed mt-4'>
              You can manage cookie preferences through your browser settings. Note that disabling certain cookies may affect platform functionality.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>9. Third-Party Links</h2>
            <p className='text-gray-300 leading-relaxed'>
              Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>10. Children's Privacy</h2>
            <p className='text-gray-300 leading-relaxed'>
              AI4FI is not intended for children under 18 years of age. We do not knowingly collect personal information from children. If you believe we have inadvertently collected data from a child, please contact us immediately, and we will take steps to delete such information.
            </p>
          </section>

          {/* International Transfers */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>11. International Data Transfers</h2>
            <p className='text-gray-300 leading-relaxed'>
              Your information may be transferred to and processed in countries other than your country of residence, including India where AI4FI is headquartered. We ensure appropriate safeguards are in place for international data transfers in compliance with applicable data protection laws.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>12. Changes to This Policy</h2>
            <p className='text-gray-300 leading-relaxed'>
              We may update this Privacy Policy from time to time. Material changes will be communicated through our platform or via email. The "Last Updated" date at the top of this policy indicates when it was last revised. Your continued use of our Services after changes become effective constitutes acceptance of the updated policy.
            </p>
          </section>



          {/* Related Links */}
          <div className='mt-10 pt-8 border-t border-gray-700'>
            <p className='text-gray-400 text-center mb-4'>Related Documents</p>
            <div className='flex flex-wrap justify-center gap-4'>
              <Link
                to='/terms-of-service'
                className='text-sky-400 hover:text-sky-300 underline'
              >
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Back to Home */}
          <div className='mt-10 text-center'>
            <Link
              to='/'
              className='inline-block px-8 py-3 bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-sky-500 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-sky-500/25'
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;


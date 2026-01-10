import { useEffect } from "react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
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
            Terms of Service
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
              Welcome to AI4FI ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of the AI4FI platform, website, and services (collectively, the "Services"), including our AI-powered virtual model generation, virtual try-on experiences, product visualization, and advertisement generation tools.
            </p>
            <p className='text-gray-300 leading-relaxed'>
              By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Services.
            </p>
          </section>

          {/* Description of Services */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>2. Description of Services</h2>
            <p className='text-gray-300 leading-relaxed mb-4'>
              AI4FI provides AI-powered solutions for the fashion industry, including but not limited to:
            </p>
            <ul className='list-disc list-inside text-gray-300 space-y-2 ml-4'>
              <li><strong className='text-sky-400'>AI Model Generation:</strong> Create lifelike virtual models with customizable features including gender, skin tone, pose, ethnicity, and styling options.</li>
              <li><strong className='text-sky-400'>Virtual Try-On:</strong> Allow customers to visualize garments on AI-generated or selected models.</li>
              <li><strong className='text-sky-400'>Product Model Generator:</strong> Generate professional product images with AI-powered model placement.</li>
              <li><strong className='text-sky-400'>Advertisement Generation:</strong> Create AI-powered video and image advertisements for marketing purposes.</li>
              <li><strong className='text-sky-400'>Model Gallery:</strong> Access and manage your generated AI models.</li>
            </ul>
          </section>

          {/* Account Registration */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>3. Account Registration</h2>
            <p className='text-gray-300 leading-relaxed mb-4'>
              To access certain features of our Services, you must create an account. When registering, you agree to:
            </p>
            <ul className='list-disc list-inside text-gray-300 space-y-2 ml-4'>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your login credentials secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access or security breach</li>
            </ul>
            <p className='text-gray-300 leading-relaxed mt-4'>
              You must be at least 18 years old or have legal parental/guardian consent to use our Services.
            </p>
          </section>

          {/* Acceptable Use */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>4. Acceptable Use Policy</h2>
            <p className='text-gray-300 leading-relaxed mb-4'>
              You agree to use our Services only for lawful purposes. You shall not:
            </p>
            <ul className='list-disc list-inside text-gray-300 space-y-2 ml-4'>
              <li>Generate content that is illegal, harmful, threatening, abusive, defamatory, or otherwise objectionable</li>
              <li>Create deepfakes or misleading content intended to deceive or harm others</li>
              <li>Use generated models to impersonate real individuals without their consent</li>
              <li>Generate explicit, adult, or inappropriate content</li>
              <li>Violate any intellectual property rights of third parties</li>
              <li>Attempt to reverse engineer, decompile, or extract our AI models or algorithms</li>
              <li>Use automated systems or bots to access the Services without authorization</li>
              <li>Interfere with or disrupt the integrity of our Services</li>
              <li>Resell or redistribute our Services without written permission</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>5. Intellectual Property Rights</h2>
            <h3 className='text-xl font-semibold text-sky-400 mb-3'>5.1 Our Intellectual Property</h3>
            <p className='text-gray-300 leading-relaxed mb-4'>
              The AI4FI platform, including its software, algorithms, designs, logos, trademarks, and all related intellectual property, are owned by AI4FI and protected by applicable laws. Nothing in these Terms grants you any right to use our trademarks, logos, or brand assets without prior written consent.
            </p>
            <h3 className='text-xl font-semibold text-sky-400 mb-3'>5.2 Your Content</h3>
            <p className='text-gray-300 leading-relaxed mb-4'>
              You retain ownership of any images, garment photos, or other content you upload to our platform ("Your Content"). By uploading Your Content, you grant AI4FI a non-exclusive, worldwide, royalty-free license to use, process, and display Your Content solely to provide the Services to you.
            </p>
            <h3 className='text-xl font-semibold text-sky-400 mb-3'>5.3 Generated Content</h3>
            <p className='text-gray-300 leading-relaxed'>
              Subject to your compliance with these Terms and any applicable subscription plan, you receive a license to use AI-generated content (including virtual models, try-on images, and advertisements) created through our Services for your legitimate business purposes, including commercial use in marketing materials.
            </p>
          </section>

          {/* Payment Terms */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>6. Payment and Subscription</h2>
            <p className='text-gray-300 leading-relaxed mb-4'>
              Certain features of our Services may require payment or subscription. By subscribing to a paid plan:
            </p>
            <ul className='list-disc list-inside text-gray-300 space-y-2 ml-4'>
              <li>You agree to pay all applicable fees as described at the time of purchase</li>
              <li>Subscriptions may auto-renew unless cancelled before the renewal date</li>
              <li>Prices are subject to change with reasonable notice</li>
              <li>Refunds are provided in accordance with our refund policy</li>
              <li>Usage limits apply based on your subscription tier</li>
            </ul>
          </section>

          {/* Data and Privacy */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>7. Data and Privacy</h2>
            <p className='text-gray-300 leading-relaxed'>
              Your privacy is important to us. Our collection and use of personal information is governed by our{" "}
              <Link to='/privacy-policy' className='text-sky-400 hover:text-sky-300 underline'>
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference. By using our Services, you consent to our data practices as described in our Privacy Policy.
            </p>
          </section>

          {/* Disclaimers */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>8. Disclaimers</h2>
            <p className='text-gray-300 leading-relaxed mb-4'>
              THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className='list-disc list-inside text-gray-300 space-y-2 ml-4'>
              <li>Implied warranties of merchantability and fitness for a particular purpose</li>
              <li>Warranties regarding the accuracy, reliability, or completeness of AI-generated content</li>
              <li>Warranties that the Services will be uninterrupted, error-free, or secure</li>
              <li>Warranties regarding the results obtained from using the Services</li>
            </ul>
            <p className='text-gray-300 leading-relaxed mt-4'>
              AI-generated content may not always be perfect and should be reviewed before commercial use.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>9. Limitation of Liability</h2>
            <p className='text-gray-300 leading-relaxed'>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, AI4FI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU TO AI4FI IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          {/* Indemnification */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>10. Indemnification</h2>
            <p className='text-gray-300 leading-relaxed'>
              You agree to indemnify, defend, and hold harmless AI4FI and its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorneys' fees) arising from your use of the Services, violation of these Terms, or infringement of any third-party rights.
            </p>
          </section>

          {/* Termination */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>11. Termination</h2>
            <p className='text-gray-300 leading-relaxed mb-4'>
              We reserve the right to suspend or terminate your access to the Services at any time, with or without cause, and with or without notice. Upon termination:
            </p>
            <ul className='list-disc list-inside text-gray-300 space-y-2 ml-4'>
              <li>Your right to access the Services will immediately cease</li>
              <li>You remain responsible for any outstanding fees</li>
              <li>Provisions that by their nature should survive will remain in effect</li>
            </ul>
            <p className='text-gray-300 leading-relaxed mt-4'>
              You may terminate your account at any time by contacting us or through your account settings.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>12. Changes to Terms</h2>
            <p className='text-gray-300 leading-relaxed'>
              We may modify these Terms at any time. Material changes will be communicated through our platform or via email. Your continued use of the Services after changes become effective constitutes acceptance of the modified Terms. We encourage you to review these Terms periodically.
            </p>
          </section>

          {/* Governing Law */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold text-white mb-4'>13. Governing Law</h2>
            <p className='text-gray-300 leading-relaxed'>
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </section>


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

export default TermsOfService;


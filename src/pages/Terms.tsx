
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';

const Terms = () => {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-6 text-center">Terms of Service</h1>
          <p className="text-center text-muted-foreground mb-12">
            Last updated: April 13, 2024
          </p>
          
          <Card>
            <CardContent className="pt-6 prose max-w-none">
              <p>
                Welcome to PartyVerse! These Terms of Service govern your use of our website and services.
                By accessing or using PartyVerse, you agree to be bound by these Terms.
              </p>
              
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using our services, you agree to be bound by these Terms of Service and our Privacy Policy. 
                If you do not agree to these terms, please do not use our services.
              </p>
              
              <h2>2. Description of Services</h2>
              <p>
                PartyVerse provides an AI-powered event planning platform that allows users to create, manage, and discover events, 
                as well as connect with vendors for event services. Our services include event creation tools, AI suggestions,
                vendor marketplace, guest management, and other related features.
              </p>
              
              <h2>3. User Accounts</h2>
              <p>
                To access certain features of our services, you must register for an account. You agree to provide accurate and 
                complete information when creating your account and to keep this information updated. You are responsible for 
                maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
              
              <h2>4. User Content</h2>
              <p>
                You retain ownership of any content you submit, post, or display on or through our services ("User Content").
                By providing User Content, you grant PartyVerse a worldwide, non-exclusive, royalty-free license to use, copy, 
                modify, distribute, and display your User Content for the purpose of operating and improving our services.
              </p>
              
              <h2>5. Prohibited Conduct</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use our services for any illegal purpose or in violation of any laws</li>
                <li>Post or transmit harmful, offensive, or inappropriate content</li>
                <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation</li>
                <li>Interfere with or disrupt our services or servers</li>
                <li>Attempt to gain unauthorized access to our services or systems</li>
                <li>Use our services to send unsolicited communications, promotions, or advertisements</li>
              </ul>
              
              <h2>6. Intellectual Property</h2>
              <p>
                Our services and their contents, features, and functionality are owned by PartyVerse and are protected by 
                copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              
              <h2>7. Termination</h2>
              <p>
                We may terminate or suspend your account and access to our services at any time, without prior notice or 
                liability, for any reason, including if you breach these Terms of Service.
              </p>
              
              <h2>8. Disclaimer of Warranties</h2>
              <p>
                Our services are provided "as is" and "as available" without warranties of any kind, either express or implied.
                We do not guarantee that our services will be uninterrupted, secure, or error-free.
              </p>
              
              <h2>9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, PartyVerse shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages resulting from your use of or inability to use our services.
              </p>
              
              <h2>10. Changes to Terms</h2>
              <p>
                We may revise these Terms of Service at any time by updating this page. Your continued use of our services 
                after any changes indicates your acceptance of the revised Terms.
              </p>
              
              <h2>11. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the United States, 
                without regard to its conflict of law provisions.
              </p>
              
              <h2>12. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at legal@partyverse.com.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Terms;

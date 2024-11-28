import React from "react";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy">
      <div className="privacy-policy-container">
        <h1>Privacy Policy</h1>
        <p className="intro">
          At our company, your privacy is our priority. We are committed to protecting your personal
          information and respecting your privacy rights.
        </p>

        <section className="content-section">
          <h2>Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul>
            <li><strong>Personal Information:</strong> Your name, email address, phone number, etc.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our website.</li>
            <li><strong>Payment Information:</strong> Payment details for purchases made on our website.</li>
          </ul>
        </section>

        <section className="content-section">
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect for the following purposes:</p>
          <ul>
            <li>To personalize your user experience and improve our website.</li>
            <li>To process transactions and provide customer support.</li>
            <li>To communicate important updates regarding your account or transactions.</li>
            <li>To send marketing communications if you've opted-in to receive them.</li>
          </ul>
        </section>

        <section className="content-section">
          <h2>How We Protect Your Information</h2>
          <p>We use advanced security measures to ensure your data is safe:</p>
          <ul>
            <li>Data encryption using secure protocols (SSL/TLS).</li>
            <li>Access restrictions to sensitive data to ensure only authorized personnel can access it.</li>
            <li>Regular security audits to identify and address vulnerabilities.</li>
          </ul>
        </section>

        <section className="content-section">
          <h2>Sharing Your Information</h2>
          <p>We may share your information in the following circumstances:</p>
          <ul>
            <li>With trusted third-party service providers who help us operate our website.</li>
            <li>When required by law, or to protect the rights and safety of our users.</li>
          </ul>
        </section>

        <section className="content-section">
          <h2>Your Rights</h2>
          <p>You have the following rights over your personal data:</p>
          <ul>
            <li><strong>Access:</strong> Request access to the data we hold about you.</li>
            <li><strong>Correction:</strong> Request updates or corrections to your personal information.</li>
            <li><strong>Deletion:</strong> Request the deletion of your personal data where possible.</li>
            <li><strong>Opt-out:</strong> You may opt out of marketing communications at any time.</li>
          </ul>
        </section>

        <section className="content-section">
          <h2>Cookies</h2>
          <p>We use cookies to enhance your experience on our website. By using our website, you consent to the use of cookies.</p>
        </section>

        <section className="content-section">
          <h2>Changes to This Privacy Policy</h2>
          <p>We may update this policy from time to time. Any changes will be posted on this page, with the date of the most recent update indicated below.</p>
        </section>

        <section className="content-section">
          <h2>Contact Us</h2>
          <p>If you have any questions or concerns about this privacy policy, feel free to contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
        </section>

        <footer>
          <p className="footer-text">Last updated: November 2024</p>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

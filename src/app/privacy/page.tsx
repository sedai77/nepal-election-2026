import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back to Map</span>
          </Link>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <Link href="/tos" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link href="/data" className="hover:text-slate-300 transition-colors">Data Disclaimer</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-8">Last updated: February 9, 2026</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              Nepal Election 2026 (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the Nepal Election 2026 Tracker website (the &quot;Service&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. By using the Service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Information We Collect</h2>

            <h3 className="text-base font-medium text-slate-200 mt-4 mb-2">2.1 Facebook Login Data</h3>
            <p>When you log in via Facebook, we collect:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
              <li>Your Facebook user ID (a unique identifier)</li>
              <li>Your public profile name</li>
              <li>Your profile picture URL</li>
              <li>Your email address (if you have granted permission)</li>
            </ul>
            <p className="mt-2">
              We do <strong className="text-white">not</strong> access your Facebook friends list, posts, photos, messages, or any other private Facebook data. We only request the minimum permissions necessary for authentication.
            </p>

            <h3 className="text-base font-medium text-slate-200 mt-4 mb-2">2.2 Voting/Like Data</h3>
            <p>
              When you &quot;like&quot; a candidate, we store: your Facebook user ID (linked to the like), the district, election zone, and candidate name you liked, and the timestamp of the action. This data is used solely to display aggregate sentiment and prevent duplicate voting.
            </p>

            <h3 className="text-base font-medium text-slate-200 mt-4 mb-2">2.3 Automatically Collected Data</h3>
            <p>
              We use Google Analytics (ID: G-T4YZLTLZVS) which may collect: IP address (anonymized), browser type and version, device type, pages visited and time spent, and referring website. This data is collected and processed by Google in accordance with their privacy policy.
            </p>

            <h3 className="text-base font-medium text-slate-200 mt-4 mb-2">2.4 Local Storage</h3>
            <p>
              We use your browser&apos;s localStorage to store: your login session (to keep you logged in), bookmarked districts (for your convenience). This data never leaves your device and is not transmitted to our servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
              <li>Authenticate your identity via Facebook login</li>
              <li>Allow you to like/vote for candidates (one like per zone per user)</li>
              <li>Display aggregate sentiment data (like counts, sentiment heatmap)</li>
              <li>Prevent abuse and duplicate voting</li>
              <li>Improve the Service through analytics</li>
            </ul>
            <p className="mt-2">
              We do <strong className="text-white">not</strong> use your data for advertising, marketing, or sell it to any third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Data Storage and Security</h2>
            <p>
              Your data is stored on Vercel&apos;s infrastructure (Vercel Postgres) with industry-standard security measures including encrypted connections (HTTPS/TLS), database-level access controls, and server-side token verification for all API requests. While we implement reasonable security measures, no method of electronic storage is 100% secure. We cannot guarantee absolute security of your data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Data Sharing and Disclosure</h2>
            <p>We do not sell, trade, or rent your personal information. We may share data only in the following circumstances:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
              <li><strong className="text-slate-200">Aggregate Data:</strong> We display aggregate, anonymized sentiment data (total likes per candidate) publicly on the website. This does not identify individual users.</li>
              <li><strong className="text-slate-200">Legal Requirements:</strong> We may disclose your information if required by law, legal process, or government request.</li>
              <li><strong className="text-slate-200">Service Providers:</strong> We use Vercel (hosting/database), Facebook (authentication), and Google Analytics (website analytics). These providers have their own privacy policies.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
              <li><strong className="text-slate-200">Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong className="text-slate-200">Deletion:</strong> Request deletion of your account and all associated data</li>
              <li><strong className="text-slate-200">Withdraw Consent:</strong> Log out at any time and revoke Facebook app permissions through your Facebook settings</li>
              <li><strong className="text-slate-200">Opt-Out of Analytics:</strong> Use browser privacy settings or extensions to block Google Analytics</li>
            </ul>
            <p className="mt-2">To exercise any of these rights, please contact us (see Section 10).</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Cookies</h2>
            <p>
              This website uses minimal cookies. Facebook SDK may set cookies for authentication purposes. Google Analytics uses cookies for tracking. You can control or delete cookies through your browser settings. Disabling cookies may affect the functionality of the login feature.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Children&apos;s Privacy</h2>
            <p>
              Our Service is not directed to individuals under the age of 13 (or the applicable minimum age in your jurisdiction). We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal data, please contact us and we will delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &quot;Last updated&quot; date. Your continued use of the Service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, your data, or wish to exercise your rights, please contact us through the website or the channels provided on our main page.
            </p>
          </section>

          <section className="border-t border-slate-800 pt-6 mt-8">
            <p className="text-xs text-slate-500">
              This privacy policy is provided for informational purposes. By using our Service, you acknowledge that you have read and understood this policy.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

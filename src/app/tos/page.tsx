import Link from "next/link";

export default function TermsOfService() {
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
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link href="/data" className="hover:text-slate-300 transition-colors">Data Disclaimer</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-8">Last updated: February 9, 2026</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Nepal Election 2026 Tracker website (the &quot;Service&quot;), you accept and agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you must not use the Service. We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Service constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Description of Service</h2>
            <p>
              The Service is a free, community-driven, informational website that provides an interactive map of Nepal&apos;s election districts, candidate information, historical (2022) election results, and user sentiment data through a &quot;like&quot; system. The Service is <strong className="text-white">not affiliated with, endorsed by, or connected to</strong> the Election Commission of Nepal, the Government of Nepal, or any political party, candidate, or official election body.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. No Official Status</h2>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-3">
              <p className="text-red-300 font-medium">
                IMPORTANT: This website is NOT an official election resource. It has no affiliation with the Election Commission of Nepal or any government body.
              </p>
            </div>
            <p>
              The Service is an independent, unofficial project created for informational and educational purposes only. Nothing on this website should be construed as official election information, official results, predictions, or endorsements. For official election information, please visit the <strong className="text-white">Election Commission of Nepal</strong> at <a href="https://election.gov.np" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">election.gov.np</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Data Accuracy Disclaimer</h2>
            <p>
              All data displayed on this website, including but not limited to candidate names, party affiliations, district information, constituency data, and 2022 election results, has been collected from publicly available sources on the internet. <strong className="text-white">We make no warranties or representations about the accuracy, completeness, reliability, or timeliness of any data.</strong>
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-slate-400">
              <li>Candidate data may contain errors, omissions, or outdated information</li>
              <li>Election zone boundaries and district information may not be perfectly accurate</li>
              <li>2022 historical results are sourced from public data and may contain inaccuracies</li>
              <li>User sentiment (&quot;likes&quot;) does not represent actual election results, polls, or predictions</li>
              <li>Party affiliations and candidate details may change and our data may not reflect the latest changes</li>
            </ul>
            <p className="mt-3">
              Users should always verify election-related information with official sources before relying on it for any purpose. Please see our <Link href="/data" className="text-blue-400 hover:underline">Data Usage &amp; Disclaimer</Link> page for more details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Limitation of Liability</h2>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-3">
              <p className="text-amber-300 text-xs leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICE AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE. THIS INCLUDES, WITHOUT LIMITATION, DAMAGES FOR LOSS OF PROFITS, GOODWILL, DATA, OR OTHER INTANGIBLE LOSSES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
            </div>
            <p>Specifically, we are not liable for:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
              <li>Any decisions made based on information displayed on this website</li>
              <li>Inaccuracies in candidate data, election results, or district information</li>
              <li>Any interpretation of sentiment/like data as election predictions or polls</li>
              <li>Service interruptions, downtime, or data loss</li>
              <li>Unauthorized access to your account or data</li>
              <li>Any third-party actions, including Facebook&apos;s handling of your data</li>
              <li>Any political, reputational, or financial harm resulting from use of this Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. User Conduct</h2>
            <p>By using the Service, you agree not to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to manipulate sentiment data through fake accounts, bots, or automated systems</li>
              <li>Misrepresent sentiment data as official election polls or results</li>
              <li>Interfere with or disrupt the Service or its servers</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Use the Service to spread misinformation about elections, candidates, or parties</li>
              <li>Scrape, harvest, or collect data from the Service without permission</li>
            </ul>
            <p className="mt-2">
              We reserve the right to terminate or restrict access to users who violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Sentiment/Like System</h2>
            <p>The &quot;like&quot; system on this website:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
              <li>Is a user engagement feature only — it is <strong className="text-slate-200">not</strong> an official poll, survey, or election prediction</li>
              <li>May be subject to manipulation, bias, or unrepresentative sampling</li>
              <li>Does not use any scientific methodology for sampling or weighting</li>
              <li>Should not be cited, referenced, or used as evidence of public opinion or election outcomes</li>
              <li>Has no statistical validity and cannot be used to project or predict election results</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Intellectual Property</h2>
            <p>
              The Service&apos;s design, code, and original content are the property of its creators. Candidate data, party names, logos, and election information belong to their respective owners. GeoJSON map data is used under open-source licenses. Users retain no ownership over any content or data submitted through the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Third-Party Services</h2>
            <p>
              The Service integrates with third-party services including Facebook (for authentication), Google Analytics (for website analytics), and Vercel (for hosting). Each of these services has its own terms of service and privacy policies. We are not responsible for the practices of these third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless the Service operators and their affiliates from and against any claims, liabilities, damages, losses, and expenses (including legal fees) arising from your use of the Service, your violation of these Terms, or your violation of any rights of a third party.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Nepal. Any disputes arising from these Terms or the use of the Service shall be subject to the exclusive jurisdiction of the courts of Nepal.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">12. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">13. Contact</h2>
            <p>
              If you have questions about these Terms, please contact us through the channels provided on our main page.
            </p>
          </section>

          <section className="border-t border-slate-800 pt-6 mt-8">
            <p className="text-xs text-slate-500">
              By using the Nepal Election 2026 Tracker, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

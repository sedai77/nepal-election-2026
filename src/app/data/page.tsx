import Link from "next/link";

export default function DataDisclaimer() {
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
            <Link href="/tos" className="hover:text-slate-300 transition-colors">Terms</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-white mb-2">Data Usage &amp; Disclaimer</h1>
        <p className="text-sm text-slate-500 mb-8">Last updated: February 9, 2026</p>

        {/* Critical disclaimer banner */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 mb-8">
          <h2 className="text-base font-bold text-red-300 mb-2">CRITICAL DISCLAIMER</h2>
          <p className="text-sm text-red-200/90 leading-relaxed">
            The information on this website may be inaccurate, incomplete, or outdated. All data has been collected from publicly available sources on the internet and has NOT been verified by any official authority. <strong>DO NOT treat this website as the source of truth for any election-related information.</strong> Always verify with official sources, including the Election Commission of Nepal (<a href="https://election.gov.np" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-100">election.gov.np</a>).
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Data Sources</h2>
            <p>The data displayed on this website comes from the following sources:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-slate-400">
              <li>
                <strong className="text-slate-200">Candidate Data:</strong> Collected from publicly available online sources including news websites, party announcements, and public records. This data was scraped/compiled from the internet and may contain errors.
              </li>
              <li>
                <strong className="text-slate-200">2022 Election Results:</strong> Historical FPTP results sourced from public databases and news reports of the 2022 (2079 BS) general election. These may not match official records exactly.
              </li>
              <li>
                <strong className="text-slate-200">District/Geographic Data:</strong> GeoJSON boundary data sourced from open-source repositories. District boundaries, headquarters, and province assignments may contain inaccuracies.
              </li>
              <li>
                <strong className="text-slate-200">Election Zone Data:</strong> Constituency/zone allocations based on publicly available information. Zone boundaries and candidate-zone assignments may not be perfectly accurate.
              </li>
              <li>
                <strong className="text-slate-200">Sentiment/Like Data:</strong> Generated entirely by website users through the &quot;like&quot; feature. This is unscientific, unverified user input with no statistical validity.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Known Limitations</h2>
            <div className="space-y-3">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <h3 className="text-sm font-medium text-amber-400 mb-1">Candidate Information</h3>
                <p className="text-slate-400">
                  Candidate names may have spelling variations. Party affiliations may have changed since data was collected. Some candidates may have withdrawn or been added after our data was compiled. Party alliances and mergers may not be reflected. Independent candidates may be missing or miscategorized.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <h3 className="text-sm font-medium text-amber-400 mb-1">Election Zone Assignments</h3>
                <p className="text-slate-400">
                  The number of candidates per zone may not match official records. Zone numbering may differ from official Election Commission designations. Some districts may have incorrect zone counts.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <h3 className="text-sm font-medium text-amber-400 mb-1">Historical Results (2022)</h3>
                <p className="text-slate-400">
                  2022 results are limited to FPTP constituencies only. Proportional representation results are not included. Some winning candidates or margins may be inaccurate. By-election results may not be reflected.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <h3 className="text-sm font-medium text-amber-400 mb-1">Sentiment / Like Data</h3>
                <p className="text-slate-400">
                  The like/voting system is NOT a scientific poll. It has no controlled sampling methodology. It is susceptible to manipulation by bots or coordinated campaigns. It may be biased towards demographics with internet access. It has NO predictive value for actual election outcomes. It should NEVER be cited as public opinion data.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Official Sources</h2>
            <p className="mb-3">
              For accurate, verified election information, please refer to these official sources:
            </p>
            <div className="space-y-2">
              <a
                href="https://election.gov.np"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Election Commission of Nepal</p>
                  <p className="text-xs text-slate-500">election.gov.np — Official election authority</p>
                </div>
              </a>
              <a
                href="https://nepal.gov.np"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Government of Nepal Portal</p>
                  <p className="text-xs text-slate-500">nepal.gov.np — Official government website</p>
                </div>
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. No Warranty</h2>
            <p>
              THE DATA ON THIS WEBSITE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF ACCURACY, COMPLETENESS, RELIABILITY, MERCHANTABILITY, OR FITNESS FOR A PARTICULAR PURPOSE. WE DO NOT WARRANT THAT THE DATA WILL BE ERROR-FREE, CURRENT, OR UNINTERRUPTED.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Use at Your Own Risk</h2>
            <p>
              You use the data on this website entirely at your own risk. We shall not be held responsible for any harm, loss, or damage resulting from reliance on or use of the data provided on this website. This includes but is not limited to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
              <li>Decisions made based on candidate or party information shown here</li>
              <li>Financial decisions or bets placed based on sentiment data</li>
              <li>Academic, journalistic, or research citations of this data</li>
              <li>Any legal proceedings where this data is presented as evidence</li>
              <li>Political campaigning or advertising based on this data</li>
              <li>Any misunderstanding of sentiment data as actual election polling or results</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Reporting Errors</h2>
            <p>
              If you notice any incorrect data on this website — such as wrong candidate names, incorrect party affiliations, wrong constituency assignments, or inaccurate historical results — we appreciate reports so we can attempt to correct them. However, we make no guarantees about the timeliness or completeness of any corrections.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Data Retention</h2>
            <p>
              User sentiment (like) data may be retained indefinitely for aggregate display purposes. We may delete, modify, or reset sentiment data at any time without notice. Historical data snapshots are not guaranteed to be preserved.
            </p>
          </section>

          <section className="border-t border-slate-800 pt-6 mt-8">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <p className="text-xs text-amber-300/90 leading-relaxed">
                <strong>Remember:</strong> This website is an unofficial, community-driven project. For any official election-related information, candidate lists, voter registration, polling station locations, or election results, always refer to the <a href="https://election.gov.np" target="_blank" rel="noopener noreferrer" className="underline">Election Commission of Nepal (election.gov.np)</a>. Do not rely on this website for making any decisions related to elections or governance.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

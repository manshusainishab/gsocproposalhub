import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                G
              </div>
              <span className="font-bold text-lg text-slate-100">
                GSoC<span className="text-indigo-400"> Hub</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              A structured, searchable archive of accepted Google Summer of Code proposals.
              Learn from winning proposals and contribute your own to help future GSoC applicants.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/proposals" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  Browse Proposals
                </Link>
              </li>
              <li>
                <a href="https://summerofcode.withgoogle.com" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  GSoC Official Site ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Contribute */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Contribute</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="https://github.com/manshushahab/gsocproposalhub/pulls" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  Submit a Proposal
                </a>
              </li>
              <li>
                <a href="https://github.com/manshusainishab/gsocproposalhub/blob/main/docs/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  Contribution Guide
                </a>
              </li>
              <li>
                <a href="https://github.com/manshushahab/gsocproposalhub" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  GitHub Repository ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} GSoC Proposal Hub. Open source under MIT License.
          </p>
          <p className="text-sm text-slate-600">
            Built with ❤️ for the open source community by @manshusainishab
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

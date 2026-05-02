import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProposalDetailPage from './pages/ProposalDetailPage'
import OrgsPage from './pages/OrgsPage'
import OrgProposalsPage from './pages/OrgProposalsPage'
import HowToAddPage from './pages/HowToAddPage'

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<OrgsPage />} />
          <Route path="/orgs" element={<OrgsPage />} />
          <Route path="/how-to-add" element={<HowToAddPage />} />
          <Route path="/:orgSlug/proposals" element={<OrgProposalsPage />} />
          <Route path="/:orgSlug/proposals/:year/:project" element={<ProposalDetailPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App

import { DocumentProvider, SettingsProvider } from '@/contexts'
import { Header } from '@/components/layout'
import { DocumentEditor } from '@/components/editor'

function App() {
  return (
    <SettingsProvider>
      <DocumentProvider>
        <div className="h-screen flex flex-col bg-gray-100">
          <Header />
          <DocumentEditor />
        </div>
      </DocumentProvider>
    </SettingsProvider>
  )
}

export default App

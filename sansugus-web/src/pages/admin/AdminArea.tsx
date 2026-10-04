import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import AdminLayout from './AdminLayout'
import AdminLoginPage from './AdminLoginPage'
import AdminDashboardPage from './AdminDashboardPage'
import SeasonsAdminPage from './SeasonsAdminPage'
import MatchesAdminPage from './MatchesAdminPage'
import ActaEditorPage from './ActaEditorPage'
import SquadAdminPage from './SquadAdminPage'
import PlayersAdminPage from './PlayersAdminPage'
import NotFound from '@/components/NotFound'

/** Rutas bajo /admin. No hay ningún enlace a ellas desde la web pública. */
export default function AdminArea() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<AdminLoginPage />} />
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="partidos" element={<MatchesAdminPage />} />
          <Route path="partidos/:id/acta" element={<ActaEditorPage />} />
          <Route path="plantilla" element={<SquadAdminPage />} />
          <Route path="jugadores" element={<PlayersAdminPage />} />
          <Route path="temporadas" element={<SeasonsAdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

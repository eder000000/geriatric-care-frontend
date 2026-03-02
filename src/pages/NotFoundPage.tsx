import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-8xl font-bold text-blue-200 mb-2">404</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Página no encontrada</h1>
        <p className="text-gray-500 mb-6">La página que buscas no existe o fue movida.</p>
        <Button className="gap-2" onClick={() => navigate('/dashboard')}>
          <Home className="w-4 h-4" />
          Volver al inicio
        </Button>
      </div>
    </div>
  );
}

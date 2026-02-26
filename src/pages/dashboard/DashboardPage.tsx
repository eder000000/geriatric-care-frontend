import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';

export function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        {t('dashboard.title')}
      </h1>
      <p className="text-gray-500 mb-6">
        Bienvenido, {user?.firstName} — {t(`roles.${user?.role}`)}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('dashboard.totalPatients'), value: '—', color: 'bg-blue-500' },
          { label: t('dashboard.activeAlerts'),  value: '—', color: 'bg-red-500' },
          { label: t('dashboard.carePlans'),     value: '—', color: 'bg-green-500' },
          { label: t('dashboard.medications'),   value: '—', color: 'bg-purple-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className={`w-10 h-10 ${color} rounded-lg mb-3`} />
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

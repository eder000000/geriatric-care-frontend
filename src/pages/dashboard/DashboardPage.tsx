import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { patientService } from '@/api/patientService';
import { alertService } from '@/api/alertService';
import { carePlanService } from '@/api/carePlanService';
import { medicationService } from '@/api/medicationService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Bell, ClipboardList, Pill, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function KpiCard({
  title, value, icon: Icon, color, loading, onClick
}: {
  title: string;
  value: number | undefined;
  icon: React.ElementType;
  color: string;
  loading: boolean;
  onClick?: () => void;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            {loading ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : (
              <p className="text-3xl font-bold text-gray-800">{value ?? 0}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">{title}</p>
          </div>
          <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: patients, isLoading: loadingPatients } = useQuery({
    queryKey: ['patients-count'],
    queryFn: () => patientService.getPatients(0, 1),
  });

  const { data: alertRules, isLoading: loadingAlerts } = useQuery({
    queryKey: ['active-alert-rules'],
    queryFn: () => alertService.getActiveAlertRules(),
  });

  const { data: carePlans, isLoading: loadingCarePlans } = useQuery({
    queryKey: ['careplans-count'],
    queryFn: () => carePlanService.getCarePlans(),
  });

  const { data: medications, isLoading: loadingMedications } = useQuery({
    queryKey: ['medications-count'],
    queryFn: () => medicationService.getMedications(),
  });

  const lowStockCount = medications?.filter(m => m.isLowStock).length ?? 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t('dashboard.title')}</h1>
        <p className="text-gray-500 mt-1">
          {i18n.language.startsWith('es') ? 'Bienvenido' : 'Welcome'}, {user?.firstName} — {t(`roles.${user?.role}`)}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          title={t('dashboard.totalPatients')}
          value={patients?.totalElements}
          icon={Users}
          color="bg-blue-500"
          loading={loadingPatients}
          onClick={() => navigate('/patients')}
        />
        <KpiCard
          title={t('dashboard.activeAlerts')}
          value={alertRules?.length}
          icon={Bell}
          color="bg-red-500"
          loading={loadingAlerts}
          onClick={() => navigate('/alerts')}
        />
        <KpiCard
          title={t('dashboard.carePlans')}
          value={carePlans?.totalElements}
          icon={ClipboardList}
          color="bg-green-500"
          loading={loadingCarePlans}
          onClick={() => navigate('/care-plans')}
        />
        <KpiCard
          title={t('medications.lowStock')}
          value={lowStockCount}
          icon={Pill}
          color="bg-purple-500"
          loading={loadingMedications}
          onClick={() => navigate('/medications')}
        />
      </div>

      {/* Alert Rules Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            {t('dashboard.recentAlerts')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingAlerts ? (
            <div className="space-y-2">
              {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : !alertRules?.length ? (
            <div className="text-center py-8 text-gray-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">{t('dashboard.noAlerts')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {alertRules.slice(0, 5).map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
                      {t('alerts.warning')}
                    </Badge>
                    <p className="text-sm font-medium text-gray-800">{rule.alertMessage.slice(0, 50)}</p>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-700 text-xs">
                    {t('common.active')}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

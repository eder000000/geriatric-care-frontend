import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { alertService } from '@/api/alertService';
import { patientService } from '@/api/patientService';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, ShieldAlert, Activity } from 'lucide-react';

const severityColors: Record<string, string> = {
  CRITICAL: 'bg-red-100 text-red-700 border-red-200',
  WARNING:  'bg-yellow-100 text-yellow-700 border-yellow-200',
  INFO:     'bg-blue-100 text-blue-700 border-blue-200',
};

const vitalSignLabels: Record<string, string> = {
  BLOOD_PRESSURE:    'Presión Arterial',
  HEART_RATE:        'Frecuencia Cardíaca',
  TEMPERATURE:       'Temperatura',
  OXYGEN_SATURATION: 'Saturación de Oxígeno',
  RESPIRATORY_RATE:  'Frecuencia Respiratoria',
  GLUCOSE:           'Glucosa',
};

const operatorLabels: Record<string, string> = {
  GREATER_THAN: '>',
  LESS_THAN:    '<',
  BETWEEN:      'entre',
  EQUALS:       '=',
};

export function AlertsPage() {
  const { t } = useTranslation();
  const [selectedPatient, setSelectedPatient] = useState('');

  const { data: patients } = useQuery({
    queryKey: ['patients-all'],
    queryFn: () => patientService.getPatients(0, 100),
  });

  const { data: alertRules, isLoading: loadingRules } = useQuery({
    queryKey: ['alert-rules'],
    queryFn: alertService.getAlertRules,
  });

  const { data: patientAlerts, isLoading: loadingPatientAlerts } = useQuery({
    queryKey: ['patient-alerts', selectedPatient],
    queryFn: () => alertService.getPatientAlerts(selectedPatient),
    enabled: !!selectedPatient,
  });

  const criticalCount = alertRules?.filter(r => r.severity === 'CRITICAL' && r.isActive).length ?? 0;
  const warningCount  = alertRules?.filter(r => r.severity === 'WARNING'  && r.isActive).length ?? 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t('alerts.title')}</h1>
        <p className="text-sm text-gray-500 mt-1">{alertRules?.length ?? 0} reglas configuradas</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{criticalCount}</p>
              <p className="text-xs text-gray-500">Reglas Críticas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{warningCount}</p>
              <p className="text-xs text-gray-500">Reglas de Advertencia</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{alertRules?.filter(r => r.isActive).length ?? 0}</p>
              <p className="text-xs text-gray-500">Reglas Activas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient alert history */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="w-4 h-4 text-red-500" />
            Alertas por Paciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3">
            <Label className="text-xs text-gray-500 mb-1 block">Seleccionar Paciente</Label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="w-full md:w-72">
                <SelectValue placeholder="Selecciona un paciente..." />
              </SelectTrigger>
              <SelectContent>
                {patients?.content.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.fullName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {!selectedPatient ? (
            <div className="text-center py-6 text-gray-400 text-sm">Selecciona un paciente para ver sus alertas</div>
          ) : loadingPatientAlerts ? (
            <div className="space-y-2">{[1,2].map(i => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : !patientAlerts?.length ? (
            <div className="text-center py-6 text-gray-400 text-sm">Sin alertas para este paciente</div>
          ) : (
            <div className="space-y-2">
              {patientAlerts.map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`text-xs ${severityColors[a.severity]}`}>{a.severity}</Badge>
                    <p className="text-sm text-gray-800">{a.message}</p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(a.triggeredAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert rules table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-orange-500" />
            Reglas de Alertas Configuradas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loadingRules ? (
            <div className="p-4 space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Signo Vital</TableHead>
                  <TableHead>Severidad</TableHead>
                  <TableHead>Condición</TableHead>
                  <TableHead>Cooldown</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertRules?.map(rule => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium text-sm">
                      {vitalSignLabels[rule.vitalSignType] ?? rule.vitalSignType}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${severityColors[rule.severity]}`}>
                        {rule.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {operatorLabels[rule.comparisonOperator] ?? rule.comparisonOperator} {rule.thresholdValue}
                      {rule.thresholdValueMax ? ` - ${rule.thresholdValueMax}` : ''}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{rule.cooldownMinutes} min</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={rule.isActive
                        ? 'bg-green-100 text-green-700 border-green-200 text-xs'
                        : 'bg-gray-100 text-gray-500 text-xs'}>
                        {rule.isActive ? t('common.active') : t('common.inactive')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

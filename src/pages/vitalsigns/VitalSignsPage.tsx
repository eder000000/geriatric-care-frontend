import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { vitalSignService } from '@/api/vitalSignService';
import { patientService } from '@/api/patientService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, Plus, Heart, Thermometer, Wind } from 'lucide-react';
import { useRole } from '@/context/useRole';

interface VitalForm {
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  heartRate: string;
  temperature: string;
  oxygenSaturation: string;
  respiratoryRate: string;
  notes: string;
}

export function VitalSignsPage() {
  const { t } = useTranslation();
  const { isFamily } = useRole();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string>('');

  const { data: patients } = useQuery({
    queryKey: ['patients-all'],
    queryFn: () => patientService.getPatients(0, 100),
  });

  const { data: vitalSigns, isLoading } = useQuery({
    queryKey: ['vital-signs', selectedPatient],
    queryFn: () => vitalSignService.getByPatient(selectedPatient),
    enabled: !!selectedPatient,
  });

  const { register, handleSubmit, reset } = useForm<VitalForm>();

  const createMutation = useMutation({
    mutationFn: vitalSignService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vital-signs', selectedPatient] });
      setShowForm(false);
      reset();
    },
  });

  const onSubmit = (data: VitalForm) => {
    createMutation.mutate({
      patientId: selectedPatient,
      bloodPressureSystolic: data.bloodPressureSystolic ? Number(data.bloodPressureSystolic) : undefined,
      bloodPressureDiastolic: data.bloodPressureDiastolic ? Number(data.bloodPressureDiastolic) : undefined,
      heartRate: data.heartRate ? Number(data.heartRate) : undefined,
      temperature: data.temperature ? Number(data.temperature) : undefined,
      oxygenSaturation: data.oxygenSaturation ? Number(data.oxygenSaturation) : undefined,
      respiratoryRate: data.respiratoryRate ? Number(data.respiratoryRate) : undefined,
      notes: data.notes || undefined,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t('vitalSigns.title')}</h1>
        {!isFamily && (
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            onClick={() => setShowForm(true)}
            disabled={!selectedPatient}
          >
            <Plus className="w-4 h-4" />
            {t('vitalSigns.record')}
          </Button>
        )}
      </div>

      <Card className="mb-4">
        <CardContent className="p-4">
          <Label className="text-sm text-gray-600 mb-2 block">Seleccionar Paciente</Label>
          <Select onValueChange={setSelectedPatient} value={selectedPatient}>
            <SelectTrigger className="w-full md:w-80">
              <SelectValue placeholder="Selecciona un paciente..." />
            </SelectTrigger>
            <SelectContent>
              {patients?.content.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.fullName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {vitalSigns && vitalSigns.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: t('vitalSigns.bloodPressure'), value: vitalSigns[0].bloodPressureSystolic ? `${vitalSigns[0].bloodPressureSystolic}/${vitalSigns[0].bloodPressureDiastolic}` : '—', unit: 'mmHg', icon: Heart, color: 'text-red-500' },
            { label: t('vitalSigns.heartRate'), value: String(vitalSigns[0].heartRate ?? '—'), unit: 'bpm', icon: Activity, color: 'text-pink-500' },
            { label: t('vitalSigns.temperature'), value: String(vitalSigns[0].temperature ?? '—'), unit: '°C', icon: Thermometer, color: 'text-orange-500' },
            { label: t('vitalSigns.oxygenSaturation'), value: String(vitalSigns[0].oxygenSaturation ?? '—'), unit: '%', icon: Wind, color: 'text-blue-500' },
          ].map(({ label, value, unit, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-xs text-gray-500">{label}</span>
                </div>
                <p className="text-xl font-bold text-gray-800">
                  {value} <span className="text-xs font-normal text-gray-400">{unit}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Historial</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!selectedPatient ? (
            <div className="text-center py-12 text-gray-400">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Selecciona un paciente para ver sus signos vitales</p>
            </div>
          ) : isLoading ? (
            <div className="p-4 space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : !vitalSigns?.length ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm">{t('common.noData')}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('vitalSigns.measuredAt')}</TableHead>
                  <TableHead>{t('vitalSigns.bloodPressure')}</TableHead>
                  <TableHead>{t('vitalSigns.heartRate')}</TableHead>
                  <TableHead>{t('vitalSigns.temperature')}</TableHead>
                  <TableHead>{t('vitalSigns.oxygenSaturation')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vitalSigns.map(v => (
                  <TableRow key={v.id}>
                    <TableCell className="text-sm">{new Date(v.measuredAt).toLocaleString()}</TableCell>
                    <TableCell>{v.bloodPressureSystolic ? `${v.bloodPressureSystolic}/${v.bloodPressureDiastolic}` : '—'}</TableCell>
                    <TableCell>{v.heartRate ?? '—'}</TableCell>
                    <TableCell>{v.temperature ?? '—'}</TableCell>
                    <TableCell>{v.oxygenSaturation ?? '—'}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('vitalSigns.record')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">{t('vitalSigns.bloodPressure')} Sistólica</Label>
                <Input type="number" placeholder="120" {...register('bloodPressureSystolic')} />
              </div>
              <div>
                <Label className="text-xs">Diastólica</Label>
                <Input type="number" placeholder="80" {...register('bloodPressureDiastolic')} />
              </div>
              <div>
                <Label className="text-xs">{t('vitalSigns.heartRate')} (bpm)</Label>
                <Input type="number" placeholder="72" {...register('heartRate')} />
              </div>
              <div>
                <Label className="text-xs">{t('vitalSigns.temperature')} (°C)</Label>
                <Input type="number" step="0.1" placeholder="36.5" {...register('temperature')} />
              </div>
              <div>
                <Label className="text-xs">{t('vitalSigns.oxygenSaturation')} (%)</Label>
                <Input type="number" placeholder="98" {...register('oxygenSaturation')} />
              </div>
              <div>
                <Label className="text-xs">{t('vitalSigns.respiratoryRate')} (rpm)</Label>
                <Input type="number" placeholder="16" {...register('respiratoryRate')} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); reset(); }}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? t('common.loading') : t('common.save')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

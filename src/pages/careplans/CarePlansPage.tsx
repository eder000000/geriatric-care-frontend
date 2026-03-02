import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { carePlanService } from '@/api/carePlanService';
import { patientService } from '@/api/patientService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ClipboardList, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRole } from '@/context/useRole';

interface CarePlanForm {
  patientId: string;
  title: string;
  description: string;
  priority: string;
  startDate: string;
  endDate: string;
}

const priorityColors: Record<string, string> = {
  LOW:      'bg-gray-100 text-gray-600 border-gray-200',
  MEDIUM:   'bg-blue-100 text-blue-700 border-blue-200',
  HIGH:     'bg-orange-100 text-orange-700 border-orange-200',
  CRITICAL: 'bg-red-100 text-red-700 border-red-200',
};

const statusColors: Record<string, string> = {
  DRAFT:      'bg-gray-100 text-gray-600 border-gray-200',
  ACTIVE:     'bg-green-100 text-green-700 border-green-200',
  ON_HOLD:    'bg-yellow-100 text-yellow-700 border-yellow-200',
  COMPLETED:  'bg-blue-100 text-blue-700 border-blue-200',
  CANCELLED:  'bg-red-100 text-red-500 border-red-200',
};

export function CarePlansPage() {
  const { t } = useTranslation();
  const { isFamily } = useRole();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(0);
  const [selectedPatientId, setSelectedPatientId] = useState('');

  const { data: patients } = useQuery({
    queryKey: ['patients-all'],
    queryFn: () => patientService.getPatients(0, 100),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['care-plans', page],
    queryFn: () => carePlanService.getCarePlans(page, 10),
  });

  const { register, handleSubmit, reset, setValue, watch } = useForm<CarePlanForm>({
    defaultValues: { priority: 'MEDIUM', startDate: new Date().toISOString().split('T')[0] }
  });

  const createMutation = useMutation({
    mutationFn: carePlanService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['care-plans'] });
      queryClient.invalidateQueries({ queryKey: ['careplans-count'] });
      setShowForm(false);
      reset();
      setSelectedPatientId('');
    },
  });

  const onSubmit = (data: CarePlanForm) => {
    createMutation.mutate({
      patientId: data.patientId,
      title: data.title,
      description: data.description || undefined,
      priority: data.priority,
      startDate: data.startDate,
      endDate: data.endDate || undefined,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('carePlans.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{data?.totalElements ?? 0} planes registrados</p>
        </div>
        {!isFamily && (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" />
            {t('carePlans.newCarePlan')}
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('carePlans.title')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('patients.title')}</TableHead>
                <TableHead>{t('carePlans.priority')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead className="hidden lg:table-cell">{t('carePlans.progress')}</TableHead>
                <TableHead className="hidden lg:table-cell">{t('carePlans.startDate')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : !data?.content.length ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-400">
                    <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">{t('common.noData')}</p>
                  </TableCell>
                </TableRow>
              ) : (
                data.content.map(plan => (
                  <TableRow key={plan.id} className="hover:bg-gray-50">
                    <TableCell>
                      <p className="font-medium text-gray-800">{plan.title}</p>
                      {plan.description && <p className="text-xs text-gray-400 truncate max-w-xs">{plan.description}</p>}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-gray-600">{plan.patientName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${priorityColors[plan.priority]}`}>
                        {t(`carePlans.priorities.${plan.priority}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${statusColors[plan.status]}`}>
                        {t(`carePlans.statuses.${plan.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full"
                            style={{ width: `${plan.completionPercentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{Math.round(plan.completionPercentage)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-gray-600">
                      {new Date(plan.startDate).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">Página {data.number + 1} / {data.totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 0}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= data.totalPages - 1}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('carePlans.newCarePlan')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <Label className="text-xs">Paciente *</Label>
              <Select
                value={selectedPatientId}
                onValueChange={(val) => { setSelectedPatientId(val); setValue('patientId', val); }}
              >
                <SelectTrigger><SelectValue placeholder="Selecciona un paciente..." /></SelectTrigger>
                <SelectContent>
                  {patients?.content.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.fullName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register('patientId', { required: true })} />
            </div>
            <div>
              <Label className="text-xs">{t('carePlans.planTitle')} *</Label>
              <Input {...register('title', { required: true })} placeholder="Plan de cuidado..." />
            </div>
            <div>
              <Label className="text-xs">Descripción</Label>
              <Input {...register('description')} placeholder="Descripción opcional..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">{t('carePlans.priority')} *</Label>
                <Select defaultValue="MEDIUM" onValueChange={(val) => setValue('priority', val)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Baja</SelectItem>
                    <SelectItem value="MEDIUM">Media</SelectItem>
                    <SelectItem value="HIGH">Alta</SelectItem>
                    <SelectItem value="CRITICAL">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">{t('carePlans.startDate')} *</Label>
                <Input type="date" {...register('startDate', { required: true })} />
              </div>
            </div>
            <div>
              <Label className="text-xs">{t('carePlans.endDate')}</Label>
              <Input type="date" {...register('endDate')} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); reset(); setSelectedPatientId(''); }}>
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

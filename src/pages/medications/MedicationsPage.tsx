import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { medicationService } from '@/api/medicationService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Pill, Plus, AlertTriangle } from 'lucide-react';
import { useRole } from '@/context/useRole';

interface MedForm {
  name: string;
  genericName: string;
  dosage: string;
  form: string;
  manufacturer: string;
  expirationDate: string;
  quantityInStock: string;
  reorderLevel: string;
}

export function MedicationsPage() {
  const { t } = useTranslation();
  const { isFamily } = useRole();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: medications, isLoading } = useQuery({
    queryKey: ['medications'],
    queryFn: medicationService.getMedications,
  });

  const { register, handleSubmit, reset } = useForm<MedForm>();

  const createMutation = useMutation({
    mutationFn: (data: MedForm) => medicationService.create({
      name: data.name,
      genericName: data.genericName || undefined,
      dosage: data.dosage,
      form: data.form || undefined,
      manufacturer: data.manufacturer || undefined,
      expirationDate: data.expirationDate || undefined,
      quantityInStock: Number(data.quantityInStock),
      reorderLevel: Number(data.reorderLevel),
    }),
    onSuccess: (med) => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['medications-count'] });
      setShowForm(false);
      reset();
      toast.success(`Medicamento "${med.name}" creado correctamente`);
    },
    onError: () => toast.error('Error al crear el medicamento'),
  });

  const onSubmit = (data: MedForm) => createMutation.mutate(data);
  const lowStockCount = medications?.filter(m => m.isLowStock).length ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('medications.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{medications?.length ?? 0} medicamentos registrados</p>
        </div>
        {!isFamily && (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" />
            {t('medications.newMedication')}
          </Button>
        )}
      </div>

      {lowStockCount > 0 && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4 text-yellow-800 text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{lowStockCount} medicamento(s) con stock bajo</span>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('medications.name')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('medications.dosage')}</TableHead>
                <TableHead className="hidden lg:table-cell">{t('medications.expirationDate')}</TableHead>
                <TableHead>{t('medications.quantity')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : !medications?.length ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-gray-400">
                    <Pill className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">{t('common.noData')}</p>
                  </TableCell>
                </TableRow>
              ) : (
                medications.map(med => (
                  <TableRow key={med.id}>
                    <TableCell>
                      <p className="font-medium text-gray-800">{med.name}</p>
                      {med.genericName && <p className="text-xs text-gray-400">{med.genericName}</p>}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-gray-600">{med.dosage}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-gray-600">
                      {med.expirationDate ? new Date(med.expirationDate).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell className="text-sm">{med.quantityInStock}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {med.isExpired && <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">{t('medications.expired')}</Badge>}
                        {med.isExpiringSoon && !med.isExpired && <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">{t('medications.expiringSoon')}</Badge>}
                        {med.isLowStock && <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">{t('medications.lowStock')}</Badge>}
                        {!med.isExpired && !med.isLowStock && <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">{t('common.active')}</Badge>}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('medications.newMedication')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <Label className="text-xs">{t('medications.name')} *</Label>
              <Input {...register('name', { required: true })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">{t('medications.dosage')} *</Label>
                <Input placeholder="500mg" {...register('dosage', { required: true })} />
              </div>
              <div>
                <Label className="text-xs">{t('medications.form')}</Label>
                <Input placeholder="Tablet" {...register('form')} />
              </div>
              <div>
                <Label className="text-xs">{t('medications.quantity')} *</Label>
                <Input type="number" defaultValue="0" {...register('quantityInStock', { required: true })} />
              </div>
              <div>
                <Label className="text-xs">{t('medications.reorderLevel')} *</Label>
                <Input type="number" defaultValue="0" {...register('reorderLevel', { required: true })} />
              </div>
            </div>
            <div>
              <Label className="text-xs">{t('medications.expirationDate')}</Label>
              <Input type="date" {...register('expirationDate')} />
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

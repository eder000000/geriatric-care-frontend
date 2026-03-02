import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService } from '@/api/patientService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';
import {
  ArrowLeft, User, Phone, Calendar, Activity,
  ClipboardList, UserX, Edit
} from 'lucide-react';
import { useRole } from '@/context/useRole';

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAdmin, isPhysician } = useRole();
  const queryClient = useQueryClient();
  const [showDeactivate, setShowDeactivate] = useState(false);

  const { data: patient, isLoading } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientService.getPatient(id!),
    enabled: !!id,
  });

  const deactivateMutation = useMutation({
    mutationFn: () => patientService.deactivatePatient(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', id] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setShowDeactivate(false);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p>Patient not found</p>
        <Button variant="ghost" onClick={() => navigate('/patients')} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> {t('common.back')}
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/patients')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{patient.fullName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="outline"
                className={patient.isActive
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : 'bg-gray-100 text-gray-500'}
              >
                {patient.isActive ? t('common.active') : t('common.inactive')}
              </Badge>
              <span className="text-sm text-gray-400">{patient.age} años</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {(isAdmin || isPhysician) && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate(`/patients/${id}/edit`)}
            >
              <Edit className="w-4 h-4" />
              {t('common.edit')}
            </Button>
          )}
          {isAdmin && patient.isActive && (
            <Button
              variant="outline"
              className="gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              onClick={() => setShowDeactivate(true)}
            >
              <UserX className="w-4 h-4" />
              {t('patients.deactivate')}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Personal Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label={t('patients.firstName')} value={patient.firstName} />
            <Separator />
            <InfoRow label={t('patients.lastName')} value={patient.lastName} />
            <Separator />
            <InfoRow
              label={t('patients.dateOfBirth')}
              value={new Date(patient.dateOfBirth).toLocaleDateString()}
              icon={<Calendar className="w-4 h-4 text-gray-400" />}
            />
            <Separator />
            <InfoRow
              label={t('patients.medicalConditions')}
              value={patient.medicalConditions || '—'}
            />
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-500" />
              {t('patients.emergencyContact')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label={t('patients.emergencyContact')} value={patient.emergencyContact || '—'} />
            <Separator />
            <InfoRow label={t('patients.emergencyPhone')} value={patient.emergencyPhone || '—'} />
          </CardContent>
        </Card>

        {/* Vital Signs placeholder */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500" />
              {t('vitalSigns.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-gray-400">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Sin registros de signos vitales</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => navigate('/vital-signs')}
              >
                {t('vitalSigns.record')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Care Plans placeholder */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-purple-500" />
              {t('carePlans.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-gray-400">
              <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Sin planes de cuidado</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => navigate('/care-plans')}
              >
                {t('carePlans.newCarePlan')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deactivate Dialog */}
      <Dialog open={showDeactivate} onOpenChange={setShowDeactivate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('patients.deactivate')}</DialogTitle>
            <DialogDescription>{t('patients.deactivateConfirm')}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeactivate(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => deactivateMutation.mutate()}
              disabled={deactivateMutation.isPending}
            >
              {deactivateMutation.isPending ? t('common.loading') : t('patients.deactivate')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500 flex items-center gap-1">
        {icon}{label}
      </span>
      <span className="text-sm font-medium text-gray-800 text-right max-w-xs">{value}</span>
    </div>
  );
}

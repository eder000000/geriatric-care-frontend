import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { patientService } from '@/api/patientService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, User, Phone } from 'lucide-react';

const patientSchema = z.object({
  firstName: z.string().min(1, 'Nombre requerido').max(50),
  lastName: z.string().min(1, 'Apellido requerido').max(50),
  dateOfBirth: z.string().min(1, 'Fecha de nacimiento requerida'),
  medicalConditions: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

export function PatientFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: patient, isLoading } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientService.getPatient(id!),
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      medicalConditions: '',
      emergencyContact: '',
      emergencyPhone: '',
    },
  });

  useEffect(() => {
    if (patient) {
      reset({
        firstName: patient.firstName,
        lastName: patient.lastName,
        dateOfBirth: patient.dateOfBirth?.substring(0, 10) ?? '',
        medicalConditions: patient.medicalConditions ?? '',
        emergencyContact: patient.emergencyContact ?? '',
        emergencyPhone: patient.emergencyPhone ?? '',
      });
    }
  }, [patient, reset]);

  const createMutation = useMutation({
    mutationFn: (data: PatientFormData) => patientService.createPatient(data),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Paciente creado exitosamente');
      navigate(`/patients/${created.id}`);
    },
    onError: () => toast.error('Error al crear paciente'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: PatientFormData) => patientService.updatePatient(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', id] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Paciente actualizado exitosamente');
      navigate(`/patients/${id}`);
    },
    onError: () => toast.error('Error al actualizar paciente'),
  });

  const onSubmit = (data: PatientFormData) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isEdit && isLoading) {
    return (
      <div className="space-y-4 max-w-2xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(isEdit ? `/patients/${id}` : '/patients')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Editar Paciente' : t('patients.newPatient')}
          </h1>
          {isEdit && patient && (
            <p className="text-sm text-gray-500 mt-1">{patient.fullName}</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Personal Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              {t('patients.personalInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">{t('patients.firstName')} *</Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  placeholder="Ej. María"
                  className={errors.firstName ? 'border-red-400' : ''}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">{t('patients.lastName')} *</Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  placeholder="Ej. González"
                  className={errors.lastName ? 'border-red-400' : ''}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dateOfBirth">{t('patients.dateOfBirth')} *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register('dateOfBirth')}
                className={errors.dateOfBirth ? 'border-red-400' : ''}
              />
              {errors.dateOfBirth && (
                <p className="text-xs text-red-500">{errors.dateOfBirth.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="medicalConditions">{t('patients.medicalConditions')}</Label>
              <Textarea
                id="medicalConditions"
                {...register('medicalConditions')}
                placeholder="Ej. Hipertensión, Diabetes tipo 2, Artritis..."
                rows={3}
              />
            </div>
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="emergencyContact">{t('patients.emergencyContact')}</Label>
                <Input
                  id="emergencyContact"
                  {...register('emergencyContact')}
                  placeholder="Ej. Juan González (hijo)"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emergencyPhone">{t('patients.emergencyPhone')}</Label>
                <Input
                  id="emergencyPhone"
                  {...register('emergencyPhone')}
                  placeholder="Ej. +52 33 1234 5678"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(isEdit ? `/patients/${id}` : '/patients')}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={isPending || (isEdit && !isDirty)}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Save className="w-4 h-4" />
            {isPending ? t('common.loading') : t('common.save')}
          </Button>
        </div>
      </form>
    </div>
  );
}

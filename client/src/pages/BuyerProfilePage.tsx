import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { User, Loader2, CheckCircle } from 'lucide-react';

const buyerProfileSchema = z.object({
  riskTolerance: z.enum(['low', 'medium', 'high']),
  urgencyLevel: z.enum(['low', 'medium', 'high']),
  priceSensitivity: z.enum(['low', 'medium', 'high']),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minSize: z.coerce.number().min(0).optional(),
  maxSize: z.coerce.number().min(0).optional(),
  preferredCities: z.array(z.string()).default([]),
  preferredTypes: z.array(z.string()).default([]),
});

type BuyerProfileForm = z.infer<typeof buyerProfileSchema>;

export default function BuyerProfilePage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [userId] = useState('user-123'); // TODO: Get from auth context

  const { data: existingProfile, isLoading } = useQuery({
    queryKey: ['/api/buyer-profile', userId],
  });

  const form = useForm<BuyerProfileForm>({
    resolver: zodResolver(buyerProfileSchema),
    defaultValues: existingProfile || {
      riskTolerance: 'medium',
      urgencyLevel: 'medium',
      priceSensitivity: 'medium',
      preferredCities: [],
      preferredTypes: [],
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: BuyerProfileForm) => {
      return await apiRequest('POST', '/api/buyer-profile', {
        userId,
        ...data,
        psychologicalProfile: {},
        mustHaveFeatures: [],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/buyer-profile', userId] });
      toast({
        title: t('nav.home') === 'Home' ? 'Profile Saved' : 'تم حفظ الملف',
        description: t('nav.home') === 'Home' ? 'Your buyer profile has been updated successfully' : 'تم تحديث ملف المشتري بنجاح',
      });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('nav.home') === 'Home' ? 'Failed to save profile' : 'فشل في حفظ الملف',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: BuyerProfileForm) => {
    saveMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>{t('buyerProfile.title')}</CardTitle>
              <CardDescription>{t('buyerProfile.subtitle')}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="riskTolerance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('buyerProfile.riskTolerance')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-risk-tolerance">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">{t('buyerProfile.low')}</SelectItem>
                          <SelectItem value="medium">{t('buyerProfile.medium')}</SelectItem>
                          <SelectItem value="high">{t('buyerProfile.high')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="urgencyLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('buyerProfile.urgencyLevel')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-urgency">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">{t('buyerProfile.low')}</SelectItem>
                          <SelectItem value="medium">{t('buyerProfile.medium')}</SelectItem>
                          <SelectItem value="high">{t('buyerProfile.high')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priceSensitivity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('buyerProfile.priceSensitivity')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-price-sensitivity">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">{t('buyerProfile.low')}</SelectItem>
                          <SelectItem value="medium">{t('buyerProfile.medium')}</SelectItem>
                          <SelectItem value="high">{t('buyerProfile.high')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {t('nav.home') === 'Home' ? 'Budget Range' : 'نطاق الميزانية'}
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="minPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('nav.home') === 'Home' ? 'Min Price (SAR)' : 'الحد الأدنى للسعر (ريال)'}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="500,000"
                            {...field}
                            data-testid="input-min-price"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('nav.home') === 'Home' ? 'Max Price (SAR)' : 'الحد الأقصى للسعر (ريال)'}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="2,000,000"
                            {...field}
                            data-testid="input-max-price"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {t('nav.home') === 'Home' ? 'Size Range' : 'نطاق المساحة'}
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="minSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('nav.home') === 'Home' ? 'Min Size (sqm)' : 'الحد الأدنى للمساحة (متر مربع)'}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="100"
                            {...field}
                            data-testid="input-min-size"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('nav.home') === 'Home' ? 'Max Size (sqm)' : 'الحد الأقصى للمساحة (متر مربع)'}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="500"
                            {...field}
                            data-testid="input-max-size"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full hover-elevate active-elevate-2 gap-2"
                disabled={saveMutation.isPending}
                data-testid="button-save-profile"
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    {t('buyerProfile.submit')}
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

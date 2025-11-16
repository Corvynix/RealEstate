import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Building2, MessageSquare, TrendingUp, Activity } from 'lucide-react';
import type { User, Property, AiCloserSession, Developer } from '@shared/schema';

export default function AdminDashboardPage() {
  const { t } = useTranslation();

  const { data: users, isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  const { data: properties, isLoading: loadingProperties } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  const { data: developers, isLoading: loadingDevelopers } = useQuery<Developer[]>({
    queryKey: ['/api/developers'],
  });

  const { data: aiSessions, isLoading: loadingSessions } = useQuery<AiCloserSession[]>({
    queryKey: ['/api/ai-closer/sessions'],
  });

  const activeSessions = aiSessions?.filter(s => s.status === 'active').length || 0;
  const completedSessions = aiSessions?.filter(s => s.status === 'completed').length || 0;
  const qualifiedLeads = aiSessions?.filter(s => s.outcome === 'qualified').length || 0;
  const conversionRate = completedSessions > 0 ? ((qualifiedLeads / completedSessions) * 100).toFixed(1) : '0';

  const stats = [
    {
      title: t('admin.totalUsers'),
      value: users?.length || 0,
      icon: Users,
      color: 'text-info',
      bgColor: 'bg-info/10',
      loading: loadingUsers,
    },
    {
      title: t('admin.totalProperties'),
      value: properties?.length || 0,
      icon: Building2,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      loading: loadingProperties,
    },
    {
      title: t('admin.activeSessions'),
      value: activeSessions,
      icon: MessageSquare,
      color: 'text-success',
      bgColor: 'bg-success/10',
      loading: loadingSessions,
    },
    {
      title: t('admin.conversionRate'),
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      loading: loadingSessions,
    },
  ];

  const topDevelopers = developers
    ?.sort((a, b) => b.trustScore - a.trustScore)
    .slice(0, 5) || [];

  const recentSessions = aiSessions
    ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5) || [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t('admin.dashboard')}</h1>
        <p className="text-muted-foreground">
          {t('nav.home') === 'Home' ? 'Overview of platform performance and metrics' : 'نظرة عامة على أداء المنصة والمقاييس'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover-elevate transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    {stat.loading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <p className="text-2xl font-bold">{stat.value}</p>
                    )}
                  </div>
                  <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Developers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {t('nav.home') === 'Home' ? 'Top Developers by Trust Score' : 'أفضل المطورين حسب درجة الثقة'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingDevelopers ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : topDevelopers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">{t('common.noResults')}</p>
            ) : (
              <div className="space-y-3">
                {topDevelopers.map((developer, index) => (
                  <div
                    key={developer.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover-elevate"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{developer.companyName}</p>
                        <p className="text-sm text-muted-foreground">{developer.projectsCompleted} projects</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-accent">{developer.trustScore.toFixed(0)}%</p>
                      <p className="text-xs text-muted-foreground">{t('developer.trustScore')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent AI Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {t('nav.home') === 'Home' ? 'Recent AI Sessions' : 'جلسات الذكاء الاصطناعي الأخيرة'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingSessions ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentSessions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">{t('common.noResults')}</p>
            ) : (
              <div className="space-y-3">
                {recentSessions.map((session) => {
                  const getStatusColor = (status: string) => {
                    switch (status) {
                      case 'completed':
                        return 'bg-success/10 text-success';
                      case 'active':
                        return 'bg-info/10 text-info';
                      case 'abandoned':
                        return 'bg-muted text-muted-foreground';
                      default:
                        return 'bg-secondary text-secondary-foreground';
                    }
                  };

                  return (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover-elevate"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {t('nav.home') === 'Home' ? 'Session' : 'جلسة'} {session.id.slice(0, 8)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.qualificationScore !== null && (
                          <span className="text-sm font-semibold">{session.qualificationScore.toFixed(0)}%</span>
                        )}
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

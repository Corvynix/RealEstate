import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Star, Calendar, CheckCircle, Eye } from 'lucide-react';
import type { Developer } from '@shared/schema';

interface DeveloperCardProps {
  developer: Developer;
}

export function DeveloperCard({ developer }: DeveloperCardProps) {
  const { t } = useTranslation();

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'bg-success text-success-foreground';
    if (score >= 60) return 'bg-warning text-warning-foreground';
    return 'bg-destructive text-destructive-foreground';
  };

  return (
    <Card className="hover-elevate transition-all duration-200" data-testid={`card-developer-${developer.id}`}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg" data-testid={`text-name-${developer.id}`}>
                {developer.companyName}
              </h3>
              <p className="text-sm text-muted-foreground">{developer.name}</p>
            </div>
          </div>
          <Badge className={getTrustScoreColor(developer.trustScore)} data-testid={`badge-trust-${developer.id}`}>
            {developer.trustScore.toFixed(0)}%
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1 text-center p-2 rounded-md bg-muted/30">
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
            </div>
            <div className="text-lg font-semibold" data-testid={`text-years-${developer.id}`}>
              {developer.yearsActive}
            </div>
            <div className="text-xs text-muted-foreground">{t('developer.yearsActive')}</div>
          </div>

          <div className="space-y-1 text-center p-2 rounded-md bg-muted/30">
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
              <CheckCircle className="h-3.5 w-3.5" />
            </div>
            <div className="text-lg font-semibold" data-testid={`text-projects-${developer.id}`}>
              {developer.projectsCompleted}
            </div>
            <div className="text-xs text-muted-foreground">{t('developer.projectsCompleted')}</div>
          </div>

          <div className="space-y-1 text-center p-2 rounded-md bg-muted/30">
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
              <Star className="h-3.5 w-3.5" />
            </div>
            <div className="text-lg font-semibold" data-testid={`text-rating-${developer.id}`}>
              {developer.averageRating.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">{t('developer.averageRating')}</div>
          </div>
        </div>

        {developer.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {developer.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-2">
        <Link href={`/developers/${developer.id}`} className="flex-1">
          <Button variant="outline" className="w-full hover-elevate active-elevate-2 gap-2" data-testid={`button-view-developer-${developer.id}`}>
            <Eye className="h-4 w-4" />
            {t('developer.viewProfile')}
          </Button>
        </Link>
        <Button className="flex-1 hover-elevate active-elevate-2" data-testid={`button-contact-developer-${developer.id}`}>
          {t('developer.contactNow')}
        </Button>
      </CardFooter>
    </Card>
  );
}

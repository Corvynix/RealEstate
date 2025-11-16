import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { DeveloperCard } from '@/components/DeveloperCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import type { Developer } from '@shared/schema';
import { useBehaviorTracking } from '@/hooks/use-behavior-tracking';

export default function DevelopersPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('trust-score');
  
  useBehaviorTracking({ page: '/developers' });

  const { data: developers, isLoading } = useQuery<Developer[]>({
    queryKey: ['/api/developers'],
  });

  const filteredDevelopers = developers?.filter(developer => {
    const matchesSearch = !searchQuery || 
      developer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      developer.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }) || [];

  const sortedDevelopers = [...filteredDevelopers].sort((a, b) => {
    switch (sortBy) {
      case 'trust-score':
        return (b.trustScore || 0) - (a.trustScore || 0);
      case 'projects':
        return (b.projectsCompleted || 0) - (a.projectsCompleted || 0);
      case 'rating':
        return (b.averageRating || 0) - (a.averageRating || 0);
      case 'years':
        return (b.yearsActive || 0) - (a.yearsActive || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t('nav.developers')}</h1>
        <p className="text-muted-foreground">
          {isLoading ? t('common.loading') : `${filteredDevelopers.length} ${t('nav.developers').toLowerCase()}`}
        </p>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-developers"
            />
          </div>
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger data-testid="select-sort">
            <SelectValue placeholder={t('common.sort')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trust-score">{t('developer.trustScore')}</SelectItem>
            <SelectItem value="projects">{t('developer.projectsCompleted')}</SelectItem>
            <SelectItem value="rating">{t('developer.averageRating')}</SelectItem>
            <SelectItem value="years">{t('developer.yearsActive')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Developers Grid */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
            </div>
          ))}
        </div>
      ) : sortedDevelopers.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">{t('common.noResults')}</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedDevelopers.map((developer) => (
            <DeveloperCard key={developer.id} developer={developer} />
          ))}
        </div>
      )}
    </div>
  );
}

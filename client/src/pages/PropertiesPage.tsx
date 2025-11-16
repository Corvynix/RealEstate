import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { PropertyCard } from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Property, Developer } from '@shared/schema';

export default function PropertiesPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  const { data: developers } = useQuery<Developer[]>({
    queryKey: ['/api/developers'],
  });

  const developersMap = developers?.reduce((acc, dev) => {
    acc[dev.id] = dev;
    return acc;
  }, {} as Record<string, Developer>) || {};

  const cities = ['all', 'Riyadh', 'Jeddah', 'Dubai', 'Abu Dhabi', 'Doha'];
  const propertyTypes = ['all', 'apartment', 'villa', 'office', 'land'];

  const filteredProperties = properties?.filter(property => {
    const matchesSearch = !searchQuery || 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'all' || property.city === selectedCity;
    const matchesType = selectedType === 'all' || property.propertyType === selectedType;
    return matchesSearch && matchesCity && matchesType;
  }) || [];

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'size-asc':
        return a.size - b.size;
      case 'size-desc':
        return b.size - a.size;
      default: // newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t('nav.properties')}</h1>
        <p className="text-muted-foreground">
          {isLoading ? t('common.loading') : `${filteredProperties.length} ${t('nav.properties').toLowerCase()}`}
        </p>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-properties"
            />
          </div>
        </div>

        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger data-testid="select-city">
            <SelectValue placeholder={t('nav.home') === 'Home' ? 'City' : 'المدينة'} />
          </SelectTrigger>
          <SelectContent>
            {cities.map(city => (
              <SelectItem key={city} value={city}>
                {city === 'all' ? (t('nav.home') === 'Home' ? 'All Cities' : 'كل المدن') : city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger data-testid="select-type">
            <SelectValue placeholder={t('property.type')} />
          </SelectTrigger>
          <SelectContent>
            {propertyTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type === 'all' ? (t('nav.home') === 'Home' ? 'All Types' : 'كل الأنواع') : type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger data-testid="select-sort">
            <SelectValue placeholder={t('common.sort')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t('nav.home') === 'Home' ? 'Newest' : 'الأحدث'}</SelectItem>
            <SelectItem value="price-asc">{t('nav.home') === 'Home' ? 'Price: Low to High' : 'السعر: من الأقل للأعلى'}</SelectItem>
            <SelectItem value="price-desc">{t('nav.home') === 'Home' ? 'Price: High to Low' : 'السعر: من الأعلى للأقل'}</SelectItem>
            <SelectItem value="size-asc">{t('nav.home') === 'Home' ? 'Size: Small to Large' : 'المساحة: من الأصغر للأكبر'}</SelectItem>
            <SelectItem value="size-desc">{t('nav.home') === 'Home' ? 'Size: Large to Small' : 'المساحة: من الأكبر للأصغر'}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Properties Grid */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[4/3] w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : sortedProperties.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">{t('common.noResults')}</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              developer={developersMap[property.developerId]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

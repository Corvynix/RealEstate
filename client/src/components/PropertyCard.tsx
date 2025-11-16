import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Maximize, Bed, Bath, Eye, AlertTriangle } from 'lucide-react';
import type { Property, Developer } from '@shared/schema';

interface PropertyCardProps {
  property: Property;
  developer?: Developer;
  matchScore?: number;
}

export function PropertyCard({ property, developer, matchScore }: PropertyCardProps) {
  const { t } = useTranslation();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-success text-success-foreground';
      case 'reserved':
        return 'bg-warning text-warning-foreground';
      case 'sold':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const riskFlags = property.riskFlags as Array<{ type: string; severity: string; description: string }>;
  const images = property.images as string[];
  const primaryImage = images && images.length > 0 ? images[0] : '/api/placeholder/400/300';

  return (
    <Card className="group overflow-hidden hover-elevate transition-all duration-200" data-testid={`card-property-${property.id}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={primaryImage}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          data-testid={`img-property-${property.id}`}
        />
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <Badge className={getStatusColor(property.status)} data-testid={`badge-status-${property.id}`}>
            {t(`property.${property.status}`)}
          </Badge>
          {matchScore && matchScore > 0 && (
            <Badge className="bg-info text-info-foreground" data-testid={`badge-match-${property.id}`}>
              {matchScore}% Match
            </Badge>
          )}
        </div>
        {riskFlags && riskFlags.length > 0 && (
          <div className="absolute top-3 right-3">
            <Badge variant="destructive" className="gap-1" data-testid={`badge-risk-${property.id}`}>
              <AlertTriangle className="h-3 w-3" />
              {riskFlags.length}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg line-clamp-1" data-testid={`text-title-${property.id}`}>
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span data-testid={`text-city-${property.id}`}>{property.city}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-accent" data-testid={`text-price-${property.id}`}>
            {formatPrice(property.price)}
          </div>
          {developer && (
            <Badge variant="outline" className="gap-1">
              <Building2 className="h-3 w-3" />
              <span className="text-xs">{developer.trustScore.toFixed(0)}%</span>
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Maximize className="h-4 w-4" />
            <span>{property.size} {t('property.sqm')}</span>
          </div>
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/properties/${property.id}`} className="w-full">
          <Button className="w-full hover-elevate active-elevate-2 gap-2" data-testid={`button-view-${property.id}`}>
            <Eye className="h-4 w-4" />
            {t('property.viewDetails')}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

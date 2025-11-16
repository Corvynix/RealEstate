import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Shield, Brain, TrendingUp, MessageSquare, FileCheck, Users } from 'lucide-react';
import heroImage from '@assets/generated_images/Hero_cityscape_background_002dfd35.png';

export default function HomePage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Brain,
      title: 'AI Property Assistant',
      titleAr: 'مساعد عقاري ذكي',
      description: 'Intelligent AI-powered conversations to understand your needs and find perfect properties',
      descriptionAr: 'محادثات ذكية مدعومة بالذكاء الاصطناعي لفهم احتياجاتك والعثور على العقارات المثالية',
    },
    {
      icon: Shield,
      title: 'Developer Trust Score',
      titleAr: 'درجة ثقة المطور',
      description: 'Comprehensive trust analysis of developers based on delivery history and reviews',
      descriptionAr: 'تحليل شامل لثقة المطورين بناءً على تاريخ التسليم والمراجعات',
    },
    {
      icon: FileCheck,
      title: 'Risk Analysis',
      titleAr: 'تحليل المخاطر',
      description: 'Automated detection of risk flags and hidden conditions in properties',
      descriptionAr: 'اكتشاف تلقائي لمؤشرات المخاطر والشروط المخفية في العقارات',
    },
    {
      icon: TrendingUp,
      title: 'Smart Matching',
      titleAr: 'مطابقة ذكية',
      description: 'Advanced algorithms match properties to your profile and preferences',
      descriptionAr: 'خوارزميات متقدمة تطابق العقارات مع ملفك وتفضيلاتك',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Properties', labelAr: 'عقار' },
    { value: '500+', label: 'Verified Developers', labelAr: 'مطور موثوق' },
    { value: '95%', label: 'Satisfaction Rate', labelAr: 'معدل الرضا' },
    { value: '24/7', label: 'AI Support', labelAr: 'دعم ذكي' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Modern cityscape"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-primary/70" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-4xl space-y-8">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {t('hero.title')}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/90 sm:text-xl">
              {t('hero.subtitle')}
            </p>

            {/* Search Bar */}
            <div className="mx-auto max-w-2xl">
              <div className="flex gap-2 rounded-lg bg-white/10 p-2 backdrop-blur-sm">
                <Input
                  type="search"
                  placeholder={t('hero.searchPlaceholder')}
                  className="flex-1 border-0 bg-white text-foreground placeholder:text-muted-foreground focus-visible:ring-accent"
                  data-testid="input-search"
                />
                <Link href="/properties">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2" data-testid="button-search">
                    <Search className="h-5 w-5" />
                    {t('hero.searchButton')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-accent">{stat.value}</div>
                  <div className="text-sm text-white/90">{t('nav.home') === 'Home' ? stat.label : stat.labelAr}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
              {t('nav.home') === 'Home' ? 'Why Choose Us' : 'لماذا تختارنا'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('nav.home') === 'Home' 
                ? 'Advanced AI technology combined with comprehensive trust analysis'
                : 'تقنية ذكاء اصطناعي متقدمة مع تحليل شامل للثقة'}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover-elevate transition-all duration-200" data-testid={`card-feature-${index}`}>
                  <CardContent className="p-6 space-y-4">
                    <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold">
                      {t('nav.home') === 'Home' ? feature.title : feature.titleAr}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('nav.home') === 'Home' ? feature.description : feature.descriptionAr}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl space-y-6">
            <h2 className="text-3xl font-bold sm:text-4xl">
              {t('nav.home') === 'Home' 
                ? 'Start Your Property Search Today'
                : 'ابدأ البحث عن عقارك اليوم'}
            </h2>
            <p className="text-lg text-primary-foreground/90">
              {t('nav.home') === 'Home'
                ? 'Let our AI assistant guide you to the perfect property investment'
                : 'دع مساعدنا الذكي يرشدك إلى الاستثمار العقاري المثالي'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/ai-closer">
                <Button size="lg" variant="secondary" className="gap-2" data-testid="button-start-ai">
                  <MessageSquare className="h-5 w-5" />
                  {t('aiCloser.startChat')}
                </Button>
              </Link>
              <Link href="/properties">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white gap-2" data-testid="button-browse">
                  <Users className="h-5 w-5" />
                  {t('nav.properties')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

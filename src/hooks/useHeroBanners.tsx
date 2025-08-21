
import { useQuery } from '@tanstack/react-query';
import { bannerService } from '@/services/bannerService';

export const useHeroBanners = () => {
  const { data: allBanners = [], isLoading, error } = useQuery({
    queryKey: ['banners'],
    queryFn: bannerService.getAll,
  });

  // Filter banners by hero section or isHero flag and sort by order
  const heroBanners = allBanners
    .filter(banner => banner.section === 'hero' || banner.isHero)
    .sort((a, b) => a.order - b.order);

  return {
    heroBanners,
    isLoading,
    error,
    hasHeroBanners: heroBanners.length > 0
  };
};

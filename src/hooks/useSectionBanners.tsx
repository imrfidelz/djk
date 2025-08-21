import { useQuery } from '@tanstack/react-query';
import { bannerService } from '@/services/bannerService';
import { Banner } from '@/components/admin/types/banner.types';

export const useSectionBanners = (section: 'hero' | 'signature-collection' | 'commitment') => {
  const { data: allBanners = [], isLoading, error } = useQuery({
    queryKey: ['banners'],
    queryFn: bannerService.getAll,
  });

  // Filter banners by section and sort by order
  const sectionBanners = allBanners
    .filter((banner: Banner) => banner.section === section)
    .sort((a: Banner, b: Banner) => a.order - b.order);

  return {
    banners: sectionBanners,
    isLoading,
    error,
    hasBanners: sectionBanners.length > 0
  };
};

export const useSignatureCollectionBanners = () => useSectionBanners('signature-collection');
export const useCommitmentBanners = () => useSectionBanners('commitment');
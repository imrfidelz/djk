
import React, { useState, useEffect } from 'react';
import { locationService } from '@/services/locationService';
import { Country, State, City } from '@/components/admin/types/location.types';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form';
import { formatCurrency } from '@/lib/currency';

interface LocationSelectorProps {
  form: any;
  onCityChange?: (city: City | null, deliveryFee: number) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ form, onCityChange }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(false);

  // Load countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await locationService.getCountries();
        setCountries(data);
      } catch (error) {
        console.error('Failed to load countries:', error);
      }
    };
    fetchCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const fetchStatesAndCities = async () => {
        setLoading(true);
        try {
          const data = await locationService.getCountryById(selectedCountry);
          setStates(data.states || []);
          setCities(data.cities || []);
        } catch (error) {
          console.error('Failed to load states and cities:', error);
          setStates([]);
          setCities([]);
        } finally {
          setLoading(false);
        }
      };
      fetchStatesAndCities();
    } else {
      setStates([]);
      setCities([]);
    }
  }, [selectedCountry]);

  // Filter cities by selected state
  const filteredCities = selectedState 
    ? cities.filter(city => {
        const cityState = typeof city.state === 'string' ? city.state : city.state._id;
        return cityState === selectedState;
      })
    : [];

  const handleCountryChange = (countryId: string) => {
    setSelectedCountry(countryId);
    setSelectedState('');
    setSelectedCity(null);
    form.setValue('countryId', countryId);
    form.setValue('stateId', '');
    form.setValue('cityId', '');
    onCityChange?.(null, 0);
  };

  const handleStateChange = (stateId: string) => {
    setSelectedState(stateId);
    setSelectedCity(null);
    form.setValue('stateId', stateId);
    form.setValue('cityId', '');
    onCityChange?.(null, 0);
  };

  const handleCityChange = (cityId: string) => {
    const city = filteredCities.find(c => c._id === cityId);
    setSelectedCity(city || null);
    form.setValue('cityId', cityId);
    
    if (city) {
      const deliveryFee = parseFloat(city.price) || 0;
      onCityChange?.(city, deliveryFee);
    } else {
      onCityChange?.(null, 0);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={form.control}
        name="countryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country *</FormLabel>
            <Select onValueChange={handleCountryChange} value={selectedCountry}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country._id} value={country._id}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="stateId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>State/Province *</FormLabel>
            <Select 
              onValueChange={handleStateChange} 
              value={selectedState}
              disabled={!selectedCountry || loading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state._id} value={state._id}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cityId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City *</FormLabel>
            <Select 
              onValueChange={handleCityChange} 
              value={selectedCity?._id || ''}
              disabled={!selectedState || filteredCities.length === 0}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {filteredCities.map((city) => (
                  <SelectItem key={city._id} value={city._id}>
                    {city.name} (Delivery: {formatCurrency(parseFloat(city.price))})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default LocationSelector;

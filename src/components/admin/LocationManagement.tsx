
import React, { useState } from 'react';
import { 
  Plus, Edit, Trash, Map, Flag, MapPin, FolderOpen, ChevronDown, Search 
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, SelectContent, SelectGroup, SelectItem, 
  SelectLabel, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { locationService } from '@/services/locationService';
import { Country, State, City, LocationFormData } from '@/components/admin/types/location.types';
import { formatCurrency } from '@/lib/currency';

const LocationManagement = () => {
  // State management
  const [activeTab, setActiveTab] = useState('countries');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  
  // Dialogs state
  const [countryDialogOpen, setCountryDialogOpen] = useState(false);
  const [stateDialogOpen, setStateDialogOpen] = useState(false);
  const [cityDialogOpen, setCityDialogOpen] = useState(false);
  
  // Form states
  const [newCountry, setNewCountry] = useState<LocationFormData>({ name: '', abrivation: '' });
  const [newState, setNewState] = useState<LocationFormData>({ name: '', country: '' });
  const [newCity, setNewCity] = useState<LocationFormData>({ name: '', price: '', state: '' });
  
  // Edit states
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [editingState, setEditingState] = useState<State | null>(null);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: countries = [], isLoading: countriesLoading } = useQuery({
    queryKey: ['countries'],
    queryFn: locationService.getCountries,
  });

  const { data: countryDetails } = useQuery({
    queryKey: ['country-details', selectedCountryId],
    queryFn: () => locationService.getCountryById(selectedCountryId!),
    enabled: !!selectedCountryId,
  });

  // Get states and cities from the selected country details
  const states = countryDetails?.states || [];
  const cities = countryDetails?.cities || [];

  // Mutations
  const createCountryMutation = useMutation({
    mutationFn: locationService.createCountry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      toast({ title: "Success", description: "Country created successfully" });
      setCountryDialogOpen(false);
      setNewCountry({ name: '', abrivation: '' });
      setEditingCountry(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create country",
        variant: "destructive",
      });
    },
  });

  const updateCountryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; abrivation: string } }) => 
      locationService.updateCountry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      queryClient.invalidateQueries({ queryKey: ['country-details'] });
      toast({ title: "Success", description: "Country updated successfully" });
      setCountryDialogOpen(false);
      setNewCountry({ name: '', abrivation: '' });
      setEditingCountry(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update country",
        variant: "destructive",
      });
    },
  });

  const deleteCountryMutation = useMutation({
    mutationFn: locationService.deleteCountry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      toast({ title: "Success", description: "Country deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete country",
        variant: "destructive",
      });
    },
  });

  const createStateMutation = useMutation({
    mutationFn: locationService.createState,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['country-details'] });
      toast({ title: "Success", description: "State created successfully" });
      setStateDialogOpen(false);
      setNewState({ name: '', country: '' });
      setEditingState(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create state",
        variant: "destructive",
      });
    },
  });

  const updateStateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; country: string } }) => 
      locationService.updateState(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['country-details'] });
      toast({ title: "Success", description: "State updated successfully" });
      setStateDialogOpen(false);
      setNewState({ name: '', country: '' });
      setEditingState(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update state",
        variant: "destructive",
      });
    },
  });

  const deleteStateMutation = useMutation({
    mutationFn: locationService.deleteState,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['country-details'] });
      toast({ title: "Success", description: "State deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete state",
        variant: "destructive",
      });
    },
  });

  const createCityMutation = useMutation({
    mutationFn: locationService.createCity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['country-details'] });
      toast({ title: "Success", description: "City created successfully" });
      setCityDialogOpen(false);
      setNewCity({ name: '', price: '', state: '' });
      setEditingCity(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create city",
        variant: "destructive",
      });
    },
  });

  const updateCityMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; price: string; state: string } }) => 
      locationService.updateCity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['country-details'] });
      toast({ title: "Success", description: "City updated successfully" });
      setCityDialogOpen(false);
      setNewCity({ name: '', price: '', state: '' });
      setEditingCity(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update city",
        variant: "destructive",
      });
    },
  });

  const deleteCityMutation = useMutation({
    mutationFn: locationService.deleteCity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['country-details'] });
      toast({ title: "Success", description: "City deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete city",
        variant: "destructive",
      });
    },
  });

  // Filter function for search
  const filterItems = <T extends { name: string }>(items: T[], query: string): T[] => {
    if (!query) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Get filtered lists based on selections and search query
  const filteredCountries = filterItems(countries, searchQuery);
  
  const filteredStates = filterItems(
    states.filter(state => !selectedCountryId || (typeof state.country === 'string' ? state.country === selectedCountryId : state.country._id === selectedCountryId)), 
    searchQuery
  );
  
  const filteredCities = filterItems(
    cities.filter(city => !selectedStateId || (typeof city.state === 'string' ? city.state === selectedStateId : city.state._id === selectedStateId)),
    searchQuery
  );
  
  // CRUD operations for Countries
  const handleAddCountry = () => {
    if (!newCountry.name?.trim() || !newCountry.abrivation?.trim()) {
      toast({
        title: "Error",
        description: "Country name and abbreviation are required",
        variant: "destructive",
      });
      return;
    }
    
    if (editingCountry) {
      updateCountryMutation.mutate({
        id: editingCountry._id,
        data: { name: newCountry.name, abrivation: newCountry.abrivation }
      });
    } else {
      createCountryMutation.mutate({ name: newCountry.name, abrivation: newCountry.abrivation });
    }
  };
  
  const handleEditCountry = (country: Country) => {
    setEditingCountry(country);
    setNewCountry({ name: country.name, abrivation: country.abrivation });
    setCountryDialogOpen(true);
  };
  
  const handleDeleteCountry = (id: string) => {
    deleteCountryMutation.mutate(id);
  };
  
  // CRUD operations for States
  const handleAddState = () => {
    if (!newState.name?.trim() || !newState.country) {
      toast({
        title: "Error",
        description: "State name and country selection are required",
        variant: "destructive",
      });
      return;
    }
    
    if (editingState) {
      updateStateMutation.mutate({
        id: editingState._id,
        data: { name: newState.name, country: newState.country }
      });
    } else {
      createStateMutation.mutate({ name: newState.name, country: newState.country });
    }
  };
  
  const handleEditState = (state: State) => {
    setEditingState(state);
    setNewState({ 
      name: state.name, 
      country: typeof state.country === 'string' ? state.country : state.country._id 
    });
    setStateDialogOpen(true);
  };
  
  const handleDeleteState = (id: string) => {
    deleteStateMutation.mutate(id);
  };
  
  // CRUD operations for Cities
  const handleAddCity = () => {
    if (!newCity.name?.trim() || !newCity.state || !newCity.price) {
      toast({
        title: "Error",
        description: "City name, state selection, and delivery price are required",
        variant: "destructive",
      });
      return;
    }
    
    if (editingCity) {
      updateCityMutation.mutate({
        id: editingCity._id,
        data: { name: newCity.name, price: newCity.price, state: newCity.state }
      });
    } else {
      createCityMutation.mutate({ name: newCity.name, price: newCity.price, state: newCity.state });
    }
  };
  
  const handleEditCity = (city: City) => {
    setEditingCity(city);
    setNewCity({ 
      name: city.name, 
      price: city.price, 
      state: typeof city.state === 'string' ? city.state : city.state._id 
    });
    setCityDialogOpen(true);
  };
  
  const handleDeleteCity = (id: string) => {
    deleteCityMutation.mutate(id);
  };
  
  const openAddCountryDialog = () => {
    setEditingCountry(null);
    setNewCountry({ name: '', abrivation: '' });
    setCountryDialogOpen(true);
  };
  
  const openAddStateDialog = () => {
    setEditingState(null);
    setNewState({ name: '', country: selectedCountryId || '' });
    setStateDialogOpen(true);
  };
  
  const openAddCityDialog = () => {
    setEditingCity(null);
    setNewCity({ name: '', price: '', state: selectedStateId || '' });
    setCityDialogOpen(true);
  };

  // Handling country selection (for filtering states)
  const handleCountrySelection = (value: string) => {
    const countryId = value === "all" ? null : value;
    setSelectedCountryId(countryId);
    setSelectedStateId(null); // Reset state selection when country changes
  };

  // Handling state selection (for filtering cities)
  const handleStateSelection = (value: string) => {
    const stateId = value === "all" ? null : value;
    setSelectedStateId(stateId);
  };

  if (countriesLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground">Location Management</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">Manage delivery locations and shipping costs</p>
        </div>
        
        {activeTab === 'countries' && (
          <Button className="gap-2 shrink-0" onClick={openAddCountryDialog}>
            <Plus className="h-4 w-4" />
            Add Country
          </Button>
        )}
        
        {activeTab === 'states' && (
          <Button className="gap-2 shrink-0" onClick={openAddStateDialog}>
            <Plus className="h-4 w-4" />
            Add State
          </Button>
        )}
        
        {activeTab === 'cities' && (
          <Button className="gap-2 shrink-0" onClick={openAddCityDialog}>
            <Plus className="h-4 w-4" />
            Add City
          </Button>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div className="w-full md:w-2/3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search locations..." 
              className="w-full pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Hierarchical Selection */}
        <div className="flex flex-col md:flex-row gap-2">
          {/* Country Select */}
          <Select onValueChange={handleCountrySelection} value={selectedCountryId || "all"}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country._id} value={country._id}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* State Select - Only visible when viewing cities */}
          {activeTab === 'cities' && (
            <Select onValueChange={handleStateSelection} value={selectedStateId || "all"}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states
                  .filter(state => !selectedCountryId || (typeof state.country === 'string' ? state.country === selectedCountryId : state.country._id === selectedCountryId))
                  .map((state) => (
                    <SelectItem key={state._id} value={state._id}>
                      {state.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="countries" className="flex items-center">
            <Flag size={16} className="mr-2" />
            Countries
          </TabsTrigger>
          <TabsTrigger value="states" className="flex items-center">
            <FolderOpen size={16} className="mr-2" />
            States/Provinces
          </TabsTrigger>
          <TabsTrigger value="cities" className="flex items-center">
            <MapPin size={16} className="mr-2" />
            Cities & Prices
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="countries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Countries</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Country Name</TableHead>
                      <TableHead>Abbreviation</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCountries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                          No countries found. Add a new country to get started.
                        </TableCell>
                      </TableRow>
                  ) : (
                    filteredCountries.map((country) => (
                      <TableRow key={country._id}>
                        <TableCell>{country.name}</TableCell>
                        <TableCell>{country.abrivation}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditCountry(country)}
                          >
                            <Edit size={16} className="mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500"
                            onClick={() => handleDeleteCountry(country._id)}
                          >
                            <Trash size={16} className="mr-1" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                 </TableBody>
               </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="states" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>States/Provinces</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>State/Province Name</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        {selectedCountryId 
                          ? "No states/provinces found for the selected country."
                          : "No states/provinces found. Add a new state/province to get started."
                        }
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStates.map((state) => (
                      <TableRow key={state._id}>
                        <TableCell>{state.name}</TableCell>
                        <TableCell>
                          {typeof state.country === 'string' 
                            ? countries.find(c => c._id === state.country)?.name || 'Unknown'
                            : state.country.name
                          }
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditState(state)}
                          >
                            <Edit size={16} className="mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500"
                            onClick={() => handleDeleteState(state._id)}
                          >
                            <Trash size={16} className="mr-1" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cities & Delivery Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>City Name</TableHead>
                    <TableHead>State/Province</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Delivery Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {selectedStateId 
                          ? "No cities found for the selected state/province." 
                          : "No cities found. Add a new city to get started."
                        }
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCities.map((city) => {
                      const cityState = typeof city.state === 'string' 
                        ? states.find(s => s._id === city.state)
                        : city.state;
                      const country = typeof cityState?.country === 'string'
                        ? countries.find(c => c._id === cityState.country)
                        : cityState?.country;
                      
                      return (
                        <TableRow key={city._id}>
                          <TableCell>{city.name}</TableCell>
                          <TableCell>{cityState?.name || 'Unknown'}</TableCell>
                          <TableCell>{country?.name || 'Unknown'}</TableCell>
                          <TableCell>{formatCurrency(parseFloat(city.price))}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditCity(city)}
                            >
                              <Edit size={16} className="mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500"
                              onClick={() => handleDeleteCity(city._id)}
                            >
                              <Trash size={16} className="mr-1" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Country Dialog */}
      <Dialog open={countryDialogOpen} onOpenChange={setCountryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCountry ? 'Edit Country' : 'Add New Country'}
            </DialogTitle>
            <DialogDescription>
              {editingCountry 
                ? 'Update the country information below'
                : 'Enter the details for the new country'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="country-name">Country Name</Label>
              <Input 
                id="country-name"
                value={newCountry.name || ''} 
                onChange={(e) => setNewCountry({...newCountry, name: e.target.value})} 
                placeholder="Enter country name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country-abbreviation">Abbreviation</Label>
              <Input 
                id="country-abbreviation"
                value={newCountry.abrivation || ''} 
                onChange={(e) => setNewCountry({...newCountry, abrivation: e.target.value})} 
                placeholder="Enter country abbreviation (e.g., US, CA)"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCountryDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddCountry}
              disabled={createCountryMutation.isPending || updateCountryMutation.isPending}
            >
              {editingCountry ? 'Update' : 'Add'} Country
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* State Dialog */}
      <Dialog open={stateDialogOpen} onOpenChange={setStateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingState ? 'Edit State/Province' : 'Add New State/Province'}
            </DialogTitle>
            <DialogDescription>
              {editingState 
                ? 'Update the state/province information below'
                : 'Enter the details for the new state/province'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="state-name">State/Province Name</Label>
              <Input 
                id="state-name"
                value={newState.name || ''} 
                onChange={(e) => setNewState({...newState, name: e.target.value})} 
                placeholder="Enter state/province name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state-country">Country</Label>
              <Select 
                value={newState.country || ''} 
                onValueChange={(value) => setNewState({...newState, country: value})}
              >
                <SelectTrigger id="state-country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country._id} value={country._id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setStateDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddState}
              disabled={createStateMutation.isPending || updateStateMutation.isPending}
            >
              {editingState ? 'Update' : 'Add'} State/Province
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* City Dialog */}
      <Dialog open={cityDialogOpen} onOpenChange={setCityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCity ? 'Edit City' : 'Add New City'}
            </DialogTitle>
            <DialogDescription>
              {editingCity 
                ? 'Update the city information below'
                : 'Enter the details for the new city'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="city-name">City Name</Label>
              <Input 
                id="city-name"
                value={newCity.name || ''} 
                onChange={(e) => setNewCity({...newCity, name: e.target.value})} 
                placeholder="Enter city name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city-state">State/Province</Label>
              <Select 
                value={newCity.state || ''} 
                onValueChange={(value) => setNewCity({...newCity, state: value})}
              >
                <SelectTrigger id="city-state">
                  <SelectValue placeholder="Select state/province" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => {
                    const country = typeof state.country === 'string'
                      ? countries.find(c => c._id === state.country)
                      : state.country;
                    return (
                      <SelectItem key={state._id} value={state._id}>
                        {state.name} ({country?.name})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city-price">Delivery Price (₦)</Label>
              <Input
                id="city-price"
                type="number"
                min="0"
                step="0.01"
                value={newCity.price || ''}
                onChange={(e) => setNewCity({...newCity, price: e.target.value})}
                placeholder="Enter delivery price"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCityDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddCity}
              disabled={createCityMutation.isPending || updateCityMutation.isPending}
            >
              {editingCity ? 'Update' : 'Add'} City
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationManagement;

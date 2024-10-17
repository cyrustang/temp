'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, ChevronDown, ChevronUp, Plus, X, ChevronLeft, ChevronRight } from "lucide-react"
import { debounce } from 'lodash'

interface Location {
  id: number;
  name: string;
  created_at: number;
}

interface AssetPhoto {
  id: number;
  url: string;
  cm_asset_id: number;
}

interface Asset {
  id: number;
  name: string;
  cm_current_location_id: number;
  cm_next_location_id: number;
  created_at: number;
  _cm_asset_photo_of_cm_asset: AssetPhoto[];
}

const LocationCombobox = ({ asset, onLocationChange }: { asset: Asset, onLocationChange: (locationId: number) => void }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [search, setSearch] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(asset.cm_next_location_id);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchLocations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api.bricks.academy/api:NXGbpEss/cm_location');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setLocations(data);
      if (asset.cm_next_location_id) {
        const initialLocation = data.find((loc: Location) => loc.id === asset.cm_next_location_id);
        if (initialLocation) {
          setSearch(initialLocation.name);
        }
      }
    } catch (err) {
      setError('An error occurred while fetching data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLocations = useMemo(() => {
    if (!search) return locations;
    return locations.filter(location =>
      location.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [locations, search]);

  const isExactMatch = useMemo(() => {
    return filteredLocations.some(location => 
      location.name.toLowerCase() === search.toLowerCase()
    );
  }, [filteredLocations, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (e.target.value === '') {
      setSelectedLocationId(null);
      onLocationChange(0);
    } else {
      setSelectedLocationId(null);
    }
    if (!isOpen) setIsOpen(true);
  };

  const handleSelectLocation = (location: Location) => {
    setSearch(location.name);
    setSelectedLocationId(location.id);
    onLocationChange(location.id);
    setIsOpen(false);
  };

  const handleAddLocation = async () => {
    if (!search || isExactMatch) return;

    setIsAdding(true);
    setError(null);

    try {
      const response = await fetch('https://api.bricks.academy/api:NXGbpEss/cm_location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: search }),
      });

      if (!response.ok) {
        throw new Error('Failed to add new location');
      }

      const newLocation = await response.json();
      setLocations([...locations, newLocation]);
      setSearch(newLocation.name);
      setSelectedLocationId(newLocation.id);
      onLocationChange(newLocation.id);
      setIsOpen(false);
    } catch (err) {
      setError('Failed to add new location. Please try again.');
      console.error('Error adding new location:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const highlightMatch = (text: string, filter: string) => {
    if (!filter) return text;
    const regex = new RegExp(`(${filter})`, 'gi');
    return text.replace(regex, '<span class="bg-yellow-200">$1</span>');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <div className="flex items-center">
          <Input
            type="text"
            value={search}
            onChange={handleSearch}
            onClick={() => setIsOpen(true)}
            placeholder="Select or type a location"
            className="w-full pr-10"
            aria-autocomplete="list"
            aria-controls="location-list"
            aria-expanded={isOpen}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
            {selectedLocationId ? (
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedLocationId(null);
                  onLocationChange(0);
                }}
                className="mr-1 focus:outline-none"
                aria-label="Clear selection"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            ) : search && !isExactMatch && (
              <button
                onClick={handleAddLocation}
                disabled={isAdding}
                className="mr-1 focus:outline-none"
                aria-label="Add new location"
              >
                {isAdding ? (
                  <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                ) : (
                  <Plus className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close dropdown" : "Open dropdown"}
            >
              {isOpen ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
        </div>
      </div>
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {isOpen && (
        <ul
          id="location-list"
          role="listbox"
          className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg"
        >
          {isLoading ? (
            <li className="p-2 text-center text-gray-600">Loading...</li>
          ) : filteredLocations.length > 0 ? (
            filteredLocations.map((location) => (
              <li
                key={location.id}
                role="option"
                className="p-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                onClick={() => handleSelectLocation(location)}
                dangerouslySetInnerHTML={{
                  __html: highlightMatch(location.name, search)
                }}
              />
            ))
          ) : (
            <li className="p-2 text-center text-gray-600">No results found</li>
          )}
        </ul>
      )}
    </div>
  )
}

const AssetPhotoGallery = ({ photos }: { photos?: AssetPhoto[] }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  const totalPhotos = photos?.length ?? 0;

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (!photos || photos.length === 0) {
    return (
      <div className="relative w-full h-[calc(100vw*3/4)] max-h-[300px] bg-gray-200 flex items-center justify-center rounded-md">
        <p className="text-gray-600">No photos available</p>
      </div>
    );
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % totalPhotos);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + totalPhotos) % totalPhotos);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      fullscreenRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div ref={fullscreenRef} className={`relative ${isFullscreen ? 'fixed inset-0 bg-black z-50' : ''}`}>
      <img
        src={photos[currentPhotoIndex].url}
        alt={`Asset photo ${currentPhotoIndex + 1}`}
        className={`w-full ${isFullscreen ? 'h-full object-contain' : 'h-[calc(100vw*3/4)] max-h-[300px] object-cover'} rounded-md cursor-pointer`}
        onClick={toggleFullscreen}
      />
      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
        {totalPhotos} photo{totalPhotos !== 1 ? 's' : ''}
      </div>
      {totalPhotos > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full"
            aria-label="Next photo"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
            {currentPhotoIndex + 1} / {totalPhotos}
          </div>
        </>
      )}
    </div>
  );
};

export function AssetManagement() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('https://api.bricks.academy/api:NXGbpEss/cm_asset');
        if (!response.ok) {
          throw new Error('Failed to fetch assets');
        }
        const data = await response.json();
        setAssets(data);
      } catch (err) {
        setError('An error occurred while fetching assets. Please try again.');
        console.error('Error fetching assets:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const updateAssetLocation = useCallback(async (asset: Asset, newLocationId: number) => {
    try {
      const response = await fetch(`https://api.bricks.academy/api:NXGbpEss/cm_asset/${asset.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cm_asset_id: asset.id,
          name: asset.name,
          cm_next_location_id: newLocationId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update asset location');
      }

      // Update local state
      setAssets(prevAssets =>
        prevAssets.map(a =>
          a.id === asset.id ? { ...a, cm_next_location_id: newLocationId } : a
        )
      );
    } catch (err) {
      console.error('Error updating asset location:', err);
      // You might want to show an error message to the user here
    }
  }, []);

  const debouncedUpdateAssetLocation = useMemo(
    () => debounce(updateAssetLocation, 300),
    [updateAssetLocation]
  );

  const handleLocationChange = (asset: Asset, newLocationId: number) => {
    debouncedUpdateAssetLocation(asset, newLocationId);
  };

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center">Loading assets...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">澳門教區 - 聖物管理系統</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map((asset, index) => (
          <Card  key={asset.id} className={`w-full ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
            <CardHeader>
              <CardTitle>{asset.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <AssetPhotoGallery photos={asset._cm_asset_photo_of_cm_asset || []} />
              <div className="mt-4 flex items-center">
                <label htmlFor={`location-${asset.id}`} className="text-sm font-medium text-gray-700 mr-2">
                  存放地點:
                </label>
                <LocationCombobox
                  asset={asset}
                  onLocationChange={(newLocationId) => handleLocationChange(asset, newLocationId)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
"use client"

import { useEffect, useRef, useCallback, useMemo, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '../leaflet-custom.css'
import { MapPin, Users } from 'lucide-react'

// Define the Member type
interface Member {
  id: string
  name: string
  initials: string
  title: string
  location: string
  coordinates: { lat: number; lng: number }
  email: string
  bio: string
  expertise: string[]
  skills: string[]
  joinDate: string
  cohort: string
  industry: string
  subgroups: string[]
  avatar: string
  isOnline: boolean
  color: string
  social: {
    linkedin?: string
    twitter?: string
    website?: string
    github?: string
  }
  lookingFor: string[]
  offering: string[]
  experience: {
    title: string
    company: string
    duration: string
    description: string
  }[]
  referrals: {
    organization: string
    type: string
    category: string
  }[]
}

interface MapViewProps {
  members: Member[]
}

// City-level data aggregation
interface CityData {
  name: string
  coordinates: { lat: number; lng: number }
  members: Member[]
  count: number
}

const MapView: React.FC<MapViewProps> = ({ members }) => {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<L.LayerGroup | null>(null)
  const [currentZoom, setCurrentZoom] = useState(5)
  
  // Debug: Track when members prop changes
  useEffect(() => {
    console.log('MapView received members update:', members.length, 'members')
  }, [members])
  
  // Memoize avatar color calculation
  const getAvatarColorClass = useCallback((color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      emerald: "bg-emerald-500",
      purple: "bg-purple-500",
      yellow: "bg-yellow-500",
      red: "bg-red-500",
      orange: "bg-orange-500",
      pink: "bg-pink-500",
      indigo: "bg-indigo-500",
      teal: "bg-teal-500",
    }
    return colorMap[color] || "bg-gray-500"
  }, [])

  // Memoized city-level data aggregation - only recalculate when members change
  const cityData = useMemo(() => {
    console.log('Recalculating city data with members:', members.length)
    const cities = new Map<string, CityData>()
    
    members.forEach(member => {
      if (!member.coordinates) return
      
      const cityKey = `${member.location}_${member.coordinates.lat}_${member.coordinates.lng}`
      if (cities.has(cityKey)) {
        const existing = cities.get(cityKey)!
        existing.members.push(member)
        existing.count++
      } else {
        cities.set(cityKey, {
          name: member.location,
          coordinates: member.coordinates,
          members: [member],
          count: 1
        })
      }
    })
    
    const result = Array.from(cities.values())
    console.log('Generated city data:', result.length, 'cities')
    return result
  }, [members])

  // Memoized marker creation with better performance
  const createCityMarker = useCallback((city: CityData, isDetailed: boolean = false) => {
    const markerKey = `${city.name}_${city.count}_${isDetailed}`
    
    if (isDetailed && city.count === 1) {
      // Individual member marker for single-member cities at high zoom
      const member = city.members[0]
      const iconHtml = `
        <div class="relative">
          <div class="w-10 h-10 rounded-full border-2 border-white shadow-lg ${getAvatarColorClass(member.color)} flex items-center justify-center text-white font-semibold text-xs">
            ${member.initials}
          </div>
        </div>
      `
      
      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
      })

      const popupContent = `
        <div class="p-3 min-w-[250px] max-w-[300px]">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-full ${getAvatarColorClass(member.color)} flex items-center justify-center text-white font-semibold text-sm">
              ${member.initials}
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 leading-tight">${member.name}</h3>
              <p class="text-sm text-gray-600 leading-tight">${member.title}</p>
            </div>
          </div>
          <div class="space-y-1 mb-3">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <span>📍</span>
              <span>${member.location}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <span>💼</span>
              <span>${member.industry}</span>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">${member.cohort}</span>
            <a href="/profile/${member.id}" class="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline">View Profile</a>
          </div>
        </div>
      `

      return L.marker([member.coordinates.lat, member.coordinates.lng], { icon: customIcon })
        .bindPopup(popupContent, { maxWidth: 320, className: 'custom-popup' })
    } else {
      // Clustered city marker for multiple members or low zoom
      const iconHtml = `
        <div class="relative">
          <div class="w-12 h-12 rounded-full border-3 border-white shadow-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm hover:bg-blue-700 transition-colors">
            ${city.count}
          </div>
          <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 bg-white px-2 py-0.5 rounded shadow-sm border whitespace-nowrap">
            ${city.name}
          </div>
        </div>
      `
      
      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-cluster-marker',
        iconSize: [48, 60],
        iconAnchor: [24, 30],
        popupAnchor: [0, -30],
      })

      const membersToShow = city.members.slice(0, 6)
      const remainingCount = city.members.length - membersToShow.length
      
      const membersHtml = membersToShow.map(member => `
        <div class="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
          <div class="w-8 h-8 rounded-full ${getAvatarColorClass(member.color)} flex items-center justify-center text-white font-medium text-xs">
            ${member.initials}
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-medium text-sm text-gray-900 truncate">${member.name}</div>
            <div class="text-xs text-gray-600 truncate">${member.title}</div>
          </div>
          <a href="/profile/${member.id}" class="text-blue-600 text-xs hover:text-blue-700 font-medium">View</a>
        </div>
      `).join('')

      const popupContent = `
        <div class="p-3 min-w-[300px] max-w-[350px]">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-lg">📍</span>
            <h3 class="font-semibold text-gray-900">${city.name}</h3>
            <span class="ml-auto text-sm text-gray-600 bg-blue-100 px-2 py-1 rounded-full">${city.count} members</span>
          </div>
          <div class="max-h-64 overflow-y-auto">
            ${membersHtml}
            ${remainingCount > 0 ? `<div class="text-center text-sm text-gray-500 py-2 border-t">+${remainingCount} more members</div>` : ''}
          </div>
        </div>
      `

      return L.marker([city.coordinates.lat, city.coordinates.lng], { icon: customIcon })
        .bindPopup(popupContent, { maxWidth: 380, className: 'custom-popup' })
    }
  }, [getAvatarColorClass])

  // Initialize map with optimized settings
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    console.log('Initializing map with members:', members.length)
    console.log('City data:', cityData.length)

    mapRef.current = L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629], // Center of India
      zoom: 5,
      minZoom: 3,
      maxZoom: 18,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      dragging: true,
      preferCanvas: true, // Use canvas for better performance
      zoomAnimation: true,
      fadeAnimation: true,
      markerZoomAnimation: true,
      renderer: L.canvas(), // Force canvas renderer for better performance
    })

    console.log('Map created successfully')

    // Add English-language tile layer with fallback
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
      minZoom: 3,
      subdomains: ['a', 'b', 'c'],
      updateWhenIdle: true,
      updateWhenZooming: false,
      keepBuffer: 3,
      crossOrigin: true,
    }).addTo(mapRef.current)

    // Add error handling for tile loading
    tileLayer.on('tileerror', (error) => {
      console.warn('Tile loading error:', error)
    })

    tileLayer.on('tileloadstart', () => {
      console.log('Tile loading started')
    })

    console.log('Tile layer added')

    // Initialize marker layer
    markersRef.current = L.layerGroup().addTo(mapRef.current)

    // Set initial zoom state
    setCurrentZoom(5)

    console.log('Map initialization complete')

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Memoized markers based on current zoom and city data
  const visibleMarkers = useMemo(() => {
    if (!cityData.length) {
      console.log('No city data available for markers')
      return []
    }
    
    console.log('Creating markers for', cityData.length, 'cities at zoom', currentZoom)
    const isDetailed = currentZoom > 8
    const markers = cityData.map(city => ({
      city,
      marker: createCityMarker(city, isDetailed),
      key: `${city.name}_${city.count}_${isDetailed}`
    }))
    
    console.log('Generated', markers.length, 'markers')
    return markers
  }, [cityData, currentZoom, createCityMarker])

  // Update markers when visible markers change
  useEffect(() => {
    if (!markersRef.current || !mapRef.current) return

    console.log('Updating markers, visible count:', visibleMarkers.length)

    // Clear existing markers
    markersRef.current.clearLayers()

    // Add new markers
    visibleMarkers.forEach(({ marker }, index) => {
      if (marker) {
        markersRef.current!.addLayer(marker)
        console.log(`Added marker ${index + 1}`)
      }
    })

    // Auto-fit bounds on first load
    if (visibleMarkers.length > 0 && currentZoom === 5) {
      const group = L.featureGroup(visibleMarkers.map(({ marker }) => marker).filter(Boolean))
      
      if (group.getLayers().length > 0 && mapRef.current) {
        mapRef.current.fitBounds(group.getBounds(), { 
          padding: [20, 20],
          maxZoom: 10
        })
        console.log('Fitted bounds to markers')
      }
    }

    // Force map to refresh
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize()
        console.log('Map size invalidated')
      }
    }, 100)
  }, [visibleMarkers, currentZoom])

  // Optimized zoom event handler
  useEffect(() => {
    if (!mapRef.current) return

    const handleZoomEnd = () => {
      if (mapRef.current) {
        setCurrentZoom(mapRef.current.getZoom())
      }
    }

    mapRef.current.on('zoomend', handleZoomEnd)

    return () => {
      if (mapRef.current) {
        mapRef.current.off('zoomend', handleZoomEnd)
      }
    }
  }, [])

  return (
    <div className="w-full h-full relative">
      <div 
        ref={mapContainerRef} 
        className="w-full h-full rounded-lg border border-gray-200"
        style={{ 
          minHeight: '500px', 
          backgroundColor: '#f8fafc',
          position: 'relative'
        }}
      />
      
      {/* Debug info */}
      {!mapRef.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Initializing map...</p>
          </div>
        </div>
      )}
      


      {/* Enhanced Stats Panel */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000] border">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={16} className="text-blue-600" />
          <span className="text-sm font-semibold text-gray-900">Overview</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Members:</span>
            <span className="text-sm font-bold text-blue-600">{members.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Cities:</span>
            <span className="text-sm font-bold text-green-600">{cityData.length}</span>
          </div>
        </div>
      </div>

      {/* Zoom Controls Enhancement */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 z-[1000] border">
        <div className="text-xs text-gray-500 text-center mb-1">
          {currentZoom <= 8 ? 'Zoom in for details' : 'Individual members visible'}
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
          <div className="w-16 h-1 bg-gray-200 rounded-full">
            <div 
              className="h-1 bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((currentZoom - 3) / 15 * 100, 100)}%` }}
            ></div>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </div>
    </div>
  )
}

export default MapView

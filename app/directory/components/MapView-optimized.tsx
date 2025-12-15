"use client"

import { useEffect, useRef, useCallback, useMemo } from 'react'
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

  // Memoized city-level data aggregation
  const cityData = useMemo(() => {
    const cities = new Map<string, CityData>()
    
    members.forEach(member => {
      if (!member.coordinates) return
      
      const cityName = member.location
      if (cities.has(cityName)) {
        const existing = cities.get(cityName)!
        existing.members.push(member)
        existing.count++
      } else {
        cities.set(cityName, {
          name: cityName,
          coordinates: member.coordinates,
          members: [member],
          count: 1
        })
      }
    })
    
    return Array.from(cities.values())
  }, [members])

  // Memoized marker creation
  const createCityMarker = useCallback((city: CityData, isDetailed: boolean = false) => {
    if (isDetailed && city.count === 1) {
      // Show individual member marker for single member cities
      const member = city.members[0]
      const iconHtml = `
        <div class="relative">
          <div class="w-10 h-10 rounded-full border-2 border-white shadow-lg ${getAvatarColorClass(member.color)} flex items-center justify-center text-white font-medium text-xs">
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
        <div class="p-3 min-w-[250px]">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-full ${getAvatarColorClass(member.color)} flex items-center justify-center text-white font-medium text-sm">
              ${member.initials}
            </div>
            <div>
              <h3 class="font-medium text-gray-900">${member.name}</h3>
              <p class="text-sm text-gray-600">${member.title}</p>
            </div>
          </div>
          <div class="space-y-1 mb-2">
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
            <span class="text-xs text-gray-500">${member.cohort}</span>
            <a href="/profile/${member.id}" class="text-blue-600 hover:text-blue-700 text-sm font-medium">View Profile</a>
          </div>
        </div>
      `

      return L.marker([member.coordinates.lat, member.coordinates.lng], { icon: customIcon })
        .bindPopup(popupContent, { maxWidth: 280, className: 'custom-popup' })
    } else {
      // Show clustered city marker
      const iconHtml = `
        <div class="relative">
          <div class="w-12 h-12 rounded-full border-3 border-white shadow-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            ${city.count}
          </div>
          <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 bg-white px-2 py-0.5 rounded shadow-sm border">
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

      const membersHtml = city.members.slice(0, 5).map(member => `
        <div class="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
          <div class="w-8 h-8 rounded-full ${getAvatarColorClass(member.color)} flex items-center justify-center text-white font-medium text-xs">
            ${member.initials}
          </div>
          <div class="flex-1">
            <div class="font-medium text-sm">${member.name}</div>
            <div class="text-xs text-gray-600">${member.title}</div>
          </div>
          <a href="/profile/${member.id}" class="text-blue-600 text-xs">View</a>
        </div>
      `).join('')

      const popupContent = `
        <div class="p-3 min-w-[300px] max-w-[350px]">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-lg">📍</span>
            <h3 class="font-semibold text-gray-900">${city.name}</h3>
            <span class="ml-auto text-sm text-gray-600">${city.count} members</span>
          </div>
          <div class="max-h-60 overflow-y-auto">
            ${membersHtml}
            ${city.members.length > 5 ? `<div class="text-center text-sm text-gray-500 py-2">+${city.members.length - 5} more members</div>` : ''}
          </div>
        </div>
      `

      return L.marker([city.coordinates.lat, city.coordinates.lng], { icon: customIcon })
        .bindPopup(popupContent, { maxWidth: 380, className: 'custom-popup' })
    }
  }, [getAvatarColorClass])

  // Initialize map with better performance settings
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    mapRef.current = L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629], // Center of India
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      dragging: true,
      preferCanvas: true, // Use canvas for better performance
      zoomAnimation: true,
      fadeAnimation: true,
      markerZoomAnimation: true,
    })

    // Add tile layer with better caching
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
      subdomains: ['a', 'b', 'c'],
      updateWhenIdle: true,
      updateWhenZooming: false,
      keepBuffer: 2,
    }).addTo(mapRef.current)

    // Initialize marker layer
    markersRef.current = L.layerGroup().addTo(mapRef.current)

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Update markers based on zoom level and city data
  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return

    // Clear existing markers
    markersRef.current.clearLayers()

    if (cityData.length === 0) return

    const currentZoom = mapRef.current.getZoom()
    const isDetailed = currentZoom > 8 // Show detailed markers when zoomed in

    // Add markers for each city
    cityData.forEach(city => {
      const marker = createCityMarker(city, isDetailed)
      if (marker) {
        markersRef.current!.addLayer(marker)
      }
    })

    // Fit bounds only on first load
    if (cityData.length > 0) {
      const group = L.featureGroup(cityData.map(city => 
        L.marker([city.coordinates.lat, city.coordinates.lng])
      ))
      
      if (group.getLayers().length > 0) {
        mapRef.current.fitBounds(group.getBounds(), { 
          padding: [20, 20],
          maxZoom: 10
        })
      }
    }
  }, [cityData, createCityMarker])

  // Add zoom event listener for dynamic detail loading
  useEffect(() => {
    if (!mapRef.current) return

    const handleZoomEnd = () => {
      if (!mapRef.current || !markersRef.current) return
      
      // Clear and reload markers based on new zoom level
      markersRef.current.clearLayers()
      
      const currentZoom = mapRef.current.getZoom()
      const isDetailed = currentZoom > 8

      cityData.forEach(city => {
        const marker = createCityMarker(city, isDetailed)
        if (marker) {
          markersRef.current!.addLayer(marker)
        }
      })
    }

    mapRef.current.on('zoomend', handleZoomEnd)

    return () => {
      if (mapRef.current) {
        mapRef.current.off('zoomend', handleZoomEnd)
      }
    }
  }, [cityData, createCityMarker])

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full rounded-lg" />
      
      {/* Map Legend */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <div className="flex items-center gap-2 mb-2">
          <Users size={16} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-900">Member Locations</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-3 h-3 rounded-full bg-blue-600 border border-white"></div>
            <span>Cities with members</span>
          </div>
          <div className="text-xs text-gray-500">
            Zoom in for individual members
          </div>
        </div>
      </div>

      {/* Total Members Counter */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-blue-600" />
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">{members.length}</div>
            <div className="text-xs text-gray-600">Total Members</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapView

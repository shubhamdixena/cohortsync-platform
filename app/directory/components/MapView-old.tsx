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
  const markersRef = useRef<L.Marker[]>([])

  const getAvatarColorClass = (color: string) => {
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
  }

  // Memoize the tile layer to prevent recreation
  const tileLayer = useMemo(() => {
    return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
      minZoom: 4,
      // Performance optimizations
      crossOrigin: true,
      keepBuffer: 3,
      maxNativeZoom: 18,
      // Caching improvements
      updateWhenZooming: false,
      updateWhenIdle: true,
      // Tile loading optimization
      detectRetina: true,
      // Pre-load tiles
      bounds: L.latLngBounds([6.4627, 68.1097], [35.5137, 97.4152]), // India bounds
    })
  }, [])

  useEffect(() => {
    if (!mapContainerRef.current) return

    // Initialize map only once
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [20.5937, 78.9629], // Center of India
        zoom: 5,
        minZoom: 4,
        maxZoom: 16,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true,
        touchZoom: true,
        boxZoom: true,
        keyboard: true,
        // Performance optimizations
        preferCanvas: false,
        // Zoom animation
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true,
        // Interaction improvements
        wheelPxPerZoomLevel: 60,
        zoomSnap: 0.25,
        zoomDelta: 0.25,
      })

      // Add tile layer
      tileLayer.addTo(mapRef.current)

      // Add zoom control with custom position and styling
      mapRef.current.zoomControl.setPosition('topright')
      
      // Preload nearby tiles for better performance
      mapRef.current.on('zoomend moveend', () => {
        if (mapRef.current) {
          const bounds = mapRef.current.getBounds()
          const zoom = mapRef.current.getZoom()
          // Prefetch tiles at current zoom level
          tileLayer.redraw()
        }
      })
    }

    // Clear existing markers efficiently
    markersRef.current.forEach(marker => {
      if (mapRef.current) {
        mapRef.current.removeLayer(marker)
      }
    })
    markersRef.current = []

    // Add markers for members
    members.forEach((member) => {
      if (member.coordinates && mapRef.current) {
        // Create optimized custom icon
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
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
        })

        // Create optimized popup content
        const popupContent = `
          <div class="p-3 min-w-[280px]">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-full ${getAvatarColorClass(member.color)} flex items-center justify-center text-white font-medium text-sm">
                ${member.initials}
              </div>
              <div>
                <h3 class="font-medium text-gray-900">${member.name}</h3>
                <p class="text-sm text-gray-600">${member.title}</p>
              </div>
            </div>
            <div class="space-y-2 mb-3">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <span class="w-4 h-4 flex items-center justify-center">📍</span>
                <span>${member.location}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <span class="w-4 h-4 flex items-center justify-center">💼</span>
                <span>${member.industry}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <span class="w-4 h-4 flex items-center justify-center">👥</span>
                <span>${member.cohort}</span>
              </div>
            </div>
            <div class="flex flex-wrap gap-1 mb-3">
              ${member.skills.slice(0, 3).map(skill => `<span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">${skill}</span>`).join('')}
              ${member.skills.length > 3 ? `<span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">+${member.skills.length - 3} more</span>` : ''}
            </div>
            <div class="flex justify-end">
              <a href="/profile/${member.id}" class="text-blue-600 hover:text-blue-700 text-sm font-medium">View Profile</a>
            </div>
          </div>
        `

        // Add marker to map
        const marker = L.marker([member.coordinates.lat, member.coordinates.lng], {
          icon: customIcon,
          riseOnHover: true,
        }).addTo(mapRef.current)

        marker.bindPopup(popupContent, {
          maxWidth: 300,
          className: 'custom-popup',
          closeButton: true,
          autoPan: true,
          autoPanPadding: [10, 10],
        })

        markersRef.current.push(marker)
      }
    })

    // Fit map to show all markers with better bounds
    if (members.length > 0 && markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current)
      mapRef.current.fitBounds(group.getBounds(), { 
        padding: [30, 30],
        maxZoom: 10
      })
    }

  }, [members, tileLayer, getAvatarColorClass])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      markersRef.current = []
    }
  }, [])

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full rounded-lg" />
      
      {/* Map Info Panel */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1000]">
        <div className="flex items-center gap-2 mb-2">
          <Users size={16} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-900">Members</span>
        </div>
        <div className="text-sm text-gray-600">
          {members.length} locations across India
        </div>
      </div>

      {/* Total Members Counter */}
      <div className="absolute top-4 right-14 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1000]">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-blue-600" />
          <div className="text-right">
            <div className="text-lg font-medium text-blue-600">{members.length}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapView

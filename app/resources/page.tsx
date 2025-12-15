"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Download, ExternalLink, BookOpen, FileText, Video, LinkIcon } from "lucide-react"

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources')
      if (response.ok) {
        const data = await response.json()
        setResources(data)
      }
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (resourceId: string) => {
    try {
      await fetch(`/api/resources/${resourceId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'download' })
      })
      fetchResources() // Refresh to show updated download count
    } catch (error) {
      console.error('Error tracking download:', error)
    }
  }

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (resource.tags && JSON.parse(resource.tags).some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())))

    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText size={14} />
      case "video":
        return <Video size={14} />
      case "link":
        return <LinkIcon size={14} />
      default:
        return <BookOpen size={14} />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "business":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "technology":
        return "bg-indigo-100 text-indigo-700 border-indigo-200"
      case "marketing":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "finance":
        return "bg-amber-100 text-amber-700 border-amber-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Resource Library</h1>
            <p className="text-xs text-gray-600">Discover valuable resources shared by the community</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search resources by title, description, or tags..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-500 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="text-gray-400" size={14} />
            <select
              className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-xs"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="business">Business</option>
              <option value="technology">Technology</option>
              <option value="marketing">Marketing</option>
              <option value="finance">Finance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-gray-100 rounded-lg text-gray-600">{getResourceIcon(resource.type)}</div>
                <div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(resource.category)}`}
                  >
                    {resource.category}
                  </span>
                </div>
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={() => handleDownload(resource.id)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Download size={12} />
                </button>
                {resource.url && (
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>

            <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-xs">{resource.title}</h3>
            <p className="text-gray-600 text-xs mb-3 line-clamp-3">{resource.description}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {(Array.isArray(resource.tags) ? resource.tags : JSON.parse(resource.tags || '[]')).map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                  {resource.author.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs text-gray-600">{resource.author}</span>
              </div>
              <span className="text-xs text-gray-500">{resource.downloadCount} downloads</span>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-3">
            <BookOpen size={32} className="mx-auto" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">No resources found</h3>
          <p className="text-xs text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}

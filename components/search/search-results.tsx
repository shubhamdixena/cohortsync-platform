"use client"

import { Search, User, FileText } from "lucide-react"

interface SearchResultsProps {
  query: string
}

const mockResults = [
  {
    id: 1,
    type: "member",
    title: "Sarah Chen",
    description: "UX Designer at DesignStudio",
    icon: User,
  },
  {
    id: 2,
    type: "post",
    title: "Sustainability Dashboard Launch",
    description: "Just launched our new sustainability dashboard...",
    icon: FileText,
  },
  {
    id: 3,
    type: "member",
    title: "Michael Rodriguez",
    description: "Software Engineer at StartupXYZ",
    icon: User,
  },
]

export default function SearchResults({ query }: SearchResultsProps) {
  const filteredResults = mockResults.filter(
    (result) =>
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.description.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <Search size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">Search results for "{query}"</span>
        </div>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {filteredResults.length > 0 ? (
          filteredResults.map((result) => (
            <div
              key={result.id}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <result.icon size={16} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{result.title}</p>
                  <p className="text-xs text-gray-500">{result.description}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            <p className="text-sm">No results found for "{query}"</p>
          </div>
        )}
      </div>
    </div>
  )
}

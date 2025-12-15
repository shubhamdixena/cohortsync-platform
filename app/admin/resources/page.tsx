"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  Star,
  Upload,
  FileText,
  ExternalLink,
  Calendar,
  User,
  MoreVertical,
  BarChart3,
} from "lucide-react"
import { useUser } from "@/lib/user-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ResourcesManagement() {
  const { userInfo } = useUser()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedResource, setSelectedResource] = useState(null)
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    category: "",
    url: "",
    file: null,
    tags: "",
    accessLevel: "all",
    featured: false,
  })

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/resources')
      if (response.ok) {
        const data = await response.json()
        setResources(data || [])
      }
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddResource = async () => {
    if (!newResource.title || !newResource.category) {
      alert('Title and category are required')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newResource.title,
          description: newResource.description,
          category: newResource.category,
          type: newResource.file ? 'PDF' : 'Link',
          url: newResource.url || null,
          featured: newResource.featured,
          accessLevel: newResource.accessLevel,
          tags: newResource.tags ? newResource.tags.split(',').map(t => t.trim()) : null
        })
      })

      if (response.ok) {
        alert('Resource added successfully')
        setShowAddDialog(false)
        setNewResource({
          title: "",
          description: "",
          category: "",
          url: "",
          file: null,
          tags: "",
          accessLevel: "all",
          featured: false,
        })
        fetchResources()
      } else {
        const error = await response.json()
        alert('Failed to add resource: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error adding resource:', error)
      alert('Error adding resource')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditResource = async () => {
    if (!newResource.title || !newResource.category) {
      alert('Title and category are required')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`/api/resources/${selectedResource.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newResource.title,
          description: newResource.description,
          category: newResource.category,
          url: newResource.url || null,
          featured: newResource.featured,
          accessLevel: newResource.accessLevel,
          tags: newResource.tags ? newResource.tags.split(',').map(t => t.trim()) : null
        })
      })

      if (response.ok) {
        alert('Resource updated successfully')
        setShowEditDialog(false)
        setSelectedResource(null)
        fetchResources()
      } else {
        const error = await response.json()
        alert('Failed to update resource: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error updating resource:', error)
      alert('Error updating resource')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteResource = async () => {
    setSubmitting(true)
    try {
      const response = await fetch(`/api/resources/${selectedResource.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Resource deleted successfully')
        setShowDeleteDialog(false)
        setSelectedResource(null)
        fetchResources()
      } else {
        const error = await response.json()
        alert('Failed to delete resource: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error deleting resource:', error)
      alert('Error deleting resource')
    } finally {
      setSubmitting(false)
    }
  }

  const openEditDialog = (resource) => {
    setSelectedResource(resource)
    setNewResource({
      title: resource.title,
      description: resource.description,
      category: resource.category,
      url: resource.url || "",
      file: null,
      tags: resource.tags || "",
      accessLevel: resource.accessLevel || "all",
      featured: resource.featured || false,
    })
    setShowEditDialog(true)
  }

  const openViewDialog = (resource) => {
    setSelectedResource(resource)
    setShowViewDialog(true)
  }

  const openDeleteDialog = (resource) => {
    setSelectedResource(resource)
    setShowDeleteDialog(true)
  }

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Resource Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage and organize resources, documents, and learning materials for your community.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button onClick={() => setShowAddDialog(true)} size="sm">
              <Plus size={14} className="mr-1" /> Add Resource
            </Button>
            <Button variant="outline" size="sm">
              <Upload size={14} className="mr-1" /> Bulk Upload
            </Button>
          </div>
        </div>
      </div>

      {/* Resource Categories */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("all")}
              className={`${activeTab === "all" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-3 px-4 border-b-2 font-medium text-xs`}
            >
              All Resources <span className="ml-1 bg-gray-100 text-gray-700 py-0.5 px-2 rounded-full text-xs">45</span>
            </button>
            <button
              onClick={() => setActiveTab("guides")}
              className={`${activeTab === "guides" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-3 px-4 border-b-2 font-medium text-xs`}
            >
              Guides <span className="ml-1 bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full text-xs">12</span>
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`${activeTab === "templates" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-3 px-4 border-b-2 font-medium text-xs`}
            >
              Templates <span className="ml-1 bg-green-100 text-green-800 py-0.5 px-2 rounded-full text-xs">8</span>
            </button>
            <button
              onClick={() => setActiveTab("tools")}
              className={`${activeTab === "tools" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-3 px-4 border-b-2 font-medium text-xs`}
            >
              Tools <span className="ml-1 bg-purple-100 text-purple-800 py-0.5 px-2 rounded-full text-xs">15</span>
            </button>
            <button
              onClick={() => setActiveTab("featured")}
              className={`${activeTab === "featured" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-3 px-4 border-b-2 font-medium text-xs`}
            >
              Featured <span className="ml-1 bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full text-xs">10</span>
            </button>
          </nav>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full bg-gray-100 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Search size={16} />
              </div>
            </div>
            <div className="flex space-x-2">
              <select className="bg-gray-100 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white">
                <option value="">All Categories</option>
                <option value="funding">Funding</option>
                <option value="legal">Legal</option>
                <option value="marketing">Marketing</option>
                <option value="operations">Operations</option>
              </select>
              <select className="bg-gray-100 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white">
                <option value="">All Formats</option>
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
                <option value="link">External Link</option>
                <option value="document">Document</option>
              </select>
              <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200">
                <Filter size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className={`border rounded-lg p-4 transition-all hover:shadow-md hover:-translate-y-1 ${resource.featured ? "border-yellow-200 bg-yellow-50" : "border-gray-200"}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    <FileText size={24} />
                  </div>
                  <div className="flex items-center space-x-1">
                    {resource.featured && <Star size={16} className="text-yellow-500 fill-current" />}
                    <Badge variant={resource.featured ? "default" : "secondary"}>
                      {resource.featured ? "Featured" : resource.category}
                    </Badge>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{resource.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>
                    {resource.type}
                    {resource.size && ` • ${resource.size}`}
                  </span>
                  <span>{resource.downloads} downloads</span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center">
                    <User size={12} className="mr-1" />
                    <span>{resource.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1" onClick={() => openViewDialog(resource)}>
                    <Eye size={14} className="mr-1" /> View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(resource)}>
                    <Edit size={14} />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline">
                        <MoreVertical size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => console.log("Download", resource.title)}>
                        <Download size={14} className="mr-2" /> Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => console.log("Feature", resource.title)}>
                        <Star size={14} className="mr-2" /> {resource.featured ? "Unfeature" : "Feature"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => console.log("Duplicate", resource.title)}>
                        <FileText size={14} className="mr-2" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openDeleteDialog(resource)} className="text-red-600">
                        <Trash2 size={14} className="mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of{" "}
                <span className="font-medium">45</span> resources
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="bg-white text-gray-500 px-3 py-1 rounded-md text-sm border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm border border-blue-300 hover:bg-blue-100">
                1
              </button>
              <button className="bg-white text-gray-700 px-3 py-1 rounded-md text-sm border border-gray-300 hover:bg-gray-50">
                2
              </button>
              <button className="bg-white text-gray-700 px-3 py-1 rounded-md text-sm border border-gray-300 hover:bg-gray-50">
                3
              </button>
              <span className="text-gray-500">...</span>
              <button className="bg-white text-gray-700 px-3 py-1 rounded-md text-sm border border-gray-300 hover:bg-gray-50">
                8
              </button>
              <button className="bg-white text-gray-700 px-3 py-1 rounded-md text-sm border border-gray-300 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Resource Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Resource Title *</Label>
              <Input
                id="title"
                value={newResource.title}
                onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                placeholder="Enter resource title"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                rows={4}
                value={newResource.description}
                onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                placeholder="Enter resource description"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newResource.category}
                  onValueChange={(value) => setNewResource({ ...newResource, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="funding">Funding</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="accessLevel">Access Level</Label>
                <Select
                  value={newResource.accessLevel}
                  onValueChange={(value) => setNewResource({ ...newResource, accessLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Members</SelectItem>
                    <SelectItem value="premium">Premium Members</SelectItem>
                    <SelectItem value="admin">Admins Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="url">URL (Optional)</Label>
              <Input
                id="url"
                type="url"
                value={newResource.url}
                onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <Label htmlFor="file">Upload File (Optional)</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setNewResource({ ...newResource, file: e.target.files?.[0] || null })}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xlsx,.zip"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, DOC, DOCX, PPT, PPTX, XLSX, ZIP (Max 10MB)
              </p>
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={newResource.tags}
                onChange={(e) => setNewResource({ ...newResource, tags: e.target.value })}
                placeholder="Enter tags separated by commas"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={newResource.featured}
                onCheckedChange={(checked) => setNewResource({ ...newResource, featured: checked })}
              />
              <Label htmlFor="featured">Feature this resource</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddResource}>Add Resource</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Resource Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label htmlFor="edit-title">Resource Title *</Label>
              <Input
                id="edit-title"
                value={newResource.title}
                onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                placeholder="Enter resource title"
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                rows={4}
                value={newResource.description}
                onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                placeholder="Enter resource description"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={newResource.category}
                  onValueChange={(value) => setNewResource({ ...newResource, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="funding">Funding</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-accessLevel">Access Level</Label>
                <Select
                  value={newResource.accessLevel}
                  onValueChange={(value) => setNewResource({ ...newResource, accessLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Members</SelectItem>
                    <SelectItem value="premium">Premium Members</SelectItem>
                    <SelectItem value="admin">Admins Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-url">URL (Optional)</Label>
              <Input
                id="edit-url"
                type="url"
                value={newResource.url}
                onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <Label htmlFor="edit-file">Replace File (Optional)</Label>
              <Input
                id="edit-file"
                type="file"
                onChange={(e) => setNewResource({ ...newResource, file: e.target.files?.[0] || null })}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xlsx,.zip"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to keep current file. Supported formats: PDF, DOC, DOCX, PPT, PPTX, XLSX, ZIP (Max 10MB)
              </p>
            </div>

            <div>
              <Label htmlFor="edit-tags">Tags</Label>
              <Input
                id="edit-tags"
                value={newResource.tags}
                onChange={(e) => setNewResource({ ...newResource, tags: e.target.value })}
                placeholder="Enter tags separated by commas"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-featured"
                checked={newResource.featured}
                onCheckedChange={(checked) => setNewResource({ ...newResource, featured: checked })}
              />
              <Label htmlFor="edit-featured">Feature this resource</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditResource}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Resource Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resource Details</DialogTitle>
          </DialogHeader>
          {selectedResource && (
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <FileText size={32} />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{selectedResource.title}</h3>
                    {selectedResource.featured && <Star size={20} className="text-yellow-500 fill-current" />}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <Badge>{selectedResource.category}</Badge>
                    <span>{selectedResource.type}</span>
                    {selectedResource.size && <span>{selectedResource.size}</span>}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-sm text-gray-600">{selectedResource.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Author:</span>
                      <span>{selectedResource.author}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Created:</span>
                      <span>{new Date(selectedResource.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Downloads:</span>
                      <span>{selectedResource.downloads}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Access Level:</span>
                      <span className="capitalize">{selectedResource.accessLevel}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedResource.tags?.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {selectedResource.url && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">External Link</h4>
                  <a
                    href={selectedResource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    {selectedResource.url}
                  </a>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowViewDialog(false)
                    openEditDialog(selectedResource)
                  }}
                >
                  Edit Resource
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedResource?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteResource} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Resource Management Tools */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Resource Management Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md hover:-translate-y-1">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Plus size={20} />
              </div>
              <h3 className="ml-3 text-sm font-medium text-gray-900">Bulk Resource Upload</h3>
            </div>
            <p className="text-xs text-gray-600 mb-4">
              Upload multiple resources at once using our bulk upload tool with automatic categorization.
            </p>
            <button className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              Bulk Upload
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md hover:-translate-y-1">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Star size={20} />
              </div>
              <h3 className="ml-3 text-sm font-medium text-gray-900">Featured Resources</h3>
            </div>
            <p className="text-xs text-gray-600 mb-4">
              Manage featured resources that appear prominently in your community resource library.
            </p>
            <button className="w-full bg-green-600 text-white py-2 rounded-md text-sm font-medium hover:bg-green-700">
              Manage Featured
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md hover:-translate-y-1">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <BarChart3 size={20} />
              </div>
              <h3 className="ml-3 text-sm font-medium text-gray-900">Resource Analytics</h3>
            </div>
            <p className="text-xs text-gray-600 mb-4">
              View detailed analytics on resource usage, downloads, and member engagement with your content.
            </p>
            <button className="w-full bg-purple-600 text-white py-2 rounded-md text-sm font-medium hover:bg-purple-700">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

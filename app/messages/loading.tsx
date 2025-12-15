import { Skeleton } from "@/components/ui/skeleton"

export default function MessagesLoading() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-64 hidden md:block">
        <Skeleton className="h-screen w-full" />
      </div>

      <div className="flex-1 md:ml-64">
        <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
          <div className="flex flex-col md:flex-row">
            {/* Left Sidebar - Message List */}
            <div className="w-full md:w-1/3 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <Skeleton className="h-7 w-40 mb-4" />
                <Skeleton className="h-10 w-full mb-4" />
                <div className="flex space-x-2">
                  <Skeleton className="h-9 w-32" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>

              <div className="px-4 py-2 border-b border-gray-200">
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-8 w-16 rounded-full" />
                  ))}
                </div>
              </div>

              <div className="h-[calc(100vh-250px)] p-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="mb-4">
                    <div className="flex items-start">
                      <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                      <div className="ml-3 flex-grow">
                        <div className="flex justify-between mb-2">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-10" />
                        </div>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Chat Area */}
            <div className="w-full md:w-2/3">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="ml-3">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="w-8 h-8 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 h-[calc(100vh-300px)]">
                <div className="flex justify-center mb-4">
                  <Skeleton className="h-6 w-32 rounded-full" />
                </div>

                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : ""} mb-4`}>
                    {i % 2 !== 0 && <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />}
                    <div className={`${i % 2 !== 0 ? "ml-2" : ""} max-w-xs md:max-w-md`}>
                      <Skeleton className={`h-20 w-64 rounded-lg`} />
                      <div className={`flex ${i % 2 === 0 ? "justify-end" : ""} mt-1`}>
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex items-end">
                  <Skeleton className="w-10 h-10 rounded-full mr-2" />
                  <Skeleton className="flex-grow h-24 rounded-lg" />
                  <Skeleton className="w-10 h-10 rounded-full ml-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

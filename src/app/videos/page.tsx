export default function VideosPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Videolar</h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Video kartları buraya gelecek */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-video bg-gray-100">
              {/* Video thumbnail gelecek */}
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Örnek Video Başlığı
              </h2>
              <p className="text-gray-600 mb-4">
                Bu bir örnek video açıklamasıdır...
              </p>
              <div className="text-sm text-gray-500">5 dakika</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 
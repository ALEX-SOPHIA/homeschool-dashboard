import { seedTestFamily } from '@/app/actions';

export default function SeedDatabasePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center border-2 border-dashed border-blue-400">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Database Testing Area 🧪
        </h1>
        <p className="mb-8 text-gray-600">
          This is a temporary hidden route used only for development.
        </p>
        
        {/* We use a form to trigger the Server Action */}
        <form action={seedTestFamily}>
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Inject Test Data (Family & Students)
          </button>
        </form>
      </div>
    </main>
  );
}
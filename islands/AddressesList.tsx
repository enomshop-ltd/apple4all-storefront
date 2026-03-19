import { useState } from "preact/hooks";
import { Plus, Edit2, Trash2 } from "lucide-react";

export function AddressesList({ initialAddresses }: { initialAddresses: any[] }) {
  const [addresses, setAddresses] = useState(initialAddresses || []);

  return (
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div key={addr.id} class="border border-gray-200 rounded-xl p-6 flex flex-col h-full relative group">
            <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Edit2 class="w-4 h-4" />
              </button>
              <button class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
            
            <h3 class="font-semibold text-gray-900 mb-2">{addr.first_name} {addr.last_name}</h3>
            <div class="text-sm text-gray-600 space-y-1 flex-1">
              {addr.company && <p>{addr.company}</p>}
              <p>{addr.address_1}</p>
              {addr.address_2 && <p>{addr.address_2}</p>}
              <p>{addr.city}, {addr.province} {addr.postal_code}</p>
              <p>{addr.country_code?.toUpperCase()}</p>
              <p class="pt-2">{addr.phone}</p>
            </div>
          </div>
        ))}

        <button class="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 transition-colors min-h-[200px] gap-3">
          <div class="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm border border-gray-100">
            <Plus class="w-5 h-5" />
          </div>
          <span class="font-medium">Add new address</span>
        </button>
      </div>
    </div>
  );
}

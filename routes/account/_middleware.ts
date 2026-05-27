const pubKey = Deno.env.get("MEDUSA_PUBLISHABLE_KEY") || "";

    try {
      const [ordersResult, repairsRes] = await Promise.all([
        medusa.store.order.list(
          { fields: "*items,*items.metadata" },
          { Authorization: `Bearer ${token}` },
        ),
        fetch(`${medusaUrl}/store/customers/me/repairs`, {
          headers: { 
            "Authorization": `Bearer ${token}`,
            "x-publishable-api-key": pubKey 
          },
        }),
      ]);
      
      // ... rest of your existing logic
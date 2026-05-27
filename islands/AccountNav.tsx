export function AccountNav({ currentPath }: { currentPath: string }) {
  const navItems = [
    { name: "Overview", href: "/account" },
    { name: "Profile", href: "/account/profile" },
    { name: "Addresses", href: "/account/addresses" },
    { name: "Orders", href: "/account/orders" },
  ];

  const handleLogout = async () => {
    // Implement logout logic
    await fetch("/api/auth/logout", { method: "POST" });
    globalThis.location.href = "/login";
  };

  return (
    <div>
      <div class="text-2xl font-bold mb-8">Account</div>
      <nav class="flex flex-col gap-y-4">
        {navItems.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <a
              key={item.name}
              href={item.href}
              f-client-nav
              class={`text-base transition-colors ${
                isActive
                  ? "text-gray-900 font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {item.name}
            </a>
          );
        })}
        <button
          type="button"
          onClick={handleLogout}
          class="text-base text-gray-500 hover:text-gray-900 transition-colors text-left"
        >
          Log out
        </button>
      </nav>
    </div>
  );
}

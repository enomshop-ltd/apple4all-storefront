import { useState } from "preact/hooks";

export default function Image({ src, alt, class: className, ...props }: any) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div class={`relative overflow-hidden bg-gray-200 ${className || ''}`}>
      {!isLoaded && (
        <div class="absolute inset-0 animate-pulse bg-gray-300" />
      )}
      <img
        src={src}
        alt={alt}
        class={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
}

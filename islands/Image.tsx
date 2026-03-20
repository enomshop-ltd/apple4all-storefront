import { useState } from "preact/hooks";
import { JSX } from "preact";

export default function Image({ src, alt, class: className, ...props }: JSX.HTMLAttributes<HTMLImageElement> & { src: string; alt: string; class?: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div class={`relative overflow-hidden bg-gray-200 ${className || ''}`}>
      {!isLoaded && (
        <div class="absolute inset-0 animate-pulse bg-gray-300" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        class={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
}

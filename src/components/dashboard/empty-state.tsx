import Image from "next/image";

export function EmptyState({ src, alt, title, description }: { src: string; alt: string; title: string; description?: string }) {
  return <div className="flex flex-col items-center gap-3 py-6 text-center">
    <Image src={src} alt={alt} width={240} height={160} sizes="240px" className="h-32 w-48 rounded-md object-cover" />
    <div><p className="font-semibold text-gray-700">{title}</p>{description && <p className="mt-1 text-sm text-gray-500">{description}</p>}</div>
  </div>;
}

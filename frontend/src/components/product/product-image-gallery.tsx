import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ProductImageGalleryProps {
  images: Array<{ id: number; image: string }>;
  mainImage: string;
  variantName: string;
  discountPercentage: number;
}

export function ProductImageGallery({
  images,
  mainImage,
  variantName,
  discountPercentage,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const displayImage = images[selectedImage]?.image || mainImage;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-2 md:p-4">
        <div className="relative aspect-square bg-muted/30 rounded-lg overflow-hidden mb-2 md:mb-4">
          {discountPercentage !== 0 && (
            <Badge className="absolute top-2 left-2 md:top-4 md:left-4 z-10 bg-primary text-sm md:text-lg px-2 md:px-3 py-0.5 md:py-1">
              -{discountPercentage}%
            </Badge>
          )}
          <img
            src={displayImage}
            alt={variantName}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="grid grid-cols-4 md:grid-cols-4 gap-1.5 md:gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square border-2 rounded-md md:rounded-lg overflow-hidden transition-all ${
                selectedImage === index
                  ? "border-primary"
                  : "border-muted hover:border-muted-foreground"
              }`}
            >
              <img
                src={image.image}
                alt={`${variantName} ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


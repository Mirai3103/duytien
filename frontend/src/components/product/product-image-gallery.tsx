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
      <CardContent className="p-4">
        <div className="relative aspect-square bg-muted/30 rounded-lg overflow-hidden mb-4">
          {discountPercentage !== 0 && (
            <Badge className="absolute top-4 left-4 z-10 bg-primary text-lg px-3 py-1">
              -{discountPercentage}%
            </Badge>
          )}
          <img
            src={displayImage}
            alt={variantName}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square border-2 rounded-lg overflow-hidden transition-all ${
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


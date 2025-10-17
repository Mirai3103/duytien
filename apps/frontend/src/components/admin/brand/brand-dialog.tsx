import { useEffect, useState } from "react";
import slugify from "slugify";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUploadPreview from "@/components/ImageUploadPreview";
import { uploadFile } from "@/lib/file";
import type { IBrand } from "./brands-table";
interface BrandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand?: IBrand | null;
  onSave: (data: {
    id?: number;
    name: string;
    slug: string;
    logo?: string;
  }) => void;
}

export function BrandDialog({
  open,
  onOpenChange,
  brand,
  onSave,
}: BrandDialogProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logo, setLogo] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [originalLogo, setOriginalLogo] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (open) {
      if (brand) {
        // Edit mode
        setName(brand.name);
        setSlug(brand.slug);
        setLogo(brand.logo || "");
        setOriginalLogo(brand.logo || "");
        setLogoFile(null);
      } else {
        // Add mode
        setName("");
        setSlug("");
        setLogo("");
        setOriginalLogo("");
        setLogoFile(null);
      }
    }
  }, [open, brand]);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!brand) {
      // Auto-generate slug only when creating new brand
      setSlug(slugify(value));
    }
  };

  const handleLogoUpload = (file: File | null) => {
    setLogoFile(file);
  };

  const handleSave = async () => {
    let finalLogoUrl = logo;

    // Check if we need to upload a new file
    if (logoFile) {
      // There's a new file to upload
      setIsUploading(true);
      try {
        const uploadedUrl = await uploadFile(logoFile);
        finalLogoUrl = uploadedUrl;
      } catch (error) {
        console.error("Upload failed:", error);
        // Don't save if upload fails
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    } else if (logoFile === null && originalLogo) {
      // File was removed
      finalLogoUrl = "";
    }
    // If logoFile is undefined, keep the current logo value

    onSave({
      id: brand?.id,
      name,
      slug,
      logo: finalLogoUrl || undefined,
    });
    onOpenChange(false);
  };

  const isFormValid = name.trim() && slug.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {brand ? "Sửa thương hiệu" : "Thêm thương hiệu mới"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {brand ? "Cập nhật thông tin thương hiệu" : "Tạo thương hiệu mới"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Name Input */}
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-foreground">
              Tên thương hiệu <span className="text-red-500">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Nhập tên thương hiệu"
              className="bg-card border-border text-foreground"
            />
          </div>

          {/* Slug Input */}
          <div className="grid gap-2">
            <Label htmlFor="slug" className="text-foreground">
              Slug <span className="text-red-500">*</span>
            </Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="ten-thuong-hieu"
              className="bg-card border-border text-foreground"
            />
            <p className="text-xs text-muted-foreground">
              URL thân thiện, tự động tạo từ tên
            </p>
          </div>

          {/* Logo Upload */}
          <div className="grid gap-2">
            <Label className="text-foreground">Logo thương hiệu</Label>
            <ImageUploadPreview
              defaultValue={logo}
              file={logoFile}
              onChange={handleLogoUpload}
              disabled={isUploading}
              className="h-32"
              imageClassName="h-32"
            />
            <p className="text-xs text-muted-foreground">
              Kéo thả hình ảnh hoặc click để chọn file
            </p>
          </div>

          {/* Manual URL Input (Alternative) */}
          <div className="grid gap-2">
            <Label htmlFor="logo-url" className="text-foreground">
              Hoặc nhập URL logo
            </Label>
            <Input
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="bg-card border-border text-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Đường dẫn URL tới logo thương hiệu
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border bg-transparent"
            disabled={isUploading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isFormValid || isUploading}
            className="bg-primary hover:bg-primary/90"
          >
            {isUploading ? "Đang tải lên..." : brand ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

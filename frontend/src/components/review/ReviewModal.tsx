import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTRPC } from "@/lib/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const reviewSchema = z.object({
  rating: z.number().min(1, "Vui lòng chọn số sao").max(5),
  comment: z.string().min(10, "Nhận xét phải có ít nhất 10 ký tự"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variantId: number | null;
  productName?: string;
  productId?: number;
  onSuccess?: () => void;
}

export function ReviewModal({
  open,
  onOpenChange,
  variantId,
  productName,
  productId,
  onSuccess,
}: ReviewModalProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const reviewForm = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  // Create review mutation
  const createReviewMutation = useMutation(
    trpc.review.createReview.mutationOptions({
      onSuccess: () => {
        toast.success("Đánh giá thành công!");
        onOpenChange(false);
        reviewForm.reset();
        
        // Invalidate relevant queries
        queryClient.invalidateQueries();
        
        // Call custom success callback if provided
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error?.message || "Có lỗi xảy ra khi đánh giá");
      },
    })
  );

  const handleSubmitReview = (values: ReviewFormValues) => {
    if (!variantId) return;
    createReviewMutation.mutate({
      ...values,
      variantId,
    });
  };

  // Reset form when modal opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      reviewForm.reset({ rating: 0, comment: "" });
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Đánh giá sản phẩm</DialogTitle>
          <DialogDescription>
            {productName || "Chia sẻ trải nghiệm của bạn về sản phẩm này"}
          </DialogDescription>
        </DialogHeader>

        <Form {...reviewForm}>
          <form
            onSubmit={reviewForm.handleSubmit(handleSubmitReview)}
            className="space-y-6"
          >
            {/* Rating Field */}
            <FormField
              control={reviewForm.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đánh giá của bạn</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => field.onChange(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= field.value
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comment Field */}
            <FormField
              control={reviewForm.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhận xét của bạn</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={createReviewMutation.isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={createReviewMutation.isPending}>
                {createReviewMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Gửi đánh giá
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


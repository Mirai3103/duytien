import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Loader2 } from "lucide-react";
import { useTRPC, useTRPCClient } from "@/lib/trpc";
import { useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { ReviewModal } from "@/components/review/ReviewModal";

interface ReviewsTabProps {
  productId: number;
  variantId: number;
}

export function ReviewsTab({ productId, variantId }: ReviewsTabProps) {
  const trpc = useTRPC();
  const trpcClient = useTRPCClient();
  const queryClient = useQueryClient();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  // Fetch product review stats
  const { data: stats, isLoading: statsLoading } = useQuery(
    trpc.review.getProductReviewStats.queryOptions({ productId })
  );

  // Check if user can review (only for logged-in users)
  const { data: canReviewVariantIds } = useQuery({
    ...trpc.review.checkCanReview.queryOptions({ productId }),
    retry: false, // Don't retry on auth error
  });

  const handleOpenReviewDialog = () => {
    setReviewDialogOpen(true);
  };

  const handleReviewSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["reviews", "product", variantId] });
    queryClient.invalidateQueries(
      trpc.review.getProductReviewStats.queryOptions({ productId }) as any
    );
    queryClient.invalidateQueries(
      trpc.review.checkCanReview.queryOptions({ productId }) as any
    );
  };

  // Fetch reviews with infinite scroll
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["reviews", "product", variantId],
    queryFn: async ({ pageParam }) => {
      return await trpcClient.review.getReviewsOfProduct.query({
        variantId,
        limit: 10,
        cursor: pageParam,
      });
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as number | undefined,
  });

  const reviews = useMemo(
    () => reviewsData?.pages.flatMap((page) => page.reviews) ?? [],
    [reviewsData]
  );

  const ratingDistribution = useMemo(() => {
    if (!stats) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const total = stats.totalReviews || 1;
    return {
      5: Math.round((stats.total5Stars / total) * 100),
      4: Math.round((stats.total4Stars / total) * 100),
      3: Math.round((stats.total3Stars / total) * 100),
      2: Math.round((stats.total2Stars / total) * 100),
      1: Math.round((stats.total1Stars / total) * 100),
    };
  }, [stats]);

  const isLoading = statsLoading || reviewsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats || stats.totalReviews === 0) {
    return (
      <>
        <div className="text-center py-12">
          {canReviewVariantIds && Array.isArray(canReviewVariantIds) && canReviewVariantIds.length > 0 && (
            <Button
              onClick={handleOpenReviewDialog}
              className="mb-6"
              variant="default"
            >
              <Star className="h-4 w-4 mr-2" />
              Viết đánh giá
            </Button>
          )}
          <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">
            Chưa có đánh giá nào
          </h3>
          <p className="text-muted-foreground">
            Hãy là người đầu tiên mua và  đánh giá sản phẩm này
          </p>
        </div>

        {/* Review Dialog */}
        <ReviewModal
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          variantId={
            canReviewVariantIds && Array.isArray(canReviewVariantIds) && canReviewVariantIds.length > 0
              ? canReviewVariantIds[0]
              : null
          }
          productId={productId}
          onSuccess={handleReviewSuccess}
        />
      </>
    );
  }

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Rating Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              {/* Write Review Button */}
              {canReviewVariantIds && Array.isArray(canReviewVariantIds) && canReviewVariantIds.length > 0 && (
                <Button
                  onClick={handleOpenReviewDialog}
                  className="w-full mb-4"
                  variant="default"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Viết đánh giá
                </Button>
              )}
            <div className="text-5xl font-bold mb-2">
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(stats.averageRating)
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {stats.totalReviews} đánh giá
            </p>

            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count =
                  rating === 5
                    ? stats.total5Stars
                    : rating === 4
                    ? stats.total4Stars
                    : rating === 3
                    ? stats.total3Stars
                    : rating === 2
                    ? stats.total2Stars
                    : stats.total1Stars;

                return (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm w-6">{rating}★</span>
                    <Progress
                      value={
                        ratingDistribution[
                          rating as keyof typeof ratingDistribution
                        ]
                      }
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="lg:col-span-2 space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Chưa có đánh giá nào cho phiên bản này
            </p>
          </div>
        ) : (
          <>
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user?.id}`}
                      />
                      <AvatarFallback>
                        {review.user?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">
                          {review.user?.name || "Người dùng"}
                        </h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-3">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang tải...
                    </>
                  ) : (
                    "Xem thêm đánh giá"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>

      {/* Review Dialog */}
      <ReviewModal
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        variantId={
          canReviewVariantIds && Array.isArray(canReviewVariantIds) && canReviewVariantIds.length > 0
            ? canReviewVariantIds[0]
            : null
        }
        productId={productId}
        onSuccess={handleReviewSuccess}
      />
    </>
  );
}


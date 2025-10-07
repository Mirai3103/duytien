import { Button } from "@/components/ui/button";

const BannerAds = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="relative rounded-lg overflow-hidden h-64 bg-linear-to-r from-purple-500 to-pink-500">
          <div className="absolute inset-0 flex flex-col justify-center items-start p-8 text-white">
            <h3 className="text-3xl font-bold mb-2">Combo Phụ Kiện</h3>
            <p className="text-xl mb-4">Giảm thêm 10% khi mua kèm</p>
            <Button variant="hero">Mua ngay</Button>
          </div>
        </div>

        <div className="relative rounded-lg overflow-hidden h-64 bg-linear-to-r from-blue-500 to-cyan-500">
          <div className="absolute inset-0 flex flex-col justify-center items-start p-8 text-white">
            <h3 className="text-3xl font-bold mb-2">Galaxy Z Fold6</h3>
            <p className="text-xl mb-4">Đặt trước - Nhận quà 5 triệu</p>
            <Button variant="hero">Đặt trước ngay</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerAds;

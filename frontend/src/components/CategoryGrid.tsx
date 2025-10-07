import { Smartphone, Laptop, Headphones, Watch, Gamepad2, Camera } from "lucide-react";
import { Card } from "@/components/ui/card";

const categories = [
  { icon: Smartphone, name: "Điện thoại", color: "text-blue-500" , image:"https://cdn2.fptshop.com.vn/unsafe/360x0/filters:format(webp):quality(75)/dien_thoai_icon_cate_05347c5136.png"},
  { icon: Laptop, name: "Laptop", color: "text-purple-500" ,image:"https://cdn2.fptshop.com.vn/unsafe/360x0/filters:format(webp):quality(75)/laptop_ic_cate_47e7264bc7.png"},
  { icon: Headphones, name: "Tai nghe", color: "text-green-500",image:"https://cdn2.fptshop.com.vn/unsafe/360x0/filters:format(webp):quality(75)/phu_kien_ic_cate_ecae8ddd38.png" },
  { icon: Watch, name: "Đồng hồ", color: "text-orange-500" ,image: "https://cdn2.fptshop.com.vn/unsafe/360x0/filters:format(webp):quality(75)/dong_ho_icon_cate_d8bc66c8e7.png"},
  { icon: Gamepad2, name: "Gaming", color: "text-red-500",image:"https://cdn2.fptshop.com.vn/unsafe/360x0/filters:format(webp):quality(75)/man_hinh_ic_cate_7663908793.png" },
  { icon: Camera, name: "Camera", color: "text-pink-500", image:"https://cdn2.fptshop.com.vn/unsafe/360x0/filters:format(webp):quality(75)/2024_1_29_638421266235563489_camera-insta360-ace-dd.jpg"},
  { icon: Smartphone, name: "Điện thoại", color: "text-blue-500" , image:"https://cdn2.fptshop.com.vn/unsafe/360x0/filters:format(webp):quality(75)/dien_thoai_icon_cate_05347c5136.png"},
  { icon: Laptop, name: "Laptop", color: "text-purple-500" ,image:"https://cdn2.fptshop.com.vn/unsafe/360x0/filters:format(webp):quality(75)/laptop_ic_cate_47e7264bc7.png"},
  { icon: Headphones, name: "Tai nghe", color: "text-green-500",image:"https://cdn2.fptshop.com.vn/unsafe/360x0/filters:format(webp):quality(75)/phu_kien_ic_cate_ecae8ddd38.png" },
  { icon: Watch, name: "Đồng hồ", color: "text-orange-500" ,image: "https://cdn2.fptshop.com.vn/unsafe/360x0/filters:format(webp):quality(75)/dong_ho_icon_cate_d8bc66c8e7.png"},
  { icon: Gamepad2, name: "Gaming", color: "text-red-500",image:"https://cdn2.fptshop.com.vn/unsafe/360x0/filters:format(webp):quality(75)/man_hinh_ic_cate_7663908793.png" },
  { icon: Camera, name: "Camera", color: "text-pink-500", image:"https://cdn2.fptshop.com.vn/unsafe/360x0/filters:format(webp):quality(75)/2024_1_29_638421266235563489_camera-insta360-ace-dd.jpg"},
];

const CategoryGrid = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Khám phá theo danh mục</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category, index) => (
          <Card
            key={index}
            className="hover-lift cursor-pointer p-2 py-4 flex flex-col items-center justify-center gap-2 border-2 hover:border-primary transition-all"
          >
            {/* <category.icon size={48} className={category.color} /> */}
            <img src={category.image} alt={category.name} className="w-20 h-20 object-contain" />
            <span className="font-semibold text-center">{category.name}</span>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;

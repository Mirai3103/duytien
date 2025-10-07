import { Link } from "@tanstack/react-router";
import { Smartphone, Laptop, Headphones, Watch, Gift, Newspaper } from "lucide-react";

const menuItems = [
  { icon: Smartphone, label: "Điện thoại" },
  { icon: Laptop, label: "Laptop" },
  { icon: Headphones, label: "Tai nghe" },
  { icon: Watch, label: "Đồng hồ" },
  { icon: Gift, label: "Khuyến mãi" },
  { icon: Newspaper, label: "Tin công nghệ" },
];

const Navbar = () => {
  return (
    null
    // <nav className="bg-primary text-primary-foreground">
    //   <div className="container mx-auto px-4">
    //     <ul className="flex items-center justify-center gap-8 py-3">
    //       {menuItems.map((item, index) => (
    //         <li key={index}>
    //           <Link
    //             to="/search"
    //             className="flex items-center gap-2 hover:text-primary-foreground/80 transition-colors"
    //           >
    //             <item.icon size={18} />
    //             <span className="font-medium">{item.label}</span>
    //           </Link>
    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    // </nav>
  );
};

export default Navbar;

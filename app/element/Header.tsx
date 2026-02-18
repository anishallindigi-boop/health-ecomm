import { Search, User, ShoppingCart } from "lucide-react";

const navLinks = ["HOME", "ABOUT US", "SHOP NOW", "OUR BLOGS", "CONTACT US"];

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-26">
       <img src='/logo.jpeg' className="h-20"/>
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm font-body tracking-wider text-foreground/80 hover:text-primary transition-colors"
            >
              {link}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-foreground/70">
          <Search className="w-5 h-5 hover:text-primary cursor-pointer transition-colors" />
          <User className="w-5 h-5 hover:text-primary cursor-pointer transition-colors" />
          <div className="relative">
            <ShoppingCart className="w-5 h-5 hover:text-primary cursor-pointer transition-colors" />
            <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
              0
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

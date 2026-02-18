import { Truck, Headphones, ShieldCheck } from "lucide-react";

const items = [
  { icon: Truck, label: "SHIPPING", desc: "Available World wide" },
  { icon: Headphones, label: "HASSLE FREE", desc: "Online Customer Support" },
  { icon: ShieldCheck, label: "SECURED", desc: "Check Out" },
];

const ShippingBar = () => {
  return (
    <section className="py-10 bg-card border-y border-border">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-4 justify-center">
              <Icon className="w-8 h-8 text-primary" />
              <div>
                <p className="font-body text-xs tracking-wider text-muted-foreground uppercase">
                  {label}
                </p>
                <p className="font-body text-sm text-foreground font-medium">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShippingBar;

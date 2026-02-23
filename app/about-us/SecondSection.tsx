export default function SecondSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div
          className="
            relative overflow-hidden
            bg-[url('/hero.jpeg')]
            bg-contain bg-center bg-no-repeat bg-fixed
            min-h-[400px] md:min-h-[650px]
            flex items-center justify-center
          "
        >
          {/* White content box */}
          <div className="text-center bg-white/95 max-w-2xl p-6 md:p-12">
            <p className="text-sm tracking-widest text-gray-600 mb-4">
Multani Pansari
            </p>
            <h2 className="text-3xl md:text-5xl font-light mb-6">
              About Multani Pansari
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
      Multani Pansari & Ayurvedic Dawakhana is a trusted store for herbal, Ayurvedic, and natural products. We provide pure herbs, authentic spices, Ayurvedic medicines, and traditional health essentials carefully selected for quality and effectiveness.

Our mission is to promote healthy living through natural and reliable products while maintaining complete customer trust.
            </p>
           <a href="/contact">
            <button className="px-8 py-3 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition">
        contact us
            </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

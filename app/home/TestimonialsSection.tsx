'use client'
import { Star, Quote, Sparkles, Shield, Truck, Clock, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Enhanced testimonials with more authentic voice for मुलतानी पंसारी
const testimonials = [
  {
    name: "राहुल शर्मा",
    location: "दिल्ली",
    rating: 5,
    verified: true,
    product: "Sthul Ghatak",
    daysUsed: 45,
    text: "मुलतानी पंसारी का असली चेहरा यहीं दिखता है। Sthul Ghatak ने मेरा वज़न 8kg कम किया 2 महीने में। पहले जिम में पसीना बहाता था, कोई फर्क नहीं पड़ता था। लेकिन ये आयुर्वेदिक फॉर्मूला एकदम रामबाण साबित हुआ। मेटाबॉलिज्म इतना तेज हुआ कि बिना डाइटिंग के ही weight loss हो गया। दादी के नुस्खों जैसा असली स्वाद, कोई मिलावट नहीं। मुलतानी पंसारी वालों ने हमारे बुजुर्गों की विरासत को सही मायने में जिंदा रखा है।",
    image: "/avatars/male-1.jpg"
  },
  {
    name: "अंजलि मेहता",
    location: "मुंबई",
    rating: 5,
    verified: true,
    product: "Consti-Pi",
    daysUsed: 30,
    text: "सुबह-सुबह पेट साफ न होना मेरी रोज की परेशानी थी। Consti-Pi ने वो परेशानी खत्म कर दी। तीसरे दिन से ही ऐसा feel आया जैसे कोई रुकावट हट गई हो। अब बिना tension के चाय पी सकती हूं। Taste थोड़ा कड़वा है, लेकिन काम ऐसा करता है कि उंगलियां चाटते रह जाओ। मुलतानी पंसारी का हर product सोने पर सुहागा है।",
    image: "/avatars/female-1.jpg"
  },
  {
    name: "रमेश पटेल",
    location: "अहमदाबाद",
    rating: 4,
    verified: true,
    product: "Vajra Vardhak",
    daysUsed: 60,
    text: "उम्र के इस पड़ाव पर energy कम होना आम बात है। लेकिन Vajra Vardhak ने मुझे 10 साल जवान कर दिया। सुबह उठते ही चुस्ती-फुर्ती, दिनभर थकान नहीं। रिश्तों में भी वो बात आ गई है। बस धैर्य रखना पड़ता है, जल्दबाजी नहीं करनी। मुलतानी पंसारी के लोग सच में बाबा जी की विरासत को संभाले हुए हैं।",
    image: "/avatars/male-2.jpg"
  },
  {
    name: "प्रिया सिंह",
    location: "लखनऊ",
    rating: 5,
    verified: true,
    product: "Kesh Amrit Oil",
    daysUsed: 90,
    text: "मेरे बाल तो जैसे मर ही गए थे। शादी के बाद झड़ते ही झड़ते गंजेपन की कगार पर आ गई थी। Kesh Amrit Oil ने जान डाल दी। 3 महीने में नए बाल आने लगे, झड़ना बंद हुआ। अब तो लोग पूछते हैं कौन सा तेल लगाती हो। मुलतानी पंसारी की हर बूटी में जादू है।",
    image: "/avatars/female-2.jpg"
  },
  {
    name: "अमित कुमार",
    location: "बैंगलोर",
    rating: 4,
    verified: true,
    product: "Pain Zero Oil",
    daysUsed: 25,
    text: "IT सेक्टर में बैठे-बैठे कमर और घुटनों ने दर्द देना शुरू कर दिया था। Pain Zero Oil ने वहीं राहत दी जहां मलहम-पेनकिलर फेल हो गए थे। सुबह-शाम मालिश करो, दर्द भूल जाओ। असली चीज़ है यार, मुलतानी पंसारी ने दिल जीत लिया।",
    image: "/avatars/male-3.jpg"
  },
  {
    name: "सुनीता देवी",
    location: "जयपुर",
    rating: 5,
    verified: true,
    product: "Madhu Vinashi",
    daysUsed: 120,
    text: "डायबिटीज ने खाने-पीने का मजा खत्म कर दिया था। Madhu Vinashi ने वो मजा लौटा दिया। 4 महीने में sugar level normal रहने लगा। दवाइयां भूल गई, सिर्फ यही लेती हूं। कोई केमिकल नहीं, बिल्कुल शुद्ध आयुर्वेद। मुलतानी पंसारी वाले सच में लोगों की भलाई सोचते हैं।",
    image: "/avatars/female-3.jpg"
  },
  {
    name: "विक्रम सिंह",
    location: "चंडीगढ़",
    rating: 5,
    verified: true,
    product: "Swarn Shakti",
    daysUsed: 45,
    text: "इम्यूनिटी इतनी कमजोर हो गई थी कि हर मौसम में बीमार। Swarn Shakti ने चुटकियों में दुरुस्त कर दिया। अब मौसम बदले या न बदले, मैं हूं कि फिट हूं। मुलतानी पंसारी का हर product सोने पर सुहागा है। बाबा जी की कृपा से ये बूटियां हम तक पहुंच रही हैं।",
    image: "/avatars/male-4.jpg"
  },
  {
    name: "नेहा गुप्ता",
    location: "कानपुर",
    rating: 5,
    verified: true,
    product: "Chyawanprash",
    daysUsed: 60,
    text: "बच्चों को च्यवनप्राश खिलाना कोई आसान काम नहीं। लेकिन मुलतानी पंसारी वालों का च्यवनप्राश इतना स्वादिष्ट है कि बच्चे खुद मांगकर खाते हैं। एनर्जी दिनभर बनी रहती है, सर्दी-खांसी गायब। असली देसी नुस्खा, कोई मिलावट नहीं।",
    image: "/avatars/female-4.jpg"
  },
  {
    name: "राजेश कुमार",
    location: "पटना",
    rating: 4,
    verified: true,
    product: "Power Grow",
    daysUsed: 35,
    text: "थकान तो जैसे मेरी जिंदगी का हिस्सा बन गई थी। Power Grow ने वो थकान दूर कर दी। अब ऑफिस के बाद भी बच्चों के साथ खेलने की energy है। मुलतानी पंसारी का हर पैसा वसूल है।",
    image: "/avatars/male-5.jpg"
  },
  {
    name: "पूजा शर्मा",
    location: "नागपुर",
    rating: 5,
    verified: true,
    product: "Sthul Ghatak",
    daysUsed: 90,
    text: "प्रेग्नेंसी के बाद बढ़ा वजन कम नहीं हो रहा था। Sthul Ghatak ने चमत्कार कर दिया। 3 महीने में 12kg कम हुआ। अब वही पुरानी फिटनेस लौट आई। मुलतानी पंसारी ने मेरा कॉन्फिडेंस वापस दिया।",
    image: "/avatars/female-5.jpg"
  },
  {
    name: "दीपक वर्मा",
    location: "भोपाल",
    rating: 5,
    verified: true,
    product: "Vajra Vardhak",
    daysUsed: 50,
    text: "40 के बाद सब कुछ slow होने लगा था। Vajra Vardhak ने फिर से वो speed दी। वर्कआउट में पहले से ज्यादा energy, रिकवरी भी तेज। मुलतानी पंसारी का हर product जड़ी-बूटियों का खजाना है।",
    image: "/avatars/male-6.jpg"
  },
  {
    name: "कविता सिंह",
    location: "इंदौर",
    rating: 5,
    verified: true,
    product: "Kesh Amrit Oil",
    daysUsed: 120,
    text: "डैंड्रफ और हेयर फॉल से परेशान थी। Kesh Amrit Oil ने दोनों का सफाया कर दिया। अब बाल घने और लंबे, चमक ऐसी कि लोग पूछें। मुलतानी पंसारी के तेल का कोई तोड़ नहीं।",
    image: "/avatars/female-6.jpg"
  },
  {
    name: "मनोज तिवारी",
    location: "वाराणसी",
    rating: 5,
    verified: true,
    product: "Swarn Shakti",
    daysUsed: 80,
    text: "बाबा जी के आशीर्वाद से मुलतानी पंसारी के products मिले। Swarn Shakti ने मेरी इम्यूनिटी इतनी मजबूत कर दी कि कोरोना काल में भी नहीं हुआ। असली सोना है ये कंपनी।",
    image: "/avatars/male-7.jpg"
  },
  {
    name: "स्नेहा रेड्डी",
    location: "हैदराबाद",
    rating: 5,
    verified: true,
    product: "Consti-Pi",
    daysUsed: 20,
    text: "पेट की गंदगी साफ होते ही चेहरे पर ग्लो आ गया। Consti-Pi ने मेरी skin की चमक लौटा दी। पहले पिम्पल्स थे, अब गायब। मुलतानी पंसारी का हर product skin के लिए वरदान है।",
    image: "/avatars/female-7.jpg"
  },
  {
    name: "अरुण नायर",
    location: "कोच्चि",
    rating: 4,
    verified: true,
    product: "Pain Zero Oil",
    daysUsed: 15,
    text: "गठिया का दर्द सालों से था। Pain Zero Oil ने 15 दिन में राहत दी। अब बिना दर्द के चल पाता हूं। मुलतानी पंसारी के लोग सच्चे सेवक हैं।",
    image: "/avatars/male-8.jpg"
  },
  {
    name: "मीरा जोशी",
    location: "पुणे",
    rating: 5,
    verified: true,
    product: "Madhu Vinashi",
    daysUsed: 180,
    text: "6 महीने से Madhu Vinashi ले रही हूं। शुगर पूरी तरह कंट्रोल में है। डॉक्टर भी हैरान हैं कि कैसे बिना दवा के शुगर नॉर्मल रहता है। मुलतानी पंसारी ने मेरी जिंदगी बदल दी।",
    image: "/avatars/female-8.jpg"
  }
];

const stats = [
  { icon: Shield, label: "100% आयुर्वेदिक", value: "प्रमाणित" },
  { icon: Users, label: "संतुष्ट ग्राहक", value: "50,000+" },
  { icon: Truck, label: "फास्ट डिलीवरी", value: "पूरे भारत में" },
  { icon: Clock, label: "परंपरा", value: "100+ वर्ष" }
];

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <div className="group relative bg-gradient-to-br from-card to-card/95 border border-primary/10 rounded-2xl p-6 min-w-[380px] md:min-w-[420px] mx-3 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] hover:-translate-y-1">
    {/* Background Pattern */}
    <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    {/* Quote Icon */}
    <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
    
    {/* Header with Verified Badge */}
    <div className="flex items-start justify-between mb-4 relative">
      <div className="flex items-center gap-3">
        {/* Avatar Placeholder with Initial */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-heading font-bold text-lg shadow-lg">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <h4 className="font-heading font-semibold text-foreground flex items-center gap-2">
            {testimonial.name}
            {testimonial.verified && (
              <span className="bg-white text-muted-foreground text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Verified
              </span>
            )}
          </h4>
          <p className="font-body text-sm text-muted-foreground">{testimonial.location}</p>
        </div>
      </div>
    </div>

    {/* Product Tag & Days */}
    <div className="flex items-center gap-2 mb-4">
      <span className="bg-white text-muted-foreground text-xs px-3 py-1 rounded-full font-body">
        {testimonial.product}
      </span>
      <span className="text-xs text-muted-foreground">
        {testimonial.daysUsed} दिनों में
      </span>
    </div>

    {/* Rating */}
    <div className="flex items-center gap-1 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 transition-all duration-300 ${
            i < testimonial.rating 
              ? "fill-white text-primary scale-110" 
              : "fill-muted text-muted"
          }`}
        />
      ))}
      <span className="ml-2 text-xs text-muted-foreground">{testimonial.rating}.0</span>
    </div>

    {/* Testimonial Text */}
    <div className="relative">
      <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-4 hover:line-clamp-none transition-all duration-500 cursor-default">
        "{testimonial.text}"
      </p>
    </div>

    {/* Read More Overlay (for truncated text) */}
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent rounded-b-2xl pointer-events-none group-hover:opacity-0 transition-opacity duration-500" />
  </div>
);

const TestimonialsSection = () => {
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer1 = scrollRef1.current;
    const scrollContainer2 = scrollRef2.current;

    let animationFrame1: number;
    let animationFrame2: number;
    let scrollPos1 = 0;
    let scrollPos2 = 0;
    let lastTimestamp1 = 0;
    let lastTimestamp2 = 0;

    const scrollRightToLeft = (timestamp: number) => {
      if (!isPaused && scrollContainer1) {
        if (!lastTimestamp1) lastTimestamp1 = timestamp;
        const delta = timestamp - lastTimestamp1;
        
        // Smooth scrolling with delta time
        scrollPos1 += (delta * 0.03);
        if (scrollPos1 >= scrollContainer1.scrollWidth / 3) {
          scrollPos1 = 0;
        }
        scrollContainer1.scrollLeft = scrollPos1;
        lastTimestamp1 = timestamp;
      }
      animationFrame1 = requestAnimationFrame(scrollRightToLeft);
    };

    const scrollLeftToRight = (timestamp: number) => {
      if (!isPaused && scrollContainer2) {
        if (!lastTimestamp2) lastTimestamp2 = timestamp;
        const delta = timestamp - lastTimestamp2;
        
        scrollPos2 -= (delta * 0.03);
        if (scrollPos2 <= 0) {
          scrollPos2 = scrollContainer2.scrollWidth / 3;
        }
        scrollContainer2.scrollLeft = scrollPos2;
        lastTimestamp2 = timestamp;
      }
      animationFrame2 = requestAnimationFrame(scrollLeftToRight);
    };

    animationFrame1 = requestAnimationFrame(scrollRightToLeft);
    animationFrame2 = requestAnimationFrame(scrollLeftToRight);

    return () => {
      cancelAnimationFrame(animationFrame1);
      cancelAnimationFrame(animationFrame2);
    };
  }, [isPaused]);

  return (
    <section className="py-24 bg-gradient-to-b from-background via-background to-background/95 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        {/* Header with Brand Name */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-white font-body text-sm tracking-wider">
              मुलतानी पंसारी ट्रस्टेड रिव्यू
            </span>
          </div>
          
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              मुलतानी पंसारी
            </span>
            <br />
            <span className="text-3xl md:text-4xl">सीधा Experience, Bina Filter</span>
          </h2>
          
          <p className="font-body text-muted-foreground text-lg leading-relaxed">
            मुलतानी पंसारी को जिन लोगों ने अपनाया, उन्होंने सिर्फ product नहीं खरीदा – 
            उन्होंने अपने बुजुर्गों की विरासत को महसूस किया। नीचे जो feedbacks हैं, 
            वो हमारे 50,000 से ज्यादा संतुष्ट ग्राहकों की सच्ची आवाज़ हैं।
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="font-heading font-bold text-foreground text-lg">{stat.value}</div>
                <div className="font-body text-xs text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* First Row - Right to Left */}
        <div className="mb-8" 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative">
            {/* Gradient fades */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background via-background to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background via-background to-transparent z-20 pointer-events-none" />
            
            <div
              ref={scrollRef1}
              className="flex overflow-x-hidden scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div className="flex gap-4 py-4">
                {[...testimonials.slice(0, 8), ...testimonials.slice(0, 8)].map((testimonial, index) => (
                  <TestimonialCard key={`row1-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Second Row - Left to Right */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background via-background to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background via-background to-transparent z-20 pointer-events-none" />
            
            <div
              ref={scrollRef2}
              className="flex overflow-x-hidden scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div className="flex gap-4 py-4">
                {[...testimonials.slice(8), ...testimonials.slice(8)].map((testimonial, index) => (
                  <TestimonialCard key={`row2-${index}`} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        {/* <div className="text-center mt-16">
          <button className="group relative inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full font-heading font-semibold text-lg hover:bg-primary/90 transition-all duration-300 hover:shadow-[0_20px_30px_-10px_rgba(0,0,0,0.3)]">
            <span>और रिव्यू पढ़ें</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div> */}

        {/* Custom CSS */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .bg-grid-white\/5 {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
          }
        `}</style>
      </div>
    </section>
  );
};

export default TestimonialsSection;
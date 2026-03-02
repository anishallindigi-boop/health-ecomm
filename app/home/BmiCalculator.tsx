// components/BmiCalculator.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Flame, Lightbulb, User, Calendar, Ruler, Weight, Heart, Activity, PenLine, Mars, Sparkles, ArrowBigRight } from 'lucide-react';
import Link from 'next/link';


interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  suggestion: string;
  product: string;
}

export default function BmiCalculator() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<BMIResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const calculateBMI = () => {
    if (!height || !weight || !name || !age || !gender) {
      alert('कृपया सभी जानकारी भरें');
      return;
    }

    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    const roundedBMI = Math.round(bmiValue * 10) / 10;

    let category = '';
    let color = '';
    let suggestion = '';
    let product = '';

    // BMI Categories with suggestions
    if (roundedBMI < 18.5) {
      category = 'Underweight';
      color = 'from-blue-400 to-blue-600';
      suggestion = 'आपको वजन बढ़ाने की जरूरत है। संतुलित आहार लें और ताकत बढ़ाने वाले व्यायाम करें।';
      product = 'मुलतानी पंसारी - वजन बढ़ाने वाला स्पेशल फॉर्मूला';
    } else if (roundedBMI >= 18.5 && roundedBMI < 25) {
      category = 'Normal Weight';
      color = 'from-green-400 to-green-600';
      suggestion = 'बहुत बढ़िया! आपका वजन संतुलित है। इसी तरह स्वस्थ जीवनशैली बनाए रखें।';
      product = 'मुलतानी पंसारी - हेल्थ मेन्टेनेंस टॉनिक';
    } else if (roundedBMI >= 25 && roundedBMI < 30) {
      category = 'Overweight';
      color = 'from-yellow-400 to-yellow-600';
      suggestion = 'वजन थोड़ा अधिक है। नियमित व्यायाम और संतुलित आहार से इसे कम कर सकते हैं।';
      product = 'मुलतानी पंसारी - मेटाबॉलिज्म बूस्टर फॉर्मूला';
    } else {
      category = 'Obese';
      color = 'from-red-400 to-red-600';
      suggestion = 'स्वास्थ्य के लिए वजन कम करना जरूरी है। डॉक्टर की सलाह लें और सही दिनचर्या अपनाएं।';
      product = 'मुलतानी पंसारी - वजन घटाने वाला हर्बल कॉम्बो';
    }

    setResult({
      bmi: roundedBMI,
      category,
      color,
      suggestion,
      product
    });
    setShowResult(true);
  };

  return (
    <div className="min-h-screen p-4">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto text-center mb-8"
      >
       <div className="bg-green-500 text-primary rounded-full w-50 float-right px-4 py-2">
  <Link href="/dosha-test">
  Dosha Test     <ArrowBigRight className="inline w-4 h-4 mr-2 text-primary" />
  </Link>
</div>
        <div className="inline-block">
          <h2 className="text-3xl md:text-4xl font-bold text-white bg-clip-text text-transparent">
            जानिए आपका Body Score और पाई सही
          </h2>
          <p className="text-white mt-2 text-lg">Health Guide</p>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        {/* Left Column - Calculator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/50"
        >
          {/* Baba Ji Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
              <i className="fas fa-leaf text-white text-xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">BMI Calculator</h2>
              <p className="text-sm text-gray-500 text-white">Multani Pansari</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Name and Age Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-sm font-medium text-white mb-2">
                  <User className="inline w-4 h-4 mr-2 text-purple-500" />
                  आपका नाम
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Raj"
                  className="w-full px-4 py-3 border border-white rounded-xl text-white bg-transparent"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-white mb-2">
                  <Calendar className="inline w-4 h-4 mr-2 text-purple-500" />
                  आयु
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Years"
                  className="w-full px-4 py-3 border border-white rounded-xl text-white bg-transparent"
                />
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <Mars className="inline w-4 h-4 mr-2 text-purple-500" />
                लिंग चुनें
              </label>
              <div className="grid grid-cols-2 gap-4">
                {['Male', 'Female', 'Other'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`px-4 py-3 rounded-xl transition-all ${
                      gender === g
                        ? 'border-white border text-white'
                        : 'text-white border-2 border-secondary'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Height and Weight Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-sm font-medium text-white mb-2">
                  <Ruler className="inline w-4 h-4 mr-2 text-purple-500" />
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g., 175"
                  className="w-full px-4 py-3 border border-white rounded-xl text-white bg-transparent"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-white mb-2">
                  <Weight className="inline w-4 h-4 mr-2 text-purple-500" />
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g., 70"
                  className="w-full px-4 py-3 border border-white rounded-xl text-white bg-transparent"
                />
              </div>
            </div>

            {/* Calculate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={calculateBMI}
              className="w-full py-4 text-white border-white border-2 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Calculate BMI
            </motion.button>
          </div>
        </motion.div>

        {/* Right Column - Result Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/50"
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="text-purple-600 w-6 h-6" />
            आपका BMI Result
          </h3>

          <AnimatePresence mode="wait">
            {showResult && result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* BMI Score Card */}
                <div className={`bg-gradient-to-r ${result.color} rounded-2xl p-6 text-white shadow-xl`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm opacity-90">Your BMI Score</p>
                      <p className="text-5xl font-bold mt-2">{result.bmi}</p>
                      <p className="text-lg mt-1 font-semibold">{result.category}</p>
                    </div>
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                      <Heart className="w-10 h-10" />
                    </div>
                  </div>
                </div>

                {/* Health Suggestion */}
                <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-secondary mb-1">Health Suggestion</p>
                      <p className="text-secondary">{result.suggestion}</p>
                    </div>
                  </div>
                </div>

                {/* Product Recommendation */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Flame className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">मुलतानी पंसारी सुझाव</p>
                      <p className="text-gray-700 font-medium">{result.product}</p>
                    </div>
                  </div>
                </div>

                {/* Info Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500">Height</p>
                    <p className="font-bold text-gray-700">{height} cm</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500">Weight</p>
                    <p className="font-bold text-gray-700">{weight} kg</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-96 flex flex-col items-center justify-center text-center"
              >
                <div className="w-32 h-32 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
                  <Activity className="w-12 h-12 text-purple-400" />
                </div>
                <h4 className="text-xl font-semibold text-gray-700 mb-2">कोई डेटा नहीं</h4>
                <p className="text-gray-500 max-w-xs">
                  अपनी जानकारी भरें और BMI कैलकुलेट करें
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* How It Works Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-6xl mx-auto mt-12"
      >
        <h2 className="text-2xl text-white font-bold text-center mb-8 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400" />
          How It Works ?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: PenLine, title: 'अपना नाम और age डालिए', desc: 'Pehle apna naam likho, aur age daalo – kyunki health advice matter karti hai!' },
            { icon: Mars, title: 'Gender choose kariye', desc: 'Health needs gender ke hisaab se thodi different hoti hai – isliye yeh step important hai!' },
            { icon: Ruler, title: 'Apni height aur weight daaliye', desc: 'Yeh do cheezein sabse basic hain – inke bina BMI ka hisaab nahi banega.' },
            { icon: Calculator, title: 'Click kariye – "Calculate BMI"', desc: 'Ek click karo aur turant aapka Body Mass Index aa jayega – bina jhanjhat ke.' }
          ].map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="backdrop-blur-sm text-white rounded-xl p-5 border border-white/50 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl mb-3">
                <step.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
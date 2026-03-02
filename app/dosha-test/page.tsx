'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Moon, Sun, Cloud, Activity, Brain, Coffee, Wind, Droplet, Flame, Leaf, ChevronLeft, RotateCcw } from 'lucide-react'

// ------------------- TYPES & DATA -------------------

type Dosha = 'vata' | 'pitta' | 'kapha'
type Option = { text: string; dosha: Dosha }

// Fix: Use React.ReactNode instead of JSX.Element
interface Question {
  id: number
  text: string
  icon: React.ReactNode
  options: Option[]
}

const questions: Question[] = [
  {
    id: 1,
    text: 'आपकी भूख कैसी रहती है?',
    icon: <Coffee className="w-5 h-5" />,
    options: [
      { text: 'अनियमित, कभी बहुत भूख तो कभी नहीं', dosha: 'vata' },
      { text: 'तेज़ और नियमित, समय पर खाना ज़रूरी', dosha: 'pitta' },
      { text: 'धीमी और स्थिर, देर से भूख लगती है', dosha: 'kapha' },
    ],
  },
  {
    id: 2,
    text: 'आपका शरीर कैसा है?',
    icon: <Activity className="w-5 h-5" />,
    options: [
      { text: 'पतला, हल्का, वजन बढ़ाना मुश्किल', dosha: 'vata' },
      { text: 'मध्यम, मांसपेशियों वाला', dosha: 'pitta' },
      { text: 'भारी, मोटा, वजन घटना मुश्किल', dosha: 'kapha' },
    ],
  },
  {
    id: 3,
    text: 'आपको किस मौसम में असुविधा अधिक होती है?',
    icon: <Cloud className="w-5 h-5" />,
    options: [
      { text: 'सर्द और हवादार मौसम में', dosha: 'vata' },
      { text: 'गर्मी और धूप में', dosha: 'pitta' },
      { text: 'ठंड और नमी वाले मौसम में', dosha: 'kapha' },
    ],
  },
  {
    id: 4,
    text: 'आपका स्वभाव कैसा है?',
    icon: <Brain className="w-5 h-5" />,
    options: [
      { text: 'उत्साही, रचनात्मक, चंचल', dosha: 'vata' },
      { text: 'महत्वाकांक्षी, केंद्रित, प्रतिस्पर्धी', dosha: 'pitta' },
      { text: 'शांत, स्थिर, धैर्यवान', dosha: 'kapha' },
    ],
  },
  {
    id: 5,
    text: 'आपकी नींद कैसी रहती है?',
    icon: <Moon className="w-5 h-5" />,
    options: [
      { text: 'हल्की, बार-बार टूटती है', dosha: 'vata' },
      { text: 'अच्छी लेकिन छोटी, जल्दी उठ जाते हैं', dosha: 'pitta' },
      { text: 'गहरी और लंबी, उठना मुश्किल', dosha: 'kapha' },
    ],
  },
  {
    id: 6,
    text: 'आपकी याददाश्त कैसी है?',
    icon: <Brain className="w-5 h-5" />,
    options: [
      { text: 'जल्दी सीखते हैं, जल्दी भूल जाते हैं', dosha: 'vata' },
      { text: 'तेज और स्पष्ट याददाश्त', dosha: 'pitta' },
      { text: 'धीरे सीखते हैं, लंबे समय तक याद रहता है', dosha: 'kapha' },
    ],
  },
  {
    id: 7,
    text: 'आपको कैसी चीज़ें पसंद हैं?',
    icon: <Leaf className="w-5 h-5" />,
    options: [
      { text: 'गर्म, तैलीय और पौष्टिक भोजन', dosha: 'vata' },
      { text: 'ठंडा, मीठा और ताज़ा भोजन', dosha: 'pitta' },
      { text: 'मसालेदार, हल्का और सूखा भोजन', dosha: 'kapha' },
    ],
  },
  {
    id: 8,
    text: 'आपका पाचन कैसा रहता है?',
    icon: <Flame className="w-5 h-5" />,
    options: [
      { text: 'अनियमित, कब्ज़ या गैस की समस्या', dosha: 'vata' },
      { text: 'मजबूत, कभी-कभी एसिडिटी', dosha: 'pitta' },
      { text: 'धीमा, भारीपन महसूस होता है', dosha: 'kapha' },
    ],
  },
  {
    id: 9,
    text: 'मानसिक दबाव में आप कैसी प्रतिक्रिया देते हैं?',
    icon: <Wind className="w-5 h-5" />,
    options: [
      { text: 'चिंतित और घबराए हुए हो जाते हैं', dosha: 'vata' },
      { text: 'गुस्सा और चिड़चिड़ापन आता है', dosha: 'pitta' },
      { text: 'सुस्त और उदासीन हो जाते हैं', dosha: 'kapha' },
    ],
  },
  {
    id: 10,
    text: 'आपकी त्वचा आमतौर पर कैसी है?',
    icon: <Droplet className="w-5 h-5" />,
    options: [
      { text: 'सूखी, खुरदरी, ठंडी', dosha: 'vata' },
      { text: 'संवेदनशील, जलन वाली, तैलीय', dosha: 'pitta' },
      { text: 'चिकनी, मुलायम, थोड़ी तैलीय', dosha: 'kapha' },
    ],
  },
]

type DoshaScores = Record<Dosha, number>

// Fix: Use React.ReactNode for icon in doshaNames
const doshaNames: Record<Dosha, { name: string; desc: string; color: string; icon: React.ReactNode; suggestions: string[] }> = {
  vata: {
    name: 'वात (Vata)',
    desc: 'वात गति, वायु एवं आकाश तत्व प्रधान। रचनात्मक, ऊर्जावान, परिवर्तनशील।',
    color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/40',
    icon: <Wind className="w-6 h-6 text-purple-400" />,
    suggestions: [
      'गर्म, तैलीय एवं भारी भोजन',
      'नियमित दिनचर्या एवं पर्याप्त आराम',
      'अदरक, घी, हल्दी वाला दूध लाभकारी',
      'ठंडी और सूखी चीज़ों से बचें',
      'अभ्यंग (तेल मालिश) नियमित करें',
    ],
  },
  pitta: {
    name: 'पित्त (Pitta)',
    desc: 'पित्त अग्नि, परिवर्तन और बुद्धि का प्रतिनिधित्व करता है। तीव्र, केंद्रित, महत्वाकांक्षी।',
    color: 'from-orange-500/20 to-rose-500/20 border-orange-500/40',
    icon: <Flame className="w-6 h-6 text-orange-400" />,
    suggestions: [
      'ठंडा और मीठा भोजन करें (खीरा, नारियल पानी)',
      'गुलाब जल / एलोवेरा का उपयोग',
      'तीखे, तले, अत्यधिक मसालेदार से बचें',
      'शांत वातावरण, ध्यान और शीतल श्वास',
      'धूप में कम समय बिताएं',
    ],
  },
  kapha: {
    name: 'कफ (Kapha)',
    desc: 'कफ स्थिरता, जल और पृथ्वी तत्व प्रधान। शांत, स्थिर, धैर्यवान, स्नेही।',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40',
    icon: <Droplet className="w-6 h-6 text-emerald-400" />,
    suggestions: [
      'हल्का, गर्म, सूखा भोजन',
      'मसालों का प्रयोग (अदरक, काली मिर्च)',
      'नियमित कसरत, सुबह जल्दी उठें',
      'मीठे, तैलीय, भारी भोजन से परहेज',
      'विविधता लाएं, नए अनुभव अपनाएं',
    ],
  },
}

// ------------------- MAIN COMPONENT -------------------

export default function DoshaTest() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<(Dosha | null)[]>(Array(questions.length).fill(null))
  const [showResult, setShowResult] = useState(false)
  const [scores, setScores] = useState<DoshaScores>({ vata: 0, pitta: 0, kapha: 0 })

  // compute scores when answers change
  useEffect(() => {
    const newScores = { vata: 0, pitta: 0, kapha: 0 }
    answers.forEach((ans) => {
      if (ans) newScores[ans]++
    })
    setScores(newScores)
  }, [answers])

  // auto-show result when all questions answered
  useEffect(() => {
    if (answers.every((a) => a !== null)) {
      setShowResult(true)
    }
  }, [answers])

  const handleSelect = (dosha: Dosha) => {
    const newAnswers = [...answers]
    newAnswers[currentIndex] = dosha
    setAnswers(newAnswers)

    // auto advance to next question if not last
    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 200)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  const resetTest = () => {
    setAnswers(Array(questions.length).fill(null))
    setCurrentIndex(0)
    setShowResult(false)
  }

  const progress = (answers.filter((a) => a !== null).length / questions.length) * 100

  // dominant dosha
  const dominant = (Object.entries(scores) as [Dosha, number][]).reduce((a, b) => (a[1] > b[1] ? a : b))[0]

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-zinc-200 flex items-center justify-center p-4 font-sans">
      {/* subtle animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-900/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-900/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl relative"
      >
        {/* Header Card */}
        <motion.div
          className="bg-zinc-900/80 backdrop-blur-xl rounded-t-3xl border border-zinc-800/80 p-6 shadow-2xl"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                वात · पित्त · कफ
              </h1>
              <p className="text-zinc-400 text-sm md:text-base mt-1 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                आपमें कौन-सा दोष हावी है? — दोष परीक्षण
              </p>
            </div>
            <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-full border border-zinc-800">
              <Moon className="w-4 h-4 text-zinc-500" />
              <span className="text-xs text-zinc-500">डार्क थीम</span>
            </div>
          </div>

          {/* Info badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 text-xs">
            {['क्यों कुछ सूट नहीं करता', 'Lifestyle सुधार', 'दवाएं तेज असर', 'Long‑term planning'].map(
              (text, i) => (
                <div key={i} className="bg-zinc-800/50 border border-zinc-700/50 rounded-full px-3 py-1.5 text-zinc-300 flex items-center justify-center gap-1">
                  <span className="text-amber-400">★</span> {text}
                </div>
              )
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-6 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </motion.div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-zinc-900/60 backdrop-blur-lg border-x border-b border-zinc-800/80 rounded-b-3xl p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-4xl text-amber-400/80">{questions[currentIndex].icon}</span>
                  <h2 className="text-2xl font-semibold text-zinc-100">सवाल {currentIndex + 1}/10</h2>
                </div>
                <span className="bg-zinc-800 text-zinc-300 px-4 py-1.5 rounded-full text-sm border border-zinc-700">
                  {Math.round(progress)}% पूरा
                </span>
              </div>

              <motion.p
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl md:text-2xl text-zinc-200 mb-8 border-l-4 border-amber-500 pl-4"
              >
                {questions[currentIndex].text}
              </motion.p>

              <div className="space-y-3">
                {questions[currentIndex].options.map((opt, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    onClick={() => handleSelect(opt.dosha)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center gap-4 group
                      ${
                        answers[currentIndex] === opt.dosha
                          ? 'bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/10'
                          : 'bg-zinc-800/50 border-zinc-700 hover:border-amber-500/50 hover:bg-zinc-800'
                      }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-sm
                      ${
                        answers[currentIndex] === opt.dosha
                          ? 'border-amber-500 bg-amber-500 text-black'
                          : 'border-zinc-600 text-zinc-400 group-hover:border-amber-500'
                      }`}
                    >
                      {answers[currentIndex] === opt.dosha ? '✓' : String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 text-base md:text-lg">{opt.text}</span>
                    {opt.dosha === 'vata' && <Wind className="w-5 h-5 text-purple-400/50" />}
                    {opt.dosha === 'pitta' && <Flame className="w-5 h-5 text-orange-400/50" />}
                    {opt.dosha === 'kapha' && <Droplet className="w-5 h-5 text-emerald-400/50" />}
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition ${
                    currentIndex === 0
                      ? 'border-zinc-800 text-zinc-700 cursor-not-allowed'
                      : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-amber-500'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" /> पिछला
                </button>
                <div className="flex gap-1.5">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentIndex
                          ? 'bg-amber-500 w-4'
                          : answers[i] !== null
                          ? 'bg-amber-500/50'
                          : 'bg-zinc-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-zinc-900/60 backdrop-blur-lg border-x border-b border-zinc-800/80 rounded-b-3xl p-6 md:p-8"
            >
              {/* Dominant dosha card */}
              <motion.div
                className={`p-6 rounded-3xl border bg-gradient-to-br ${doshaNames[dominant].color} mb-8`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-black/40 rounded-2xl">{doshaNames[dominant].icon}</div>
                  <div>
                    <h3 className="text-3xl font-bold text-white">{doshaNames[dominant].name}</h3>
                    <p className="text-zinc-300 text-sm mt-1">{doshaNames[dominant].desc}</p>
                  </div>
                </div>

                {/* Meter */}
                <div className="space-y-3 mt-6">
                  {(['vata', 'pitta', 'kapha'] as Dosha[]).map((d) => (
                    <div key={d} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize flex items-center gap-1">
                          {d === 'vata' && <Wind className="w-4 h-4 text-purple-400" />}
                          {d === 'pitta' && <Flame className="w-4 h-4 text-orange-400" />}
                          {d === 'kapha' && <Droplet className="w-4 h-4 text-emerald-400" />}
                          {d}
                        </span>
                        <span className="font-mono">{scores[d]}/10</span>
                      </div>
                      <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(scores[d] / 10) * 100}%` }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className={`h-full rounded-full ${
                            d === 'vata' ? 'bg-purple-500' : d === 'pitta' ? 'bg-orange-500' : 'bg-emerald-500'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Suggestions */}
              <motion.div
                className="bg-black/40 rounded-3xl p-6 border border-zinc-800"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-amber-400" />
                  जीवनशैली व भोजन सुझाव
                </h4>
                <ul className="space-y-3">
                  {doshaNames[dominant].suggestions.map((tip, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-start gap-3 text-zinc-300"
                    >
                      <span className="text-amber-400 text-lg leading-5">•</span>
                      {tip}
                    </motion.li>
                  ))}
                </ul>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-8 text-xs text-zinc-500 border-t border-zinc-800 pt-6">
                  <div className="flex items-center gap-1">★ क्यों कुछ सूट नहीं करता</div>
                  <div className="flex items-center gap-1">★ Lifestyle सुधार आसान</div>
                  <div className="flex items-center gap-1">★ दवाएं तेज असर</div>
                  <div className="flex items-center gap-1">★ Long‑term balance</div>
                </div>
              </motion.div>

              {/* Reset button */}
              <motion.div
                className="flex justify-center mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <button
                  onClick={resetTest}
                  className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-full border border-zinc-700 transition-colors group"
                >
                  <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  पुनः परीक्षण करें
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer note */}
        <div className="mt-4 text-center text-xs text-zinc-700 border-t border-zinc-800 pt-4">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> संतुलन में दोष = स्वस्थ शरीर | असंतुलन = समस्या की शुरुआत
          </span>
        </div>
      </motion.div>
    </main>
  )
}
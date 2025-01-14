'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FiCode, FiCoffee, FiZap } from 'react-icons/fi'

export default function AboutPage() {
  const [showSecret, setShowSecret] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  useEffect(() => {
    if (clickCount === 42) {
      setShowSecret(true)
      // Sihirli efekt
      import('canvas-confetti').then(confetti => {
        const colors = ['#9333EA', '#2563EB', '#DB2777']
        confetti.default({
          particleCount: 42,
          colors,
          spread: 70,
          origin: { y: 0.6 }
        })
      })
    }
  }, [clickCount])

  return (
    <main className="min-h-screen bg-[#1a1a2e] text-white pt-24">
      {/* Retro Grid Background */}
      <div className="fixed inset-0 bg-[url('/retro-grid.svg')] bg-repeat opacity-5" />
      
      {/* Synthwave Sun Effect */}
      <div className="fixed bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-purple-600/20 via-orange-400/10 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 glitch-text">
            Uzak Diyarlardan Gelen Sihirbaz
          </h1>
          <p className="text-xl text-purple-300">
            "Her satır kod, yeni bir büyü formülüdür." 🌟
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-purple-400 mb-4">
              Sihirli Yolculuk
            </h2>
            <p className="text-gray-300">
              Paralel bir evrenden, tam olarak 42 parsek öteden geldim. Orada, kodların büyülerle yazıldığı ve bug'ların birer portal olduğu bir dünyada yaşıyordum.
            </p>
            <p className="text-gray-300">
              Bizim dünyamızda, her programlama dili farklı bir büyü ekolünü temsil eder. JavaScript kaos büyüsü, Python doğa büyüsü, Rust ise antik koruma büyüleridir.
            </p>
            <div 
              onClick={() => setClickCount(prev => prev + 1)}
              className="text-sm text-purple-400 mt-4 cursor-pointer hover:text-purple-300 transition-colors"
            >
              * Bu metne {42 - clickCount} kez daha tıklarsan bir sır açığa çıkabilir...
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-purple-500/10 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiCode className="text-purple-400" />
                Sihirli Yetenekler
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>🌟 Kod Büyücülüğü (Full-Stack)</li>
                <li>🎨 UI/UX İllüzyonları</li>
                <li>🚀 Performans Simyası</li>
                <li>🤖 AI Kehaneti</li>
              </ul>
            </div>

            <div className="bg-purple-500/10 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiCoffee className="text-purple-400" />
                Günlük Ritüeller
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>☕️ Sihirli kahve demleme (günde 42 kez)</li>
                <li>💻 Kod portalları açma</li>
                <li>🎮 Piksel dünyalarda gezinme</li>
                <li>📚 Antik scrollları okuma (Stack Overflow)</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {showSecret && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-16 p-8 bg-purple-500/20 rounded-xl text-center"
          >
            <h3 className="text-2xl font-bold mb-4 text-purple-300">
              🌟 Gizli Mesaj Açıldı!
            </h3>
            <p className="text-gray-300">
              "42, evrenin ve tüm kodların anlamıdır. Bu sayıyı bulabildiğine göre, sen de bir kod büyücüsü olmaya hazırsın! 
              <br />
              <span className="text-purple-400">Artık antik sırları seninle paylaşabilirim...</span>"
            </p>
            <div className="mt-4 flex justify-center">
              <FiZap className="text-yellow-400 text-4xl animate-pulse" />
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-24 text-center text-sm text-gray-400"
        >
          <p>
            * Bu biyografi, 42 farklı paralel evrende aynı anda yayınlanmaktadır.
            <br />
            ** Herhangi bir bug bulursanız, bu muhtemelen başka bir evrene açılan bir portaldır.
          </p>
        </motion.div>
      </div>
    </main>
  )
} 
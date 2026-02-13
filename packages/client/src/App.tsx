import { motion } from "framer-motion"
import { Header } from "@/components/Header"
import { About } from "@/components/About"
import { Experience } from "@/components/Experience"
import { Projects } from "@/components/Projects"
import { Education } from "@/components/Education"
import { Skills } from "@/components/Skills"

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

const sections = [Header, About, Projects, Experience, Education, Skills]

function App() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 space-y-12">
      {sections.map((Section, i) => (
        <motion.div
          key={i}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4, delay: i * 0.1 }}
        >
          <Section />
        </motion.div>
      ))}
    </main>
  )
}

export default App

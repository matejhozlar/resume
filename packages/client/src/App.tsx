import { motion } from "framer-motion"
import { Header } from "@/components/Header"
import { About } from "@/components/About"
import { Experience } from "@/components/Experience"
import { Projects } from "@/components/Projects"
import { Skills } from "@/components/Skills"

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

const sections = [Header, About, Experience, Projects, Skills]

function App() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 space-y-12">
      {sections.map((Section, i) => (
        <div key={i}>
          {i > 0 && <hr className="section-separator mb-12" />}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <Section />
          </motion.div>
        </div>
      ))}
    </main>
  )
}

export default App

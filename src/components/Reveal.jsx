import { motion } from 'framer-motion'

/** Scroll-reveal wrapper: fades + slides children in when they enter the viewport. */
export default function Reveal({ children, delay = 0, y = 36, rotate = 0, once = true, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, rotate }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

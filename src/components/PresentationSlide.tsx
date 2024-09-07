import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import jsPDF from 'jspdf'
import { Progress } from "./ui/progress"
import { ThemeSelector } from "@/components/ThemeSelector"
import { savePitchDeck, getPitchDeck, PitchDeck, Slide } from '@/lib/localStorage';

export default function PresentationSlide() {
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()
  const [deckData, setDeckData] = useState<PitchDeck | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const [theme, setTheme] = useState('default')
  const [progress, setProgress] = useState(0)

  const slides = deckData?.slides || []

  useEffect(() => {
    setProgress((currentSlide / (slides.length - 1)) * 100)
  }, [currentSlide, slides.length])

  useEffect(() => {
    const timer = setTimeout(() => {
      // This empty setState will trigger a re-render
      setCurrentSlide(currentSlide)
    }, 100)
    return () => clearTimeout(timer)
  }, [currentSlide])

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
  }

  const exportToPDF = async () => {
    if (!deckData) {
      console.error('No deck data available');
      alert('Unable to export PDF. Deck data is missing.');
      return;
    }

    setIsExporting(true);
    try {
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add cover page
      pdf.setFillColor(230, 240, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(32);
      pdf.setTextColor(0, 0, 0);
      pdf.text(deckData.companyName, pageWidth / 2, 60, { align: 'center' });
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Pitch Deck', pageWidth / 2, 80, { align: 'center' });
      pdf.setFontSize(16);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 100, { align: 'center' });
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'italic');
      const startupIdeaLines = pdf.splitTextToSize(deckData.formData.startupIdea, pageWidth - 40);
      pdf.text(startupIdeaLines, pageWidth / 2, 120, { align: 'center' });

      for (let i = 0; i < slides.length; i++) {
        if (i > 0) pdf.addPage();
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(28);
        pdf.text(slides[i].title, 20, 30);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(16);
        let yOffset = 50;
        slides[i].content.forEach((point: string) => {
          const lines = pdf.splitTextToSize(`• ${point}`, pageWidth / 2 - 30);
          pdf.text(lines, 25, yOffset);
          yOffset += 10 * lines.length;
        });

        if (slides[i]?.imageUrl && slides[i].imageUrl.trim() !== '') {
          const img = new Image();
          img.src = slides[i].imageUrl;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          const imgWidth = pageWidth / 2 - 30;
          const imgHeight = (img.height * imgWidth) / img.width;
          pdf.addImage(img, 'JPEG', pageWidth / 2 + 10, 50, imgWidth, imgHeight);
        }

        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(12);
        pdf.text(`Image: ${slides[i].imagePrompt}`, 20, pageHeight - 15);
      }

      pdf.save(`${deckData.companyName}_pitch_deck.pdf`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Failed to export PDF. Please try again later.');
    } finally {
      setIsExporting(false);
    }
  }

  const saveDeck = () => {
    if (deckData) {
      try {
        const deckId = savePitchDeck(deckData.companyName, deckData.slides, deckData.formData)
        console.log(`Deck saved with ID: ${deckId}`)
        alert('Pitch deck saved successfully!')
        navigate('/dashboard')
      } catch (error) {
        console.error('Error saving pitch deck:', error)
        alert('Failed to save pitch deck. Please try again.')
      }
    }
  }

  useEffect(() => {
    if (id) {
      const fetchedDeck = getPitchDeck(id)
      if (fetchedDeck) {
        setDeckData(fetchedDeck)
      } else {
        navigate('/dashboard', { replace: true })
      }
    } else if (!location.state) {
      navigate('/dashboard', { replace: true })
    } else {
      const slides = location.state.slideContent.slides.map((slide: Slide) => ({
        ...slide,
        imageUrl: slide.imageUrl || '' // Ensure imageUrl is always a string
      }));
      setDeckData({
        id: '',
        companyName: location.state.formData.companyName,
        createdAt: new Date().toISOString(),
        slides: slides,
        formData: location.state.formData
      })
    }
  }, [id, location.state, navigate])

  if (!deckData) {
    return <div>Loading...</div>
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 theme-${theme}`}>
      <div className="w-full max-w-3xl flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-center">{deckData.companyName}</h1>
        <Button onClick={() => navigate('/')} variant="outline">
          Back to Generator
        </Button>
      </div>
      <p className="text-xl italic mb-8 text-center">{deckData.formData.startupIdea}</p>
      <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
      <Progress value={progress} className="w-full max-w-3xl mb-4" title="Presentation progress" />
      <AnimatePresence initial={false} custom={currentSlide}>
        <motion.div
          id="slide-content"
          key={`slide-${currentSlide}-${theme}`}
          className={`bg-white rounded-lg shadow-xl p-8 max-w-3xl w-full theme-${theme}`}
          custom={currentSlide}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">{slides[currentSlide]?.title}</h2>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 pr-4">
              <ul className="space-y-4">
                {slides[currentSlide]?.content.map((point: string) => (
                  <li key={point} className="flex items-start">
                    <span className="mr-2 mt-1 text-teal-500">•</span>
                    <span className="text-lg text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 mt-4 md:mt-0">
              {slides[currentSlide]?.imageUrl && (
                <img 
                  src={slides[currentSlide].imageUrl}
                  alt={slides[currentSlide].imagePrompt || 'Slide image'} 
                  className="w-full h-auto rounded-lg shadow-md"
                />
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="mt-8 flex justify-between w-full max-w-3xl">
        <Button onClick={prevSlide} disabled={currentSlide === 0} variant="outline">
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button onClick={nextSlide} disabled={currentSlide === slides.length - 1} variant="outline">
          Next <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="mt-4 flex space-x-4">
        <Button onClick={exportToPDF} disabled={isExporting} variant="secondary">
          {isExporting ? 'Exporting...' : 'Export to PDF'}
        </Button>
        <Button onClick={saveDeck} variant="secondary">
          Save Deck
        </Button>
        <Button onClick={() => navigate('/dashboard')} variant="secondary">
          View All Decks
        </Button>
      </div>
    </div>
  )
}
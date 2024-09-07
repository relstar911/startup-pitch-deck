import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { BuildingIcon, LightbulbIcon, GlobeIcon, BarChartIcon, UsersIcon, StarIcon, DollarSignIcon, AlertCircleIcon, CheckCircleIcon, UserIcon, MegaphoneIcon, PiggyBankIcon } from "lucide-react"
import { generateSlideContent } from '@/components/ui/services/openai'

export default function EntryForm() {
  const [formData, setFormData] = useState({
    companyName: '',
    startupIdea: '',
    problemStatement: '',
    solution: '',
    marketDescription: '',
    marketSize: '',
    targetCustomer: '',
    competitors: '',
    uniqueSellingProposition: '',
    revenueModel: '',
    marketingStrategy: '',
    teamMembers: '',
    fundingNeeds: ''
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null) // Add this line
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Reset error state
    try {
      const slideContent = await generateSlideContent(formData);
      navigate('/presentation', { state: { formData, slideContent } });
    } catch (error) {
      console.error('Error generating slide content:', error);
      setError('Failed to generate slide content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <Input
              label="Company Name"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              helperText="Enter your startup's name"
              icon={<BuildingIcon className="w-5 h-5 text-gray-500" />}
            />
            <Textarea
              label="Main Startup Idea"
              id="startupIdea"
              name="startupIdea"
              value={formData.startupIdea}
              onChange={handleChange}
              required
              helperText="Describe your startup's main idea or concept"
              icon={<LightbulbIcon className="w-5 h-5 text-yellow-500" />}
            />
            <Textarea
              label="Problem Statement"
              id="problemStatement"
              name="problemStatement"
              value={formData.problemStatement}
              onChange={handleChange}
              required
              helperText="What problem does your startup solve?"
              icon={<AlertCircleIcon className="w-5 h-5 text-red-500" />}
            />
            <Textarea
              label="Solution"
              id="solution"
              name="solution"
              value={formData.solution}
              onChange={handleChange}
              required
              helperText="How does your startup solve this problem?"
              icon={<CheckCircleIcon className="w-5 h-5 text-green-500" />}
            />
          </>
        )
      case 2:
        return (
          <>
            <Textarea
              label="Market Description"
              id="marketDescription"
              name="marketDescription"
              value={formData.marketDescription}
              onChange={handleChange}
              required
              helperText="Describe your target market"
              icon={<GlobeIcon className="w-5 h-5 text-blue-500" />}
            />
            <Input
              label="Market Size"
              id="marketSize"
              name="marketSize"
              value={formData.marketSize}
              onChange={handleChange}
              required
              helperText="Provide an estimate of your market size"
              icon={<BarChartIcon className="w-5 h-5 text-purple-500" />}
            />
            <Textarea
              label="Target Customer"
              id="targetCustomer"
              name="targetCustomer"
              value={formData.targetCustomer}
              onChange={handleChange}
              required
              helperText="Describe your ideal customer"
              icon={<UserIcon className="w-5 h-5 text-orange-500" />}
            />
            <Textarea
              label="Competitors"
              id="competitors"
              name="competitors"
              value={formData.competitors}
              onChange={handleChange}
              required
              helperText="List your main competitors"
              icon={<UsersIcon className="w-5 h-5 text-red-500" />}
            />
          </>
        )
      case 3:
        return (
          <>
            <Textarea
              label="Unique Selling Proposition"
              id="uniqueSellingProposition"
              name="uniqueSellingProposition"
              value={formData.uniqueSellingProposition}
              onChange={handleChange}
              required
              helperText="What makes your startup unique?"
              icon={<StarIcon className="w-5 h-5 text-yellow-500" />}
            />
            <Textarea
              label="Revenue Model"
              id="revenueModel"
              name="revenueModel"
              value={formData.revenueModel}
              onChange={handleChange}
              required
              helperText="Describe how your startup will generate revenue"
              icon={<DollarSignIcon className="w-5 h-5 text-green-500" />}
            />
            <Textarea
              label="Marketing Strategy"
              id="marketingStrategy"
              name="marketingStrategy"
              value={formData.marketingStrategy}
              onChange={handleChange}
              required
              helperText="Outline your marketing and customer acquisition strategy"
              icon={<MegaphoneIcon className="w-5 h-5 text-blue-500" />}
            />
            <Textarea
              label="Team Members"
              id="teamMembers"
              name="teamMembers"
              value={formData.teamMembers}
              onChange={handleChange}
              required
              helperText="List key team members and their roles"
              icon={<UsersIcon className="w-5 h-5 text-purple-500" />}
            />
            <Textarea
              label="Funding Needs"
              id="fundingNeeds"
              name="fundingNeeds"
              value={formData.fundingNeeds}
              onChange={handleChange}
              required
              helperText="Describe your funding requirements and plans"
              icon={<PiggyBankIcon className="w-5 h-5 text-pink-500" />}
            />
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Enter Your Startup Information</CardTitle>
            <CardDescription>Step {currentStep} of 3</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500 mb-4">{error}</p>} {/* Add this line to display the error */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderFormStep()}
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            {currentStep > 1 && (
              <Button onClick={prevStep} variant="outline">
                Previous
              </Button>
            )}
            {currentStep < 3 ? (
              <Button onClick={nextStep}>Next</Button>
            ) : (
              <Button type="submit" onClick={handleSubmit} className="bg-teal-500 hover:bg-teal-600" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Slides'}
              </Button>
            )}
          </CardFooter>
        </Card>
        <div className="mt-4 flex justify-center">
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            View Saved Decks
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, Clock, Users, ArrowRight, Zap, Mail, AlertTriangle } from 'lucide-react';

const BlendedIndependenceCalculator = () => {
  const [inputs, setInputs] = useState({
    hoursPerWeek: 20,
    hourlyRate: 25,
    platform: 'preply',
    experience: 'intermediate'
  });

  const [results, setResults] = useState(null);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [calculationStep, setCalculationStep] = useState(0);
  const [phase, setPhase] = useState('input'); // input, calculating, shock, results

  const platformData = {
    preply: { 
      newCommission: 0.33, 
      experiencedCommission: 0.18,
      name: 'Preply',
      color: '#EF4444'
    },
    italki: { 
      commission: 0.15, 
      processingFee: 0.029,
      name: 'iTalki',
      color: '#F97316'
    },
    cambly: { 
      fixedRate: 10.20,
      name: 'Cambly',
      color: '#3B82F6'
    },
    verbling: { 
      commission: 0.20,
      name: 'Verbling',
      color: '#8B5CF6'
    }
  };

  const calculatePlatformCosts = () => {
    const { hoursPerWeek, hourlyRate, platform, experience } = inputs;
    const platformInfo = platformData[platform];
    
    let weeklyGross = hoursPerWeek * hourlyRate;
    let commission = 0;
    
    switch (platform) {
      case 'preply':
        commission = experience === 'new' ? 
          platformInfo.newCommission : 
          platformInfo.experiencedCommission;
        break;
      case 'italki':
        commission = platformInfo.commission + platformInfo.processingFee;
        break;
      case 'cambly':
        weeklyGross = hoursPerWeek * platformInfo.fixedRate;
        commission = Math.max(0, 1 - (platformInfo.fixedRate / hourlyRate));
        break;
      case 'verbling':
        commission = platformInfo.commission;
        break;
      default:
        commission = 0.20;
    }

    const weeklyCommission = weeklyGross * commission;
    const weeklyNet = weeklyGross - weeklyCommission;
    
    // Independent calculations
    const independentWeeklyGross = hoursPerWeek * hourlyRate * 1.15; // 15% rate increase
    const paymentFees = independentWeeklyGross * 0.029; // Stripe fees
    const businessCosts = 111; // Monthly business costs
    const weeklyBusinessCosts = businessCosts / 4.33;
    const independentWeeklyNet = independentWeeklyGross - paymentFees - weeklyBusinessCosts;

    return {
      platform: {
        weeklyGross,
        weeklyCommission,
        weeklyNet,
        monthlyGross: weeklyGross * 4.33,
        monthlyCommission: weeklyCommission * 4.33,
        monthlyNet: weeklyNet * 4.33,
        annualGross: weeklyGross * 52,
        annualCommission: weeklyCommission * 52,
        annualNet: weeklyNet * 52
      },
      independent: {
        weeklyGross: independentWeeklyGross,
        weeklyNet: independentWeeklyNet,
        monthlyGross: independentWeeklyGross * 4.33,
        monthlyNet: independentWeeklyNet * 4.33,
        annualGross: independentWeeklyGross * 52,
        annualNet: independentWeeklyNet * 52,
        businessCosts: businessCosts * 12
      },
      comparison: {
        monthlyDifference: (independentWeeklyNet - weeklyNet) * 4.33,
        annualDifference: (independentWeeklyNet - weeklyNet) * 52,
        percentageIncrease: ((independentWeeklyNet - weeklyNet) / weeklyNet) * 100
      },
      platformInfo: platformInfo
    };
  };

  const handleCalculate = () => {
    setPhase('calculating');
    setCalculationStep(1);
    
    // Dramatic calculation sequence
    setTimeout(() => setCalculationStep(2), 1000);
    setTimeout(() => setCalculationStep(3), 2000);
    setTimeout(() => {
      const calculatedResults = calculatePlatformCosts();
      setResults(calculatedResults);
      setCalculationStep(4);
      setPhase('shock');
      setTimeout(() => setShowEmailGate(true), 2000);
    }, 3000);
  };

  const handleEmailSubmit = async (emailData) => {
    try {
      // Track email capture
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'email_capture', {
          event_category: 'calculator',
          event_label: inputs.platform,
          value: results?.comparison?.annualDifference || 0
        });
      }

      // Send to backend API
      const response = await fetch('/api/calculator-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...emailData,
          inputs,
          results
        })
      });

      if (response.ok) {
        setShowEmailGate(false);
        setPhase('results');
        setShowResults(true);
      }
    } catch (error) {
      console.error('Lead capture error:', error);
      // Show results anyway for demo
      setShowEmailGate(false);
      setPhase('results');
      setShowResults(true);
    }
  };

  const formatCurrency = (amount) => {
    return `$${Math.round(amount).toLocaleString()}`;
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 ${
      phase === 'shock' ? 'bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900' : 'bg-stone-50'
    }`}>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className={`font-serif text-5xl md:text-7xl font-bold mb-6 transition-colors duration-1000 ${
            phase === 'shock' ? 'text-stone-50' : 'text-stone-900'
          }`}>
            The <span className="text-red-800">Platform Tax</span> Calculator
          </h1>
          <p className={`text-xl md:text-2xl mb-8 transition-colors duration-1000 ${
            phase === 'shock' ? 'text-stone-300' : 'text-stone-600'
          }`}>
            Discover exactly how much platform dependency is costing you annually
          </p>
          <div className={`flex items-center justify-center space-x-4 transition-colors duration-1000 ${
            phase === 'shock' ? 'text-orange-400' : 'text-orange-600'
          }`}>
            <Zap className="w-6 h-6" />
            <span className="text-lg font-medium">Free • Instant • Eye-Opening Results</span>
            <Zap className="w-6 h-6" />
          </div>
        </motion.div>

        {!showResults ? (
          <div className="max-w-4xl mx-auto">
            {/* Calculator Inputs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`transition-all duration-1000 ${
                phase === 'shock' 
                  ? 'bg-stone-800/90 border-stone-600/30' 
                  : 'bg-white border-stone-200/50'
              } backdrop-blur-md rounded-3xl p-8 mb-8 border shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* Hours per week */}
                <div>
                  <label className={`block text-lg font-semibold mb-4 transition-colors duration-1000 ${
                    phase === 'shock' ? 'text-stone-200' : 'text-stone-700'
                  }`}>
                    <Clock className="inline w-5 h-5 mr-2" />
                    Hours per week teaching
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="5"
                      max="60"
                      value={inputs.hoursPerWeek}
                      onChange={(e) => setInputs({...inputs, hoursPerWeek: parseInt(e.target.value)})}
                      className="w-full h-3 bg-stone-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #D36135 0%, #D36135 ${((inputs.hoursPerWeek - 5) / 55) * 100}%, #E5E7EB ${((inputs.hoursPerWeek - 5) / 55) * 100}%, #E5E7EB 100%)`
                      }}
                    />
                    <div className={`flex justify-between text-sm mt-2 transition-colors duration-1000 ${
                      phase === 'shock' ? 'text-stone-400' : 'text-stone-500'
                    }`}>
                      <span>5 hrs</span>
                      <span className={`text-2xl font-bold transition-colors duration-1000 ${
                        phase === 'shock' ? 'text-stone-100' : 'text-stone-800'
                      }`}>{inputs.hoursPerWeek} hours</span>
                      <span>60 hrs</span>
                    </div>
                  </div>
                </div>

                {/* Hourly rate */}
                <div>
                  <label className={`block text-lg font-semibold mb-4 transition-colors duration-1000 ${
                    phase === 'shock' ? 'text-stone-200' : 'text-stone-700'
                  }`}>
                    <DollarSign className="inline w-5 h-5 mr-2" />
                    Your hourly rate
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputs.hourlyRate}
                      onChange={(e) => setInputs({...inputs, hourlyRate: parseInt(e.target.value) || 0})}
                      className={`w-full p-4 text-2xl font-bold text-center rounded-xl border transition-all duration-1000 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        phase === 'shock' 
                          ? 'bg-stone-700 text-stone-100 border-stone-600' 
                          : 'bg-stone-50 text-stone-800 border-stone-300'
                      }`}
                      min="5"
                      max="200"
                    />
                    <div className={`text-sm mt-2 text-center transition-colors duration-1000 ${
                      phase === 'shock' ? 'text-stone-400' : 'text-stone-500'
                    }`}>
                      ${(inputs.hourlyRate * inputs.hoursPerWeek * 4.33).toLocaleString()}/month gross
                    </div>
                  </div>
                </div>

                {/* Platform selection */}
                <div>
                  <label className={`block text-lg font-semibold mb-4 transition-colors duration-1000 ${
                    phase === 'shock' ? 'text-stone-200' : 'text-stone-700'
                  }`}>
                    <Users className="inline w-5 h-5 mr-2" />
                    Current platform
                  </label>
                  <select
                    value={inputs.platform}
                    onChange={(e) => setInputs({...inputs, platform: e.target.value})}
                    className={`w-full p-4 text-lg rounded-xl border transition-all duration-1000 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      phase === 'shock' 
                        ? 'bg-stone-700 text-stone-100 border-stone-600' 
                        : 'bg-stone-50 text-stone-800 border-stone-300'
                    }`}
                  >
                    <option value="preply">Preply (18-33% commission)</option>
                    <option value="italki">iTalki (15% + fees)</option>
                    <option value="cambly">Cambly (fixed rates)</option>
                    <option value="verbling">Verbling (20% commission)</option>
                  </select>
                </div>

                {/* Experience level */}
                <div>
                  <label className={`block text-lg font-semibold mb-4 transition-colors duration-1000 ${
                    phase === 'shock' ? 'text-stone-200' : 'text-stone-700'
                  }`}>
                    <TrendingUp className="inline w-5 h-5 mr-2" />
                    Platform experience
                  </label>
                  <div className="space-y-3">
                    {['new', 'intermediate', 'experienced'].map((level) => (
                      <label key={level} className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="experience"
                          value={level}
                          checked={inputs.experience === level}
                          onChange={(e) => setInputs({...inputs, experience: e.target.value})}
                          className="mr-3 w-4 h-4 text-orange-600 focus:ring-orange-500"
                        />
                        <span className={`transition-colors duration-1000 group-hover:text-orange-600 ${
                          phase === 'shock' ? 'text-stone-300' : 'text-stone-700'
                        } capitalize`}>
                          {level} {level === 'new' && '(0-6 months)'}
                          {level === 'intermediate' && '(6 months - 2 years)'}
                          {level === 'experienced' && '(2+ years)'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Calculate button */}
              <motion.button
                onClick={handleCalculate}
                disabled={calculationStep > 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-8 p-6 bg-gradient-to-r from-orange-700 to-red-700 hover:from-orange-800 hover:to-red-800 text-white text-2xl font-bold rounded-xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 uppercase tracking-wide"
              >
                {calculationStep === 0 && (
                  <>
                    <AlertTriangle className="inline mr-3 w-6 h-6" />
                    Calculate My Platform Tax
                    <ArrowRight className="inline ml-3 w-6 h-6" />
                  </>
                )}
                {calculationStep === 1 && "Analyzing your earnings..."}
                {calculationStep === 2 && "Computing platform fees..."}
                {calculationStep === 3 && "Calculating your losses..."}
                {calculationStep === 4 && "Shocking results ready!"}
              </motion.button>
            </motion.div>

            {/* Calculation Animation */}
            <AnimatePresence>
              {calculationStep > 0 && calculationStep < 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center py-12"
                >
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mb-6"></div>
                  <div className={`text-xl transition-colors duration-1000 ${
                    phase === 'shock' ? 'text-stone-300' : 'text-stone-700'
                  }`}>
                    {calculationStep === 1 && "Analyzing your teaching income..."}
                    {calculationStep === 2 && "Computing platform commissions..."}
                    {calculationStep === 3 && "Calculating your annual losses..."}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Initial Results Teaser */}
            <AnimatePresence>
              {results && calculationStep === 4 && !showEmailGate && !showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    <h2 className="text-4xl font-bold text-stone-50 mb-6 font-serif">
                      🚨 SHOCKING RESULTS 🚨
                    </h2>
                    <div className="bg-gradient-to-r from-red-800 to-red-900 text-white p-8 rounded-3xl max-w-2xl mx-auto border border-red-700 shadow-2xl">
                      <div className="text-7xl font-bold mb-4 font-serif">
                        {formatCurrency(results.platform.annualCommission)}
                      </div>
                      <div className="text-3xl mb-2">
                        Annual tribute to {results.platformInfo.name}
                      </div>
                      <div className="text-xl opacity-90">
                        That's {formatCurrency(results.platform.monthlyCommission)} every month funding platform shareholders
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <DetailedResults results={results} inputs={inputs} formatCurrency={formatCurrency} />
        )}

        {/* Email Gate */}
        <AnimatePresence>
          {showEmailGate && (
            <EmailGateModal
              onSubmit={handleEmailSubmit}
              results={results}
              formatCurrency={formatCurrency}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Custom CSS for slider styling */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #B85129 0%, #D36135 100%);
          border-radius: 50%;
          margin-top: -10px;
          box-shadow: 0 4px 12px rgba(211, 97, 53, 0.3);
          transition: all 0.15s ease;
          cursor: pointer;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(211, 97, 53, 0.4);
        }
      `}</style>
    </div>
  );
};

// Email Gate Modal Component
const EmailGateModal = ({ onSubmit, results, formatCurrency }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !firstName) return;

    setIsSubmitting(true);
    await onSubmit({ email, firstName });
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onSubmit(null)}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 border-t-4 border-orange-600 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-stone-900 mb-4 font-serif">
            🚨 Your Platform Tax Results 🚨
          </h2>
          
          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 mb-6">
            <div className="text-red-700 text-lg mb-2">You're paying annually:</div>
            <div className="text-5xl font-bold text-red-800 mb-2 font-serif">
              {formatCurrency(results.platform.annualCommission)}
            </div>
            <div className="text-red-600">to platform shareholders</div>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-6">
            <div className="text-green-700 text-lg mb-2">You could earn instead:</div>
            <div className="text-5xl font-bold text-green-800 mb-2 font-serif">
              +{formatCurrency(results.comparison.annualDifference)}
            </div>
            <div className="text-green-600">more per year independent</div>
          </div>
        </div>

        <div className="bg-stone-50 rounded-3xl p-6 mb-6">
          <h3 className="text-2xl font-bold text-stone-900 mb-4 text-center">
            Get Your Complete Independence Analysis
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6 text-sm">
            <div className="flex items-start space-x-3">
              <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
              <div>
                <div className="text-stone-900 font-semibold">5-Year Financial Projection</div>
                <div className="text-stone-600">See your long-term savings potential</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
              <div>
                <div className="text-stone-900 font-semibold">Personalized Action Plan</div>
                <div className="text-stone-600">Step-by-step independence roadmap</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
              <div>
                <div className="text-stone-900 font-semibold">Rate Optimization Guide</div>
                <div className="text-stone-600">Maximize your independent earnings</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</div>
              <div>
                <div className="text-stone-900 font-semibold">Free TutorLingua Trial</div>
                <div className="text-stone-600">14-day platform access</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-4 bg-white text-stone-900 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-white text-stone-900 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />

            <motion.button
              type="submit"
              disabled={isSubmitting || !email || !firstName}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 bg-gradient-to-r from-orange-700 to-orange-800 hover:from-orange-800 hover:to-orange-900 text-white text-xl font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Generating Your Report...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Get My Independence Analysis</span>
                </div>
              )}
            </motion.button>
          </form>

          <div className="flex items-center justify-center space-x-4 mt-4 text-stone-500 text-sm">
            <span>🔒 100% Private</span>
            <span>•</span>
            <span>No Spam Ever</span>
            <span>•</span>
            <span>Unsubscribe Anytime</span>
          </div>
        </div>

        <div className="text-center">
          <div className="text-stone-500 text-sm mb-2">
            Join 2,847+ tutors who discovered their platform tax
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Detailed Results Component
const DetailedResults = ({ results, inputs, formatCurrency }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center bg-gradient-to-r from-red-700 to-red-800 rounded-3xl p-8 text-white shadow-2xl"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif">
          {formatCurrency(results.platform.annualCommission)}
        </h1>
        <p className="text-2xl md:text-3xl mb-2">
          Annual Platform Tax
        </p>
        <p className="text-lg opacity-90">
          That's {formatCurrency(results.platform.monthlyCommission)} every month going to {results.platformInfo.name} shareholders
        </p>
      </motion.div>

      {/* Quick comparison cards */}
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-8 shadow-lg border border-stone-200"
        >
          <h3 className="text-2xl font-bold text-stone-900 mb-6 font-serif">Platform Reality</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-lg">
              <span className="text-stone-600">Monthly Gross:</span>
              <span className="font-bold text-stone-900">{formatCurrency(results.platform.monthlyGross)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-stone-600">Platform Takes:</span>
              <span className="font-bold text-red-700">{formatCurrency(results.platform.monthlyCommission)}</span>
            </div>
            <div className="flex justify-between text-lg border-t border-stone-200 pt-4">
              <span className="text-stone-600">You Keep:</span>
              <span className="font-bold text-stone-900">{formatCurrency(results.platform.monthlyNet)}</span>
            </div>
            <div className="text-sm text-stone-500 text-center mt-4">
              Effective Rate: ${(results.platform.monthlyNet / (inputs.hoursPerWeek * 4.33)).toFixed(2)}/hour
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-8 shadow-lg border border-stone-200"
        >
          <h3 className="text-2xl font-bold text-stone-900 mb-6 font-serif">Independent Reality</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-lg">
              <span className="text-stone-600">Monthly Gross:</span>
              <span className="font-bold text-stone-900">{formatCurrency(results.independent.monthlyGross)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-stone-600">Business Costs:</span>
              <span className="font-bold text-orange-700">{formatCurrency(111)}</span>
            </div>
            <div className="flex justify-between text-lg border-t border-stone-200 pt-4">
              <span className="text-stone-600">You Keep:</span>
              <span className="font-bold text-green-700">{formatCurrency(results.independent.monthlyNet)}</span>
            </div>
            <div className="text-sm text-stone-500 text-center mt-4">
              Effective Rate: ${(results.independent.monthlyNet / (inputs.hoursPerWeek * 4.33)).toFixed(2)}/hour
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-50 to-green-100 rounded-3xl p-8 border-2 border-green-200 text-center"
      >
        <h2 className="text-3xl font-bold text-green-800 mb-4 font-serif">
          Monthly Difference: +{formatCurrency(results.comparison.monthlyDifference)}
        </h2>
        <p className="text-green-700 text-lg">
          That's enough for: rent payment, car payment, vacation savings, or emergency fund contribution
        </p>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-3xl p-8 text-white text-center"
      >
        <h2 className="text-3xl font-bold mb-4 font-serif">Ready to Keep 100% of Your Earnings?</h2>
        <p className="text-xl mb-6 opacity-90">Start your 14-day free trial with TutorLingua today</p>
        <motion.a
          href="https://tutorlingua.com/trial"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block bg-white text-orange-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-stone-50 transition-colors duration-300"
        >
          Start Free Trial →
        </motion.a>
      </motion.div>
    </div>
  );
};

export default BlendedIndependenceCalculator;
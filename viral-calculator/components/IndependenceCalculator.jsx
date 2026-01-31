import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, Clock, Users, ArrowRight, Zap } from 'lucide-react';
import EmailGate from './EmailGate';
import ResultsDisplay from './ResultsDisplay';
import SocialShare from './SocialShare';

const IndependenceCalculator = () => {
  const [inputs, setInputs] = useState({
    hoursPerWeek: 20,
    hourlyRate: 25,
    platform: 'preply',
    experience: 'intermediate',
    currency: 'USD'
  });

  const [results, setResults] = useState(null);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [calculationStep, setCalculationStep] = useState(0);

  const platformData = {
    preply: { 
      newCommission: 0.33, 
      experiencedCommission: 0.18,
      name: 'Preply',
      color: '#FF6B6B'
    },
    italki: { 
      commission: 0.15, 
      processingFee: 0.029,
      name: 'iTalki',
      color: '#FF8E53'
    },
    cambly: { 
      fixedRate: 10.20,
      name: 'Cambly',
      color: '#45B7D1'
    },
    verbling: { 
      commission: 0.20,
      name: 'Verbling',
      color: '#96CEB4'
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
    setCalculationStep(1);
    
    // Dramatic calculation animation
    setTimeout(() => setCalculationStep(2), 1000);
    setTimeout(() => setCalculationStep(3), 2000);
    setTimeout(() => {
      const calculatedResults = calculatePlatformCosts();
      setResults(calculatedResults);
      setCalculationStep(4);
      setTimeout(() => setShowEmailGate(true), 1500);
    }, 3000);
  };

  const handleEmailSubmit = (emailData) => {
    // Track email capture
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'email_capture', {
        event_category: 'calculator',
        event_label: inputs.platform,
        value: results?.comparison?.annualDifference || 0
      });
    }

    setShowEmailGate(false);
    setShowResults(true);
    
    // Send to backend API
    fetch('/api/calculator-leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...emailData,
        inputs,
        results
      })
    });
  };

  const formatCurrency = (amount) => {
    const currencySymbols = { USD: '$', EUR: '€', GBP: '£' };
    return `${currencySymbols[inputs.currency] || '$'}${Math.round(amount).toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            The <span className="text-red-500">Platform Tax</span> Calculator
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Discover exactly how much platform dependency is costing you annually
          </p>
          <div className="flex items-center justify-center space-x-4 text-yellow-400">
            <Zap className="w-6 h-6" />
            <span className="text-lg">Free • Instant • Shocking Results</span>
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
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8"
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* Hours per week */}
                <div>
                  <label className="block text-white text-lg font-semibold mb-4">
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
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-300 mt-2">
                      <span>5 hrs</span>
                      <span className="text-2xl font-bold text-white">{inputs.hoursPerWeek} hours</span>
                      <span>60 hrs</span>
                    </div>
                  </div>
                </div>

                {/* Hourly rate */}
                <div>
                  <label className="block text-white text-lg font-semibold mb-4">
                    <DollarSign className="inline w-5 h-5 mr-2" />
                    Your hourly rate
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputs.hourlyRate}
                      onChange={(e) => setInputs({...inputs, hourlyRate: parseInt(e.target.value) || 0})}
                      className="w-full p-4 text-2xl font-bold text-center bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                      min="5"
                      max="200"
                    />
                    <div className="text-sm text-gray-300 mt-2 text-center">
                      ${inputs.hourlyRate * inputs.hoursPerWeek * 4.33}/month gross
                    </div>
                  </div>
                </div>

                {/* Platform selection */}
                <div>
                  <label className="block text-white text-lg font-semibold mb-4">
                    <Users className="inline w-5 h-5 mr-2" />
                    Current platform
                  </label>
                  <select
                    value={inputs.platform}
                    onChange={(e) => setInputs({...inputs, platform: e.target.value})}
                    className="w-full p-4 text-lg bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="preply">Preply (18-33% commission)</option>
                    <option value="italki">iTalki (15% + fees)</option>
                    <option value="cambly">Cambly (fixed rates)</option>
                    <option value="verbling">Verbling (20% commission)</option>
                  </select>
                </div>

                {/* Experience level */}
                <div>
                  <label className="block text-white text-lg font-semibold mb-4">
                    <TrendingUp className="inline w-5 h-5 mr-2" />
                    Platform experience
                  </label>
                  <div className="space-y-3">
                    {['new', 'intermediate', 'experienced'].map((level) => (
                      <label key={level} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="experience"
                          value={level}
                          checked={inputs.experience === level}
                          onChange={(e) => setInputs({...inputs, experience: e.target.value})}
                          className="mr-3 w-4 h-4 text-purple-500"
                        />
                        <span className="text-white capitalize">
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
                className="w-full mt-8 p-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-2xl font-bold rounded-xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {calculationStep === 0 && (
                  <>
                    Calculate My Platform Tax
                    <ArrowRight className="inline ml-3 w-6 h-6" />
                  </>
                )}
                {calculationStep === 1 && "Calculating your losses..."}
                {calculationStep === 2 && "Computing platform fees..."}
                {calculationStep === 3 && "Analyzing independence benefits..."}
                {calculationStep === 4 && "Results ready!"}
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
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mb-6"></div>
                  <div className="text-white text-xl">
                    Calculating your platform losses...
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
                  <h2 className="text-4xl font-bold text-white mb-6">
                    🚨 SHOCKING RESULTS 🚨
                  </h2>
                  <div className="bg-red-600 text-white p-8 rounded-2xl max-w-2xl mx-auto">
                    <div className="text-6xl font-bold mb-4">
                      {formatCurrency(results.platform.annualCommission)}
                    </div>
                    <div className="text-2xl">
                      Annual tribute to {results.platformInfo.name}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <ResultsDisplay results={results} inputs={inputs} formatCurrency={formatCurrency} />
        )}

        {/* Email Gate */}
        <AnimatePresence>
          {showEmailGate && (
            <EmailGate
              onSubmit={handleEmailSubmit}
              results={results}
              formatCurrency={formatCurrency}
            />
          )}
        </AnimatePresence>

        {/* Social Share */}
        {showResults && (
          <SocialShare 
            results={results} 
            platform={platformData[inputs.platform].name}
            formatCurrency={formatCurrency}
          />
        )}
      </div>
    </div>
  );
};

export default IndependenceCalculator;
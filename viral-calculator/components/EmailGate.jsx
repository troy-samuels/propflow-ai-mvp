import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Gift, TrendingUp, FileText, Calculator } from 'lucide-react';

const EmailGate = ({ onSubmit, results, formatCurrency }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !firstName) return;

    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onSubmit({ email, firstName });
      setIsSubmitting(false);
    }, 1000);
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
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-2xl w-full mx-4 border border-purple-500/30"
      >
        {/* Shocking Results Preview */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            🚨 Your Platform Tax Results 🚨
          </h2>
          
          <div className="bg-red-600/20 border border-red-500 rounded-xl p-6 mb-6">
            <div className="text-red-300 text-lg mb-2">You're paying annually:</div>
            <div className="text-5xl font-bold text-red-400 mb-2">
              {formatCurrency(results.platform.annualCommission)}
            </div>
            <div className="text-red-300">to platform shareholders</div>
          </div>

          <div className="bg-green-600/20 border border-green-500 rounded-xl p-6">
            <div className="text-green-300 text-lg mb-2">You could earn instead:</div>
            <div className="text-5xl font-bold text-green-400 mb-2">
              +{formatCurrency(results.comparison.annualDifference)}
            </div>
            <div className="text-green-300">more per year independent</div>
          </div>
        </div>

        {/* Email Form */}
        <div className="bg-white/10 rounded-xl p-6 mb-6">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">
            Get Your Complete Independence Analysis
          </h3>
          
          {/* Benefits List */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <div className="text-white font-semibold">5-Year Projection Report</div>
                <div className="text-gray-300 text-sm">See your long-term financial impact</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <div className="text-white font-semibold">Personalized Action Plan</div>
                <div className="text-gray-300 text-sm">Step-by-step independence roadmap</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Calculator className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <div className="text-white font-semibold">Rate Optimization Guide</div>
                <div className="text-gray-300 text-sm">Maximize your independent earnings</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Gift className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <div className="text-white font-semibold">Free Trial Access</div>
                <div className="text-gray-300 text-sm">14-day TutorLingua platform trial</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-4 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
            
            <div>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting || !email || !firstName}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-xl font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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

          {/* Trust Signals */}
          <div className="flex items-center justify-center space-x-4 mt-4 text-gray-400 text-sm">
            <div className="flex items-center space-x-1">
              <Lock className="w-4 h-4" />
              <span>100% Private</span>
            </div>
            <div>•</div>
            <div>No Spam Ever</div>
            <div>•</div>
            <div>Unsubscribe Anytime</div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-2">
            Join 2,847+ tutors who discovered their platform tax
          </div>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
            ))}
            <div className="text-white text-sm self-center ml-2">and 2,842 others</div>
          </div>
        </div>

        {/* Close option */}
        <div className="text-center mt-6">
          <button
            onClick={() => onSubmit(null)}
            className="text-gray-400 hover:text-white text-sm underline"
          >
            Maybe later (you'll miss the free analysis)
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EmailGate;
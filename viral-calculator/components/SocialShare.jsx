import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';

const SocialShare = ({ results, platform, formatCurrency }) => {
  const [copied, setCopied] = useState(false);
  const [shareCount, setShareCount] = useState(1247); // Initial share count

  const baseUrl = "https://tutorlingua.com/calculator";
  const annualTax = formatCurrency(results.platform.annualCommission);
  const savings = formatCurrency(results.comparison.annualDifference);

  const shareMessages = {
    twitter: `🚨 I just discovered I'm paying ${annualTax} annually in platform fees! That's ${Math.round(results.platform.annualCommission / (results.platform.monthlyNet / 30))} days of work for FREE.

Check your platform tax: ${baseUrl}

#TutorLife #PlatformFees #IndependentTutor`,

    linkedin: `After using the TutorLingua Platform Tax Calculator, I discovered something shocking:

💸 Annual platform fees: ${annualTax}
💰 Potential independence savings: +${savings}
📈 Income increase: +${Math.round(results.comparison.percentageIncrease)}%

For fellow language educators: this tool shows exactly how much platform dependency costs. The results might surprise you.

Calculate yours: ${baseUrl}

#LanguageEducation #OnlineTutoring #IndependentEducator`,

    facebook: `Just calculated my "platform tax" and I'm shocked! 😱

I'm paying ${annualTax} every year to ${platform} - that's ${Math.round(results.platform.monthlyCommission)} every month going to shareholders instead of my family.

If I went independent, I could earn ${savings} more annually. That's enough for:
• Family vacation ✈️
• Emergency fund 💰
• Car payment 🚗
• Home improvements 🏠

Other tutors should check their numbers too: ${baseUrl}`,

    whatsapp: `Hey! I just found out I'm paying ${annualTax} per year to ${platform} in fees 😲

That's like working ${Math.round(results.platform.annualCommission / (results.platform.monthlyNet * 12 / 52))} weeks for FREE every year!

Check how much your platform is costing you: ${baseUrl}`,

    reddit: `PSA: Calculate Your Platform Tax Before It's Too Late

I just used this calculator and discovered I'm paying ${annualTax} annually to ${platform}. That's ${Math.round(results.comparison.percentageIncrease)}% of my potential income!

The breakdown:
- Platform commission: ${formatCurrency(results.platform.monthlyCommission)}/month
- Opportunity cost: ${savings}/year
- Break-even for independence: ${Math.round(111 / (results.comparison.monthlyDifference))} months

Link: ${baseUrl}

For anyone teaching on platforms, this is eye-opening. The math doesn't lie.`,

    generic: `I'm paying ${annualTax} per year in platform fees! 😱 That could be ${savings} more in my pocket. Calculate your platform tax: ${baseUrl}`
  };

  const handleShare = async (platform) => {
    const message = shareMessages[platform] || shareMessages.generic;
    
    // Track sharing
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'share', {
        event_category: 'calculator',
        event_label: platform,
        value: results.platform.annualCommission
      });
    }

    // Increment share count with animation
    setShareCount(prev => prev + 1);

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(baseUrl)}&summary=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(baseUrl)}&quote=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(message);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = message;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
        break;
    }
  };

  const shareButtons = [
    {
      platform: 'twitter',
      icon: Twitter,
      label: 'Twitter',
      color: 'from-blue-400 to-blue-600',
      hoverColor: 'hover:from-blue-500 hover:to-blue-700'
    },
    {
      platform: 'linkedin',
      icon: Linkedin,
      label: 'LinkedIn',
      color: 'from-blue-600 to-blue-800',
      hoverColor: 'hover:from-blue-700 hover:to-blue-900'
    },
    {
      platform: 'facebook',
      icon: Facebook,
      label: 'Facebook',
      color: 'from-blue-500 to-blue-700',
      hoverColor: 'hover:from-blue-600 hover:to-blue-800'
    },
    {
      platform: 'whatsapp',
      icon: MessageCircle,
      label: 'WhatsApp',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mt-12"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4"
        >
          <Share2 className="w-8 h-8 text-white" />
        </motion.div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Help Other Tutors Discover Their Platform Tax
        </h2>
        
        <p className="text-xl text-gray-300 mb-2">
          Your results are shocking. Other tutors deserve to know the truth.
        </p>
        
        <motion.div
          key={shareCount}
          initial={{ scale: 1.2, color: "#10B981" }}
          animate={{ scale: 1, color: "#9CA3AF" }}
          className="text-lg"
        >
          {shareCount.toLocaleString()} tutors have shared their results
        </motion.div>
      </div>

      {/* Quick Stats for Sharing */}
      <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-white mb-4 text-center">Share Your Shocking Results</h3>
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-400">{annualTax}</div>
            <div className="text-gray-300 text-sm">Annual platform tax</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">+{Math.round(results.comparison.percentageIncrease)}%</div>
            <div className="text-gray-300 text-sm">Potential income increase</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">{Math.round(results.platform.annualCommission / (results.platform.monthlyNet * 12 / 52))}</div>
            <div className="text-gray-300 text-sm">Weeks working for free</div>
          </div>
        </div>
      </div>

      {/* Social Media Buttons */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {shareButtons.map((button) => {
            const Icon = button.icon;
            return (
              <motion.button
                key={button.platform}
                onClick={() => handleShare(button.platform)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-r ${button.color} ${button.hoverColor} text-white p-4 rounded-lg flex flex-col items-center space-y-2 transition-all duration-300`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-semibold">{button.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Copy Link Button */}
        <motion.button
          onClick={() => handleShare('copy')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-green-400" />
              <span>Copied to clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              <span>Copy Share Message</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Viral Incentive */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6 text-center"
      >
        <h3 className="text-xl font-bold text-white mb-3">
          💝 Share & Get Exclusive Benefits
        </h3>
        <p className="text-gray-300 mb-4">
          Help 3 tutors discover their platform tax and unlock:
        </p>
        <div className="space-y-2 text-left max-w-md mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-gray-300">Extended 21-day free trial (vs 14 days)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-gray-300">Free independence consultation call</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-gray-300">Platform exit strategy guide</span>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
        >
          Track My Shares
        </motion.button>
      </motion.div>

      {/* Platform-Specific Messages */}
      <div className="mt-8 space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800/50 rounded-lg p-4"
        >
          <h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
            <MessageCircle className="w-4 h-4 text-blue-400" />
            <span>Suggested message for tutor groups:</span>
          </h4>
          <p className="text-gray-300 text-sm italic">
            "Just calculated my platform tax - ${Math.round(results.platform.annualCommission/1000)}k per year! 😱 
            That's like {Math.round(results.platform.annualCommission / (results.platform.monthlyNet * 12 / 52))} weeks 
            of unpaid work. Other tutors should check their numbers too: {baseUrl}"
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-800/50 rounded-lg p-4"
        >
          <h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
            <Twitter className="w-4 h-4 text-blue-400" />
            <span>Tweet template (copy & customize):</span>
          </h4>
          <div className="text-gray-300 text-sm bg-gray-900/50 p-3 rounded border-l-4 border-blue-500">
            <p className="mb-2">🚨 Platform tax shock: {annualTax}/year to {platform}</p>
            <p className="mb-2">That's {Math.round(results.comparison.percentageIncrease)}% of my potential income! 💸</p>
            <p className="mb-2">Calculate yours: {baseUrl}</p>
            <p className="text-blue-400">#TutorLife #PlatformFees #IndependentTutor</p>
          </div>
        </motion.div>
      </div>

      {/* Viral Loop Tracking */}
      <div className="mt-8 text-center">
        <div className="text-gray-400 text-sm">
          🔥 This calculator has exposed ${((shareCount * results.platform.annualCommission) / 1000000).toFixed(1)}M+ in platform fees
        </div>
      </div>
    </motion.div>
  );
};

export default SocialShare;
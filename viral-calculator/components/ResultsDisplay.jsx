import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  PiggyBank, 
  Target,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Download
} from 'lucide-react';

const ResultsDisplay = ({ results, inputs, formatCurrency }) => {
  const [expandedSection, setExpandedSection] = useState('summary');

  const sections = [
    { id: 'summary', title: 'Executive Summary', icon: TrendingUp },
    { id: 'breakdown', title: 'Cost Breakdown', icon: DollarSign },
    { id: 'timeline', title: '5-Year Projection', icon: Calendar },
    { id: 'opportunity', title: 'Opportunity Cost', icon: PiggyBank },
    { id: 'action', title: 'Action Plan', icon: Target }
  ];

  const generateYearlyProjection = () => {
    const years = [];
    for (let year = 1; year <= 5; year++) {
      const platformCost = results.platform.annualCommission;
      const independentSavings = results.comparison.annualDifference;
      const compoundingSavings = independentSavings * year;
      
      years.push({
        year,
        platformCost: platformCost * year,
        independentEarnings: (results.independent.annualNet * year),
        cumulativeSavings: compoundingSavings,
        investmentValue: compoundingSavings * Math.pow(1.07, year) // 7% return
      });
    }
    return years;
  };

  const yearlyProjection = generateYearlyProjection();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Shocking Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {formatCurrency(results.platform.annualCommission)}
        </h1>
        <p className="text-2xl md:text-3xl mb-2">
          Annual Platform Tax
        </p>
        <p className="text-lg opacity-90">
          That's {formatCurrency(results.platform.monthlyCommission)} every month going to platform shareholders
        </p>
      </motion.div>

      {/* Quick Wins */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-green-600/20 border border-green-500 rounded-xl p-6 text-center"
        >
          <div className="text-green-400 text-3xl font-bold mb-2">
            +{Math.round(results.comparison.percentageIncrease)}%
          </div>
          <div className="text-green-300">Income Increase</div>
          <div className="text-green-200 text-sm mt-2">
            Going independent
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-600/20 border border-blue-500 rounded-xl p-6 text-center"
        >
          <div className="text-blue-400 text-3xl font-bold mb-2">
            {Math.round(results.platform.annualCommission / (inputs.hourlyRate * inputs.hoursPerWeek))} weeks
          </div>
          <div className="text-blue-300">Work for Free</div>
          <div className="text-blue-200 text-sm mt-2">
            To pay platform fees
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-purple-600/20 border border-purple-500 rounded-xl p-6 text-center"
        >
          <div className="text-purple-400 text-3xl font-bold mb-2">
            {formatCurrency(yearlyProjection[4].cumulativeSavings)}
          </div>
          <div className="text-purple-300">5-Year Savings</div>
          <div className="text-purple-200 text-sm mt-2">
            Independence benefit
          </div>
        </motion.div>
      </div>

      {/* Detailed Sections */}
      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;
          
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Icon className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">{section.title}</h3>
                </div>
                {isExpanded ? 
                  <ChevronUp className="w-6 h-6 text-gray-400" /> : 
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                }
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-6"
                >
                  {section.id === 'summary' && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-red-400 mb-3">Platform Reality</h4>
                          <div className="space-y-2 text-gray-300">
                            <div>Monthly Gross: {formatCurrency(results.platform.monthlyGross)}</div>
                            <div>Platform Takes: <span className="text-red-400">{formatCurrency(results.platform.monthlyCommission)}</span></div>
                            <div>You Keep: {formatCurrency(results.platform.monthlyNet)}</div>
                            <div className="text-sm text-gray-400">
                              Effective Rate: ${(results.platform.monthlyNet / (inputs.hoursPerWeek * 4.33)).toFixed(2)}/hour
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-green-400 mb-3">Independent Reality</h4>
                          <div className="space-y-2 text-gray-300">
                            <div>Monthly Gross: {formatCurrency(results.independent.monthlyGross)}</div>
                            <div>Business Costs: <span className="text-yellow-400">{formatCurrency(111)}</span></div>
                            <div>You Keep: <span className="text-green-400">{formatCurrency(results.independent.monthlyNet)}</span></div>
                            <div className="text-sm text-gray-400">
                              Effective Rate: ${(results.independent.monthlyNet / (inputs.hoursPerWeek * 4.33)).toFixed(2)}/hour
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg p-6 border border-green-500/30">
                        <h4 className="text-2xl font-bold text-white mb-2">
                          Monthly Difference: +{formatCurrency(results.comparison.monthlyDifference)}
                        </h4>
                        <p className="text-gray-300">
                          That's enough for: rent payment, car payment, vacation savings, or emergency fund contribution
                        </p>
                      </div>
                    </div>
                  )}

                  {section.id === 'breakdown' && (
                    <div className="space-y-6">
                      <div className="overflow-x-auto">
                        <table className="w-full text-gray-300">
                          <thead>
                            <tr className="border-b border-gray-600">
                              <th className="text-left py-2">Expense Category</th>
                              <th className="text-right py-2">Platform</th>
                              <th className="text-right py-2">Independent</th>
                              <th className="text-right py-2">Difference</th>
                            </tr>
                          </thead>
                          <tbody className="space-y-2">
                            <tr className="border-b border-gray-700">
                              <td className="py-2">Commission/Platform Fees</td>
                              <td className="text-right text-red-400">{formatCurrency(results.platform.monthlyCommission)}</td>
                              <td className="text-right text-gray-400">$0</td>
                              <td className="text-right text-green-400">-{formatCurrency(results.platform.monthlyCommission)}</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                              <td className="py-2">Payment Processing</td>
                              <td className="text-right text-gray-400">Included</td>
                              <td className="text-right text-yellow-400">${Math.round(results.independent.monthlyGross * 0.029)}</td>
                              <td className="text-right text-yellow-400">+${Math.round(results.independent.monthlyGross * 0.029)}</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                              <td className="py-2">Business Platform</td>
                              <td className="text-right text-gray-400">$0</td>
                              <td className="text-right text-yellow-400">$39</td>
                              <td className="text-right text-yellow-400">+$39</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                              <td className="py-2">Marketing & Tools</td>
                              <td className="text-right text-gray-400">$0</td>
                              <td className="text-right text-yellow-400">$72</td>
                              <td className="text-right text-yellow-400">+$72</td>
                            </tr>
                            <tr className="bg-gray-800/50">
                              <td className="py-3 font-bold">Net Difference</td>
                              <td className="text-right"></td>
                              <td className="text-right"></td>
                              <td className="text-right text-green-400 font-bold text-xl">
                                +{formatCurrency(results.comparison.monthlyDifference)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {section.id === 'timeline' && (
                    <div className="space-y-6">
                      <div className="overflow-x-auto">
                        <table className="w-full text-gray-300">
                          <thead>
                            <tr className="border-b border-gray-600">
                              <th className="text-left py-2">Year</th>
                              <th className="text-right py-2">Platform Fees Paid</th>
                              <th className="text-right py-2">Independent Earnings</th>
                              <th className="text-right py-2">Cumulative Difference</th>
                            </tr>
                          </thead>
                          <tbody>
                            {yearlyProjection.map((year) => (
                              <tr key={year.year} className="border-b border-gray-700">
                                <td className="py-2">Year {year.year}</td>
                                <td className="text-right text-red-400">{formatCurrency(year.platformCost)}</td>
                                <td className="text-right text-green-400">{formatCurrency(year.independentEarnings)}</td>
                                <td className="text-right text-green-400 font-bold">{formatCurrency(year.cumulativeSavings)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="bg-blue-600/20 border border-blue-500 rounded-lg p-4">
                        <h4 className="text-lg font-bold text-blue-400 mb-2">5-Year Impact Summary</h4>
                        <div className="text-gray-300">
                          <div>Total Platform Fees: <span className="text-red-400">{formatCurrency(yearlyProjection[4].platformCost)}</span></div>
                          <div>Total Independence Benefit: <span className="text-green-400">{formatCurrency(yearlyProjection[4].cumulativeSavings)}</span></div>
                          <div>If invested at 7% return: <span className="text-blue-400">{formatCurrency(yearlyProjection[4].investmentValue)}</span></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {section.id === 'opportunity' && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-red-600/20 border border-red-500 rounded-lg p-6">
                          <h4 className="text-xl font-bold text-red-400 mb-4">What You're Losing</h4>
                          <div className="space-y-3 text-gray-300">
                            <div className="flex justify-between">
                              <span>Monthly platform tribute:</span>
                              <span className="text-red-400">{formatCurrency(results.platform.monthlyCommission)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Hours working for free:</span>
                              <span className="text-red-400">{Math.round(results.platform.monthlyCommission / inputs.hourlyRate)} hours</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Weeks per year for platform:</span>
                              <span className="text-red-400">{Math.round(results.platform.annualCommission / (inputs.hourlyRate * inputs.hoursPerWeek))} weeks</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-600/20 border border-green-500 rounded-lg p-6">
                          <h4 className="text-xl font-bold text-green-400 mb-4">What You Could Gain</h4>
                          <div className="space-y-3 text-gray-300">
                            <div className="flex justify-between">
                              <span>Extra monthly income:</span>
                              <span className="text-green-400">{formatCurrency(results.comparison.monthlyDifference)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Vacation fund per year:</span>
                              <span className="text-green-400">{formatCurrency(results.comparison.annualDifference / 4)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Emergency fund:</span>
                              <span className="text-green-400">{Math.round(results.comparison.annualDifference / (results.independent.monthlyNet / 3))} months</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-600/20 border border-purple-500 rounded-lg p-6">
                        <h4 className="text-xl font-bold text-purple-400 mb-4">Investment Opportunity</h4>
                        <p className="text-gray-300 mb-4">
                          If you invested your platform fees instead of paying them:
                        </p>
                        <div className="space-y-2 text-gray-300">
                          <div>Annual platform fees: <span className="text-red-400">{formatCurrency(results.platform.annualCommission)}</span></div>
                          <div>Same amount invested (7% return): <span className="text-green-400">{formatCurrency(results.platform.annualCommission * 1.07)}</span></div>
                          <div>5-year investment value: <span className="text-purple-400">{formatCurrency(yearlyProjection[4].investmentValue)}</span></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {section.id === 'action' && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-6 border border-purple-500/30">
                        <h4 className="text-2xl font-bold text-white mb-4">Your Independence Roadmap</h4>
                        <p className="text-gray-300 mb-4">
                          Based on your current situation, here's your path to financial independence:
                        </p>
                        
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                            <div>
                              <h5 className="text-white font-semibold">Start Your Free Trial</h5>
                              <p className="text-gray-300 text-sm">Test TutorLingua with no commitment. See the difference in 14 days.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                            <div>
                              <h5 className="text-white font-semibold">Transition Gradually</h5>
                              <p className="text-gray-300 text-sm">Keep platform active while building direct relationships.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                            <div>
                              <h5 className="text-white font-semibold">Optimize Pricing</h5>
                              <p className="text-gray-300 text-sm">Raise your rates to ${Math.round(inputs.hourlyRate * 1.15)}/hour (suggested independent rate).</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
                            <div>
                              <h5 className="text-white font-semibold">Scale Your Business</h5>
                              <p className="text-gray-300 text-sm">Add group classes, digital products, and premium services.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <motion.a
                          href="https://tutorlingua.com/trial"
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.02 }}
                          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-6 rounded-xl text-center block transition-all duration-300"
                        >
                          <ExternalLink className="w-8 h-8 mx-auto mb-3" />
                          <div className="text-xl font-bold mb-2">Start Free Trial</div>
                          <div className="text-purple-200">14 days • No credit card required</div>
                        </motion.a>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => window.print()}
                          className="bg-gray-700 hover:bg-gray-600 text-white p-6 rounded-xl text-center transition-all duration-300"
                        >
                          <Download className="w-8 h-8 mx-auto mb-3" />
                          <div className="text-xl font-bold mb-2">Download Report</div>
                          <div className="text-gray-300">Save your analysis as PDF</div>
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsDisplay;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Check, 
  X, 
  Star,
  Users,
  Zap,
  Shield,
  Brain,
  BarChart3,
  Clock,
  Award,
  Headphones
} from 'lucide-react';

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individual educators getting started',
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        'Up to 100 students',
        'Basic AI grading',
        '5 courses',
        'Standard rubrics',
        'Email support',
        'Basic analytics'
      ],
      limitations: [
        'Advanced AI features',
        'Custom integrations',
        'Priority support'
      ],
      popular: false,
      color: 'blue'
    },
    {
      name: 'Professional',
      description: 'Ideal for departments and growing institutions',
      monthlyPrice: 79,
      annualPrice: 790,
      features: [
        'Up to 500 students',
        'Advanced AI grading',
        'Unlimited courses',
        'Custom rubrics',
        'Priority support',
        'Advanced analytics',
        'Bulk operations',
        'Grade export',
        'Team collaboration'
      ],
      limitations: [
        'White-label options'
      ],
      popular: true,
      color: 'purple'
    },
    {
      name: 'Enterprise',
      description: 'For large institutions with custom needs',
      monthlyPrice: 199,
      annualPrice: 1990,
      features: [
        'Unlimited students',
        'Premium AI grading',
        'Unlimited courses',
        'Custom rubrics',
        '24/7 dedicated support',
        'Enterprise analytics',
        'API access',
        'SSO integration',
        'Custom training',
        'White-label options',
        'SLA guarantee'
      ],
      limitations: [],
      popular: false,
      color: 'green'
    }
  ];

  const features = [
    {
      category: 'Core Features',
      items: [
        { name: 'AI-Powered Grading', starter: true, professional: true, enterprise: true },
        { name: 'Custom Rubrics', starter: 'Basic', professional: true, enterprise: true },
        { name: 'Student Portal', starter: true, professional: true, enterprise: true },
        { name: 'Grade Analytics', starter: 'Basic', professional: 'Advanced', enterprise: 'Enterprise' },
        { name: 'File Upload Support', starter: true, professional: true, enterprise: true }
      ]
    },
    {
      category: 'Advanced Features',
      items: [
        { name: 'Bulk Operations', starter: false, professional: true, enterprise: true },
        { name: 'API Access', starter: false, professional: false, enterprise: true },
        { name: 'SSO Integration', starter: false, professional: false, enterprise: true },
        { name: 'White-label Options', starter: false, professional: false, enterprise: true },
        { name: 'Custom Training', starter: false, professional: false, enterprise: true }
      ]
    },
    {
      category: 'Support & Service',
      items: [
        { name: 'Email Support', starter: true, professional: true, enterprise: true },
        { name: 'Priority Support', starter: false, professional: true, enterprise: true },
        { name: '24/7 Dedicated Support', starter: false, professional: false, enterprise: true },
        { name: 'SLA Guarantee', starter: false, professional: false, enterprise: true },
        { name: 'Onboarding Assistance', starter: false, professional: true, enterprise: true }
      ]
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Jennifer Martinez',
      role: 'Computer Science Professor',
      institution: 'Stanford University',
      content: 'Gradrly has transformed how I provide feedback. My students get detailed responses in minutes, not days.',
      rating: 5,
      plan: 'Professional'
    },
    {
      name: 'Prof. David Chen',
      role: 'Mathematics Department Head',
      institution: 'MIT',
      content: 'The enterprise features have streamlined our entire grading workflow across 15 courses.',
      rating: 5,
      plan: 'Enterprise'
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    return isAnnual ? plan.annualPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: typeof plans[0]) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const annualCost = plan.annualPrice;
    return monthlyCost - annualCost;
  };

  const getPlanColor = (color: string) => {
    switch (color) {
      case 'blue': return 'from-blue-500 to-blue-600';
      case 'purple': return 'from-purple-500 to-purple-600';
      case 'green': return 'from-green-500 to-green-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const renderFeatureValue = (value: boolean | string) => {
    if (value === true) {
      return <Check className="h-5 w-5 text-green-500" />;
    } else if (value === false) {
      return <X className="h-5 w-5 text-gray-300" />;
    } else {
      return <span className="text-sm text-gray-600">{value}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/Gradrly logo 2.png" 
                alt="Gradrly" 
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Gradrly
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Choose the perfect plan for your institution. All plans include our core AI grading features 
              with no hidden fees or setup costs.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-10">
              <span className={`text-lg ${!isAnnual ? 'text-white' : 'text-blue-200'}`}>Monthly</span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-lg ${isAnnual ? 'text-white' : 'text-blue-200'}`}>
                Annual
                <span className="ml-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">Save 20%</span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                  plan.popular ? 'ring-2 ring-purple-500 transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-2">
                    <span className="font-semibold">Most Popular</span>
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">${getPrice(plan)}</span>
                      <span className="text-gray-600 ml-2">/{isAnnual ? 'year' : 'month'}</span>
                    </div>
                    {isAnnual && (
                      <p className="text-green-600 text-sm mt-1">
                        Save ${getSavings(plan)} per year
                      </p>
                    )}
                  </div>

                  <Link
                    to="/register"
                    className={`w-full bg-gradient-to-r ${getPlanColor(plan.color)} text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity block text-center mb-6`}
                  >
                    Get Started
                  </Link>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">What's included:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {plan.limitations.length > 0 && (
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">Not included:</h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, limitIndex) => (
                            <li key={limitIndex} className="flex items-center space-x-3">
                              <X className="h-5 w-5 text-gray-400 flex-shrink-0" />
                              <span className="text-gray-500 text-sm">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Compare All Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See exactly what's included in each plan to make the best choice for your needs.
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Features</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Starter</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Professional</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {features.map((category, categoryIndex) => (
                  <React.Fragment key={category.category}>
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="py-3 px-6 font-semibold text-gray-900">
                        {category.category}
                      </td>
                    </tr>
                    {category.items.map((item, itemIndex) => (
                      <tr key={itemIndex} className="border-b border-gray-100">
                        <td className="py-4 px-6 text-gray-700">{item.name}</td>
                        <td className="py-4 px-6 text-center">{renderFeatureValue(item.starter)}</td>
                        <td className="py-4 px-6 text-center">{renderFeatureValue(item.professional)}</td>
                        <td className="py-4 px-6 text-center">{renderFeatureValue(item.enterprise)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What Our Customers Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-gray-600">{testimonial.institution}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {testimonial.plan}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change plans at any time?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate any billing adjustments.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial available?
              </h3>
              <p className="text-gray-600">
                We offer a 14-day free trial for all plans. No credit card required to get started.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and can arrange invoicing for enterprise customers.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How does the AI grading work?
              </h3>
              <p className="text-gray-600">
                Our AI uses advanced natural language processing to evaluate submissions against your rubrics, 
                providing detailed feedback and scores while maintaining consistency across all grading.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Grading?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Start your free trial today. No credit card required.
            </p>
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl inline-flex items-center"
            >
              Start Free Trial
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img 
                src="/Gradrly logo 2.png" 
                alt="Gradrly" 
                className="h-8 w-8 object-contain"
              />
              <span className="text-2xl font-bold">Gradrly</span>
            </div>
            <p className="text-gray-400 mb-8">Transparent pricing for intelligent grading solutions.</p>
            <div className="flex justify-center space-x-8 text-sm text-gray-400">
              <Link to="/about" className="hover:text-white transition-colors">About</Link>
              <Link to="/student-portal" className="hover:text-white transition-colors">Student Portal</Link>
              <Link to="/grader-portal" className="hover:text-white transition-colors">Grader Portal</Link>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
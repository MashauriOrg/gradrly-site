import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Brain, 
  Users, 
  BarChart3, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Grading',
      description: 'Advanced AI algorithms provide consistent, detailed feedback and scoring for student assignments.'
    },
    {
      icon: Users,
      title: 'Multi-Role Support',
      description: 'Seamlessly manage professors, students, and graders across multiple institutions.'
    },
    {
      icon: BarChart3,
      title: 'Comprehensive Analytics',
      description: 'Track performance trends and generate detailed reports for informed decision-making.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security ensures your academic data remains protected and private.'
    },
    {
      icon: Zap,
      title: 'Instant Feedback',
      description: 'Students receive immediate, actionable feedback to accelerate their learning process.'
    },
    {
      icon: GraduationCap,
      title: 'Rubric Builder',
      description: 'Create detailed, customizable rubrics that align with your educational objectives.'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Professor of Computer Science',
      institution: 'Stanford University',
      content: 'Gradrly has revolutionized how I grade assignments. The AI feedback is incredibly detailed and saves me hours every week.',
      rating: 5
    },
    {
      name: 'Prof. Michael Chen',
      role: 'Mathematics Department',
      institution: 'MIT',
      content: 'The rubric builder is intuitive and the analytics help me understand my students\' progress like never before.',
      rating: 5
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'English Literature',
      institution: 'Harvard University',
      content: 'My students love the instant feedback, and I appreciate how it maintains consistency across all submissions.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-800 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation */}
          <nav className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-2">
              <img 
                src="/Gradrly logo 2.png" 
                alt="Gradrly" 
                className="h-8 w-8 object-contain"
              />
              <span className="text-2xl font-bold text-white">Gradrly</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/about"
                className="text-white hover:text-blue-200 px-4 py-2 rounded-lg transition-colors"
              >
                About
              </Link>
              <Link
                to="/pricing"
                className="text-white hover:text-blue-200 px-4 py-2 rounded-lg transition-colors"
              >
                Pricing
              </Link>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="py-20 lg:py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Transform Academic
                <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent block">
                  Grading with AI
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                Streamline assignment grading, provide instant feedback, and enhance learning outcomes 
                with our intelligent academic platform designed for modern education.
              </p>
              
              {/* Call-to-Action Buttons */}
              <div className="flex flex-col lg:flex-row gap-6 justify-center items-center max-w-4xl mx-auto">
                {/* Mentor Sign In */}
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20 flex-1 max-w-md">
                  <div className="text-center mb-6">
                    <div className="bg-white bg-opacity-20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">For Mentors</h3>
                    <p className="text-blue-100 text-sm">Review and manage student submissions</p>
                  </div>
                  <a
                    href="https://app.gradrly.com/login?role=mentor"
                    className="block w-full bg-white text-blue-900 px-6 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl text-center"
                  >
                    Mentor Sign In
                    <ArrowRight className="inline-block ml-2 h-5 w-5" />
                  </a>
                </div>

                {/* Student Sign In */}
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20 flex-1 max-w-md">
                  <div className="text-center mb-6">
                    <div className="bg-white bg-opacity-20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <GraduationCap className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">For Students</h3>
                    <p className="text-blue-100 text-sm">Submit assignments and view feedback</p>
                  </div>
                  <a
                    href="https://app.gradrly.com/login?role=student"
                    className="block w-full bg-white text-blue-900 px-6 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl text-center"
                  >
                    Student Sign In
                    <ArrowRight className="inline-block ml-2 h-5 w-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                Modern Grading
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform combines cutting-edge AI with intuitive design 
              to revolutionize how educators assess and provide feedback on student work.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl w-fit mb-6">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Leading
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                Educational Institutions
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-2xl"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-blue-600">{testimonial.institution}</p>
                </div>
              </motion.div>
            ))}
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
              Ready to Transform Your Grading Process?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Join thousands of educators who have already revolutionized their workflow with Gradrly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://app.gradrly.com/login"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl inline-flex items-center justify-center"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
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
            <p className="text-gray-400 mb-8">Transforming education through intelligent grading solutions.</p>
            <div className="flex justify-center space-x-8 text-sm text-gray-400">
              <Link to="/student-portal" className="hover:text-white transition-colors">Student Portal</Link>
              <Link to="/grader-portal" className="hover:text-white transition-colors">Grader Portal</Link>
              <Link to="/about" className="hover:text-white transition-colors">About</Link>
              <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <a href="https://app.gradrly.com/login" className="hover:text-white transition-colors">Sign In</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

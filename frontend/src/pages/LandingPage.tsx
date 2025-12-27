import { ArrowRight, Calendar, CheckCircle, FileText, Github, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import config from '../config/app.config';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-[#714B67] to-[#8B5A7D] p-2 rounded-xl shadow-md">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#714B67] to-[#8B5A7D] bg-clip-text text-transparent">
                GearGuard
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href={config.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-[#714B67] hover:bg-[#714B67]/5 rounded-xl transition-all border border-transparent hover:border-[#714B67]/20"
                title="View on GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#714B67] hover:bg-[#714B67]/5 rounded-xl transition-all border border-transparent hover:border-[#714B67]/20"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#714B67] to-[#8B5A7D] hover:from-[#5a3a52] hover:to-[#714B67] rounded-xl transition-all shadow-md hover:shadow-xl border border-[#714B67]/20"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-6xl sm:text-7xl font-extrabold bg-gradient-to-r from-[#714B67] via-[#8B5A7D] to-[#714B67] bg-clip-text text-transparent mb-8 leading-tight tracking-tight drop-shadow-sm">
              The Ultimate Maintenance Tracker
            </h2>
            <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-sm">
              Professional ERP-style maintenance management system inspired by Odoo. Track equipment, schedule preventive maintenance, and manage corrective requests with ease.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate('/signup')}
                className="inline-flex items-center px-8 py-3.5 text-base font-medium text-white bg-[#714B67] hover:bg-[#5a3a52] rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <a
                href={config.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-3.5 text-base font-medium text-gray-700 bg-white border-2 border-gray-300 hover:border-[#714B67] hover:text-[#714B67] rounded-lg transition-all"
              >
                <FileText className="mr-2 h-5 w-5" />
                <span>View Demo</span>
              </a>
              <a
                href={config.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-3.5 text-base font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                <Github className="mr-2 h-5 w-5" />
                <span>GitHub Repo</span>
              </a>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-6xl font-extrabold bg-gradient-to-br from-[#714B67] to-[#8B5A7D] bg-clip-text text-transparent mb-3 drop-shadow-md">10K+</div>
              <div className="text-base text-gray-600 font-semibold tracking-wide drop-shadow-sm">Equipment Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-extrabold bg-gradient-to-br from-[#714B67] to-[#8B5A7D] bg-clip-text text-transparent mb-3 drop-shadow-md">50K+</div>
              <div className="text-base text-gray-600 font-semibold tracking-wide drop-shadow-sm">Maintenance Requests</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-extrabold bg-gradient-to-br from-[#714B67] to-[#8B5A7D] bg-clip-text text-transparent mb-3 drop-shadow-md">99.9%</div>
              <div className="text-base text-gray-600 font-semibold tracking-wide drop-shadow-sm">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-900 mb-4 drop-shadow-sm">
              Professional Maintenance Management Interface
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto drop-shadow-sm">
              Odoo-inspired design with powerful features for complete maintenance workflow management
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Kanban Board Preview */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">Kanban Board</h4>
                <p className="text-sm text-gray-600">Drag-and-drop maintenance request management</p>
              </div>
              <div className="p-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg h-56 flex items-center justify-center border border-gray-200">
                  <div className="text-center">
                    <div className="bg-white rounded-full p-4 shadow-md mx-auto mb-3 w-16 h-16 flex items-center justify-center">
                      <Wrench className="h-8 w-8 text-[#714B67]" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Kanban Board Screenshot</p>
                    <p className="text-xs text-gray-500 mt-1">Visual workflow management</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar View Preview */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">Calendar View</h4>
                <p className="text-sm text-gray-600">Schedule preventive maintenance tasks</p>
              </div>
              <div className="p-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg h-56 flex items-center justify-center border border-gray-200">
                  <div className="text-center">
                    <div className="bg-white rounded-full p-4 shadow-md mx-auto mb-3 w-16 h-16 flex items-center justify-center">
                      <Calendar className="h-8 w-8 text-[#714B67]" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Calendar Screenshot</p>
                    <p className="text-xs text-gray-500 mt-1">Smart scheduling system</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Equipment Management Preview */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">Equipment Management</h4>
                <p className="text-sm text-gray-600">Track all your equipment and assets</p>
              </div>
              <div className="p-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg h-56 flex items-center justify-center border border-gray-200">
                  <div className="text-center">
                    <div className="bg-white rounded-full p-4 shadow-md mx-auto mb-3 w-16 h-16 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-[#714B67]" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Equipment List Screenshot</p>
                    <p className="text-xs text-gray-500 mt-1">Complete asset tracking</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reports Preview */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">Analytics & Reports</h4>
                <p className="text-sm text-gray-600">Data-driven maintenance insights</p>
              </div>
              <div className="p-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg h-56 flex items-center justify-center border border-gray-200">
                  <div className="text-center">
                    <div className="bg-white rounded-full p-4 shadow-md mx-auto mb-3 w-16 h-16 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-[#714B67]" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Reports Dashboard Screenshot</p>
                    <p className="text-xs text-gray-500 mt-1">Comprehensive analytics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-900 mb-4 drop-shadow-sm">
              Everything You Need for Maintenance Management
            </h3>
            <p className="text-lg text-gray-600 drop-shadow-sm">
              Built with Odoo's ERP philosophy: professional, efficient, and user-friendly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center hover:shadow-md hover:border-[#714B67] transition-all group">
              <div className="bg-[#714B67] bg-opacity-10 rounded-lg p-4 w-14 h-14 mx-auto mb-4 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
                <Wrench className="h-7 w-7 text-[#714B67]" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3 drop-shadow-sm">Equipment Tracking</h4>
              <p className="text-sm text-gray-600 leading-relaxed drop-shadow-sm">
                Comprehensive asset management with categories, teams, and maintenance history
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center hover:shadow-md hover:border-[#714B67] transition-all group">
              <div className="bg-[#714B67] bg-opacity-10 rounded-lg p-4 w-14 h-14 mx-auto mb-4 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
                <Calendar className="h-7 w-7 text-[#714B67]" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3 drop-shadow-sm">Preventive Maintenance</h4>
              <p className="text-sm text-gray-600 leading-relaxed drop-shadow-sm">
                Schedule routine maintenance tasks and never miss a preventive service
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center hover:shadow-md hover:border-[#714B67] transition-all group">
              <div className="bg-[#714B67] bg-opacity-10 rounded-lg p-4 w-14 h-14 mx-auto mb-4 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
                <CheckCircle className="h-7 w-7 text-[#714B67]" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Corrective Requests</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Track breakdowns and repairs with complete workflow management
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center hover:shadow-md hover:border-[#714B67] transition-all group">
              <div className="bg-[#714B67] bg-opacity-10 rounded-lg p-4 w-14 h-14 mx-auto mb-4 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
                <FileText className="h-7 w-7 text-[#714B67]" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Detailed Reports</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Generate insights by category, team, and request type with visual analytics
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center hover:shadow-md hover:border-[#714B67] transition-all group">
              <div className="bg-[#714B67] bg-opacity-10 rounded-lg p-4 w-14 h-14 mx-auto mb-4 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
                <ArrowRight className="h-7 w-7 text-[#714B67]" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Workflow Automation</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Automated overdue alerts and smart status updates for efficient management
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center hover:shadow-md hover:border-[#714B67] transition-all group">
              <div className="bg-[#714B67] bg-opacity-10 rounded-lg p-4 w-14 h-14 mx-auto mb-4 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
                <CheckCircle className="h-7 w-7 text-[#714B67]" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Team Management</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Organize maintenance teams and assign technicians to equipment and requests
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#714B67] via-[#8B5A7D] to-[#5a3a52] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-5"></div>
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h3 className="text-5xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
            Ready to Transform Your Maintenance Management?
          </h3>
          <p className="text-xl mb-12 text-white opacity-95 font-light drop-shadow-md">
            Join thousands of teams using GearGuard to keep their equipment running smoothly
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center px-10 py-4 text-lg font-semibold bg-white text-[#714B67] hover:bg-gray-50 rounded-xl transition-all shadow-2xl hover:shadow-3xl hover:scale-105"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <a
              href={config.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-10 py-4 text-lg font-semibold bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#714B67] rounded-xl transition-all hover:scale-105"
            >
              <Github className="mr-2 h-5 w-5" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </section>

      {/* Created By */}
      <div className="bg-white py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            Created by{' '}
            <a
              href={`https://github.com/${config.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#714B67] hover:text-[#5a3a52] transition-colors inline-flex items-center"
            >
              <Github className="h-4 w-4 mr-1" />
              @{config.githubUsername}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

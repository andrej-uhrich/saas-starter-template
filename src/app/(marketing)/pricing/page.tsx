export default function PricingPage() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="saas-container">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pricing
          </h1>
          <p className="text-xl text-gray-600">
            Three example tiers — replace with your real plans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Basic</h3>
              <p className="text-gray-600 mt-2">For getting started</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">$9</span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8 text-gray-600">
              <li>✓ Core features</li>
              <li>✓ Email support</li>
            </ul>
            <button className="w-full border border-tier-basic text-tier-basic hover:bg-tier-basic hover:text-white font-medium py-3 rounded-md transition-colors">
              Choose Basic
            </button>
          </div>

          {/* Pro */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-tier-pro p-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-tier-pro text-white px-4 py-1 rounded-full text-sm font-medium">
                Popular
              </span>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
              <p className="text-gray-600 mt-2">For growing teams</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">$29</span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8 text-gray-600">
              <li>✓ Everything in Basic</li>
              <li>✓ Analytics &amp; exports</li>
              <li>✓ Team collaboration</li>
              <li>✓ Priority support</li>
            </ul>
            <button className="w-full bg-tier-pro hover:bg-blue-700 text-white font-medium py-3 rounded-md transition-colors">
              Choose Pro
            </button>
          </div>

          {/* Enterprise */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Enterprise</h3>
              <p className="text-gray-600 mt-2">For large organizations</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">Custom</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8 text-gray-600">
              <li>✓ Everything in Pro</li>
              <li>✓ Custom branding</li>
              <li>✓ API access</li>
              <li>✓ Dedicated support</li>
            </ul>
            <button className="w-full border border-tier-enterprise text-tier-enterprise hover:bg-tier-enterprise hover:text-white font-medium py-3 rounded-md transition-colors">
              Contact sales
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

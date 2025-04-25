import React, { useState } from 'react';
import { 
  Lightbulb,
  Gavel,
  Search,
  CheckCircle,
  Building,
  Briefcase,
  CheckSquare,
  Square,
  ChevronDown  // Add this for the ExpandMore functionality
} from 'lucide-react';
import RIISEBotWidget from './RiiseBot';

export default function IPRApplicationGuide() {
  const [activeStep, setActiveStep] = useState(0);
  
  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  
  const iprTypes = [
    { name: 'Patent', description: 'Protects inventions or technical innovations' },
    { name: 'Trademark', description: 'Protects brand names, logos, and symbols' },
    { name: 'Copyright', description: 'Protects creative works like books, music, software, etc.' },
    { name: 'Design', description: 'Protects the visual appearance of a product' },
    { name: 'Geographical Indication', description: 'Protects products originating from a specific region' }
  ];
  
  const steps = [
    {
      label: 'Understand the Type of IPR',
      description: 'Determine which type of intellectual property protection you need.',
      content: (
        <div className="mt-4">
          <p className="mb-4">Before proceeding, determine the type of intellectual property you want to protect:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {iprTypes.map((type) => (
              <div key={type.name} className="p-4 bg-blue-50 border border-blue-100">
                <h3 className="font-bold text-blue-800">{type.name}</h3>
                <p className="text-gray-700">{type.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-gray-700 italic">For this guide, we focus on patents, but the general structure can be adapted for other IPR types.</p>
        </div>
      )
    },
    {
      label: 'Gather Necessary Information',
      description: 'Collect all required details for your application.',
      content: (
        <div className="mt-4">
          <p className="mb-4">To file a patent application, you need the following information:</p>
          
          <div className="mb-4 border border-gray-200 rounded">
            <div className="flex justify-between items-center p-3 cursor-pointer bg-gray-50" onClick={() => {}}>
              <h3 className="font-bold">Inventor Details</h3>
              <ChevronDown size={16} />
            </div>
            <div className="p-3 border-t border-gray-200">
              <ul className="list-disc pl-5 space-y-1">
                <li>Full name, address, and contact details of the inventor(s)</li>
                <li>If there are multiple inventors, specify their contributions</li>
              </ul>
            </div>
          </div>
          
          <div className="mb-4 border border-gray-200 rounded">
            <div className="flex justify-between items-center p-3 cursor-pointer bg-gray-50" onClick={() => {}}>
              <h3 className="font-bold">Applicant Details</h3>
              <ChevronDown size={16} />
            </div>
            <div className="p-3 border-t border-gray-200">
              <ul className="list-disc pl-5 space-y-1">
                <li>Name and address of the applicant (individual or organization)</li>
                <li>If the applicant is different from the inventor, provide an assignment agreement</li>
              </ul>
            </div>
          </div>
          
          <div className="mb-4 border border-gray-200 rounded">
            <div className="flex justify-between items-center p-3 cursor-pointer bg-gray-50" onClick={() => {}}>
              <h3 className="font-bold">Description of the Invention</h3>
              <ChevronDown size={16} />
            </div>
            <div className="p-3 border-t border-gray-200">
              <ul className="list-disc pl-5 space-y-1">
                <li>Title of the invention</li>
                <li>Field of the invention (e.g., "Electronics," "Biotechnology")</li>
                <li>Background and problem solved by the invention</li>
                <li>Detailed description of the invention, including how it works</li>
                <li>Drawings or diagrams (if applicable)</li>
              </ul>
            </div>
          </div>
          
          <div className="mb-4 border border-gray-200 rounded">
            <div className="flex justify-between items-center p-3 cursor-pointer bg-gray-50" onClick={() => {}}>
              <h3 className="font-bold">Claims</h3>
              <ChevronDown size={16} />
            </div>
            <div className="p-3 border-t border-gray-200">
              <ul className="list-disc pl-5 space-y-1">
                <li>Clear and concise statements defining the scope of protection sought</li>
                <li>Independent claims (broad protection) and dependent claims (specific details)</li>
              </ul>
            </div>
          </div>
          
          <div className="mb-4 border border-gray-200 rounded">
            <div className="flex justify-between items-center p-3 cursor-pointer bg-gray-50" onClick={() => {}}>
              <h3 className="font-bold">Abstract</h3>
              <ChevronDown size={16} />
            </div>
            <div className="p-3 border-t border-gray-200">
              <ul className="list-disc pl-5">
                <li>A brief summary of the invention (usually 150–200 words)</li>
              </ul>
            </div>
          </div>
          
          <div className="mb-4 border border-gray-200 rounded">
            <div className="flex justify-between items-center p-3 cursor-pointer bg-gray-50" onClick={() => {}}>
              <h3 className="font-bold">Prior Art Search</h3>
              <ChevronDown size={16} />
            </div>
            <div className="p-3 border-t border-gray-200">
              <ul className="list-disc pl-5 space-y-1">
                <li>Conduct a prior art search to ensure your invention is novel and non-obvious</li>
                <li>Document references to existing patents, publications, or products</li>
              </ul>
            </div>
          </div>
          
          <div className="mb-4 border border-gray-200 rounded">
            <div className="flex justify-between items-center p-3 cursor-pointer bg-gray-50" onClick={() => {}}>
              <h3 className="font-bold">Supporting Documents</h3>
              <ChevronDown size={16} />
            </div>
            <div className="p-3 border-t border-gray-200">
              <ul className="list-disc pl-5 space-y-1">
                <li>Power of Attorney (if filed through an agent/attorney)</li>
                <li>Priority documents (if claiming priority from a previous application)</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      label: 'Draft the Patent Application',
      description: 'Structure your application according to official guidelines.',
      content: (
        <div className="mt-4">
          <p className="mb-4">The patent application must be structured and formatted according to the guidelines of the relevant patent office (e.g., USPTO, EPO, WIPO, or your national patent office). Below is the standard structure:</p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Lightbulb className="text-yellow-500" size={24} />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Following this structure carefully increases your chances of a successful application.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 mb-4 border border-gray-200 rounded shadow">
            <h3 className="font-bold text-lg mb-3">Title Page</h3>
            <div className="pl-4 border-l-2 border-blue-500">
              <ul className="list-disc pl-5 space-y-1">
                <li>Title of the invention</li>
                <li>Name(s) of the inventor(s)</li>
                <li>Name and address of the applicant</li>
                <li>Filing date and application number (assigned later)</li>
              </ul>
            </div>
          </div>
          
          <div className="p-6 mb-4 border border-gray-200 rounded shadow">
            <h3 className="font-bold text-lg mb-3">Specification</h3>
            <p className="mb-2 text-gray-700">The specification is the core of the patent application and includes:</p>
            
            <div className="pl-4 border-l-2 border-green-500 mt-4">
              <h4 className="font-semibold">Field of the Invention</h4>
              <p className="text-gray-600 ml-2">Briefly describe the technical field of the invention.</p>
            </div>
            
            <div className="pl-4 border-l-2 border-green-500 mt-4">
              <h4 className="font-semibold">Background</h4>
              <p className="text-gray-600 ml-2">Explain the problem or gap in the prior art that your invention addresses.</p>
            </div>
            
            <div className="pl-4 border-l-2 border-green-500 mt-4">
              <h4 className="font-semibold">Summary</h4>
              <p className="text-gray-600 ml-2">Provide an overview of the invention and its benefits.</p>
            </div>
            
            <div className="pl-4 border-l-2 border-green-500 mt-4">
              <h4 className="font-semibold">Detailed Description</h4>
              <p className="text-gray-600 ml-2">Describe the invention in sufficient detail to enable someone skilled in the art to replicate it.</p>
              <p className="text-gray-600 ml-2">Include drawings or diagrams with detailed annotations.</p>
            </div>
            
            <div className="pl-4 border-l-2 border-green-500 mt-4">
              <h4 className="font-semibold">Claims</h4>
              <p className="text-gray-600 ml-2">Define the scope of protection sought.</p>
              <p className="text-gray-600 ml-2">Use clear and precise language.</p>
            </div>
            
            <div className="pl-4 border-l-2 border-green-500 mt-4">
              <h4 className="font-semibold">Abstract</h4>
              <p className="text-gray-600 ml-2">Summarize the invention in 150–200 words.</p>
            </div>
          </div>
          
          <div className="p-6 mb-4 border border-gray-200 rounded shadow">
            <h3 className="font-bold text-lg mb-3">Drawings</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Include labeled diagrams, flowcharts, or schematics if they help explain the invention</li>
              <li>Ensure drawings comply with the patent office's formatting rules</li>
            </ul>
          </div>
          
          <div className="p-6 border border-gray-200 rounded shadow">
            <h3 className="font-bold text-lg mb-3">Claims</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Write independent claims to cover the broadest possible protection</li>
              <li>Write dependent claims to cover specific embodiments or variations</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      label: 'File the Application',
      description: 'Submit your application through the appropriate channels.',
      content: (
        <div className="mt-4">
          <p className="mb-4">Once the application is drafted, follow these steps to file it:</p>
          
          <div className="p-6 mb-4 border border-gray-200 rounded shadow">
            <h3 className="font-bold mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-800 p-1 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">a</span>
              Choose the Filing Route
            </h3>
            <div className="flex flex-col md:flex-row gap-4 ml-8">
              <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800">National Route</h4>
                <p className="text-gray-600">File directly with your country's patent office (e.g., USPTO for the U.S., IPO for India).</p>
              </div>
              
              <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800">International Route</h4>
                <p className="text-gray-600">File under the Patent Cooperation Treaty (PCT) for international protection.</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 mb-4 border border-gray-200 rounded shadow">
            <h3 className="font-bold mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-800 p-1 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">b</span>
              Submit the Application
            </h3>
            <ul className="list-disc pl-5 space-y-1 ml-8">
              <li>Submit the application online or via mail, depending on the patent office's requirements</li>
              <li>Pay the required fees (filing fee, search fee, examination fee, etc.)</li>
            </ul>
          </div>
          
          <div className="p-6 border border-gray-200 rounded shadow">
            <h3 className="font-bold mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-800 p-1 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">c</span>
              Track the Application
            </h3>
            <ul className="list-disc pl-5 space-y-1 ml-8">
              <li>After filing, the patent office assigns an application number</li>
              <li>Monitor the status of your application through the patent office's portal</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      label: 'Respond to Office Actions',
      description: 'Address any issues raised by patent examiners.',
      content: (
        <div className="mt-4">
          <p className="mb-4">After filing, the patent examiner may issue Office Actions requesting clarifications or rejecting certain claims. Respond promptly:</p>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Gavel className="text-blue-500" size={24} />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <span className="font-bold">Pro Tip:</span> Office Actions typically have a response deadline of 2-3 months. Missing this deadline can result in application abandonment.
                </p>
              </div>
            </div>
          </div>
          
          <ul className="bg-white rounded-lg shadow border border-gray-200">
            <li className="p-4 flex items-center">
              <span className="mr-3">
                <Square className="text-blue-500" size={20} />
              </span>
              <span>Address all objections or rejections</span>
            </li>
            
            <li className="border-t border-gray-200"></li>
            
            <li className="p-4 flex items-center">
              <span className="mr-3">
                <Square className="text-blue-500" size={20} />
              </span>
              <span>Amend claims if necessary</span>
            </li>
            
            <li className="border-t border-gray-200"></li>
            
            <li className="p-4 flex items-center">
              <span className="mr-3">
                <Square className="text-blue-500" size={20} />
              </span>
              <span>Provide additional evidence or arguments to support your application</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      label: 'Grant of Patent',
      description: 'Receive official recognition of your intellectual property.',
      content: (
        <div className="mt-4">
          <p className="mb-4">If the examiner approves your application, the patent will be granted. The grant includes:</p>
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 text-center border border-gray-200 rounded shadow">
              <h3 className="font-bold text-green-800">Publication</h3>
              <p className="text-gray-600">Publication of the patent in the official journal</p>
            </div>
            
            <div className="p-4 text-center border border-gray-200 rounded shadow">
              <h3 className="font-bold text-green-800">Certificate</h3>
              <p className="text-gray-600">Issuance of a patent certificate</p>
            </div>
            
            <div className="p-4 text-center border border-gray-200 rounded shadow">
              <h3 className="font-bold text-green-800">Fees</h3>
              <p className="text-gray-600">Payment of maintenance fees to keep the patent in force</p>
            </div>
          </div>
        </div>
      )
    },
    {
      label: 'Maintain the Patent',
      description: 'Keep your patent active and enforce your rights.',
      content: (
        <div className="mt-4">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
            <h3 className="font-bold text-lg text-green-800 mb-3">Congratulations on your Patent!</h3>
            <p className="text-gray-700">To maintain your patent's validity and protect your intellectual property:</p>
            
            <div className="mt-4 space-y-4">
              <div className="flex items-start">
                <div className="bg-white p-2 rounded-full mr-3">
                  <Briefcase className="text-green-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold">Pay periodic renewal fees</h4>
                  <p className="text-sm text-gray-600">Most patent offices require periodic fees (usually annually or every few years) to maintain the patent's validity.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white p-2 rounded-full mr-3">
                  <Search className="text-green-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold">Monitor for potential infringement</h4>
                  <p className="text-sm text-gray-600">Keep an eye on the market for products or services that might infringe on your patent.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white p-2 rounded-full mr-3">
                  <Gavel className="text-green-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold">Enforce your rights</h4>
                  <p className="text-sm text-gray-600">Take legal action against infringers to protect your intellectual property.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      label: 'Tools and Resources',
      description: 'Utilize available resources to improve your application.',
      content: (
        <div className="mt-4">
          <p className="mb-6">Here are some valuable tools and resources to help with your IPR application process:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h3 className="font-bold text-purple-800 mb-2">Patent Databases</h3>
              <p className="text-gray-700 mb-3">Use databases to conduct prior art searches:</p>
              <div className="space-y-2">
                <div className="bg-white px-3 py-1 rounded inline-block mr-2 mb-2 text-sm">Google Patents</div>
                <div className="bg-white px-3 py-1 rounded inline-block mr-2 mb-2 text-sm">Espacenet</div>
                <div className="bg-white px-3 py-1 rounded inline-block mr-2 mb-2 text-sm">USPTO</div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-bold text-blue-800 mb-2">Patent Drafting Software</h3>
              <p className="text-gray-700 mb-3">Tools to help draft and analyze applications:</p>
              <div className="space-y-2">
                <div className="bg-white px-3 py-1 rounded inline-block mr-2 mb-2 text-sm">PatentOptimizer</div>
                <div className="bg-white px-3 py-1 rounded inline-block mr-2 mb-2 text-sm">Innography</div>
                <div className="bg-white px-3 py-1 rounded inline-block mr-2 mb-2 text-sm">ClaimMaster</div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="font-bold text-green-800 mb-2">Legal Assistance</h3>
              <p className="text-gray-700 mb-3">Professional help for complex applications:</p>
              <div className="space-y-2">
                <div className="bg-white px-3 py-1 rounded inline-block mr-2 mb-2 text-sm">Patent Attorneys</div>
                <div className="bg-white px-3 py-1 rounded inline-block mr-2 mb-2 text-sm">Patent Agents</div>
                <div className="bg-white px-3 py-1 rounded inline-block mr-2 mb-2 text-sm">IP Consultants</div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-gradient-to-r from-blue-800 to-purple-800 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            IPR Application Guide
          </h1>
          <p className="text-lg opacity-90">
            A comprehensive guide to filing Intellectual Property Right applications
          </p>
          <div className="flex mt-6">
            <div className="bg-blue-700 text-white flex items-center px-3 py-1 rounded">
              <Lightbulb size={16} className="mr-1" />
              <span>Focus: Patent Applications</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto py-8 px-6">
        <div className="p-6 mb-8 border border-gray-200 rounded shadow">
          <p className="text-gray-700">
            Filing an Intellectual Property Right (IPR) application is a formal and structured process that varies depending on the type of IPR you are filing for. This guide focuses on patent applications, as they are among the most complex IPR filings, but the general structure can be adapted for other IPR types.
          </p>
        </div>
      
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Application Process</h2>
          <div className="hidden md:block">
            <div className="border-l-2 border-gray-300 ml-6">
              {steps.map((step, index) => (
                <div key={step.label} className="mb-6">
                  <div 
                    className={`flex items-start cursor-pointer ${activeStep === index ? 'text-blue-600' : 'text-gray-700'}`}
                    onClick={() => handleStepChange(index)}
                  >
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full -ml-6 mr-4 ${activeStep === index ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border border-gray-300'}`}>
                      {index + 1}
                    </div>
                    <div>
                      <span className="font-medium text-lg">{step.label}</span>
                      <p className="text-sm text-gray-600">{step.description}</p>

                      {activeStep === index && (
                        <div className="mt-4 pl-2 ml-2 border-l-2 border-blue-300">
                          {step.content}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile view */}
          <div className="md:hidden">
            {steps.map((step, index) => (
              <div
                key={index}
                className="mb-4 border border-gray-200 rounded"
              >
                <div 
                  className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
                  onClick={() => handleStepChange(index)}
                >
                  <div className="flex items-center">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${activeStep === index ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border border-gray-300'}`}>
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-bold">{step.label}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  <ChevronDown />
                </div>
                
                {activeStep === index && (
                  <div className="p-4 border-t border-gray-200">
                    {step.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Final Notes</h2>
          <p className="text-gray-700">
            Filing an IPR application is a detailed and time-consuming process. Ensure that your application is thorough, accurate, and compliant with the relevant patent office's guidelines. If you're unsure about any step, seek professional assistance to avoid rejection or delays.
          </p>
          
          <div className="flex justify-center mt-6">
            <div className="bg-blue-600 text-white px-4 py-2 rounded">
              Start Your Application Process Today
            </div>
          </div>
        </div>
      </main>
      <RIISEBotWidget position="bottom-right" />
      <footer className="bg-gray-800 text-white py-8 px-6 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="opacity-80">
            This guide is for informational purposes only and does not constitute legal advice.
          </p>
          <p className="mt-2 opacity-60">
            © 2025 IPR Application Guide | Created for educational purposes
          </p>
        </div>
      </footer>
    </div>
  );
}
import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Search, User, BookOpen, FileText, Award, Download, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RIISEBotWidget from './RiiseBot';

// Register Chart.js components
Chart.register(...registerables);

export default function ResearchMedia() {
  const [searchType, setSearchType] = useState('name'); // 'name' or 'id'
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scholarData, setScholarData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedPapers, setExpandedPapers] = useState({});
  
  const citationsChartRef = useRef(null);
  const publicationsChartRef = useRef(null);
  const yearsChartRef = useRef(null);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let url;
      if (searchType === 'id') {
        url = `https://riise.koyeb.app/api/v1/research/fetch-by-id/${encodeURIComponent(searchQuery)}`;
      } else {
        url = `https://riise.koyeb.app/api/v1/research/fetch-by-name?name=${encodeURIComponent(searchQuery)}`;
      }
      
      const response = await fetch(url , {"credentials":"include"});
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setScholarData(data);
    } catch (err) {
      setError(`Failed to fetch data: ${err.message}`);
      setScholarData(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePaperExpansion = (paperId) => {
    setExpandedPapers(prev => ({
      ...prev,
      [paperId]: !prev[paperId]
    }));
  };

  useEffect(() => {
    // Only create charts if we have scholar data and are on the overview tab
    if (scholarData && activeTab === 'overview') {
      // Clean up any existing charts
      if (citationsChartRef.current && citationsChartRef.current.chart) {
        citationsChartRef.current.chart.destroy();
      }
      if (publicationsChartRef.current && publicationsChartRef.current.chart) {
        publicationsChartRef.current.chart.destroy();
      }
      if (yearsChartRef.current && yearsChartRef.current.chart) {
        yearsChartRef.current.chart.destroy();
      }
      
      // Citation distribution chart
      const papers = scholarData.papers || [];
      const citationData = {};
      
      papers.forEach(paper => {
        if (paper.citations) {
          if (citationData[paper.citations]) {
            citationData[paper.citations]++;
          } else {
            citationData[paper.citations] = 1;
          }
        }
      });
      
      const citationCtx = citationsChartRef.current.getContext('2d');
      citationsChartRef.current.chart = new Chart(citationCtx, {
        type: 'bar',
        data: {
          labels: Object.keys(citationData),
          datasets: [{
            label: 'Number of Papers',
            data: Object.values(citationData),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Papers'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Citation Count'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Citation Distribution'
            }
          }
        }
      });
      
      // Publications per year chart
      const yearData = {};
      papers.forEach(paper => {
        if (paper.publication_date) {
          const year = paper.publication_date.substring(0, 4);
          if (year && !isNaN(year)) {
            if (yearData[year]) {
              yearData[year]++;
            } else {
              yearData[year] = 1;
            }
          }
        }
      });
      
      // Sort years
      const sortedYears = Object.keys(yearData).sort();
      
      const yearsCtx = yearsChartRef.current.getContext('2d');
      yearsChartRef.current.chart = new Chart(yearsCtx, {
        type: 'line',
        data: {
          labels: sortedYears,
          datasets: [{
            label: 'Publications',
            data: sortedYears.map(year => yearData[year]),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Publications'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Year'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Publications per Year'
            }
          }
        }
      });
      
      // Co-authors network
      const coauthors = {};
      papers.forEach(paper => {
        if (paper.authors) {
          const authors = paper.authors.split(', ');
          authors.forEach(author => {
            if (author !== scholarData.author_name) {
              if (coauthors[author]) {
                coauthors[author]++;
              } else {
                coauthors[author] = 1;
              }
            }
          });
        }
      });
      
      // Sort by collaboration count and get top 10
      const topCoauthors = Object.entries(coauthors)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
      
      const publicationsCtx = publicationsChartRef.current.getContext('2d');
      publicationsChartRef.current.chart = new Chart(publicationsCtx, {
        type: 'horizontalBar',
        type: 'bar',
        data: {
          labels: topCoauthors.map(item => item[0]),
          datasets: [{
            label: 'Collaborations',
            data: topCoauthors.map(item => item[1]),
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgb(153, 102, 255)',
            borderWidth: 1
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Collaborations'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Top Co-authors'
            }
          }
        }
      });
    }
    
    // Cleanup function
    return () => {
      if (citationsChartRef.current && citationsChartRef.current.chart) {
        citationsChartRef.current.chart.destroy();
      }
      if (publicationsChartRef.current && publicationsChartRef.current.chart) {
        publicationsChartRef.current.chart.destroy();
      }
      if (yearsChartRef.current && yearsChartRef.current.chart) {
        yearsChartRef.current.chart.destroy();
      }
    };
  }, [scholarData, activeTab]);

  // Calculate statistics for the scholar
  const calculateStats = () => {
    if (!scholarData || !scholarData.papers) return null;
    
    const papers = scholarData.papers;
    const totalPapers = papers.length;
    const totalCitations = papers.reduce((sum, paper) => sum + (paper.citations || 0), 0);
    const hIndex = calculateHIndex(papers);
    
    return {
      totalPapers,
      totalCitations,
      hIndex
    };
  };
  
  // Calculate h-index
  const calculateHIndex = (papers) => {
    const citations = papers
      .map(paper => paper.citations || 0)
      .sort((a, b) => b - a);
      
    let hIndex = 0;
    for (let i = 0; i < citations.length; i++) {
      if (citations[i] >= i + 1) {
        hIndex = i + 1;
      } else {
        break;
      }
    }
    
    return hIndex;
  };
  
  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      
      <header className="bg-gradient-to-r mt-20 from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <BookOpen className="h-8 w-8" />
              <h1 className="text-2xl md:text-3xl font-bold">Research Scholar Search</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="py-6 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5  text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchType === 'id' ? "      Enter Scholar ID..." : "       Enter Scholar Name..."}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="search-by-name"
                    name="search-type"
                    checked={searchType === 'name'}
                    onChange={() => setSearchType('name')}
                    className="h-4 w-4 ml-8 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="search-by-name" className="text-sm font-medium text-gray-700">Name</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="search-by-id"
                    name="search-type"
                    checked={searchType === 'id'}
                    onChange={() => setSearchType('id')}
                    className="h-4 w-4 ml-8 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="search-by-id" className="text-sm font-medium text-gray-700">Scholar ID</label>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Results Section */}
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-exclamation-circle text-red-500"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {scholarData && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Scholar Info */}
            <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <div className="flex flex-col md:flex-row justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{scholarData.author_name}</h2>
                  <p className="text-blue-100">{scholarData.affiliation}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {scholarData.interests?.map((interest, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-700 bg-opacity-50 rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
                
                {stats && (
                  <div className="mt-6 md:mt-0 bg-white bg-opacity-20 text-gray-900 rounded-lg p-4 backdrop-blur-sm">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold">{stats.totalPapers}</p>
                        <p className="text-sm">Publications</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold">{stats.totalCitations}</p>
                        <p className="text-sm">Citations</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold">{stats.hIndex}</p>
                        <p className="text-sm">h-index</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 font-medium text-sm border-b-2 ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('papers')}
                  className={`px-4 py-2 font-medium text-sm border-b-2 ${
                    activeTab === 'papers'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Papers
                </button>
              </nav>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Citation Distribution</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <canvas ref={citationsChartRef} height="300"></canvas>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Publications per Year</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <canvas ref={yearsChartRef} height="300"></canvas>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Top Co-authors</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <canvas ref={publicationsChartRef} height="300"></canvas>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'papers' && (
                <div className="space-y-6">
                  {scholarData.papers?.map((paper, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                      <div 
                        className="p-4 bg-gray-50 cursor-pointer"
                        onClick={() => togglePaperExpansion(index)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">{paper.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{paper.authors}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {paper.publication_date ? paper.publication_date.substring(0, 4) : 'N/A'} | 
                              Citations: {paper.citations || 0}
                            </p>
                          </div>
                          <div>
                            {expandedPapers[index] ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {expandedPapers[index] && (
                        <div className="p-4 border-t border-gray-200">
                          {paper.abstract ? (
                            <>
                              <h4 className="text-md font-medium text-gray-700 mb-2">Abstract</h4>
                              <p className="text-sm text-gray-600">{paper.abstract}</p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-500 italic">No abstract available</p>
                          )}
                          
                          {paper.doi && (
                            <div className="mt-4">
                              <a 
                                href={paper.doi} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View Publication
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <RIISEBotWidget position="bottom-right" />
     <Footer/>
    </div>
  );
}
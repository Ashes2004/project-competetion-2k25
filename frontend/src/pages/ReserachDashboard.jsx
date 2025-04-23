import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, FileText, Download, ArrowUpDown  } from 'lucide-react';

// Mock data based on your schema
const initialPapers = [
  {
    paper_id: 1,
    title: "Advances in Machine Learning Applications for Climate Science",
    abstract: "This paper explores recent developments in applying machine learning techniques to climate science challenges.",
    authors: "Jane Smith, John Doe, Maria Garcia",
    publication_date: "2024-07-15",
    doi: "10.1234/journal.5678",
    status: "Published",
    citations: 12,
    scholar_id: "XYZ123456",
    source: "scholarly",
    created_at: "2024-06-01T10:30:00",
    updated_at: "2024-06-15T14:45:00",
    user_id: 3
  },
  {
    paper_id: 2,
    title: "Quantum Computing: A Survey of Current Technologies",
    abstract: "A comprehensive overview of quantum computing hardware and software technologies.",
    authors: "Robert Johnson, Lisa Chen",
    publication_date: "2024-08-22",
    doi: "10.5678/qc.review.9012",
    status: "Published",
    citations: 5,
    scholar_id: "ABC789012",
    source: "manual",
    created_at: "2024-07-12T08:15:00",
    updated_at: "2024-08-25T11:20:00",
    user_id: 2
  },
  {
    paper_id: 3,
    title: "Neural Networks for Natural Language Processing: Recent Innovations",
    abstract: "This study examines the latest breakthroughs in neural network architectures for NLP tasks.",
    authors: "Ahmed Hassan, Sarah Williams, Carlos Lopez",
    publication_date: "2024-09-05",
    doi: "10.9012/nlp.neural.3456",
    status: "Under Review",
    citations: 0,
    scholar_id: "DEF345678",
    source: "imported",
    created_at: "2024-08-30T16:45:00",
    updated_at: "2024-09-10T09:30:00",
    user_id: 1
  }
];

// Main component
export default function ResearchPaperAdmin() {
  const [papers, setPapers] = useState(initialPapers);
  const [filteredPapers, setFilteredPapers] = useState(papers);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState('paper_id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // view, add, edit

  // Filter papers based on search term
  useEffect(() => {
    const filtered = papers.filter(paper => 
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredPapers(filtered);
    setCurrentPage(1);
  }, [searchTerm, papers]);

  // Sort papers
  useEffect(() => {
    const sorted = [...filteredPapers].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredPapers(sorted);
  }, [sortField, sortDirection]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPapers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(filteredPapers.length / itemsPerPage));

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Open modal for different operations
  const openModal = (mode, paper = null) => {
    setModalMode(mode);
    setSelectedPaper(mode === 'add' ? {
      title: '',
      abstract: '',
      authors: '',
      publication_date: '',
      doi: '',
      status: 'Under Review',
      citations: 0,
      scholar_id: '',
      source: 'manual',
      user_id: 1
    } : paper);
    setIsModalOpen(true);
  };

  // Handle paper form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPaper({
      ...selectedPaper,
      [name]: value
    });
  };

  // Save paper (add or edit)
  const savePaper = () => {
    if (modalMode === 'add') {
      const newPaper = {
        ...selectedPaper,
        paper_id: Math.max(...papers.map(p => p.paper_id)) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setPapers([...papers, newPaper]);
    } else if (modalMode === 'edit') {
      const updatedPapers = papers.map(paper => 
        paper.paper_id === selectedPaper.paper_id ? 
        {...selectedPaper, updated_at: new Date().toISOString()} : 
        paper
      );
      setPapers(updatedPapers);
    }
    setIsModalOpen(false);
  };

  // Delete paper
  const deletePaper = (paperId) => {
    if (confirm('Are you sure you want to delete this paper?')) {
      setPapers(papers.filter(paper => paper.paper_id !== paperId));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-700 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Research Papers Admin Panel</h1>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4">
        {/* Search and Actions Bar */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Search papers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              onClick={() => openModal('add')}
            >
              <Plus className="h-5 w-5" />
              Add Paper
            </button>
            <button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              onClick={() => alert('Export functionality would go here')}
            >
              <Download className="h-5 w-5" />
              Export
            </button>
          </div>
        </div>
        
        {/* Papers Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('paper_id')}>
                    <div className="flex items-center">
                      ID
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('title')}>
                    <div className="flex items-center">
                      Title
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('authors')}>
                    <div className="flex items-center">
                      Authors
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('publication_date')}>
                    <div className="flex items-center">
                      Date
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                    <div className="flex items-center">
                      Status
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('citations')}>
                    <div className="flex items-center">
                      Citations
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((paper) => (
                    <tr key={paper.paper_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {paper.paper_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate">
                        {paper.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                        {paper.authors}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {paper.publication_date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          paper.status === 'Published' ? 'bg-green-100 text-green-800' : 
                          paper.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {paper.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {paper.citations}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => openModal('view', paper)}
                          >
                            <FileText className="h-5 w-5" />
                          </button>
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => openModal('edit', paper)}
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => deletePaper(paper.paper_id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No papers found. Try adjusting your search or add a new paper.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredPapers.length)}
              </span>{" "}
              of <span className="font-medium">{filteredPapers.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`flex items-center px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } border border-gray-300`}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-1">Prev</span>
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`flex items-center px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } border border-gray-300`}
              >
                <span className="mr-1">Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-4 text-gray-600 text-sm">
        <p>Research Papers CMS Admin © 2025</p>
      </footer>

      {/* Modal for View/Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {modalMode === 'view' ? 'Paper Details' : 
                   modalMode === 'add' ? 'Add New Paper' : 'Edit Paper'}
                </h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsModalOpen(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {modalMode !== 'view' ? (
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          name="title"
                          value={selectedPaper?.title}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Authors</label>
                        <input
                          type="text"
                          name="authors"
                          value={selectedPaper?.authors}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Comma-separated names"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Abstract</label>
                      <textarea
                        name="abstract"
                        value={selectedPaper?.abstract}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Publication Date</label>
                        <input
                          type="date"
                          name="publication_date"
                          value={selectedPaper?.publication_date}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">DOI</label>
                        <input
                          type="text"
                          name="doi"
                          value={selectedPaper?.doi}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          name="status"
                          value={selectedPaper?.status}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="Published">Published</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Draft">Draft</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Citations</label>
                        <input
                          type="number"
                          name="citations"
                          value={selectedPaper?.citations}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Scholar ID</label>
                        <input
                          type="text"
                          name="scholar_id"
                          value={selectedPaper?.scholar_id}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                        <select
                          name="source"
                          value={selectedPaper?.source}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="manual">Manual</option>
                          <option value="scholarly">Scholarly</option>
                          <option value="imported">Imported</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                      <input
                        type="number"
                        name="user_id"
                        value={selectedPaper?.user_id}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        min="1"
                      />
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <h3 className="text-xl font-semibold">{selectedPaper?.title}</h3>
                      <p className="text-sm text-gray-500">ID: {selectedPaper?.paper_id}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700">Abstract</h4>
                      <p className="text-gray-600 mt-1">{selectedPaper?.abstract || "No abstract available"}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700">Authors</h4>
                        <p className="text-gray-600 mt-1">{selectedPaper?.authors || "Not specified"}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">Publication Date</h4>
                        <p className="text-gray-600 mt-1">{selectedPaper?.publication_date || "Not specified"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700">DOI</h4>
                        <p className="text-gray-600 mt-1">{selectedPaper?.doi || "Not specified"}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">Status</h4>
                        <p className="text-gray-600 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            selectedPaper?.status === 'Published' ? 'bg-green-100 text-green-800' : 
                            selectedPaper?.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedPaper?.status || "Not specified"}
                          </span>
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">Citations</h4>
                        <p className="text-gray-600 mt-1">{selectedPaper?.citations || "0"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700">Scholar ID</h4>
                        <p className="text-gray-600 mt-1">{selectedPaper?.scholar_id || "Not specified"}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">Source</h4>
                        <p className="text-gray-600 mt-1">{selectedPaper?.source || "Not specified"}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">User ID</h4>
                        <p className="text-gray-600 mt-1">{selectedPaper?.user_id}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700">Created At</h4>
                        <p className="text-gray-600 mt-1">{new Date(selectedPaper?.created_at).toLocaleString()}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">Updated At</h4>
                        <p className="text-gray-600 mt-1">{new Date(selectedPaper?.updated_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsModalOpen(false)}
                >
                  {modalMode === 'view' ? 'Close' : 'Cancel'}
                </button>
                {modalMode !== 'view' && (
                  <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    onClick={savePaper}
                  >
                    {modalMode === 'add' ? 'Add Paper' : 'Save Changes'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
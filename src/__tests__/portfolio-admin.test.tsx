import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PortfolioPage } from '@/components/admin/PortfolioPage'
import { usePortfolioAdmin } from '@/hooks/usePortfolioAdmin'

// Mock the hook
jest.mock('@/hooks/usePortfolioAdmin')

const mockUsePortfolioAdmin = usePortfolioAdmin as jest.MockedFunction<typeof usePortfolioAdmin>

// Mock data
const mockProjects = [
  {
    id: '1',
    title: 'Test Project',
    description: 'A test project',
    status: 'active' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    category: {
      id: 'cat-1',
      name: 'Web Development',
      slug: 'web-development',
      description: 'Web projects',
      color: '#3B82F6',
      icon: '🌐',
      featured: true,
      sortOrder: 1,
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    technologies: [],
    results: [],
    contentBlocks: []
  }
]

const mockCategories = [
  {
    id: 'cat-1',
    name: 'Web Development',
    slug: 'web-development',
    description: 'Web projects',
    color: '#3B82F6',
    icon: '🌐',
    featured: true,
    sortOrder: 1,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

const mockApiFunctions = {
  createProject: jest.fn(),
  updateProject: jest.fn(),
  deleteProject: jest.fn(),
  createCategory: jest.fn(),
  updateCategory: jest.fn(),
  deleteCategory: jest.fn(),
  createContentBlock: jest.fn(),
  updateContentBlock: jest.fn(),
  deleteContentBlock: jest.fn(),
  reorderContentBlocks: jest.fn(),
  fetchAll: jest.fn()
}

describe('PortfolioPage', () => {
  beforeEach(() => {
    mockUsePortfolioAdmin.mockReturnValue({
      projects: mockProjects,
      categories: mockCategories,
      loading: false,
      error: null,
      ...mockApiFunctions
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders portfolio page with projects and categories', () => {
    render(<PortfolioPage />)
    
    expect(screen.getByText('Portfolio Management')).toBeInTheDocument()
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('Web Development')).toBeInTheDocument()
  })

  it('shows loading state when loading is true', () => {
    mockUsePortfolioAdmin.mockReturnValue({
      projects: [],
      categories: [],
      loading: true,
      error: null,
      ...mockApiFunctions
    })

    render(<PortfolioPage />)
    
    expect(screen.getByText('Loading portfolio data...')).toBeInTheDocument()
  })

  it('shows error state when error occurs', () => {
    mockUsePortfolioAdmin.mockReturnValue({
      projects: [],
      categories: [],
      loading: false,
      error: 'Failed to load data',
      ...mockApiFunctions
    })

    render(<PortfolioPage />)
    
    expect(screen.getByText('Error loading portfolio data: Failed to load data')).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('opens project creation dialog when Add Project is clicked', () => {
    render(<PortfolioPage />)
    
    const addButton = screen.getByText('Add Project')
    fireEvent.click(addButton)
    
    expect(screen.getByText('Create New Project')).toBeInTheDocument()
  })

  it('opens category creation dialog when Add Category is clicked', () => {
    render(<PortfolioPage />)
    
    // Switch to categories tab
    const categoriesTab = screen.getByText('Categories')
    fireEvent.click(categoriesTab)
    
    const addButton = screen.getByText('Add Category')
    fireEvent.click(addButton)
    
    expect(screen.getByText('Create New Category')).toBeInTheDocument()
  })

  it('filters projects by search term', () => {
    render(<PortfolioPage />)
    
    const searchInput = screen.getByPlaceholderText('Search projects...')
    fireEvent.change(searchInput, { target: { value: 'Test' } })
    
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('filters projects by status', () => {
    render(<PortfolioPage />)
    
    const statusSelect = screen.getByDisplayValue('All Status')
    fireEvent.change(statusSelect, { target: { value: 'active' } })
    
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('switches between grid and table view', () => {
    render(<PortfolioPage />)
    
    // Should start with grid view
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    
    // Switch to table view
    const tableButton = screen.getByRole('button', { name: /table/i })
    fireEvent.click(tableButton)
    
    // Should still show the project
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('calls deleteProject when delete button is clicked', async () => {
    mockApiFunctions.deleteProject.mockResolvedValue(true)
    
    render(<PortfolioPage />)
    
    const deleteButton = screen.getAllByRole('button', { name: /trash/i })[0]
    fireEvent.click(deleteButton)
    
    // Confirm deletion
    const confirmButton = screen.getByText('OK')
    fireEvent.click(confirmButton)
    
    await waitFor(() => {
      expect(mockApiFunctions.deleteProject).toHaveBeenCalledWith('1')
    })
  })

  it('calls createProject when project form is submitted', async () => {
    mockApiFunctions.createProject.mockResolvedValue(true)
    
    render(<PortfolioPage />)
    
    // Open create dialog
    const addButton = screen.getByText('Add Project')
    fireEvent.click(addButton)
    
    // Fill form
    const titleInput = screen.getByPlaceholderText('Enter project title...')
    fireEvent.change(titleInput, { target: { value: 'New Project' } })
    
    const descriptionInput = screen.getByPlaceholderText('Enter project description...')
    fireEvent.change(descriptionInput, { target: { value: 'New description' } })
    
    const categorySelect = screen.getByDisplayValue('Select a category')
    fireEvent.change(categorySelect, { target: { value: 'cat-1' } })
    
    // Submit form
    const createButton = screen.getByText('Create Project')
    fireEvent.click(createButton)
    
    await waitFor(() => {
      expect(mockApiFunctions.createProject).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Project',
          description: 'New description',
          categoryId: 'cat-1'
        })
      )
    })
  })

  it('calls createCategory when category form is submitted', async () => {
    mockApiFunctions.createCategory.mockResolvedValue(true)
    
    render(<PortfolioPage />)
    
    // Switch to categories tab
    const categoriesTab = screen.getByText('Categories')
    fireEvent.click(categoriesTab)
    
    // Open create dialog
    const addButton = screen.getByText('Add Category')
    fireEvent.click(addButton)
    
    // Fill form
    const nameInput = screen.getByPlaceholderText('Category name')
    fireEvent.change(nameInput, { target: { value: 'New Category' } })
    
    // Submit form
    const createButton = screen.getByText('Create Category')
    fireEvent.click(createButton)
    
    await waitFor(() => {
      expect(mockApiFunctions.createCategory).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Category',
          slug: 'new-category'
        })
      )
    })
  })

  it('shows analytics tab with project statistics', () => {
    render(<PortfolioPage />)
    
    const analyticsTab = screen.getByText('Analytics')
    fireEvent.click(analyticsTab)
    
    expect(screen.getByText('Portfolio Analytics')).toBeInTheDocument()
    expect(screen.getByText('Project Status Distribution')).toBeInTheDocument()
    expect(screen.getByText('Category Distribution')).toBeInTheDocument()
  })

  it('handles content blocks management', async () => {
    render(<PortfolioPage />)
    
    // Open project edit dialog
    const editButton = screen.getAllByRole('button', { name: /edit/i })[0]
    fireEvent.click(editButton)
    
    // Should show content blocks section
    expect(screen.getByText('Content Blocks')).toBeInTheDocument()
    
    // Add a content block
    const blockTypeSelect = screen.getByDisplayValue('Paragraph')
    fireEvent.change(blockTypeSelect, { target: { value: 'heading' } })
    
    const contentInput = screen.getByPlaceholderText('Heading text...')
    fireEvent.change(contentInput, { target: { value: 'New Heading' } })
    
    const addBlockButton = screen.getByText('Add Block')
    fireEvent.click(addBlockButton)
    
    await waitFor(() => {
      expect(mockApiFunctions.createContentBlock).toHaveBeenCalled()
    })
  })
})

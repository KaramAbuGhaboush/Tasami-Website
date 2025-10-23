import { renderHook, act } from '@testing-library/react'
import { usePortfolioAdmin } from '@/hooks/usePortfolioAdmin'

// Mock fetch
global.fetch = jest.fn()

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('usePortfolioAdmin', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('fetches data on mount', async () => {
    const mockProjectsResponse = {
      ok: true,
      json: () => Promise.resolve({ data: { projects: [] } })
    }
    
    const mockCategoriesResponse = {
      ok: true,
      json: () => Promise.resolve({ data: { categories: [] } })
    }

    mockFetch
      .mockResolvedValueOnce(mockProjectsResponse as any)
      .mockResolvedValueOnce(mockCategoriesResponse as any)

    const { result } = renderHook(() => usePortfolioAdmin())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/projects')
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/categories')
    expect(result.current.loading).toBe(false)
  })

  it('handles fetch errors', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => usePortfolioAdmin())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.error).toBe('Network error')
    expect(result.current.loading).toBe(false)
  })

  it('creates a project successfully', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ data: { project: { id: '1', title: 'Test Project' } } })
    }

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ data: { projects: [] } }) } as any)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ data: { categories: [] } }) } as any)
      .mockResolvedValueOnce(mockResponse as any)

    const { result } = renderHook(() => usePortfolioAdmin())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const projectData = {
      title: 'Test Project',
      description: 'Test Description',
      categoryId: 'cat-1',
      status: 'active' as const,
      technologies: [],
      results: [],
      contentBlocks: []
    }

    let success = false
    await act(async () => {
      success = await result.current.createProject(projectData)
    })

    expect(success).toBe(true)
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    })
  })

  it('handles project creation errors', async () => {
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ message: 'Validation error' })
    }

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ data: { projects: [] } }) } as any)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ data: { categories: [] } }) } as any)
      .mockResolvedValueOnce(mockResponse as any)

    const { result } = renderHook(() => usePortfolioAdmin())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const projectData = {
      title: 'Test Project',
      description: 'Test Description',
      categoryId: 'cat-1',
      status: 'active' as const,
      technologies: [],
      results: [],
      contentBlocks: []
    }

    let success = false
    await act(async () => {
      success = await result.current.createProject(projectData)
    })

    expect(success).toBe(false)
    expect(result.current.error).toBe('Validation error')
  })

  it('updates a project successfully', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ data: { project: { id: '1', title: 'Updated Project' } } })
    }

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ data: { projects: [] } }) } as any)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ data: { categories: [] } }) } as any)
      .mockResolvedValueOnce(mockResponse as any)

    const { result } = renderHook(() => usePortfolioAdmin())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const updateData = { title: 'Updated Project' }

    let success = false
    await act(async () => {
      success = await result.current.updateProject('1', updateData)
    })

    expect(success).toBe(true)
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/projects/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    })
  })

  it('deletes a project successfully', async () => {
    const mockResponse = { ok: true }

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ data: { projects: [] } }) } as any)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ data: { categories: [] } }) } as any)
      .mockResolvedValueOnce(mockResponse as any)

    const { result } = renderHook(() => usePortfolioAdmin())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    let success = false
    await act(async () => {
      success = await result.current.deleteProject('1')
    })

    expect(success).toBe(true)
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/projects/1', {
      method: 'DELETE'
    })
  })

  it('creates a category successfully', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ data: { category: { id: '1', name: 'Test Category' } } })
    }

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ data: { projects: [] } }) } as any)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ data: { categories: [] } }) } as any)
      .mockResolvedValueOnce(mockResponse as any)

    const { result } = renderHook(() => usePortfolioAdmin())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const categoryData = {
      name: 'Test Category',
      slug: 'test-category',
      description: 'Test Description',
      color: '#000000',
      icon: '📁',
      featured: false,
      sortOrder: 0,
      status: 'active' as const
    }

    let success = false
    await act(async () => {
      success = await result.current.createCategory(categoryData)
    })

    expect(success).toBe(true)
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData)
    })
  })

  it('creates a content block successfully', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ data: { contentBlock: { id: '1', type: 'paragraph' } } })
    }

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ data: { projects: [] } }) } as any)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ data: { categories: [] } }) } as any)
      .mockResolvedValueOnce(mockResponse as any)

    const { result } = renderHook(() => usePortfolioAdmin())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const blockData = {
      type: 'paragraph' as const,
      order: 0,
      content: 'Test content'
    }

    let success = false
    await act(async () => {
      success = await result.current.createContentBlock('1', blockData)
    })

    expect(success).toBe(true)
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/projects/1/content-blocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blockData)
    })
  })

  it('reorders content blocks successfully', async () => {
    const mockResponse = { ok: true }

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ data: { projects: [] } }) } as any)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ data: { categories: [] } }) } as any)
      .mockResolvedValueOnce(mockResponse as any)

    const { result } = renderHook(() => usePortfolioAdmin())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const blocks = [
      { id: '1', order: 0 },
      { id: '2', order: 1 }
    ]

    let success = false
    await act(async () => {
      success = await result.current.reorderContentBlocks('1', blocks)
    })

    expect(success).toBe(true)
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/projects/1/content-blocks/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks })
    })
  })
})

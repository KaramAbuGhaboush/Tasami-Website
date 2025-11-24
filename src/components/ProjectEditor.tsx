'use client'

import { useState, useRef } from 'react'
import { Project } from '@/hooks/useProject'

interface ProjectEditorProps {
  project: Project;
  onSave: (contentBlocks: any[]) => void;
}

interface EditorBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'image';
  content: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  src?: string;
  alt?: string;
  caption?: string;
}

export function ProjectEditor({ project, onSave }: ProjectEditorProps) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(
    project.contentBlocks?.map(block => ({
      id: block.id,
      type: block.type as 'heading' | 'paragraph' | 'image',
      content: block.content || '',
      level: block.level as 1 | 2 | 3 | 4 | 5 | 6,
      src: block.src,
      alt: block.alt,
      caption: block.caption
    })) || []
  )
  
  const [activeBlock, setActiveBlock] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addBlock = (type: 'heading' | 'paragraph' | 'image') => {
    const newBlock: EditorBlock = {
      id: `block-${Date.now()}`,
      type,
      content: '',
      level: type === 'heading' ? 2 : undefined
    }
    setBlocks([...blocks, newBlock])
    setActiveBlock(newBlock.id)
  }

  const updateBlock = (id: string, updates: Partial<EditorBlock>) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ))
  }

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id))
    setActiveBlock(null)
  }

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(block => block.id === id)
    if (index === -1) return

    const newBlocks = [...blocks]
    if (direction === 'up' && index > 0) {
      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]]
    } else if (direction === 'down' && index < blocks.length - 1) {
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]]
    }
    setBlocks(newBlocks)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // In a real app, you'd upload to your server/CDN
    const imageUrl = URL.createObjectURL(file)
    const activeBlockId = activeBlock
    if (activeBlockId) {
      updateBlock(activeBlockId, { src: imageUrl })
    }
  }

  const saveContent = () => {
    onSave(blocks)
  }

  const renderBlock = (block: EditorBlock) => {
    const isActive = activeBlock === block.id

    return (
      <div
        key={block.id}
        className={`group border-2 rounded-lg p-4 mb-4 transition-all ${
          isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => setActiveBlock(block.id)}
      >
        {/* Block Controls */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 uppercase">
              {block.type}
            </span>
            {block.type === 'heading' && (
              <select
                value={block.level || 2}
                onChange={(e) => updateBlock(block.id, { level: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6 })}
                className="text-xs border rounded px-2 py-1"
                onClick={(e) => e.stopPropagation()}
              >
                <option value={1}>H1</option>
                <option value={2}>H2</option>
                <option value={3}>H3</option>
                <option value={4}>H4</option>
                <option value={5}>H5</option>
                <option value={6}>H6</option>
              </select>
            )}
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation()
                moveBlock(block.id, 'up')
              }}
              className="p-1 text-gray-500 hover:text-gray-700"
              title="Move up"
            >
              ↑
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                moveBlock(block.id, 'down')
              }}
              className="p-1 text-gray-500 hover:text-gray-700"
              title="Move down"
            >
              ↓
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                deleteBlock(block.id)
              }}
              className="p-1 text-red-500 hover:text-red-700"
              title="Delete"
            >
              ×
            </button>
          </div>
        </div>

        {/* Block Content */}
        {block.type === 'heading' && (
          <div className="space-y-2">
            <input
              type="text"
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              placeholder="Enter heading text..."
              className="w-full text-2xl font-bold border-none outline-none bg-transparent"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {block.type === 'paragraph' && (
          <textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="Enter paragraph text..."
            className="w-full min-h-[100px] border-none outline-none bg-transparent resize-none"
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {block.type === 'image' && (
          <div className="space-y-4">
            {block.src ? (
              <div className="relative">
                <img
                  src={block.src}
                  alt={block.alt || ''}
                  className="max-w-full h-auto rounded-lg"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white px-3 py-1 rounded text-sm"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400"
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
              >
                <div className="text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>Click to upload image</p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={block.alt || ''}
                onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
                placeholder="Alt text (for accessibility)"
                className="w-full p-2 border rounded"
                onClick={(e) => e.stopPropagation()}
              />
              <input
                type="text"
                value={block.caption || ''}
                onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                placeholder="Caption (optional)"
                className="w-full p-2 border rounded"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Project: {project.title}</h1>
        <button
          onClick={saveContent}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </div>

      {/* Add Block Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => addBlock('heading')}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="text-lg font-bold">H</span>
          Add Heading
        </button>
        <button
          onClick={() => addBlock('paragraph')}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="text-lg">¶</span>
          Add Paragraph
        </button>
        <button
          onClick={() => addBlock('image')}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="text-lg">🖼️</span>
          Add Image
        </button>
      </div>

      {/* Content Blocks */}
      <div className="space-y-4">
        {blocks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-4">No content blocks yet</p>
            <p className="text-sm">Click the buttons above to add content</p>
          </div>
        ) : (
          blocks.map(renderBlock)
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  )
}

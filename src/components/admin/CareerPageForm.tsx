'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { jobSchema } from '@/lib/validation'
import { type CreateJobData } from '@/hooks/useCareerAdmin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Loader2 } from 'lucide-react'

interface CareerPageFormProps {
  initialData?: CreateJobData
  onSubmit: (data: CreateJobData) => Promise<{ success: boolean }>
  onCancel: () => void
  isSubmitting: boolean
  error?: string | null
}

const departments = ['Engineering', 'Design', 'Marketing', 'Product', 'Sales', 'Operations']
const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship']

export function CareerPageForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  error,
}: CareerPageFormProps) {
  const form = useForm<CreateJobData>({
    resolver: zodResolver(jobSchema),
    defaultValues: initialData || {
      title: '',
      titleAr: '',
      department: '',
      departmentAr: '',
      location: '',
      locationAr: '',
      type: '',
      typeAr: '',
      experience: '',
      experienceAr: '',
      description: '',
      descriptionAr: '',
      requirements: [],
      requirementsAr: [],
      benefits: [],
      benefitsAr: [],
      salary: '',
      salaryAr: '',
      applicationDeadline: '',
      status: 'draft',
      team: '',
      teamAr: '',
    },
  })

  const handleSubmit = async (data: CreateJobData) => {
    try {
      // Clean up array fields and convert empty applicationDeadline to null
      const cleanedData: any = {
        ...data,
        requirements: data.requirements.filter(item => item.trim() !== ''),
        requirementsAr: (data.requirementsAr || []).filter(item => item.trim() !== ''),
        benefits: data.benefits.filter(item => item.trim() !== ''),
        benefitsAr: (data.benefitsAr || []).filter(item => item.trim() !== ''),
      }
      
      // Convert empty string to null for applicationDeadline (Prisma expects null, not empty string)
      if (!cleanedData.applicationDeadline || (typeof cleanedData.applicationDeadline === 'string' && cleanedData.applicationDeadline.trim() === '')) {
        cleanedData.applicationDeadline = null
      }
      
      const result = await onSubmit(cleanedData)
      if (result.success) {
        form.reset()
      }
    } catch (error) {
      // Error will be handled by parent component
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit, (errors) => {
        console.error('Form validation errors:', errors)
      })} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-yellow-600 text-sm">Please fix the form errors below</p>
            <pre className="text-xs mt-2">{JSON.stringify(form.formState.errors, null, 2)}</pre>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Senior Frontend Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="titleAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title (Arabic)</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: مطور Frontend كبير" dir="rtl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department *</FormLabel>
                <FormControl>
                  <select
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                    {...field}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="departmentAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department (Arabic)</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: الهندسة" dir="rtl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Type *</FormLabel>
                <FormControl>
                  <select
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                    {...field}
                  >
                    <option value="">Select Type</option>
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="typeAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Type (Arabic)</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: دوام كامل" dir="rtl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Remote, San Francisco, CA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Required</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 3+ years" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary Range</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., $80,000 - $120,000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salaryAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary Range (Arabic)</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: 80,000 - 120,000 دولار" dir="rtl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="team"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Engineering Team" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="teamAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team (Arabic)</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: فريق الهندسة" dir="rtl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the role, responsibilities..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descriptionAr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description (Arabic)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="اوصف الدور والمسؤوليات..."
                  rows={4}
                  dir="rtl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="requirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requirements</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List key requirements, one per line..."
                    rows={3}
                    value={field.value.join('\n')}
                    onChange={(e) => {
                      const array = e.target.value.split('\n')
                      field.onChange(array)
                    }}
                    className="resize-y min-h-[80px]"
                  />
                </FormControl>
                <FormDescription>Enter each requirement on a new line</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="requirementsAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requirements (Arabic)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="اذكر المتطلبات الرئيسية، سطر واحد لكل متطلب..."
                    rows={3}
                    value={(field.value || []).join('\n')}
                    onChange={(e) => {
                      const array = e.target.value.split('\n')
                      field.onChange(array)
                    }}
                    className="resize-y min-h-[80px]"
                    dir="rtl"
                  />
                </FormControl>
                <FormDescription>Enter each requirement on a new line</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="benefits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Benefits</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List benefits, one per line..."
                    rows={3}
                    value={field.value.join('\n')}
                    onChange={(e) => {
                      const array = e.target.value.split('\n')
                      field.onChange(array)
                    }}
                    className="resize-y min-h-[80px]"
                  />
                </FormControl>
                <FormDescription>Enter each benefit on a new line</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="benefitsAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Benefits (Arabic)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="اذكر مزايا الشركة، سطر واحد لكل ميزة..."
                    rows={3}
                    value={(field.value || []).join('\n')}
                    onChange={(e) => {
                      const array = e.target.value.split('\n')
                      field.onChange(array)
                    }}
                    className="resize-y min-h-[80px]"
                    dir="rtl"
                  />
                </FormControl>
                <FormDescription>Enter each benefit on a new line</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="experienceAr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience Required (Arabic)</FormLabel>
              <FormControl>
                <Input placeholder="مثال: 3+ سنوات" dir="rtl" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                  {...field}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="closed">Closed</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="applicationDeadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application Deadline</FormLabel>
              <FormControl>
                <Input 
                  type="datetime-local" 
                  {...field} 
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-[#6812F7] hover:bg-[#5a0fd4]">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {initialData ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              initialData ? 'Update Job' : 'Create Job'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}


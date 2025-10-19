import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/hooks/useWorkData';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard = ({ project, index }: ProjectCardProps) => {
  return (
    <Link key={index} href={`/projects/${project.id}`}>
      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
        {/* Project Image */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              {project.category}
            </span>
          </div>
        </div>

        {/* Project Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#667eea] transition-colors duration-300">
            {project.title}
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-3">
            {project.description}
          </p>
          
          {/* Technologies */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 3).map((tech, techIndex) => (
                <span key={techIndex} className="bg-[#F8F4FF] text-[#667eea] px-2 py-1 rounded-md text-xs font-medium">
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                  +{project.technologies.length - 3} more
                </span>
              )}
            </div>
          </div>
                    
          {/* Key Results Preview */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {project.results.slice(0, 2).map((result: string, resultIndex: number) => (
                <span key={resultIndex} className="bg-[#667eea]/10 text-[#667eea] px-3 py-1 rounded-full text-xs font-medium">
                  {result}
                </span>
              ))}
              {project.results.length > 2 && (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                  +{project.results.length - 2} more results
                </span>
              )}
            </div>
          </div>

          {/* View Project Link */}
          <div className="flex items-center text-[#667eea] font-semibold group-hover:text-[#5a67d8] transition-colors duration-300">
            <span>View Project</span>
            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

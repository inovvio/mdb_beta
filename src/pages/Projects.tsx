import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Project } from '../types/project';
import { ProjectList } from '../components/projects/ProjectList';
import { ProjectForm } from '../components/projects/ProjectForm';
import { toast } from 'react-hot-toast';
import { projectsApi } from '../services/api';

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectsApi.list();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (data: Partial<Project>) => {
    try {
      await projectsApi.create(data);
      await loadProjects();
      setShowForm(false);
      toast.success('Project created successfully');
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast.error(error.message || 'Failed to create project');
    }
  };

  const handleUpdateProject = async (data: Partial<Project>) => {
    if (!selectedProject) return;

    try {
      await projectsApi.update(selectedProject.id, data);
      await loadProjects();
      setShowForm(false);
      setSelectedProject(undefined);
      toast.success('Project updated successfully');
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast.error(error.message || 'Failed to update project');
    }
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6 px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            {selectedProject ? 'Edit Project' : 'Create New Project'}
          </h2>
          <ProjectForm
            project={selectedProject}
            onSubmit={selectedProject ? handleUpdateProject : handleCreateProject}
            onCancel={() => {
              setShowForm(false);
              setSelectedProject(undefined);
            }}
          />
        </div>
      ) : (
        <ProjectList
          projects={projects}
          onProjectClick={handleProjectClick}
        />
      )}
    </div>
  );
}
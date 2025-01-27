import { redirect } from 'next/navigation'

import { ability } from '@/auth/auth'

import { ProjectForm } from './project-form'

export default async function CreateProject() {
  const permission = await ability()

  if (permission?.cannot('create', 'Project')) {
    redirect('/')
  }
  return (
    <div className="space-y-4">
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        <h1 className="text-2xl font-bold">Create organization</h1>
        <ProjectForm />
      </main>
    </div>
  )
}

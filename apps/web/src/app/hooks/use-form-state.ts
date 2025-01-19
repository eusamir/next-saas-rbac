import { type FormEvent, useState, useTransition } from 'react'

interface FormState {
  sucess: boolean
  message: string | null
  erros: Record<string, string[]> | null
}

export function useFormState(
  actions: (data: FormData) => Promise<FormState>,
  initialState?: FormState,
) {
  const [isPending, startTransition] = useTransition()

  const [formState, setFormState] = useState(
    initialState ?? {
      sucess: false,
      message: null,
      erros: null,
    },
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    startTransition(async () => {
      const state = await actions(data)

      setFormState(state)
    })
  }

  return [formState, handleSubmit, isPending] as const
}

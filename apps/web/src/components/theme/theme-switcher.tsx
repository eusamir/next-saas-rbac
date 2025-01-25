'use client'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/dropdown-menu'

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {mounted && (
          <Button variant="ghost" size="icon" suppressHydrationWarning>
            {resolvedTheme === 'dark' && <Moon className="size-4" />}
            {resolvedTheme === 'light' && <Sun className="size-4" />}
            <span className="sr-only">Toogle theme</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

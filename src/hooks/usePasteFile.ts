import { useEffect } from 'react'

interface UsePasteFileProps {
  onPaste: (file: File) => void
  isDisabled?: boolean
}

export function usePasteFile({ onPaste, isDisabled }: UsePasteFileProps) {
  useEffect(() => {
    if (isDisabled) return

    const handlePaste = (e: ClipboardEvent) => {
      const files = e.clipboardData?.files

      if (files && files.length > 0) {
        const file = files[0]
        onPaste(file)
      }
    }

    document.addEventListener('paste', handlePaste)

    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [onPaste, isDisabled])
}

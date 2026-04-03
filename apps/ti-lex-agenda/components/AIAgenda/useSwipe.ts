import { useRef, useCallback } from 'react'

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void
  onTouchMove: (e: React.TouchEvent) => void
  onTouchEnd: () => void
  onMouseDown: (e: React.MouseEvent) => void
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
}

interface UseSwipeOptions {
  onSwipeLeft: () => void
  onSwipeRight: () => void
  threshold?: number
}

/**
 * Hook for detecting swipe gestures (touch + mouse).
 * Swipe left = next (month/day), swipe right = previous.
 */
export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 50 }: UseSwipeOptions): SwipeHandlers {
  const startX = useRef(0)
  const startY = useRef(0)
  const isDragging = useRef(false)

  const handleStart = useCallback((x: number, y: number) => {
    startX.current = x
    startY.current = y
    isDragging.current = true
  }, [])

  const handleEnd = useCallback(
    (x: number) => {
      if (!isDragging.current) return
      isDragging.current = false

      const diff = startX.current - x
      if (Math.abs(diff) > threshold) {
        if (diff > 0) onSwipeLeft()
        else onSwipeRight()
      }
    },
    [onSwipeLeft, onSwipeRight, threshold]
  )

  return {
    onTouchStart: (e) => {
      const touch = e.touches[0]
      handleStart(touch.clientX, touch.clientY)
    },
    onTouchMove: () => {},
    onTouchEnd: () => {
      // Use changedTouches for the final position
    },
    onMouseDown: (e) => handleStart(e.clientX, e.clientY),
    onMouseMove: () => {},
    onMouseUp: () => {},
  }
}

/**
 * Enhanced swipe hook that also tracks drag offset for animation.
 */
export function useSwipeWithOffset({
  onSwipeLeft,
  onSwipeRight,
  threshold = 60,
}: UseSwipeOptions): SwipeHandlers & { offsetRef: React.MutableRefObject<number> } {
  const startX = useRef(0)
  const isDragging = useRef(false)
  const offsetRef = useRef(0)

  const handleStart = useCallback((x: number) => {
    startX.current = x
    isDragging.current = true
    offsetRef.current = 0
  }, [])

  const handleMove = useCallback((x: number) => {
    if (!isDragging.current) return
    offsetRef.current = x - startX.current
  }, [])

  const handleEnd = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false

    const diff = offsetRef.current
    if (Math.abs(diff) > threshold) {
      if (diff < 0) onSwipeLeft()
      else onSwipeRight()
    }
    offsetRef.current = 0
  }, [onSwipeLeft, onSwipeRight, threshold])

  return {
    offsetRef,
    onTouchStart: (e) => handleStart(e.touches[0].clientX),
    onTouchMove: (e) => handleMove(e.touches[0].clientX),
    onTouchEnd: handleEnd,
    onMouseDown: (e) => handleStart(e.clientX),
    onMouseMove: (e) => handleMove(e.clientX),
    onMouseUp: handleEnd,
  }
}

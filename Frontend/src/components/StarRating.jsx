import { useState } from 'react'
import { Star } from 'lucide-react'

/**
 * Interactive star rating.
 *
 * Usage:
 *   <StarRating value={n} onChange={setN} />
 *   <StarRating value={4.5} readOnly size={14} />
 *
 * Props:
 *   value     – number (0-5), can be fractional for read-only display
 *   onChange  – (number) => void, omit for read-only
 *   size      – pixel size (default 24)
 *   readOnly  – boolean
 *   showValue – show "4/5" next to stars
 */
export default function StarRating({
  value = 0,
  onChange,
  size = 24,
  readOnly = false,
  showValue = false,
}) {
  const [hover, setHover] = useState(0)

  const display = hover || value
  const isInteractive = !readOnly && typeof onChange === 'function'

  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= display
        const isHalf =
          !isInteractive && !Number.isInteger(display) && n - 0.5 === display

        return (
          <button
            key={n}
            type="button"
            disabled={!isInteractive}
            onClick={() => isInteractive && onChange(n)}
            onMouseEnter={() => isInteractive && setHover(n)}
            onMouseLeave={() => isInteractive && setHover(0)}
            className={`transition-transform ${
              isInteractive
                ? 'cursor-pointer hover:scale-110 active:scale-95'
                : 'cursor-default'
            }`}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            <Star
              size={size}
              strokeWidth={1.5}
              className={
                filled || isHalf
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-300'
              }
            />
          </button>
        )
      })}

      {showValue && (
        <span
          className="ml-2 text-sm font-semibold text-[#0B2B3A]"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          {value > 0 ? value.toFixed(1) : 'New'}
        </span>
      )}
    </div>
  )
}
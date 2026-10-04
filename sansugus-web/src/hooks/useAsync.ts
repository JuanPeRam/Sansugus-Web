import { useCallback, useEffect, useRef, useState } from 'react'

/** Carga asíncrona con estado de carga, error y recarga manual */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[], enabled = true) {
  const [data, setData] = useState<T | undefined>()
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<Error | undefined>()
  const [tick, setTick] = useState(0)
  const fnRef = useRef(fn)
  fnRef.current = fn

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(undefined)
    fnRef.current()
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e instanceof Error ? e : new Error(String(e))))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled, tick])

  const reload = useCallback(() => setTick((n) => n + 1), [])
  return { data, loading, error, reload }
}

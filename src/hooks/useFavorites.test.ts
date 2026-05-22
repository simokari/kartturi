import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFavorites } from './useFavorites'

const KEY = 'kartturi-favorites'

beforeEach(() => {
  localStorage.clear()
})

describe('useFavorites — initial state', () => {
  it('starts with no favorites when localStorage is empty', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.isFavorite('abc')).toBe(false)
  })

  it('loads persisted favorites from localStorage on mount', () => {
    localStorage.setItem(KEY, JSON.stringify(['id-1', 'id-2']))
    const { result } = renderHook(() => useFavorites())
    expect(result.current.isFavorite('id-1')).toBe(true)
    expect(result.current.isFavorite('id-2')).toBe(true)
    expect(result.current.isFavorite('id-3')).toBe(false)
  })

  it('returns empty set when localStorage contains corrupt JSON', () => {
    localStorage.setItem(KEY, 'not-valid-json{{{')
    const { result } = renderHook(() => useFavorites())
    expect(result.current.isFavorite('any')).toBe(false)
  })
})

describe('useFavorites — toggle', () => {
  it('adds an id when toggled the first time', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => { result.current.toggle('tool-a') })
    expect(result.current.isFavorite('tool-a')).toBe(true)
  })

  it('removes an id when toggled a second time', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => { result.current.toggle('tool-a') })
    act(() => { result.current.toggle('tool-a') })
    expect(result.current.isFavorite('tool-a')).toBe(false)
  })

  it('toggling one id does not affect others', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => { result.current.toggle('tool-a') })
    act(() => { result.current.toggle('tool-b') })
    act(() => { result.current.toggle('tool-a') }) // remove tool-a
    expect(result.current.isFavorite('tool-a')).toBe(false)
    expect(result.current.isFavorite('tool-b')).toBe(true)
  })

  it('can favorite multiple entries independently', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => { result.current.toggle('m1') })
    act(() => { result.current.toggle('m2') })
    act(() => { result.current.toggle('t1') })
    expect(result.current.isFavorite('m1')).toBe(true)
    expect(result.current.isFavorite('m2')).toBe(true)
    expect(result.current.isFavorite('t1')).toBe(true)
    expect(result.current.isFavorite('t2')).toBe(false)
  })
})

describe('useFavorites — localStorage persistence', () => {
  it('writes to localStorage when an id is added', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => { result.current.toggle('tool-x') })
    const stored = JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[]
    expect(stored).toContain('tool-x')
  })

  it('removes the id from localStorage when toggled off', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => { result.current.toggle('tool-x') })
    act(() => { result.current.toggle('tool-x') })
    const stored = JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[]
    expect(stored).not.toContain('tool-x')
  })

  it('a new hook instance reads the state written by a previous instance', () => {
    const { result: first } = renderHook(() => useFavorites())
    act(() => { first.current.toggle('persistent-id') })

    // Simulate new page load: fresh hook instance reads from localStorage
    const { result: second } = renderHook(() => useFavorites())
    expect(second.current.isFavorite('persistent-id')).toBe(true)
  })
})

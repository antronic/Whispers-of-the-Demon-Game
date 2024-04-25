import { create } from 'zustand'

interface UIState {
  userPage: 'HOME' | 'NAME' | 'CHARACTER' | 'GAME'
  page: 'HOME' | 'NAME' | 'ABILITY' | 'CHARACTER' | 'GAME' | 'GAME_OVER'
  setPage: (page: UIState['page']) => void
  setUserPage: (userPage: UIState['userPage']) => void
}

export const useUiStore = create<UIState>((set) => ({
  userPage: 'NAME',
  page: 'NAME',
  setPage: (page: UIState['page']) => set({ page }),
  setUserPage: (userPage: UIState['userPage']) => set({ userPage }),
}))
import { Storage } from '@app/utils/storage'
import { create } from 'zustand'

export interface UIState {
  userPage: 'HOME' | 'NAME' | 'CHARACTER' | 'GAME' | 'GENERATED_NAME'
  page: 'HOME' | 'NAME' | 'ABILITY' | 'CHARACTER' | 'GAME' | 'GAME_OVER'
  setPage: (page: UIState['page']) => void
  setUserPage: (userPage: UIState['userPage']) => void
}


export const useUiStore = create<UIState>((set) => ({
  userPage: Storage.get('NAV_USER_PAGE').text<UIState['userPage']>() || 'HOME',
  page: 'NAME',
  setPage: (page: UIState['page']) => set({ page }),
  setUserPage: (userPage: UIState['userPage']) => {
    Storage.set('NAV_USER_PAGE', userPage)
    set({ userPage })
  },
}))
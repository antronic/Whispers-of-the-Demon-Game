import { AppStorage } from '@app/utils/storage'
import { create } from 'zustand'

export interface UIState {
  userPage: 'HOME' | 'NAME' | 'CHARACTER' | 'GAME_PROMPT' | 'GENERATED_NAME'
  projectorPage: 'HOME' | 'GAME'
  setProjectorPage: (page: UIState['projectorPage']) => void
  setUserPage: (userPage: UIState['userPage']) => void
}


export const useUiStore = create<UIState>((set) => ({
  userPage: AppStorage.get('NAV_USER_PAGE').text<UIState['userPage']>() || 'HOME',
  projectorPage: AppStorage.get('NAV_PROJECTOR_PAGE').text<UIState['projectorPage']>() || 'HOME',
  setProjectorPage: (projectorPage: UIState['projectorPage']) => {
    AppStorage.set('NAV_PROJECTOR_PAGE', projectorPage)
    set({ projectorPage })
  },
  setUserPage: (userPage: UIState['userPage']) => {
    AppStorage.set('NAV_USER_PAGE', userPage)
    set({ userPage })
  },
}))
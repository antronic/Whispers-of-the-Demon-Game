import axios from 'axios'
import { AppStorage } from './storage'

export const generateName = async (name: string) => {
  const endpoint = 'https://isekai-game.azurewebsites.net/api/IsekaiNameGenerator'

  const response = await axios.post(
    endpoint,
    {
      data: {
        signalr_id: AppStorage.get('SIGNAL_R_ID').text<string>(),
        name,
      }
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  return response.data
}

export const generateAvartar = async (prompt: string) => {
  const endpoint = 'https://isekai-game.azurewebsites.net/api/IsekaiAvatarGenerator'

  const response = await axios.post(
    endpoint,
    {
      data: {
        signalr_id: AppStorage.get('SIGNAL_R_ID').text<string>(),
        prompt,
      }
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  return response.data
}

export const generateDamage = async (prompt: string, character: string, history: any[]) => {
  const endpoint = 'https://isekai-game.azurewebsites.net/api/IsekaiPalungGenerator'

  const response = await axios.post(
    endpoint,
    {
      data: {
        signalr_id: AppStorage.get('SIGNAL_R_ID').text<string>(),
        prompt,
        character,
        history,
        // character,
        // equipment,
        // guid: AppStorage.get('GUID').text<string>(),
      }
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  return response.data
}
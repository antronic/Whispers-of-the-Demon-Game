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
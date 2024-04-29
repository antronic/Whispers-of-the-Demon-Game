import styled from '@emotion/styled'
import tw from 'twin.macro'

export const Button = styled.button(() => [
  tw`text-xl bg-green-500 w-full
  border-r-4 border-b-4 active:border-r-0 active:border-b-0 active:border-t-4 active:border-l-4
  border-zinc-800 hover:border-b-zinc-300 hover:border-r-zinc-300
  text-white px-4 py-2`
])
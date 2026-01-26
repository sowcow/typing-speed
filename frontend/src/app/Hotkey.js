import { useHotkeys } from 'react-hotkeys-hook';

export default function Hotkey() {
  useHotkeys('enter', () =>
    document.body.classList.toggle('oops')
  ,[])

  return null
}

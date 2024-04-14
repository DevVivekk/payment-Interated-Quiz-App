import { GlobalContext } from "@/context/mycontext"
import { useContext } from "react"

export const useContextt = () => {
    const {socket} = useContext(GlobalContext);
  return (
    {socket}
  )
}
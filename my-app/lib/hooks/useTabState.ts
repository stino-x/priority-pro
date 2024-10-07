'use client'

import useTabStateStore from "../store/useTabStateStore"


const useTabState = () => {
  const activeTab = useTabStateStore((state) => state.activeTab)
  const setActiveTab = useTabStateStore((state) => state.setActiveTab)

  return { activeTab, setActiveTab }
}

export default useTabState
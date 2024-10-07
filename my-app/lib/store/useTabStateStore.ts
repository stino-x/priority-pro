import { create } from 'zustand'

type TabState = {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const useTabStateStore = create<TabState>((set) => ({
  activeTab: 'All',
  setActiveTab: (tab) => set({ activeTab: tab }),
}))

export default useTabStateStore
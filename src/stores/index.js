import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

export default createPinia().use(persist)

// import { useUserStore } from './modules/user'
// export { useUserStore }
export * from './modules/user'

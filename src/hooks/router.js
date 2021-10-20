import {useRouter} from "vue-router";

/**
 * useRouter2
 * @returns {{currentRoute: null}}
 */
export function useRouter2() {
  let router = useRouter()
  let currentRoute = null
  if (router.currentRoute && router.currentRoute.value) {
    currentRoute = router.currentRoute.value
  }
  return {
    router,
    currentRoute
  }
}

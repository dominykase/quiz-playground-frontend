import { PUBLIC_API_URL } from '$env/static/public'

/** @type { import('./$types').PageLoad } */
export function load({ params }) {
  //  let response = fetch(PUBLIC_API_URL + '/quiz')
  console.log('test SSR')
}


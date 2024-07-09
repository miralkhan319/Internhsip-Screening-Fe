import "../styles/globals.css"
import axios from "axios";
import type { AppProps } from "next/app";
import Provider  from "../components/Provider";
export default function App({ Component, pageProps: { session, ...pageProps }, }: AppProps) {
  axios.defaults.baseURL = "http://localhost:4003/"
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  // axios.defaults.timeout = 5000;
  // axios.defaults.headers.common['Authorization'] = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmOTIyOGJkMi1kZDMxLTExZWUtOGUzYi05MGIxMWM2ZmI2ZGEiLCJ1c2VyIjp7ImlkIjoiZjkyMjhiZDItZGQzMS0xMWVlLThlM2ItOTBiMTFjNmZiNmRhIiwidXNlcm5hbWUiOiJzdHVkZW50IiwiZnVsbG5hbWUiOiJNdWhhbW1hZCBNb2hzaW4iLCJlbWFpbCI6InN0dWRlbnRAdnUuZWR1LnBrIiwicGhvbmUiOiIrOTMzMzI4NTU2NzUiLCJyb2xlcyI6W3siaWQiOiJmYTA2M2Y3YS1kZDMxLTExZWUtOGUzYi05MGIxMWM2ZmI2ZGEiLCJuYW1lIjoic3R1ZGVudCJ9XX0sImlhdCI6MTcxMDkxMTY4NywiZXhwIjoxNzI4MTkxNjg3fQ.51Gl2RSPBga2t-hGWGV34dtlsEfqc9Hh7rAR3N5TU8I";


  return (
    <Provider>
      <Component {...pageProps} />
</Provider>
  );
}

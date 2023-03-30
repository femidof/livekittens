import axios from 'axios';

axios.get('/api/my-function')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });

export default function Admin() {
  return (
    <>

    </>
  )
};